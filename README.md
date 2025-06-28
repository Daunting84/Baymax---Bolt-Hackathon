# Baymax Mental Health Companion

A React-based mental health companion app featuring AI chat, journaling, breathwork exercises, and mood tracking.

## 🚀 Features

- **AI Chat**: Talk to Baymax, your personal mental health companion
- **Journal**: Guided and free-form journaling with prompt suggestions
- **Breathwork**: Guided breathing exercises with visual cues
- **Mood Tracking**: Track mood, stress, and daily ratings
- **History**: View your mental health journey and progress

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **AI**: OpenRouter API (Mistral 7B)
- **Storage**: localStorage (client-side)
- **3D Graphics**: Spline (embedded iframe)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- OpenRouter API key (get free at https://openrouter.ai)

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd baymax-mental-health-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
PORT=3002
```

4. **Start development (frontend + backend)**
```bash
npm run dev:full
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## 🌐 Deployment

### Option 1: Railway (Recommended - Full Stack)

**Automatic deployment with both frontend and backend:**

1. **Push to GitHub** (Bolt will add "Built with Bolt" badge)
2. **Connect to Railway**:
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub repository
   - Railway auto-detects Node.js and deploys both frontend + backend
3. **Set environment variables in Railway**:
   - `OPENROUTER_API_KEY=your_api_key_here`
   - `PORT=3002` (optional, Railway sets this automatically)
4. **Deploy** - Railway automatically runs `npm start` which:
   - Builds the frontend (`npm run build`)
   - Starts the Express server
   - Serves both frontend and API

✅ **Everything works automatically** - no manual setup needed!

### Option 2: Vercel + Railway (Split Deployment)

**Frontend on Vercel, Backend on Railway:**

1. **Deploy Backend to Railway**:
   - Connect GitHub repo to Railway
   - Set `OPENROUTER_API_KEY` environment variable
   - Railway automatically starts the server

2. **Deploy Frontend to Vercel**:
   - Connect GitHub repo to Vercel
   - Set environment variable: `VITE_API_URL=https://your-railway-app.railway.app`
   - Vercel automatically builds and deploys frontend

### Option 3: Other Platforms

**Render, Heroku, etc.:**
- Build command: `npm run build`
- Start command: `npm start`
- Set `OPENROUTER_API_KEY` environment variable

## 🔧 Configuration

### Environment Variables

- `OPENROUTER_API_KEY`: Your OpenRouter API key for AI chat (required)
- `PORT`: Backend server port (default: 3002, auto-set by most platforms)

### Automatic Startup

The app is configured for automatic deployment:
- ✅ `npm start` automatically builds frontend and starts backend
- ✅ `postinstall` script runs build after dependency installation
- ✅ Server serves both API endpoints and static frontend files
- ✅ Health check endpoint at `/api/health` for monitoring

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Note**: Optimized for desktop screens (1280px+). Mobile responsiveness is limited.

## 🎯 Usage

1. **Dashboard**: Chat with Baymax about your mental health
2. **Journal**: Choose prompts or write freely, entries saved to History
3. **Breathwork**: Follow guided breathing exercises with visual cues
4. **Mood Tracker**: Rate your mood, stress, and day (1-10 scale)
5. **History**: View your journal entries and mood trends

## 🔒 Privacy

- All data stored locally in browser (localStorage)
- No user accounts or cloud storage
- AI conversations processed through OpenRouter API
- Data persists per browser/device only

## 🏗️ Architecture

```
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Main application pages
│   ├── services/           # API services (chat)
│   └── lib/                # Utilities
├── server/                 # Express backend (serves API + frontend)
├── dist/                   # Built frontend (auto-generated)
└── package.json           # Dependencies and scripts
```

## 🚀 Deployment Commands

```bash
# Local development (frontend + backend)
npm run dev:full

# Production build
npm run build

# Start production server (auto-builds if needed)
npm start

# Backend only
npm run server
```

## 🤝 Contributing

This project was built for a hackathon. Feel free to fork and improve!

## 📄 License

MIT License - feel free to use for your own projects.

## 🙏 Acknowledgments

- Built with [Bolt](https://bolt.new) - AI-powered development
- 3D Baymax model from Spline
- OpenRouter for AI API access
- Inspired by the movie "Big Hero 6"

---

**Built with ❤️ and Bolt for mental health awareness**

### 🎯 Hackathon Ready!
- ✅ "Built with Bolt" badge included
- ✅ Automatic deployment on Railway/Render/Heroku
- ✅ Full-stack functionality with AI chat
- ✅ Professional documentation
- ✅ MIT license for open source