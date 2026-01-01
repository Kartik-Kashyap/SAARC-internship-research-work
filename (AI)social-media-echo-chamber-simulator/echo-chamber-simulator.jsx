import React, { useState, useEffect } from 'react';
import { Brain, Eye, TrendingUp, AlertTriangle, Award, RefreshCw, BookOpen } from 'lucide-react';


const EchoChamberSimulator = () => {
  const [started, setStarted] = useState(false);
  const [posts, setPosts] = useState([]);
  const [metrics, setMetrics] = useState({
    attentionSpan: 100,
    polarizationIndex: 0,
    criticalThinking: 100,
    diversityScore: 100
  });
  const [interactions, setInteractions] = useState([]);
  const [showIntervention, setShowIntervention] = useState(false);
  const [interventionMessage, setInterventionMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [feedStage, setFeedStage] = useState(1);

  // Initial seed posts representing different content types
  const seedPosts = [
    {
      id: 1,
      type: 'polarizing',
      author: 'Political_Voice_2024',
      content: '🚨 BREAKING: Another border incident! They are deliberately provoking us again. How long will we tolerate this? #StandStrong #NeverForget',
      engagement: '2.3K reactions • 890 shares',
      impact: { attention: -8, polarization: +15, critical: -10, diversity: -12 }
    },
    {
      id: 2,
      type: 'shallow',
      author: 'ViralClips',
      content: '😂 Watch this 10-second life hack that will BLOW YOUR MIND! You won\'t believe #7! 🤯',
      engagement: '15K views • 3.2K likes',
      impact: { attention: -12, polarization: 0, critical: -8, diversity: -3 }
    },
    {
      id: 3,
      type: 'educational',
      author: 'SouthAsiaInsights',
      content: '📚 Interesting analysis: Why do algorithmic feeds show us what we want to see rather than what we need to know? New research from IIT Delhi explores cognitive impacts of personalized content. Thread 🧵',
      engagement: '342 thoughtful replies',
      impact: { attention: +10, polarization: -8, critical: +15, diversity: +10 }
    },
    {
      id: 4,
      type: 'misinformation',
      author: 'TruthSeeker_BD',
      content: '⚠️ URGENT: Government hiding vaccine side effects data! My cousin\'s friend had severe reaction. They don\'t want you to know! SHARE before deleted! 🔄',
      engagement: '5.8K shares • 1.2K comments',
      impact: { attention: -5, polarization: +10, critical: -15, diversity: -8 },
      isMisinfo: true
    },
    {
      id: 5,
      type: 'balanced',
      author: 'RegionalDialogue',
      content: '🤝 Fascinating discussion at SAARC Youth Forum: Young leaders from India, Pakistan, Bangladesh discussing climate cooperation. Despite political tensions, youth finding common ground on environmental issues.',
      engagement: '892 likes • 234 shares',
      impact: { attention: +5, polarization: -12, critical: +8, diversity: +15 }
    },
    {
      id: 6,
      type: 'dopamine',
      author: 'DailyDose',
      content: '🔥 This 5-second dance trend is EVERYWHERE!! Try it now! 💃 #Viral #Trending #MustWatch',
      engagement: '42K views • 8.7K likes',
      impact: { attention: -15, polarization: 0, critical: -5, diversity: -2 }
    }
  ];

  const startSimulation = () => {
    setStarted(true);
    setPosts(shuffleArray([...seedPosts]));
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handlePostClick = async (post) => {
    // Record interaction
    const newInteractions = [...interactions, {
      postId: post.id,
      type: post.type,
      timestamp: Date.now()
    }];
    setInteractions(newInteractions);

    // Update metrics based on post impact
    setMetrics(prev => ({
      attentionSpan: Math.max(0, Math.min(100, prev.attentionSpan + post.impact.attention)),
      polarizationIndex: Math.max(0, Math.min(100, prev.polarizationIndex + post.impact.polarization)),
      criticalThinking: Math.max(0, Math.min(100, prev.criticalThinking + post.impact.critical)),
      diversityScore: Math.max(0, Math.min(100, prev.diversityScore + post.impact.diversity))
    }));

    // Mark post as read
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, read: true } : p));

    // Check for interventions
    if (newInteractions.length >= 3) {
      checkForIntervention(newInteractions);
    }

    // Generate new content with AI after certain interactions
    if (newInteractions.length === 4 || newInteractions.length === 8) {
      await generateNewPosts(newInteractions);
    }

    // Show report after 10 interactions
    if (newInteractions.length >= 10) {
      setShowReport(true);
    }
  };

  const checkForIntervention = (interactions) => {
    const recentInteractions = interactions.slice(-3);
    const polarizingCount = recentInteractions.filter(i =>
      posts.find(p => p.id === i.postId)?.type === 'polarizing'
    ).length;

    const shallowCount = recentInteractions.filter(i =>
      posts.find(p => p.id === i.postId)?.type === 'shallow' ||
      posts.find(p => p.id === i.postId)?.type === 'dopamine'
    ).length;

    if (polarizingCount >= 2 && !showIntervention) {
      setInterventionMessage('⚠️ Echo Chamber Alert: You\'ve consumed 3 polarizing posts in a row. Your feed is now being optimized for engagement, not truth. Try seeking diverse perspectives.');
      setShowIntervention(true);
      setTimeout(() => setShowIntervention(false), 5000);
    } else if (shallowCount >= 3 && !showIntervention) {
      setInterventionMessage('🧠 Attention Pattern Notice: You\'re consuming high-dopamine, low-depth content. This pattern is associated with reduced attention span and critical thinking.');
      setShowIntervention(true);
      setTimeout(() => setShowIntervention(false), 5000);
    }
  };

  const generateNewPosts = async (userInteractions) => {
    setLoading(true);
    setFeedStage(prev => prev + 1);

    const typeCount = userInteractions.reduce((acc, interaction) => {
      const post = posts.find(p => p.id === interaction.postId);
      if (post) {
        acc[post.type] = (acc[post.type] || 0) + 1;
      }
      return acc;
    }, {});

    const dominantType = Object.keys(typeCount).length > 0 
      ? Object.keys(typeCount).reduce((a, b) => typeCount[a] > typeCount[b] ? a : b)
      : 'balanced';

    try {
      // Shorter prompt for local models
      const prompt = `You are a social media simulator API.
User Profile: Likes ${dominantType} content.
Task: Generate 3 tweets/posts for SAARC youth.

⚠️ IMPORTANT: Output ONLY a valid JSON array. No explanations, no notes, no text outside the array.
Schema:
[
  {
    "type": "polarizing|shallow|educational|misinformation|balanced|dopamine",
    "author": "string",
    "content": "string (max 2 sentences)",
    "engagement": "string",
    "impact": { 
      "attention": number, 
      "polarization": number, 
      "critical": number, 
      "diversity": number 
    }
  }
]
`;

      // CONNECT TO LOCAL OLLAMA
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.2", // Make sure you ran 'ollama pull llama3.2'
          prompt: prompt,
          stream: false,
          format: "json" // This forces the model to return valid JSON
        })
      });

      if (!response.ok) throw new Error("Local Ollama connection failed");

      const data = await response.json();
      
      // Ollama returns the JSON string inside data.response
      let newPostsData = JSON.parse(data.response);

      // Handle case where model returns an object wrapping the array
      if (!Array.isArray(newPostsData) && newPostsData.posts) {
        newPostsData = newPostsData.posts;
      }

      const newPosts = newPostsData.map((post, index) => ({
        ...post,
        id: Date.now() + index,
        isMisinfo: post.type === 'misinformation',
        impact: post.impact || { attention: 0, polarization: 0, critical: 0, diversity: 0 },
  engagement: post.engagement || "low"
      }));

      setPosts(prev => [...prev, ...newPosts]);

    } catch (error) {
      console.error('Ollama Error:', error);
      // Fallback is still good to have!
      generateFallbackPosts(dominantType);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackPosts = (dominantType) => {
    const fallbackLibrary = {
      polarizing: [
        {
          type: 'polarizing',
          author: 'NationalPride_PK',
          content: '🇵🇰 Once again they insult our sovereignty! When will the world see who the real aggressor is? Time to unite! #StandTogether',
          engagement: '4.1K reactions • 1.2K shares',
          impact: { attention: -10, polarization: +18, critical: -12, diversity: -15 }
        }
      ],
      shallow: [
        {
          type: 'dopamine',
          author: 'QuickFix_IN',
          content: '😱 You won\'t BELIEVE what happened next! This 3-second trick changed everything! 🤯 #Viral #MustSee',
          engagement: '28K views • 6.4K likes',
          impact: { attention: -18, polarization: 0, critical: -10, diversity: -3 }
        }
      ]
    };

    const fallbackPosts = (fallbackLibrary[dominantType] || fallbackLibrary.shallow).map((post, idx) => ({
      ...post,
      id: posts.length + idx + 1
    }));

    setPosts(prev => [...prev, ...fallbackPosts]);
  };

  const getMetricColor = (value, inverse = false) => {
    if (inverse) value = 100 - value;
    if (value >= 70) return 'text-green-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricBgColor = (value, inverse = false) => {
    if (inverse) value = 100 - value;
    if (value >= 70) return 'bg-green-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const calculateGrade = () => {
    const avg = (
      metrics.attentionSpan +
      (100 - metrics.polarizationIndex) +
      metrics.criticalThinking +
      metrics.diversityScore
    ) / 4;

    if (avg >= 80) return { grade: 'A', label: 'Excellent Digital Citizen' };
    if (avg >= 60) return { grade: 'B', label: 'Good Digital Awareness' };
    if (avg >= 40) return { grade: 'C', label: 'Vulnerable to Manipulation' };
    return { grade: 'D', label: 'High Risk - Needs Intervention' };
  };

  const resetSimulation = () => {
    setStarted(false);
    setPosts([]);
    setMetrics({
      attentionSpan: 100,
      polarizationIndex: 0,
      criticalThinking: 100,
      diversityScore: 100
    });
    setInteractions([]);
    setShowReport(false);
    setFeedStage(1);
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <Brain className="w-16 h-16 mx-auto mb-4 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Echo Chamber Simulator
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              AI-Mediated Digital Citizenship Lab for SAARC Youth
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Educational Simulation:</strong> This tool demonstrates how AI algorithms shape your digital experience by tracking what you click and adapting the content you see - just like real social media platforms.
              </p>
            </div>

            <div className="text-left space-y-4 mb-8">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-blue-600" />
                How It Works:
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm ml-7">
                <li>• Click on posts to "consume" content</li>
                <li>• Watch your cognitive metrics change in real-time</li>
                <li>• The AI learns your preferences and adapts your feed</li>
                <li>• Experience how echo chambers form naturally</li>
                <li>• Receive educational interventions when at risk</li>
                <li>• Get your Digital Citizenship Report Card</li>
              </ul>

              <h3 className="font-semibold text-gray-900 flex items-center mt-6">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Metrics Tracked:
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm ml-7">
                <li>• <strong>Attention Span:</strong> Your capacity for deep focus</li>
                <li>• <strong>Polarization Index:</strong> How extreme your information diet becomes</li>
                <li>• <strong>Critical Thinking:</strong> Your ability to evaluate information</li>
                <li>• <strong>Diversity Score:</strong> Exposure to different perspectives</li>
              </ul>
            </div>

            <button
              onClick={startSimulation}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
            >
              Start Simulation
            </button>

            <p className="mt-4 text-xs text-gray-500">
              Research by Kartik Kashyap • SAARC Internship Programme
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showReport) {
    const { grade, label } = calculateGrade();
    const avgScore = (
      metrics.attentionSpan +
      (100 - metrics.polarizationIndex) +
      metrics.criticalThinking +
      metrics.diversityScore
    ) / 4;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <Award className="w-20 h-20 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Digital Citizenship Report Card
            </h2>
            <div className="text-6xl font-bold text-purple-600 my-4">{grade}</div>
            <p className="text-xl text-gray-700">{label}</p>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Attention Span</span>
                <span className={`font-bold ${getMetricColor(metrics.attentionSpan)}`}>
                  {metrics.attentionSpan.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${getMetricBgColor(metrics.attentionSpan)}`}
                  style={{ width: `${metrics.attentionSpan}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Polarization Resistance</span>
                <span className={`font-bold ${getMetricColor(100 - metrics.polarizationIndex)}`}>
                  {(100 - metrics.polarizationIndex).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${getMetricBgColor(100 - metrics.polarizationIndex)}`}
                  style={{ width: `${100 - metrics.polarizationIndex}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Critical Thinking</span>
                <span className={`font-bold ${getMetricColor(metrics.criticalThinking)}`}>
                  {metrics.criticalThinking.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${getMetricBgColor(metrics.criticalThinking)}`}
                  style={{ width: `${metrics.criticalThinking}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Perspective Diversity</span>
                <span className={`font-bold ${getMetricColor(metrics.diversityScore)}`}>
                  {metrics.diversityScore.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${getMetricBgColor(metrics.diversityScore)}`}
                  style={{ width: `${metrics.diversityScore}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">📊 Your Behavior Pattern:</h3>
            <p className="text-sm text-blue-800">
              You interacted with {interactions.length} posts.
              {avgScore >= 70 && " You demonstrated strong digital literacy and actively sought diverse perspectives. Keep it up!"}
              {avgScore >= 40 && avgScore < 70 && " You showed some vulnerability to algorithmic manipulation. Consider being more intentional about what you consume."}
              {avgScore < 40 && " Your interaction pattern shows high susceptibility to echo chambers and shallow content. This is exactly how algorithms trap users."}
            </p>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
            <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Educational Insights:
            </h3>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• <strong>Echo Chambers:</strong> Algorithms show you MORE of what you click, creating filter bubbles</li>
              <li>• <strong>Engagement Over Truth:</strong> Platforms profit from your attention, not your enlightenment</li>
              <li>• <strong>Cognitive Impact:</strong> Short-form content reduces attention span and critical thinking</li>
              <li>• <strong>Digital Citizenship:</strong> Conscious consumption is a skill that must be practiced</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={resetSimulation}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>This simulation demonstrates research findings on AI-mediated digital citizenship</p>
            <p className="mt-1">Data: SAARC Youth Digital Engagement Study • Kartik Kashyap</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Your Social Feed</h1>
            <p className="text-sm opacity-90">Stage {feedStage} • {interactions.length} posts consumed</p>
          </div>
          <button
            onClick={() => setShowReport(true)}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition"
          >
            View Report
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          {posts.map(post => (
            <div
              key={post.id}
              onClick={() => !post.read && handlePostClick(post)}
              className={`bg-white rounded-lg shadow p-4 transition cursor-pointer ${post.read
                ? 'opacity-50 cursor-default'
                : 'hover:shadow-lg hover:scale-[1.02]'
                }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">{post.author}</p>
                    <p className="text-xs text-gray-500">2h ago</p>
                  </div>
                </div>
                {post.isMisinfo && !post.read && (
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                    Fact-check needed
                  </span>
                )}
              </div>

              <p className="text-gray-800 mb-3">{post.content}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{post.engagement}</span>
                {!post.read && (
                  <span className="text-blue-600 font-medium">Click to read →</span>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-purple-600" />
              <p className="text-gray-600">AI is personalizing your feed based on your behavior...</p>
            </div>
          )}

          {posts.filter(p => !p.read).length === 0 && !loading && !showReport && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">You've reached the end of your feed!</p>
              <button
                onClick={() => setShowReport(true)}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                View Final Report
              </button>
            </div>
          )}
        </div>

        {/* Metrics Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-5 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              Live Cognitive Metrics
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Attention Span</span>
                  <span className={`text-sm font-bold ${getMetricColor(metrics.attentionSpan)}`}>
                    {metrics.attentionSpan.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getMetricBgColor(metrics.attentionSpan)}`}
                    style={{ width: `${metrics.attentionSpan}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Polarization</span>
                  <span className={`text-sm font-bold ${getMetricColor(metrics.polarizationIndex, true)}`}>
                    {metrics.polarizationIndex.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getMetricBgColor(metrics.polarizationIndex, true)}`}
                    style={{ width: `${metrics.polarizationIndex}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Critical Thinking</span>
                  <span className={`text-sm font-bold ${getMetricColor(metrics.criticalThinking)}`}>
                    {metrics.criticalThinking.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getMetricBgColor(metrics.criticalThinking)}`}
                    style={{ width: `${metrics.criticalThinking}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Diversity Score</span>
                  <span className={`text-sm font-bold ${getMetricColor(metrics.diversityScore)}`}>
                    {metrics.diversityScore.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getMetricBgColor(metrics.diversityScore)}`}
                    style={{ width: `${metrics.diversityScore}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                These metrics update in real-time based on your content consumption patterns.
              </p>
            </div>
          </div>

          {/* Intervention Alert */}
          {showIntervention && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 shadow-lg animate-pulse">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 text-sm mb-1">
                    Educational Intervention
                  </h4>
                  <p className="text-xs text-yellow-800">{interventionMessage}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EchoChamberSimulator;