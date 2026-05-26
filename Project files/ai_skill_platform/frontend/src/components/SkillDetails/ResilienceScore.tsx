import React from 'react';
import { FiShield } from 'react-icons/fi';
import { generateDynamicData } from '../../utils/dynamicData';

interface Props { skillId?: string; }

const ResilienceScore: React.FC<Props> = ({ skillId }) => {
  const data = generateDynamicData(skillId);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2 w-full justify-start">
          <FiShield className="text-blue-500" /> Profile Resilience Score
        </h3>
        <p className="text-gray-600 w-full text-left mb-8">How resistant your portfolio is to AI automation with {data.skill}.</p>
        
        <div className="relative w-48 h-48 mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="10" />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="url(#gradient)" 
              strokeWidth="10" 
              strokeDasharray="283" 
              strokeDashoffset={283 - (283 * data.score) / 100} 
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-gray-900">{data.score}%</span>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Strong</span>
          </div>
        </div>

        <div className="w-full bg-blue-50 p-6 rounded-xl border border-blue-100 text-left">
          <h4 className="font-bold text-gray-900 mb-2">Resilience Insights</h4>
          <p className="text-gray-700 text-sm">
            Adding <strong>{data.skill}</strong> boosts your resilience score by 14%. Your combination of {data.skill} and your existing experience creates a highly defensible moat against pure AI automation. Focus on complex architectural decision-making to push this score above 90%.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResilienceScore;
