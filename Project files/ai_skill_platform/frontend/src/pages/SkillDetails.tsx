import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiActivity, FiTarget, FiZap,
  FiTrendingUp, FiMessageSquare, FiBell, FiShield, FiClock,
  FiMap, FiAward
} from 'react-icons/fi';
import { useUser } from '../context/UserContext';

// Modular feature components
import DecayTracker from '../components/SkillDetails/DecayTracker';
import RoleRoadmap from '../components/SkillDetails/RoleRoadmap';
import GapForecast from '../components/SkillDetails/GapForecast';
import SkillRecommendations from '../components/SkillDetails/SkillRecommendations';
import ROIEstimation from '../components/SkillDetails/ROIEstimation';
import AIMentorChat from '../components/SkillDetails/AIMentorChat';
import TrendAlerts from '../components/SkillDetails/TrendAlerts';
import ResilienceScore from '../components/SkillDetails/ResilienceScore';

import { getMarketContext } from '../utils/marketContext';

const SkillDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userProfile, addToLearningPath, removeFromLearningPath } = useUser();
  const [activeTab, setActiveTab] = useState('decay');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const itemId = id || '';
  const itemTitle = `${id?.replace(/-/g, ' ') ?? 'Recommended Skill'}`;
  const isAlreadyAdded = userProfile.learningPath.some((entry) => entry.id === itemId);
  const contextData = getMarketContext(itemId);

  const handleToggleLearningPath = () => {
    if (isAlreadyAdded) {
      removeFromLearningPath(itemId);
      setFeedbackMessage('Removed from your Learning Path');
    } else {
      addToLearningPath({
        id: itemId,
        title: itemTitle,
        platforms: [{ name: 'AI Learning Hub', url: 'https://example.com/learning-path' }],
        status: 'Not Started',
        dateAdded: new Date().toLocaleDateString(),
      });
      setFeedbackMessage('Added to your Learning Path');
    }
    window.setTimeout(() => setFeedbackMessage(''), 2500);
  };

  const features = [
    { id: 'decay', label: 'Skill Decay Tracker', icon: <FiClock /> },
    { id: 'roadmap', label: 'Future Role & Roadmap', icon: <FiMap /> },
    { id: 'gap', label: 'Skill Gap Forecast', icon: <FiActivity /> },
    { id: 'recommend', label: 'Priority Recommendations', icon: <FiTarget /> },
    { id: 'roi', label: 'Learning ROI', icon: <FiTrendingUp /> },
    { id: 'mentor', label: 'AI Mentor', icon: <FiMessageSquare /> },
    { id: 'alerts', label: 'Trend Alerts', icon: <FiBell /> },
    { id: 'resilience', label: 'Resilience Score', icon: <FiShield /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'decay':
        return <DecayTracker skillId={id} />;
      case 'roadmap':
        return <RoleRoadmap skillId={id} />;
      case 'gap':
        return <GapForecast skillId={id} />;
      case 'recommend':
        return <SkillRecommendations skillId={id} />;
      case 'roi':
        return <ROIEstimation skillId={id} />;
      case 'mentor':
        return <AIMentorChat skillId={id} />;
      case 'alerts':
        return <TrendAlerts skillId={id} />;
      case 'resilience':
        return <ResilienceScore skillId={id} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 relative overflow-hidden transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px]"></div>

      {/* Top Nav / Toolbar */}
      <nav className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex items-center h-16 whitespace-nowrap scrollbar-hide">
            <button
              onClick={() => navigate('/skills')}
              className="mr-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <FiArrowLeft size={20} />
            </button>
            <div className="flex gap-1">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveTab(feature.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
                    activeTab === feature.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  {feature.icon}
                  <span>{feature.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Header with Skill Name */}
      <div className="relative border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-yellow-100 border border-yellow-200 dark:bg-yellow-950 dark:border-yellow-900 p-2 rounded-lg shadow-sm">
               <FiAward className="text-yellow-600 dark:text-yellow-500" size={20} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Detailed Analytics</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white capitalize drop-shadow-sm">
            {id?.replace(/-/g, ' ')}
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-2xl text-lg font-medium">
            Deep dive into your career trajectory, market value, and AI-driven growth path for this specific skill.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Feature Content */}
          <div className="lg:col-span-8">
            {renderContent()}
          </div>

          {/* Side Overview / Quick Context */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                 <FiActivity className="text-blue-600 dark:text-blue-400" /> Market Context
              </h4>
              <div className="space-y-5">
                {/* Demand Card */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Market Demand</span>
                    <span className="text-green-700 dark:text-green-400 font-bold bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900/50 px-2 py-0.5 rounded text-[10px]">{contextData.demand}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full transition-all duration-500" style={{ width: `${contextData.demandPercent}%` }}></div>
                  </div>
                </div>

                {/* Hiring Growth & Openings Grid */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Hiring Growth</span>
                    <span className="text-blue-700 dark:text-blue-400 font-black text-sm block">{contextData.hiringGrowth}</span>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${contextData.hiringGrowthPercent}%` }}></div>
                    </div>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Job Openings</span>
                    <span className="text-slate-900 dark:text-slate-200 font-black text-sm block">{contextData.jobOpenings}</span>
                  </div>
                </div>

                {/* Salary Trend Card */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl">
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Salary Range</span>
                  <span className="text-slate-950 dark:text-white font-black text-base">{contextData.salaryTrend}</span>
                </div>

                {/* Future Scope Progress */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">Future Scope</span>
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 text-xs font-bold block mb-2">{contextData.futureScope}</span>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${contextData.futureScopePercent}%` }}></div>
                  </div>
                </div>

                {/* Adoption Rate Card */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">Adoption Rate</span>
                    <span className="text-slate-900 dark:text-slate-300 text-xs font-bold">{contextData.adoptionRate}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-1.5">
                    <div className="bg-purple-650 dark:bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${contextData.adoptionPercent}%` }}></div>
                  </div>
                </div>

                {/* Complexity Stars */}
                <div className="flex justify-between items-center py-1 px-1">
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Learning Complexity</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-3 h-3 rounded-full ${
                          star <= contextData.learningComplexity
                            ? 'bg-blue-600 dark:bg-blue-500 shadow-sm'
                            : 'bg-slate-200 dark:bg-slate-800 border border-slate-350 dark:border-slate-700'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Insights Block */}
                <div className="pt-3.5 border-t border-slate-100 dark:border-slate-850">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-2.5">Key Insights</span>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                    {contextData.insights.map((insight, idx) => (
                      <li key={idx} className="font-bold leading-relaxed">{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
              <FiZap className="text-yellow-300 mb-5 relative z-10 group-hover:scale-110 transition-transform" size={28} />
              <h4 className="font-bold text-xl mb-3 relative z-10">Power Move</h4>
              <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-6 relative z-10">
                Mastering this skill right now will increase your match rate for high-paying remote roles by <strong>85%</strong>.
              </p>
              <button
                onClick={handleToggleLearningPath}
                className={`w-full py-3 rounded-xl font-bold transition-all shadow-sm relative z-10 active:scale-[0.98] ${isAlreadyAdded ? 'bg-white text-indigo-700 border border-slate-200 hover:bg-slate-50' : 'bg-white text-indigo-700 hover:bg-indigo-50'}`}
              >
                {isAlreadyAdded ? 'Remove From Path' : 'Add to Learning Path'}
              </button>
              {feedbackMessage && (
                <div className="mt-4 inline-flex items-center justify-center rounded-full bg-green-50 border border-green-200 px-4 py-2 text-sm font-semibold text-green-800 shadow-sm animate-fadeIn">
                  {feedbackMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default SkillDetails;
