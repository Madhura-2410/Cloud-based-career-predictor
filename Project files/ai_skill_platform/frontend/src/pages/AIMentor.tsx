import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useUser } from '../context/UserContext';
import { FiMessageSquare, FiTrendingUp, FiCheckCircle, FiChevronRight, FiUsers, FiPhone, FiMail } from 'react-icons/fi';

interface MentorContact {
  name: string;
  specialization: string;
  phone: string;
  email: string;
}

const AIMentor: React.FC = () => {
  const { userProfile } = useUser();
  const [guidance, setGuidance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showHumanMentor, setShowHumanMentor] = useState(false);

  const fieldText = userProfile?.fieldOfExperience || userProfile?.learningGoals?.[0] || '';
  const mentor = getMentor(fieldText);

  useEffect(() => {
    const fetchGuidance = async () => {
      try {
        const userId = 'user_123';
        const data = await api.getMentorGuidance(userId);
        setGuidance(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuidance();
  }, []);

  if (loading) return <div className="p-12 text-center text-xl animate-pulse">Consulting with your AI Mentor...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col gap-6 mb-12 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-xl text-white">
            <FiMessageSquare className="text-3xl" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">{guidance?.mentor_name || 'AI Mentor'}</h1>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Artificial Intelligence Guide</p>
          </div>
        </div>
        <button
          onClick={() => setShowHumanMentor(true)}
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-200 transition hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-100 dark:shadow-slate-800/40 dark:hover:bg-slate-900"
        >
          Connect To Human Mentor <FiChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 relative transition-colors duration-300">
            <div className="absolute -left-3 top-8 w-6 h-6 bg-white dark:bg-slate-900 transform rotate-45 border-l border-b border-slate-200 dark:border-slate-800"></div>
            <p className="text-xl text-slate-700 dark:text-slate-200 leading-relaxed font-medium italic">
              "{guidance?.summary}"
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-slate-950 p-8 rounded-3xl border border-blue-100 dark:border-slate-800 transition-colors duration-300">
            <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
              <FiTrendingUp /> Strategic Advice
            </h3>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
              {guidance?.primary_advice}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8">Your Personalized Roadmap</h3>
            <div className="space-y-8 relative">
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
              {guidance?.roadmap_steps.map((step: any, i: number) => (
                <div key={i} className="flex gap-6 relative group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors ${i === 0 ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-300 group-hover:border-blue-400 group-hover:text-blue-500'}`}>
                    {step.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
                      {step.title} {i === 0 && <FiCheckCircle className="text-green-500 text-sm" />}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">{step.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-indigo-900 to-blue-900 p-8 rounded-3xl text-white shadow-xl transition-colors duration-300">
            <h3 className="text-lg font-bold mb-4 opacity-80">Next Milestone</h3>
            <div className="text-2xl font-bold mb-6">{guidance?.next_milestone}</div>
            <div className="w-full bg-indigo-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-400 h-full w-1/3 shadow-[0_0_10px_rgba(129,140,248,0.5)]"></div>
            </div>
            <p className="mt-4 text-sm opacity-70">33% Progress</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <h3 className="text-gray-500 dark:text-slate-400 uppercase text-xs font-black tracking-widest mb-6">Daily Wisdom</h3>
            <p className="text-slate-900 dark:text-slate-100 font-bold text-lg leading-snug">
              {guidance?.motivation_quote}
            </p>
            <button
              onClick={() => setShowHumanMentor(true)}
              className="mt-8 inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-bold hover:gap-4 transition-all"
            >
              Discuss with Mentor <FiChevronRight />
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="rounded-2xl bg-indigo-100 dark:bg-indigo-900 p-4 text-indigo-800 dark:text-indigo-200">
                <FiUsers size={28} />
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300 font-bold">Connect To Human Mentor</div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Real mentor guidance mapped to your course and career category.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50 dark:bg-slate-950">
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Name</div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{mentor.name}</div>
              </div>
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50 dark:bg-slate-950">
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Specialization</div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{mentor.specialization}</div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50 dark:bg-slate-950">
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Phone</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{mentor.phone}</div>
                </div>
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50 dark:bg-slate-950">
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Email</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{mentor.email}</div>
                </div>
              </div>
            </div>
            {showHumanMentor && (
              <div className="mt-6 p-4 rounded-3xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-slate-900 dark:text-slate-100">
                <h4 className="font-bold text-lg mb-3">Human mentor connection is ready</h4>
                <p className="text-sm leading-relaxed">
                  We have connected your request to a mentor who can support your next steps in {mentor.specialization}. Reach out directly using the contact details above.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const getMentor = (fieldText: string): MentorContact => {
  const field = fieldText.toLowerCase();
  if (field.includes('cloud') || field.includes('aws') || field.includes('azure') || field.includes('devops')) {
    return {
      name: 'Rahul Verma',
      specialization: 'Azure & AWS Cloud Solutions',
      phone: '+91-9876543210',
      email: 'rahul.cloudmentor@example.com',
    };
  }
  if (field.includes('database') || field.includes('sql') || field.includes('mongodb') || field.includes('mysql') || field.includes('postgres')) {
    return {
      name: 'Arjun Mehta',
      specialization: 'Database Management & SQL Optimization',
      phone: '+91-9123456780',
      email: 'arjun.dbmentor@example.com',
    };
  }
  if (field.includes('security') || field.includes('cyber')) {
    return {
      name: 'Riya Kapoor',
      specialization: 'Cybersecurity & Risk Management',
      phone: '+91-9988776655',
      email: 'riya.securitymentor@example.com',
    };
  }
  if (field.includes('ui') || field.includes('ux') || field.includes('design') || field.includes('figma')) {
    return {
      name: 'Ananya Joshi',
      specialization: 'UI/UX Design & Product Strategy',
      phone: '+91-9812345678',
      email: 'ananya.uiuxmentor@example.com',
    };
  }
  return {
    name: 'Vikram Singh',
    specialization: 'Career Growth Advisor',
    phone: '+91-9876512340',
    email: 'vikram.careermentor@example.com',
  };
};

export default AIMentor;
