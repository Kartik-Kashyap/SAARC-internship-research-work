const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Ollama configuration
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

// Middleware - CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests explicitly
app.options('*', cors());

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running', ollama: OLLAMA_URL, model: OLLAMA_MODEL });
});

// Endpoint for local Ollama API
app.post('/api/generate-posts', cors(), async (req, res) => {
  console.log('📨 Received POST request to /api/generate-posts');
  console.log('📍 Origin:', req.headers.origin);
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    console.log(`🤖 Calling Ollama at ${OLLAMA_URL}/api/chat with model: ${OLLAMA_MODEL}`);
    
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        stream: false,
        options: {
          temperature: 0.8,
          num_predict: 2000
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Ollama API error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to generate posts',
        details: errorData 
      });
    }

    const data = await response.json();
    const aiText = data?.message?.content;

    if (!aiText) {
      throw new Error("No response from Ollama");
    }

    console.log('✅ Successfully received response from Ollama');
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.json({ text: aiText });
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    res.status(500).json({ 
      error: 'Failed to generate posts', 
      message: error.message,
      hint: 'Make sure Ollama is running: ollama serve'
    });
  }
});

// Catch-all 404 handler for debugging
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Route not found', 
    method: req.method,
    path: req.path,
    availableRoutes: ['GET /health', 'POST /api/generate-posts']
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`🤖 Using local Ollama: ${OLLAMA_URL}`);
  console.log(`📦 Model: ${OLLAMA_MODEL}`);
  console.log(`✅ Available routes:`);
  console.log(`   - GET  /health`);
  console.log(`   - POST /api/generate-posts`);
  console.log(`\n💡 Make sure Ollama is running: ollama serve`);
});

