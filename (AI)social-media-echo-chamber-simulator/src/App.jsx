import React, { useState, useEffect } from 'react';
import { Brain, Eye, Activity, AlertTriangle, Award, RefreshCw, BookOpen, ShieldAlert, Cpu, Share2, MessageCircle, Heart } from 'lucide-react';


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

    // Update metrics based on post impact (with safety check)
    // Default impact values if missing
    const impact = post.impact || {
      attention: 0,
      polarization: 0,
      critical: 0,
      diversity: 0
    };

    setMetrics(prev => ({
      attentionSpan: Math.max(0, Math.min(100, prev.attentionSpan + (impact.attention || 0))),
      polarizationIndex: Math.max(0, Math.min(100, prev.polarizationIndex + (impact.polarization || 0))),
      criticalThinking: Math.max(0, Math.min(100, prev.criticalThinking + (impact.critical || 0))),
      diversityScore: Math.max(0, Math.min(100, prev.diversityScore + (impact.diversity || 0)))
    }));

    // Mark post as read
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, read: true } : p));

    // Check for interventions
    if (newInteractions.length >= 3) {
      checkForIntervention(newInteractions);
    }

    // Generate new content with AI more frequently
    // Generate after: 2, 4, 6, 8 interactions OR when 70% of posts are consumed
    const consumedPosts = posts.filter(p => p.read).length;
    const totalPosts = posts.length;
    const consumptionRate = totalPosts > 0 ? consumedPosts / totalPosts : 0;
    
    if (
      newInteractions.length === 2 || 
      newInteractions.length === 4 || 
      newInteractions.length === 6 || 
      newInteractions.length === 8 ||
      (consumptionRate >= 0.7 && totalPosts >= 3 && !loading)
    ) {
      await generateNewPosts(newInteractions);
    }

    // Show report after 12 interactions (increased from 10 for more data)
    if (newInteractions.length >= 12) {
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
      setInterventionMessage('⚠️ FILTER BUBBLE DETECTED: You have consumed consecutive polarizing content. The algorithm is now optimizing for engagement over accuracy.');
      setShowIntervention(true);
      setTimeout(() => setShowIntervention(false), 6000);
    } else if (shallowCount >= 3 && !showIntervention) {
      setInterventionMessage('🧠 DOPAMINE LOOP ACTIVE: High-frequency, low-depth content detected. Attention span metrics are degrading.');
      setShowIntervention(true);
      setTimeout(() => setShowIntervention(false), 6000);
    }
  };

  const generateNewPosts = async (userInteractions) => {
    setLoading(true);
    setFeedStage(prev => prev + 1);

    // Analyze user behavior pattern from ALL posts (not just seedPosts)
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
//       const prompt = `You are generating social media posts for an educational simulator about AI-mediated digital citizenship in SAARC nations.

// USER BEHAVIOR PATTERN:
// - Dominant content type: ${dominantType}
// - Attention Span: ${metrics.attentionSpan}%
// - Polarization: ${metrics.polarizationIndex}%
// - Critical Thinking: ${metrics.criticalThinking}%

// TASK: Generate 3 new social media posts that a profit-driven AI algorithm would show this user. Algorithms maximize engagement by showing MORE of what users already clicked.

// POST TYPES:
// - "polarizing": Emotional political content, us-vs-them (India-Pakistan tensions, nationalism)
// - "shallow": Clickbait, viral trends, "You won't believe..."
// - "educational": Thoughtful analysis, multiple perspectives, requires reading
// - "misinformation": False but believable claims, conspiracy theories
// - "balanced": Nuanced, shows complexity, regional cooperation examples
// - "dopamine": Ultra-short viral content, dance challenges, brain rot

// SAARC CONTEXT:
// - Use regional references (India, Pakistan, Bangladesh, Nepal)
// - Social media style (heavy emojis, Hinglish, viral culture)
// - Youth topics (cricket, Bollywood, jobs, nationalism, social issues)

// OUTPUT FORMAT - ONLY VALID JSON:

// [
//   {
//     "type": "polarizing",
//     "author": "Username_2024",
//     "content": "🚨 Content here with emojis, 2-3 sentences max #Hashtag",
//     "engagement": "3.2K reactions • 890 shares",
//     "impact": {
//       "attention": -12,
//       "polarization": 15,
//       "critical": -10,
//       "diversity": -15
//     }
//   },
//   {
//     "type": "shallow",
//     "author": "ViralContent",
//     "content": "😱 Another post #Viral",
//     "engagement": "45K views",
//     "impact": {
//       "attention": -15,
//       "polarization": 0,
//       "critical": -8,
//       "diversity": -2
//     }
//   },
//   {
//     "type": "dopamine",
//     "author": "TrendingNow",
//     "content": "🔥 Third post",
//     "engagement": "128K views",
//     "impact": {
//       "attention": -18,
//       "polarization": 0,
//       "critical": -5,
//       "diversity": 0
//     }
//   }
// ]

// IMPACT SCORING:
// - attention: -20 to +15 (negative = reduces attention span)
// - polarization: -15 to +20 (positive = increases echo chamber)
// - critical: -20 to +15 (negative = reduces critical thinking)
// - diversity: -20 to +15 (negative = narrows perspectives)

// IMPORTANT: If user clicked mostly polarizing content, show MORE polarizing content! That's how real algorithms work.`;

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

      // Call local Ollama API via backend
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${apiUrl}/api/generate-posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate posts');
      }

      const data = await response.json();
      const aiText = data.text;

      if (!aiText) {
        throw new Error("No response from AI");
      }

      // Extract JSON from response
      let newPostsData = [];
      try {
        const jsonMatch = aiText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          newPostsData = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Failed to parse AI response:', e);
      }

      if (newPostsData.length > 0) {
        const newPosts = newPostsData.map((post, index) => {
          // Ensure all required properties exist with defaults
          const defaultImpact = {
            attention: 0,
            polarization: 0,
            critical: 0,
            diversity: 0
          };

          return {
            ...post,
            id: posts.length + index + 1,
            isMisinfo: post.type === 'misinformation',
            impact: post.impact || defaultImpact,
            type: post.type || 'shallow',
            author: post.author || 'Unknown',
            content: post.content || '',
            engagement: post.engagement || '0 reactions'
          };
        });

        setPosts(prev => [...prev, ...newPosts]);
      }
    } catch (error) {
      console.error('Error generating posts:', error);
      // Fallback to predefined posts if API fails
      generateFallbackPosts(dominantType);
    }

    setLoading(false);
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

    if (avg >= 80) return { grade: 'A', label: 'SYSTEM STATUS: OPTIMAL', color: 'text-emerald-400' };
    if (avg >= 60) return { grade: 'B', label: 'SYSTEM STATUS: STABLE', color: 'text-cyan-400' };
    if (avg >= 40) return { grade: 'C', label: 'SYSTEM STATUS: VULNERABLE', color: 'text-amber-400' };
    return { grade: 'D', label: 'SYSTEM STATUS: COMPROMISED', color: 'text-rose-500' };
  };

  // Custom Progress Bar Component
  const TechProgressBar = ({ value, colorClass, label }) => (
    <div className="group">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-mono text-slate-400 tracking-wider uppercase">{label}</span>
        <span className={`text-xs font-mono font-bold ${colorClass}`}>{value.toFixed(0)}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-sm overflow-hidden relative">
        {/* Grid lines on background */}
        <div className="absolute inset-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(90deg, transparent 95%, rgba(0,0,0,0.5) 95%)', backgroundSize: '10% 100%' }}></div>
        <div 
          className={`h-full transition-all duration-700 ease-out relative ${colorClass.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`}
          style={{ width: `${value}%` }}
        >
          <div className="absolute right-0 top-0 h-full w-[2px] bg-white opacity-50"></div>
        </div>
      </div>
    </div>
  );

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
      <div className="min-h-screen bg-slate-950 text-white relative flex items-center justify-center p-4 overflow-hidden">
        {/* Cyber Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <div className="max-w-4xl w-full relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-900/10 text-cyan-400 text-xs font-mono mb-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></span>
              SYSTEM ONLINE // V2.4.0
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              ECHO<br />CHAMBER
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed border-l-2 border-purple-500 pl-4">
              AI-Mediated Digital Citizenship Simulation. <br/>
              Algorithms aren't neutral. They are optimized for <span className="text-purple-400 font-bold">addiction</span>.
            </p>
            
            <button
              onClick={startSimulation}
              className="group relative px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold tracking-widest uppercase text-sm transition-all clip-path-polygon"
              style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' }}
            >
              <span className="relative z-10 flex items-center">
                Initialize Simulation <Activity className="ml-2 w-4 h-4 group-hover:rotate-180 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-purple-400 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500"></div>
            </button>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-8 shadow-2xl relative">
            <div className="absolute -top-3 -right-3 w-20 h-20 bg-cyan-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl"></div>
            
            <h3 className="font-mono text-cyan-400 text-sm mb-6 flex items-center">
              <Cpu className="w-4 h-4 mr-2" /> CORE METRICS
            </h3>
            
            <div className="space-y-6">
              {[
                { label: 'ATTENTION SPAN', val: 100, col: 'text-cyan-400' },
                { label: 'CRITICAL THINKING', val: 100, col: 'text-emerald-400' },
                { label: 'POLARIZATION', val: 0, col: 'text-rose-400' },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-500 text-xs font-mono">{i+1}</div>
                  <div className="flex-1">
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full w-full ${m.col.replace('text-', 'bg-')} opacity-50`}></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1 text-slate-400 font-mono">
                      <span>{m.label}</span>
                      <span className={m.col}>Active</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500 font-mono">
              Research by Kartik Kashyap • SAARC Program
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showReport) {
    const { grade, label, color } = calculateGrade();
    const avgScore = (
      metrics.attentionSpan +
      (100 - metrics.polarizationIndex) +
      metrics.criticalThinking +
      metrics.diversityScore
    ) / 4;

    // Calculate behavior patterns
    const typeCount = interactions.reduce((acc, interaction) => {
      const post = posts.find(p => p.id === interaction.postId);
      if (post) {
        acc[post.type] = (acc[post.type] || 0) + 1;
      }
      return acc;
    }, {});

    const dominantType = Object.keys(typeCount).length > 0 
      ? Object.keys(typeCount).reduce((a, b) => typeCount[a] > typeCount[b] ? a : b)
      : 'balanced';

    const polarizingCount = typeCount['polarizing'] || 0;
    const shallowCount = (typeCount['shallow'] || 0) + (typeCount['dopamine'] || 0);
    const educationalCount = (typeCount['educational'] || 0) + (typeCount['balanced'] || 0);

    // Generate detailed verdict
    const getVerdict = () => {
      if (avgScore >= 80) {
        return {
          title: "EXCELLENT DIGITAL CITIZEN",
          description: "You demonstrate exceptional digital literacy and critical thinking. Your consumption patterns show intentional engagement with diverse, high-quality content.",
          strengths: [
            "Strong resistance to echo chambers",
            "High critical thinking capacity",
            "Diverse information diet",
            "Conscious content consumption"
          ],
          recommendations: [
            "Continue seeking diverse perspectives",
            "Share your digital literacy skills with others",
            "Stay vigilant against algorithmic manipulation"
          ]
        };
      } else if (avgScore >= 60) {
        return {
          title: "GOOD DIGITAL AWARENESS",
          description: "You show solid digital citizenship skills but have room for improvement. Some vulnerability to algorithmic manipulation detected.",
          strengths: [
            "Moderate critical thinking",
            "Some diversity in content",
            "Awareness of digital risks"
          ],
          recommendations: [
            "Actively seek out opposing viewpoints",
            "Reduce consumption of shallow content",
            "Practice fact-checking before sharing",
            "Set time limits for social media use"
          ]
        };
      } else if (avgScore >= 40) {
        return {
          title: "VULNERABLE TO MANIPULATION",
          description: "Your consumption patterns indicate susceptibility to echo chambers and algorithmic manipulation. Immediate action recommended.",
          strengths: [
            "Some awareness of digital issues",
            "Potential for improvement"
          ],
          recommendations: [
            "Diversify your information sources immediately",
            "Question content that triggers strong emotions",
            "Follow accounts with different perspectives",
            "Take breaks from algorithmic feeds",
            "Engage with long-form, analytical content"
          ]
        };
      } else {
        return {
          title: "HIGH RISK - ALGORITHMIC CAPTURE",
          description: "Critical alert: Your consumption patterns show severe vulnerability to echo chambers and manipulation. Your feed is likely optimized for addiction, not truth.",
          strengths: [],
          recommendations: [
            "URGENT: Diversify information sources",
            "Disable algorithmic feeds temporarily",
            "Follow verified fact-checkers",
            "Engage with educational content daily",
            "Consider digital detox period",
            "Seek professional guidance on media literacy"
          ]
        };
      }
    };

    const verdict = getVerdict();

    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-1 shadow-2xl ring-1 ring-white/10 relative overflow-hidden">
           {/* Scanning Line Animation */}
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-[10px] w-full animate-scan pointer-events-none"></div>

          <div className="p-8 md:p-12 relative z-10">
            <div className="text-center mb-10">
              <Award className="w-16 h-16 mx-auto mb-4 text-purple-400" />
              <h2 className="text-sm font-mono tracking-[0.2em] text-slate-400 mb-2">DIGITAL CITIZENSHIP REPORT CARD</h2>
              <div className={`text-7xl font-black ${color} drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`}>{grade}</div>
              <p className={`text-lg font-mono mt-4 ${color}`}>{label}</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4 bg-slate-950/50 p-6 rounded-lg border border-slate-800/50">
                <TechProgressBar value={metrics.attentionSpan} label="Attention" colorClass="text-cyan-400" />
                <TechProgressBar value={100 - metrics.polarizationIndex} label="Neutrality" colorClass="text-purple-400" />
              </div>
              <div className="space-y-4 bg-slate-950/50 p-6 rounded-lg border border-slate-800/50">
                <TechProgressBar value={metrics.criticalThinking} label="Analysis" colorClass="text-emerald-400" />
                <TechProgressBar value={metrics.diversityScore} label="Diversity" colorClass="text-amber-400" />
              </div>
            </div>

            {/* Behavior Analysis */}
            <div className="bg-slate-950/50 p-6 rounded-lg border border-slate-800/50 mb-8">
              <h3 className="text-xs font-mono text-slate-400 mb-4 uppercase tracking-wider">BEHAVIOR ANALYSIS</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose-400">{polarizingCount}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">Polarizing</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{shallowCount}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">Shallow</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">{educationalCount}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">Educational</div>
                </div>
              </div>
              <p className="text-sm text-slate-300 font-mono">
                Total Interactions: <span className="text-cyan-400 font-bold">{interactions.length}</span> | 
                Dominant Pattern: <span className="text-purple-400 font-bold">{dominantType.toUpperCase()}</span>
              </p>
            </div>

            {/* Verdict Section */}
            <div className={`p-6 rounded-lg border-2 mb-8 ${
              avgScore >= 80 ? 'bg-emerald-950/30 border-emerald-500/50' :
              avgScore >= 60 ? 'bg-cyan-950/30 border-cyan-500/50' :
              avgScore >= 40 ? 'bg-amber-950/30 border-amber-500/50' :
              'bg-rose-950/30 border-rose-500/50'
            }`}>
              <h3 className={`text-lg font-bold mb-3 ${
                avgScore >= 80 ? 'text-emerald-400' :
                avgScore >= 60 ? 'text-cyan-400' :
                avgScore >= 40 ? 'text-amber-400' :
                'text-rose-400'
              }`}>
                FINAL VERDICT: {verdict.title}
              </h3>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">{verdict.description}</p>
              
              {verdict.strengths.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-mono text-slate-400 mb-2 uppercase">STRENGTHS</h4>
                  <ul className="space-y-1">
                    {verdict.strengths.map((strength, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start">
                        <span className="text-emerald-400 mr-2">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-xs font-mono text-slate-400 mb-2 uppercase">RECOMMENDATIONS</h4>
                <ul className="space-y-1">
                  {verdict.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start">
                      <span className="text-purple-400 mr-2">→</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Educational Insights */}
            <div className="bg-purple-950/20 border border-purple-500/30 p-6 rounded-lg mb-8">
              <h3 className="text-xs font-mono text-purple-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> KEY INSIGHTS
              </h3>
              <ul className="space-y-2 text-sm text-slate-300 font-mono">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span><strong className="text-purple-300">Echo Chambers:</strong> Algorithms amplify what you click, creating filter bubbles that reinforce your existing beliefs.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span><strong className="text-purple-300">Engagement Over Truth:</strong> Social platforms optimize for your attention, not your enlightenment. Profit drives content curation.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span><strong className="text-purple-300">Cognitive Impact:</strong> Short-form, high-dopamine content reduces attention span and critical thinking capacity over time.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span><strong className="text-purple-300">Digital Citizenship:</strong> Conscious consumption is a skill that requires active practice and intentional choices.</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={resetSimulation}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-mono text-sm border-t border-slate-700 transition-colors flex items-center justify-center gap-2 rounded-lg"
              >
                <RefreshCw className="w-4 h-4" /> REBOOT SIMULATION
              </button>
            </div>

            <div className="mt-6 text-center text-xs text-slate-600 font-mono border-t border-slate-800 pt-6">
              <p>SAARC Digital Citizenship Research Lab</p>
              <p className="mt-1">Data Analysis: Kartik Kashyap • SAARC Internship Programme</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30">
      
      {/* Top HUD Bar */}
      <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <h1 className="font-bold tracking-tight text-white">LIVE FEED</h1>
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-mono border border-slate-700">
              STAGE {feedStage}
            </span>
          </div>
          <button
            onClick={() => setShowReport(true)}
            className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-2"
          >
            END SESSION <ShieldAlert className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Feed Column */}
        <div className="lg:col-span-8 space-y-5">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => !post.read && handlePostClick(post)}
              className={`
                group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer
                ${post.read 
                  ? 'bg-slate-900/30 border-slate-800 opacity-60 grayscale' 
                  : 'bg-slate-900/60 border-slate-700 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:-translate-y-1'
                }
              `}
            >
              {/* Misinfo Glitch Effect */}
              {post.isMisinfo && !post.read && (
                <div className="absolute top-0 right-0 p-2">
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-rose-500 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">
                    <AlertTriangle className="w-3 h-3" /> Unverified
                  </span>
                </div>
              )}

              <div className="p-5 flex gap-4">
                {/* Avatar */}
                <div className={`
                  w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-lg
                  ${post.type === 'polarizing' ? 'bg-gradient-to-br from-rose-900 to-slate-900 text-rose-400' : 
                    post.type === 'educational' ? 'bg-gradient-to-br from-emerald-900 to-slate-900 text-emerald-400' :
                    'bg-gradient-to-br from-purple-900 to-slate-900 text-purple-400'}
                `}>
                  {post.author[0]}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-100 text-sm">{post.author}</h3>
                    <span className="text-xs text-slate-500">• 2m ago</span>
                  </div>
                  
                  <p className="text-slate-300 leading-relaxed text-sm mb-4">
                    {post.content}
                  </p>

                  {/* Interaction Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                    <span className="text-xs font-mono text-slate-500 flex items-center gap-2">
                      <Activity className="w-3 h-3" /> {post.engagement}
                    </span>
                    
                    {!post.read && (
                      <span className="text-xs font-bold text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        CONSUME <Eye className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col items-center justify-center gap-3">
              <Cpu className="w-8 h-8 text-purple-500 animate-spin" />
              <p className="text-xs font-mono text-purple-400 animate-pulse">ALGORITHM RECALIBRATING...</p>
            </div>
          )}
          
          {posts.filter(p => !p.read).length === 0 && !loading && !showReport && (
             <div className="p-8 rounded-xl border border-dashed border-slate-700 bg-slate-900/30 text-center">
                <button
                onClick={() => setShowReport(true)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded shadow-lg shadow-purple-900/20 transition-all"
              >
                GENERATE FINAL REPORT
              </button>
             </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            
            {/* Metrics Panel */}
            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-5 shadow-xl">
              <h3 className="text-xs font-mono text-slate-500 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                NEURAL METRICS
              </h3>
              
              <div className="space-y-5">
                <TechProgressBar value={metrics.attentionSpan} label="Attention" colorClass="text-cyan-400" />
                <TechProgressBar value={metrics.polarizationIndex} label="Polarization" colorClass="text-rose-500" />
                <TechProgressBar value={metrics.criticalThinking} label="Critical Analysis" colorClass="text-emerald-400" />
                <TechProgressBar value={metrics.diversityScore} label="Diversity" colorClass="text-amber-400" />
              </div>
            </div>

            {/* AI Insight / Intervention Box */}
            {showIntervention && (
              <div className="relative overflow-hidden bg-amber-950/20 border border-amber-500/50 rounded-xl p-4 animate-in slide-in-from-right-10 fade-in duration-300">
                <div className="absolute top-0 right-0 p-2 opacity-20">
                  <AlertTriangle className="w-12 h-12 text-amber-500" />
                </div>
                <h4 className="text-amber-400 font-bold text-sm mb-1 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> INTERVENTION
                </h4>
                <p className="text-xs text-amber-200/80 leading-relaxed font-mono">
                  {interventionMessage}
                </p>
              </div>
            )}
            
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-[10px] text-slate-600 font-mono text-center">
                SAARC DIGITAL CITIZENSHIP LAB <br/> v1.0.4 Local Instance
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EchoChamberSimulator;