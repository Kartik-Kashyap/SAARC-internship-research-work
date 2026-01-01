# 🦙 Local Ollama Setup Guide

## ✅ Why Local LLM?

The project now uses **local Ollama** with **Llama 3.2** instead of cloud APIs (OpenRouter/Google Gemini). This means:
- ✅ No API keys needed
- ✅ No internet required (after initial model download)
- ✅ Complete privacy - all processing happens locally
- ✅ No usage costs

## 🚀 Quick Start

### Step 1: Install Ollama

Download and install Ollama from: https://ollama.ai

### Step 2: Pull Llama 3.2 Model

```bash
ollama pull llama3.2
```

This downloads the model (about 2GB). You only need to do this once.

### Step 3: Start Ollama

Ollama runs as a service, but you can verify it's running:

```bash
ollama serve
```

Or check if it's already running:
```bash
curl http://localhost:11434/api/tags
```

### Step 4: Start the App

```bash
# Start both frontend and backend
npm run dev:full
```

Or separately:
```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend  
npm run dev
```

That's it! The AI feed generation now uses your local Llama 3.2 model.

## 🔧 Configuration

### Environment Variables (Optional)

You can customize Ollama settings in `.env`:

```env
# Ollama URL (default: http://localhost:11434)
OLLAMA_URL=http://localhost:11434

# Model name (default: llama3.2)
OLLAMA_MODEL=llama3.2

# Backend port (default: 3001)
PORT=3001
```

### Using Different Models

If you want to use a different Ollama model:

1. Pull the model:
   ```bash
   ollama pull llama3.1
   # or
   ollama pull mistral
   ```

2. Update `.env`:
   ```env
   OLLAMA_MODEL=llama3.1
   ```

3. Restart the backend server

## 📝 Code Structure

- **`server.js`** - Express backend that proxies requests to local Ollama
- **`src/App.jsx`** - Frontend that calls the backend API
- **`netlify/functions/generate-posts.js`** - Not used for local development (requires cloud LLM)

## 🧪 Testing

1. **Test Ollama directly:**
   ```bash
   curl http://localhost:11434/api/chat -d '{
     "model": "llama3.2",
     "messages": [{"role": "user", "content": "Hello!"}],
     "stream": false
   }'
   ```

2. **Test backend health:**
   ```bash
   curl http://localhost:3001/health
   ```

3. **Test the app** - Click on posts in the simulator and watch AI generate new content!

## ❓ Troubleshooting

### "Failed to generate posts" / Connection errors

- **Make sure Ollama is running:**
  ```bash
  ollama serve
  ```

- **Check if Ollama is accessible:**
  ```bash
  curl http://localhost:11434/api/tags
  ```

- **Verify the model is installed:**
  ```bash
  ollama list
  ```
  Should show `llama3.2` in the list

### Model not found

- Pull the model again:
  ```bash
  ollama pull llama3.2
  ```

### Slow responses

- Local LLMs can be slower than cloud APIs
- Consider using a smaller/faster model like `llama3.2:1b` for testing
- Make sure you have enough RAM (Llama 3.2 needs ~4GB)

### Port conflicts

- If port 11434 is in use, change Ollama's port or update `OLLAMA_URL` in `.env`
- If port 3001 is in use, change `PORT` in `.env`

## 🌐 Deployment Note

**Local Ollama only works on your machine!** 

For cloud deployment (Netlify, Vercel, etc.), you'll need to:
- Use a cloud LLM service (OpenRouter, OpenAI, etc.)
- Or deploy Ollama to a VPS/server
- Or use the Netlify function with a cloud API

## 📚 Resources

- [Ollama Documentation](https://github.com/ollama/ollama)
- [Available Models](https://ollama.ai/library)
- [Llama 3.2 Info](https://ollama.ai/library/llama3.2)

---

**Enjoy your private, local AI! 🎉**

