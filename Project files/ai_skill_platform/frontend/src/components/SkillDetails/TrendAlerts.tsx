import React from 'react';
import { FiBell, FiExternalLink } from 'react-icons/fi';
import { generateDynamicData } from '../../utils/dynamicData';

interface Props { skillId?: string; }

const TrendAlerts: React.FC<Props> = ({ skillId }) => {
  const data = generateDynamicData(skillId);

  const getAlerts = (skill: string) => {
    return [
      {
        title: `${skill} adoption surges in enterprise sectors`,
        source: 'TechCrunch',
        time: '2 days ago',
        type: 'News',
        url: `https://techcrunch.com/search/${encodeURIComponent(skill)}`
      },
      {
        title: `New major framework update changes ${skill} best practices`,
        source: 'GitHub Blog',
        time: '1 week ago',
        type: 'Update',
        url: `https://github.com/topics/${encodeURIComponent(skill.toLowerCase().replace(/\s+/g, '-'))}`
      },
      {
        title: `Demand for ${skill} engineers outpaces supply`,
        source: 'LinkedIn Insights',
        time: '2 weeks ago',
        type: 'Market',
        url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(skill)}`
      }
    ];
  };

  const alerts = getAlerts(data.skill);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-300">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <FiBell className="text-yellow-500" /> Industry Trends for {data.skill}
        </h3>
        
        <div className="space-y-4">
          {alerts.map((alert, i) => (
            <div
              key={i}
              onClick={() => window.open(alert.url, '_blank', 'noopener,noreferrer')}
              className="p-5 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-900 hover:bg-blue-50/20 dark:hover:bg-slate-900/40 transition-all duration-300 group flex justify-between items-center cursor-pointer active:scale-[0.99]"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full tracking-wider ${
                    alert.type === 'News' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                    alert.type === 'Update' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' : 
                    'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                  }`}>
                    {alert.type}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">{alert.time} • {alert.source}</span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 leading-snug">
                  {alert.title}
                </h4>
              </div>
              <div className="ml-4 w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 flex items-center justify-center text-slate-400 group-hover:text-blue-650 group-hover:border-blue-300 dark:group-hover:border-blue-800 shadow-sm transition-all duration-200">
                <FiExternalLink size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendAlerts;
