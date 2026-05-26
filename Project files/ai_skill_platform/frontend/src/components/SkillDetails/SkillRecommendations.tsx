import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTarget, FiArrowRight } from 'react-icons/fi';
import { useUser } from '../../context/UserContext';

interface Props { skillId?: string; }

const makeSkillId = (skillName: string) => skillName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const SkillRecommendations: React.FC<Props> = ({ skillId }) => {
  const navigate = useNavigate();
  const { userProfile } = useUser();
  const goalField = (userProfile.fieldOfExperience || userProfile.learningGoals[0] || '').toLowerCase();

  const recommendations = useMemo(() => {
    if (!userProfile.learningPath.length) {
      return [
        { 
          title: 'Keep building your core strengths', 
          priority: 'High', 
          explanation: 'Add more aligned skills to your learning path.', 
          order: 1,
          nextStepText: 'Explore Available Skills',
          target: '/skills'
        },
      ];
    }

    return userProfile.learningPath
      .map((item) => {
        const title = item.title;
        const normalizedTitle = title.toLowerCase();
        let priority = 'Low';
        let explanation = 'This skill is beneficial for broad career growth.';
        let order = 3;

        if (goalField.includes('database') && /sql|mongodb|database|db/.test(normalizedTitle)) {
          priority = 'High';
          explanation = 'Directly aligned with your field of interest and helps build database administration expertise.';
          order = 1;
        } else if (goalField.includes('cloud') && /cloud|aws|azure|gcp|devops/.test(normalizedTitle)) {
          priority = 'High';
          explanation = 'This course supports cloud architecture and platform administration roles.';
          order = 1;
        } else if (goalField.includes('security') && /security|cyber|network/.test(normalizedTitle)) {
          priority = 'High';
          explanation = 'Strong match for cybersecurity and secure operations career paths.';
          order = 1;
        } else if (goalField.includes('data') && /data|sql|analytics|engineering/.test(normalizedTitle)) {
          priority = 'High';
          explanation = 'Great relevance for data-focused career growth and analytics roles.';
          order = 1;
        } else if (goalField.includes('database')) {
          if (/cloud|security|aws|azure|gcp/.test(normalizedTitle)) {
            priority = 'Medium';
            explanation = 'Useful complementary knowledge to support a database administrator in hybrid environments.';
            order = 2;
          }
        } else if (goalField.includes('cloud')) {
          if (/sql|database|network|security/.test(normalizedTitle)) {
            priority = 'Medium';
            explanation = 'Helps strengthen your cloud architecture capabilities with related technical depth.';
            order = 2;
          }
        }

        // Determine dynamic next step and target
        let nextStepText = 'Explore Skill Details';
        let target = `/skill/${makeSkillId(title)}`;

        if (priority === 'High') {
          if (/sql/.test(normalizedTitle)) {
            nextStepText = 'Start Advanced SQL Optimization Module';
          } else if (/mongodb/.test(normalizedTitle)) {
            nextStepText = 'Begin MongoDB NoSQL Schema Design';
          } else if (/cloud|aws/.test(normalizedTitle)) {
            nextStepText = 'Begin AWS Fundamentals Roadmap';
          } else if (/azure/.test(normalizedTitle)) {
            nextStepText = 'Begin Azure Fundamentals Roadmap';
          } else if (/machine|ai|ml/.test(normalizedTitle)) {
            nextStepText = 'Start AI & Neural Networks Deep Dive';
          } else if (/security|cyber/.test(normalizedTitle)) {
            nextStepText = 'Launch Cybersecurity Incident Response Simulation';
          } else {
            nextStepText = `Begin Core ${title} Learning Track`;
          }
        } else if (priority === 'Medium') {
          if (/react|next|web/.test(normalizedTitle)) {
            nextStepText = `Build React & Next.js Micro-Frontend App`;
          } else {
            nextStepText = `Review ${title} Roadmap`;
          }
        } else {
          nextStepText = `Explore ${title} Basics`;
        }

        return { title, priority, explanation, order, nextStepText, target };
      })
      .sort((a, b) => a.order - b.order);
  }, [userProfile.learningPath, goalField]);

  const handleNextStep = (target: string) => {
    navigate(target);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-300">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <FiTarget className="text-indigo-500" /> Priority Recommendations
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {recommendations.map((rec, i) => (
            <div key={i} className="p-5 border border-indigo-100 dark:border-slate-800 bg-indigo-50/60 dark:bg-slate-950 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                <div>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-md uppercase">
                    {rec.priority} Priority
                  </span>
                </div>
                <span className="text-indigo-400 dark:text-indigo-300 text-sm font-medium">Order {rec.order}</span>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-2">{rec.title}</h4>
              <p className="text-slate-600 dark:text-slate-300 mb-4">{rec.explanation}</p>
              <button 
                onClick={() => handleNextStep(rec.target)}
                className="text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all hover:text-indigo-800 dark:hover:text-indigo-200 cursor-pointer"
              >
                {rec.nextStepText} <FiArrowRight />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillRecommendations;
