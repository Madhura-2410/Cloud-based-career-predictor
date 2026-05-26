import React from 'react';
import { FiClock, FiZap } from 'react-icons/fi';
import { generateDynamicData } from '../../utils/dynamicData';

interface Props { skillId?: string; }

const DecayTracker: React.FC<Props> = ({ skillId }) => {
  const data = generateDynamicData(skillId);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FiClock className="text-orange-500" /> Skill Decay Analysis
        </h3>
        <p className="text-gray-600 mb-8">Visualizing the shelf-life of your current skill set in the evolving AI landscape.</p>
        
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-700">Current Relevance ({data.skill})</span>
              <span className="text-orange-600 font-bold">{data.relevance}%</span>
            </div>
            <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-full animate-pulse" style={{ width: `${data.relevance}%` }}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="text-orange-600 font-bold text-xl mb-1">{data.halfLife} Years</div>
              <div className="text-gray-600 text-sm">Estimated Half-life</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="text-blue-600 font-bold text-xl mb-1">{data.decayRate > 15 ? 'High' : 'Moderate'}</div>
              <div className="text-gray-600 text-sm">Update Frequency</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div className="text-purple-600 font-bold text-xl mb-1">-{data.decayRate}% / Year</div>
              <div className="text-gray-600 text-sm">Decay Rate</div>
            </div>
          </div>

          <div className="p-6 bg-slate-900 rounded-xl text-white">
            <h4 className="font-bold mb-2 flex items-center gap-2 text-orange-400">
              <FiZap /> Action Recommended
            </h4>
            <p className="text-slate-300 text-sm">Your knowledge of "{data.skill}" needs an update within {Math.ceil(data.decayRate / 3)} months to maintain market edge.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecayTracker;
