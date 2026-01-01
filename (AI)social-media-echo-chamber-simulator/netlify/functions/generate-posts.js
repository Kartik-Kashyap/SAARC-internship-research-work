// Netlify Serverless Function for generating posts
// NOTE: This function is for cloud deployment. For local development with Ollama,
// use the Express server (server.js) instead.

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    // NOTE: This function requires a cloud-based LLM service (OpenRouter, OpenAI, etc.)
    // Local Ollama cannot be accessed from Netlify serverless functions.
    // For local development, use server.js with Ollama instead.
    
    return {
      statusCode: 501,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        error: 'Not implemented',
        message: 'This function requires a cloud LLM service. For local Ollama, use the Express server (server.js) instead.'
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to generate posts', 
        message: error.message 
      })
    };
  }
};
