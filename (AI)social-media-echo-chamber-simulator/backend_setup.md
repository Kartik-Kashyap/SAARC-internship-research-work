# Backend Setup Guide

## ✅ Local Ollama Setup

This project uses **local Ollama** with **Llama 3.2** for AI generation. No API keys needed!

## 🚀 Quick Start

### Step 1: Install Ollama

Download from: https://ollama.ai

### Step 2: Pull Llama 3.2 Model

```bash
ollama pull llama3.2
```

### Step 3: Start the App

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

## 🔧 Configuration

### Environment Variables (Optional)

Create `.env` file in project root:

```env
# Ollama URL (default: http://localhost:11434)
OLLAMA_URL=http://localhost:11434

# Model name (default: llama3.2)
OLLAMA_MODEL=llama3.2

# Backend port (default: 3001)
PORT=3001
```

## 🧪 Testing

1. **Test Ollama:**
   ```bash
   curl http://localhost:11434/api/tags
   ```

2. **Test backend health:**
   ```bash
   curl http://localhost:3001/health
   ```

3. **Test post generation:**
   ```bash
   curl -X POST http://localhost:3001/api/generate-posts \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Generate a test post"}'
   ```

## ❓ Troubleshooting

### "Failed to generate posts"

- **Make sure Ollama is running:**
  ```bash
  ollama serve
  ```

- **Check if model is installed:**
  ```bash
  ollama list
  ```
  Should show `llama3.2`

- **Verify Ollama is accessible:**
  ```bash
  curl http://localhost:11434/api/tags
  ```

### Backend can't connect to Ollama

- Check that Ollama is running on port 11434
- Update `OLLAMA_URL` in `.env` if using a different port
- Restart the backend server after changing `.env`

### Frontend can't connect to backend

- Check browser console for error messages
- Verify backend is running: `curl http://localhost:3001/health`
- Ensure CORS is enabled (already configured in `server.js`)

## 📝 Notes

- **No API keys needed** - everything runs locally
- **Complete privacy** - all processing happens on your machine
- **No internet required** (after initial model download)
- **See `OLLAMA_SETUP.md`** for detailed setup instructions

---

For detailed Ollama setup, see **`OLLAMA_SETUP.md`**
