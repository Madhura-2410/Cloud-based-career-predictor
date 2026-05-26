import React from 'react';
import { FiMap } from 'react-icons/fi';
import { generateDynamicData } from '../../utils/dynamicData';

interface Props { skillId?: string; }

const RoleRoadmap: React.FC<Props> = ({ skillId }) => {
  const data = generateDynamicData(skillId);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FiMap className="text-blue-500" /> Career Trajectory for {data.skill}
        </h3>
        <div className="relative border-l-2 border-blue-100 ml-4 space-y-8">
          {data.roadmapRoles.map((role, i) => (
            <div key={i} className="relative pl-8">
              <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                role.status === 'Current' ? 'bg-blue-500' : 
                role.status === 'Target' ? 'bg-indigo-500' : 'bg-purple-500'
              }`}></div>
              <div className="font-bold text-blue-600 mb-1">{role.year}</div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                <h4 className="font-bold text-gray-900">{role.role}</h4>
                <p className="text-sm text-gray-600 mt-1">Status: {role.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleRoadmap;
