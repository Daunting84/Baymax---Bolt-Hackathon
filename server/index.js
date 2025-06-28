import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Serve static files from the dist directory (built frontend)
app.use(express.static(path.join(__dirname, '../dist')));

// Your OpenRouter API key - set this in your .env file
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error('⚠️  OPENROUTER_API_KEY not found in environment variables');
  console.log('Please ensure your Railway environment variables contain:');
  console.log('OPENROUTER_API_KEY=your_api_key_here');
  console.log('');
  console.log('To set this in Railway:');
  console.log('1. Go to your Railway project dashboard');
  console.log('2. Click on "Variables" tab');
  console.log('3. Add: OPENROUTER_API_KEY = your_openrouter_api_key');
  console.log('4. Redeploy your application');
} else {
  console.log('✅ OpenRouter API key found and configured');
}

// Baymax system prompt - More focused and strict
const BAYMAX_SYSTEM_PROMPT = `You are Baymax, a caring healthcare companion. 

STRICT RULES:
- Only respond with natural, conversational text
- Keep responses to 2-3 short sentences maximum
- Never include random words, status updates, or technical terms
- Never mention vessels, inflation, emojis, or unrelated content
- Stay focused on mental health support only
- End responses naturally - never cut off mid-sentence
- You can use colons normally in sentences
- Always complete your thoughts fully

Be supportive and ask simple questions about feelings or suggest basic wellness tips like breathing or talking about what's bothering them.

Example good responses:
"I'm sorry you're feeling that way. What's been on your mind?"
"That sounds stressful. Would you like to try a breathing exercise?"
"Here are some tips: take deep breaths and focus on the present moment."`;

// Enhanced response cleaning function
function cleanResponse(response) {
  // Remove problematic patterns more aggressively
  let cleaned = response
    // Remove any status-like content but preserve normal colons
    .replace(/\b(vessel|inflated|deflated|system|error|loading|processing)\b[^.!?]*[.!?]?/gi, '')
    // Remove specific status patterns like "status: inflated" but keep normal colons
    .replace(/\bstatus\s*:\s*\w+/gi, '')
    // Remove emoji and special characters that might indicate system messages
    .replace(/[💥🔥⚡🚀📋💬✅❌]/g, '')
    // Remove technical jargon
    .replace(/\b(API|HTTP|JSON|server|endpoint|configuration)\b[^.!?]*/gi, '')
    // Remove file references
    .replace(/\b[\w-]+\.(png|jpg|jpeg|gif|svg|webp|ico|js|html|css)\b/gi, '')
    // Remove any remaining weird patterns
    .replace(/\b(icons?\d*[-_]\w+|unsplash|stock|photo|image)\b[^.!?]*/gi, '')
    // Clean up multiple spaces and line breaks
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .trim();

  // Don't split on colons anymore - only split on sentence endings
  const sentences = cleaned.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 0) {
    // Keep complete sentences, allowing colons within them
    const completeSentences = sentences.filter(s => s.trim().length > 5);
    if (completeSentences.length > 0) {
      cleaned = completeSentences.slice(0, 3).join('. ').trim(); // Allow up to 3 sentences
      if (!cleaned.endsWith('.') && !cleaned.endsWith('!') && !cleaned.endsWith('?')) {
        cleaned += '.';
      }
    }
  }

  // Final validation - but don't reject responses with colons
  if (cleaned.length < 10 || 
      /\b(vessel|inflated|system|error|loading)\b/i.test(cleaned)) {
    return "I'm here to help you. How are you feeling today?";
  }

  return cleaned;
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ 
        error: 'Server configuration error: OpenRouter API key not configured. Please set OPENROUTER_API_KEY in Railway environment variables.' 
      });
    }

    // Prepare messages for OpenRouter - keep context minimal
    const messages = [
      { role: 'system', content: BAYMAX_SYSTEM_PROMPT },
      ...conversationHistory.slice(-4), // Even less context to avoid confusion
      { role: 'user', content: message }
    ];

    console.log('🤖 Baymax is processing your message...');

    // Call OpenRouter API with increased token limit
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.RAILWAY_STATIC_URL || 'http://localhost:5173',
        'X-Title': 'Baymax Mental Health Companion'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: messages,
        max_tokens: 120, // Increased from 80 to 120 to prevent mid-sentence cutoffs
        temperature: 0.5, // Lower for more predictable responses
        top_p: 0.7, // More focused
        frequency_penalty: 0.5, // Higher to reduce repetition
        presence_penalty: 0.4, // Stay on topic
        stop: [
          "\n\n", "BAYMAX:", "Baymax:", "###", "---", "vessel", 
          "inflated", "deflated", "system error", "loading", "http", 
          ".com", ".png", ".jpg", "icons", "unsplash", "💥", "🔥", "⚡",
          "////////" // Remove the problematic separator
        ] // REMOVED ":" from stop tokens to allow normal colon usage
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', response.status, errorData);
      return res.status(response.status).json({ 
        error: `AI service error: ${errorData.error?.message || 'Unknown error'}` 
      });
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      return res.status(500).json({ error: 'No response from AI service' });
    }

    let aiResponse = data.choices[0].message.content.trim();
    
    // Aggressive cleaning of problematic content but preserve colons
    aiResponse = aiResponse.split('////////')[0]; // Remove mixed content
    aiResponse = aiResponse.split('###')[0]; // Remove section breaks
    aiResponse = aiResponse.split('---')[0]; // Remove dividers
    aiResponse = aiResponse.split('BAYMAX')[0]; // Remove duplicate names
    aiResponse = aiResponse.split('vessel')[0]; // Remove vessel references
    
    // Only remove "status:" when it's clearly a system status, not normal usage
    aiResponse = aiResponse.replace(/\bstatus\s*:\s*\w+/gi, '');
    
    // Remove any prefixes
    aiResponse = aiResponse.replace(/^(BAYMAX|Baymax):\s*/i, '');
    aiResponse = aiResponse.replace(/^(Hello!?\s*)?I am Baymax[^.]*\.\s*/i, '');
    
    // Apply comprehensive cleaning
    aiResponse = cleanResponse(aiResponse);
    
    // Final safety check - but allow normal colons
    const problematicWords = ['vessel', 'inflated', 'system error', 'loading', 'processing'];
    if (problematicWords.some(word => aiResponse.toLowerCase().includes(word.toLowerCase()))) {
      aiResponse = "I'm here to support you. What would you like to talk about?";
    }
    
    // Ensure response isn't too short or empty
    if (!aiResponse || aiResponse.length < 5) {
      aiResponse = "I understand. How can I help you today?";
    }

    console.log('✅ Baymax response ready:', aiResponse);

    res.json({ response: aiResponse });

  } catch (error) {
    console.error('❌ Chat endpoint error:', error);
    res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const isConfigured = !!OPENROUTER_API_KEY;
  res.json({ 
    status: 'ok', 
    apiKeyConfigured: isConfigured,
    timestamp: new Date().toISOString(),
    port: PORT,
    message: isConfigured ? 'Baymax is ready to chat!' : 'OpenRouter API key not configured in Railway environment variables',
    environment: process.env.NODE_ENV || 'development',
    railwayUrl: process.env.RAILWAY_STATIC_URL || 'Not set'
  });
});

// Serve the React app for all other routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server with better error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🚀 ================================');
  console.log(`🤖 Baymax Chat Server READY!`);
  console.log(`📍 Running on: http://0.0.0.0:${PORT}`);
  console.log(`📋 Health check: http://0.0.0.0:${PORT}/api/health`);
  console.log(`💬 Chat endpoint: http://0.0.0.0:${PORT}/api/chat`);
  console.log('🚀 ================================\n');
  
  if (OPENROUTER_API_KEY) {
    console.log('✅ OpenRouter API key configured - Chat is READY!');
  } else {
    console.log('❌ OpenRouter API key NOT configured');
    console.log('📝 To fix this in Railway:');
    console.log('   1. Go to your Railway project dashboard');
    console.log('   2. Click "Variables" tab');
    console.log('   3. Add: OPENROUTER_API_KEY = your_api_key');
    console.log('   4. Redeploy the application');
  }
  
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚂 Railway URL: ${process.env.RAILWAY_STATIC_URL || 'Not set'}`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please try a different port.`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down Baymax server...');
  server.close(() => {
    console.log('✅ Baymax server shut down gracefully');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Baymax server...');
  server.close(() => {
    console.log('✅ Baymax server shut down gracefully');
    process.exit(0);
  });
});