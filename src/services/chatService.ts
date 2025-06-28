interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  response: string;
}

interface HealthResponse {
  status: string;
  apiKeyConfigured: boolean;
  timestamp: string;
  port?: number;
  message?: string;
}

class ChatService {
  private baseUrl: string;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private isServerHealthy: boolean = false;

  constructor() {
    // For production deployment, use the same origin (Railway serves both frontend and backend)
    // For development, use the environment variable or localhost
    this.baseUrl = import.meta.env.PROD 
      ? window.location.origin  // Use same domain in production
      : (import.meta.env.VITE_API_URL || 'http://localhost:3002');
    
    console.log('🔧 Chat service initialized with baseUrl:', this.baseUrl);
    
    // Start periodic health checks
    this.startHealthChecks();
  }

  // Start periodic health checks to ensure server is always available
  private startHealthChecks() {
    // Check immediately
    this.checkHealth();
    
    // Then check every 30 seconds
    this.healthCheckInterval = setInterval(() => {
      this.checkHealth();
    }, 30000);
  }

  // Send message to Baymax AI via backend
  async sendMessage(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
      // Double-check server health before sending message
      const isHealthy = await this.checkHealth();
      if (!isHealthy) {
        throw new Error('Chat server is not available. Please ensure the server is running.');
      }

      console.log('🤖 Sending message to Baymax...');
      
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Chat API error:', response.status, errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      console.log('✅ Received response from Baymax');
      return data.response;
    } catch (error) {
      console.error('Chat service error:', error);
      
      // Mark server as unhealthy and recheck
      this.isServerHealthy = false;
      setTimeout(() => this.checkHealth(), 1000);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to get response from Baymax. Please check if the server is running.');
    }
  }

  // Check if backend is available and configured
  async checkHealth(): Promise<boolean> {
    try {
      console.log('🔍 Checking Baymax server health...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${this.baseUrl}/api/health`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn('❌ Health check failed - server responded with error');
        this.isServerHealthy = false;
        return false;
      }
      
      const data: HealthResponse = await response.json();
      const isHealthy = data.status === 'ok' && data.apiKeyConfigured;
      
      if (isHealthy) {
        console.log('✅ Baymax server is healthy and ready!');
        this.isServerHealthy = true;
      } else {
        console.warn('⚠️ Baymax server is running but not properly configured');
        console.warn('Please check that OPENROUTER_API_KEY is set in Railway environment variables');
        this.isServerHealthy = false;
      }
      
      return isHealthy;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('❌ Health check timed out - server may be down');
      } else {
        console.error('❌ Health check failed:', error);
      }
      this.isServerHealthy = false;
      return false;
    }
  }

  // Get current server health status
  getServerStatus(): boolean {
    return this.isServerHealthy;
  }

  // Clean up resources
  destroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
}

// Create singleton instance
export const chatService = new ChatService();
export type { ChatMessage };

// Clean up on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    chatService.destroy();
  });
}