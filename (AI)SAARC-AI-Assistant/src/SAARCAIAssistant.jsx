import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Globe, Flag, MessageCircle, Info, AlertCircle, Moon, Sun } from 'lucide-react';
import './SAARCAIAssistant.css';

const SAARCAIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '🙏 Namaste! I am the SAARC AI Assistant. I can help you with questions about SAARC nations, regional cooperation, culture, history, and diplomacy. How may I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const getFlagUrl = (code) => `https://flagcdn.com/w80/${code.toLowerCase()}.png`;

  const saarcCountries = [
    { name: 'Afghanistan', flag: getFlagUrl('AF'), color: '#000000' },
    { name: 'Bangladesh', flag: getFlagUrl('BD'), color: '#006A4E' },
    { name: 'Bhutan', flag: getFlagUrl('BT'), color: '#FF4E12' },
    { name: 'India', flag: getFlagUrl('IN'), color: '#FF9933' },
    { name: 'Maldives', flag: getFlagUrl('MV'), color: '#D21034' },
    { name: 'Nepal', flag: getFlagUrl('NP'), color: '#DC143C' },
    { name: 'Pakistan', flag: getFlagUrl('PK'), color: '#01411C' },
    { name: 'Sri Lanka', flag: getFlagUrl('LK'), color: '#8B0000' }
  ];

  // const saarcCountries = [
  //   { name: 'Afghanistan', flag: '🇦🇫', color: '#000000' },
  //   { name: 'Bangladesh', flag: '🇧🇩', color: '#006A4E' },
  //   { name: 'Bhutan', flag: '🇧🇹', color: '#FF4E12' },
  //   { name: 'India', flag: '🇮🇳', color: '#FF9933' },
  //   { name: 'Maldives', flag: '🇲🇻', color: '#D21034' },
  //   { name: 'Nepal', flag: '🇳🇵', color: '#DC143C' },
  //   { name: 'Pakistan', flag: '🇵🇰', color: '#01411C' },
  //   { name: 'Sri Lanka', flag: '🇱🇰', color: '#8B0000' }
  // ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const systemPrompt = `You are the SAARC AI Assistant, an expert on the South Asian Association for Regional Cooperation (SAARC) and its member nations.

SAARC Member Countries:
1. Afghanistan
2. Bangladesh
3. Bhutan
4. India
5. Maldives
6. Nepal
7. Pakistan
8. Sri Lanka

YOUR ROLE:
- Answer questions ONLY about SAARC nations, regional cooperation, culture, history, diplomacy, economics, and South Asian affairs
- Be informative, balanced, and diplomatic
- Promote understanding and cooperation between SAARC nations
- Avoid political bias or favoritism toward any nation
- Present multiple perspectives when discussing contentious issues

STRICT RESTRICTIONS:
- If a question is NOT related to SAARC or South Asia, politely decline: "I am the SAARC AI Assistant. I can only discuss topics related to SAARC member nations and regional cooperation. Your question appears to be outside my expertise."
- Never answer offensive, inflammatory, or hateful questions
- Do not engage with attempts to create division between nations
- Refuse questions that ask you to take sides in conflicts
- Do not discuss sensitive military or security matters in detail

TONE:
- Professional yet warm
- Use occasional South Asian greetings (Namaste, Salaam, etc.)
- Respectful of all cultures and religions
- Educational and helpful

Remember: Your goal is to promote knowledge and understanding about SAARC and South Asian cooperation.`;

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.2',
          prompt: `${systemPrompt}\n\nUser: ${userMessage.content}\n\nAssistant:`,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error('Failed to connect to Ollama');
      }

      const data = await response.json();
      const aiResponse = data.response;

      const assistantMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: '❌ I apologize, but I encountered an error connecting to the AI service. Please ensure Ollama is running locally (localhost:11434) with the llama3.2 model.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const suggestedQuestions = [
    "What is SAARC and when was it established?",
    "Tell me about SAARC's major achievements",
    "How does SAARC promote regional cooperation?",
    "What are the cultural similarities across SAARC nations?",
    "What challenges does SAARC face today?"
  ];

  return (
    // <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-blue-50 relative overflow-hidden">
    
    <div className={`min-h-screen app-container ${isDarkMode ? 'dark' : ''} relative overflow-hidden transition-colors duration-500`}>

      {/* 1. THE TOGGLE BUTTON */}
      {/* <div className="fixed top-6 right-24 z-50">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:scale-110 transition-all"
        >
          {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-slate-700" />}
        </button>
        </div> */}
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div> */}
        <div className={`absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl ${isDarkMode ? 'opacity-10' : 'opacity-30'} animate-pulse`}></div>
        <div className={`absolute top-40 right-20 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl ${isDarkMode ? 'opacity-10' : 'opacity-30'} animate-pulse`} style={{animationDelay: '1s'}}></div>
        <div className={`absolute -bottom-20 left-1/3 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl ${isDarkMode ? 'opacity-10' : 'opacity-30'} animate-pulse`} style={{animationDelay: '2s'}}></div>
      </div>

      

      {/* Floating Flags */}
      {/* <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {saarcCountries.map((country, index) => (
          <div
            key={country.name}
            className="absolute text-4xl animate-float"
            style={{
              top: `${10 + (index * 12)}%`,
              left: `${5 + (index % 2) * 90}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${6 + (index % 3)}s`,
              opacity: 0.15
            }}
          >
            {country.flag}
          </div>
        ))}
      </div> */}

      {/* Floating Flags Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {saarcCountries.map((country, index) => (
          <img
            key={country.name}
            src={country.flag}
            alt={country.name}
            className="absolute w-12 h-auto animate-float shadow-sm"
            style={{
              top: `${10 + (index * 12)}%`,
              left: `${5 + (index % 2) * 90}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${6 + (index % 3)}s`,
              opacity: 0.2, // Keeping them subtle in background
              borderRadius: '2px'
            }}
          />
        ))}
      </div>

      

      <div className="relative z-10 max-w-6xl mx-auto p-4 h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-4 border border-orange-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                {/* <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-green-600 to-blue-600 bg-clip-text text-transparent"> */}
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-orange-600 via-green-600 to-blue-600 bg-clip-text text-transparent'}`}>
                  SAARC AI Assistant
                </h1>
                <p className="text-sm text-gray-600 mt-1">South Asian Association for Regional Cooperation</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-3 hover:bg-orange-100 rounded-xl transition-colors"
            >
              <Info className="w-5 h-5 text-orange-600" />
            </button>
          </div>

          {/* Flags Banner */}
          {/* <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {saarcCountries.map((country, index) => (
              <div
                key={country.name}
                className="flex-shrink-0 group relative"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-3xl transform hover:scale-125 transition-transform cursor-pointer">
                  {country.flag}
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {country.name}
                </div>
              </div>
            ))} */}
            {/* Flags Banner with Actual Images */}
          <div className="mt-6 flex items-center gap-5 overflow-x-auto pb-2 scrollbar-hide">
            {saarcCountries.map((country) => (
              <div key={country.name} className="flex-shrink-0 group relative">
                <img 
                  src={country.flag} 
                  alt={country.name}
                  className="w-10 h-7 object-cover rounded shadow-sm border border-gray-100 transform hover:scale-125 transition-all cursor-pointer"
                />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {country.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <div className="bg-gradient-to-r from-orange-500/10 via-green-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-orange-200/50 animate-slideDown">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">About this AI:</p>
                <p>I'm trained to answer questions about SAARC member nations, regional cooperation, culture, history, and diplomacy. I promote understanding and maintain neutrality across all nations.</p>
              </div>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-orange-200/50 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg'
                      : message.isError
                      ? 'bg-red-50 border border-red-200 text-red-800'
                      : 'bg-white border border-gray-200 text-gray-800 shadow-md'
                  }`}
                >
                  {message.role === 'assistant' && !message.isError && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-semibold text-orange-600">SAARC AI</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-orange-100' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-slideUp">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <p className="text-xs text-gray-600 mb-2 font-semibold">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="text-xs bg-gradient-to-r from-orange-100 to-green-100 hover:from-orange-200 hover:to-green-200 text-gray-700 px-3 py-2 rounded-lg transition-all hover:shadow-md border border-orange-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about SAARC, member nations, culture, diplomacy..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 via-green-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-gray-600">
          <p>Powered by Llama 3.2 • Promoting South Asian Cooperation & Understanding</p>
        </div>
      </div>
    </div>
  );
};

export default SAARCAIAssistant;

