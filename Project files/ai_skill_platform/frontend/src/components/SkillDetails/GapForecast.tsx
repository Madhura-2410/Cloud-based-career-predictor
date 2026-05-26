import React from 'react';
import { FiActivity } from 'react-icons/fi';
import { generateDynamicData } from '../../utils/dynamicData';

interface Props { skillId?: string; }

const GapForecast: React.FC<Props> = ({ skillId }) => {
  const data = generateDynamicData(skillId);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FiActivity className="text-red-500" /> Skill Gap Forecast for {data.skill}
        </h3>
        <div className="space-y-4">
          {data.gaps.map((item, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-800">{item.name}</span>
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                  item.status === 'Critical' ? 'bg-red-100 text-red-600' : 
                  item.status === 'Moderate' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                }`}>{item.status}</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className={`h-full ${
                  item.status === 'Critical' ? 'bg-red-500' : 
                  item.status === 'Moderate' ? 'bg-yellow-500' : 'bg-green-500'
                }`} style={{ width: `${item.gap}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GapForecast;
