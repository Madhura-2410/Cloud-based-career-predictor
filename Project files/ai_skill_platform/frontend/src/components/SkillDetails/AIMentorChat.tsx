import React, { useState } from 'react';
import { FiMessageSquare, FiSend } from 'react-icons/fi';
import { generateDynamicData } from '../../utils/dynamicData';
import { useUser } from '../../context/UserContext';

interface Props { skillId?: string; }

type MentorContact = {
  name: string;
  phone: string;
  email: string;
  specialization: string;
};

const mentorDirectory = (topic: string): MentorContact => {
  const text = topic.toLowerCase();
  if (text.includes('cloud') || text.includes('aws') || text.includes('azure') || text.includes('devops')) {
    return {
      name: 'Rahul Verma',
      phone: '+91-9876543210',
      email: 'rahul.cloudmentor@example.com',
      specialization: 'Azure & AWS Cloud Solutions',
    };
  }
  if (text.includes('sql') || text.includes('database') || text.includes('mongodb') || text.includes('mysql') || text.includes('postgres')) {
    return {
      name: 'Arjun Mehta',
      phone: '+91-9123456780',
      email: 'arjun.dbmentor@example.com',
      specialization: 'Database Management & SQL Optimization',
    };
  }
  if (text.includes('security') || text.includes('cyber') || text.includes('network')) {
    return {
      name: 'Riya Kapoor',
      phone: '+91-9988776655',
      email: 'riya.securitymentor@example.com',
      specialization: 'Cybersecurity & Risk Management',
    };
  }
  if (text.includes('ui') || text.includes('ux') || text.includes('design') || text.includes('figma')) {
    return {
      name: 'Ananya Joshi',
      phone: '+91-9812345678',
      email: 'ananya.uiuxmentor@example.com',
      specialization: 'UI/UX Design & Product Strategy',
    };
  }
  return {
    name: 'Vikram Singh',
    phone: '+91-9876512340',
    email: 'vikram.careermentor@example.com',
    specialization: 'Career Growth & Role Strategy',
  };
};

const AIMentorChat: React.FC<Props> = ({ skillId }) => {
  const { userProfile } = useUser();
  const data = generateDynamicData(skillId);
  const userField = (userProfile?.fieldOfExperience || userProfile?.learningGoals?.[0] || '').toLowerCase();
  const [showHumanMentor, setShowHumanMentor] = useState(false);

  const [messages, setMessages] = useState([
    { text: `Hello ${userProfile?.name || 'there'}! I’m your AI mentor for ${data.skill}. Ask me anything about the skill, certifications, or career path.`, isAi: true }
  ]);
  const [input, setInput] = useState('');

  const randomChoice = <T,>(options: T[]) => options[Math.floor(Math.random() * options.length)];

  const topicResponse = (question: string) => {
    const normalized = question.toLowerCase();
    const topic = data.skill.toLowerCase();

    const genericReplies = [
      `A strong way to own ${data.skill} is to combine hands-on projects with short expert-led certifications.`,
      `I’d recommend structuring your learning around real use cases for ${data.skill}, then iterating on each project.`,
      `Focus on the core concepts first, then layer in practical lab work to build confidence with ${data.skill}.`,
    ];

    if (/human mentor|connect to mentor|need mentor|real mentor|talk to mentor/i.test(normalized)) {
      setShowHumanMentor(true);
      const mentor = mentorDirectory(userField || topic);
      return `I can connect you with a human mentor who specializes in ${mentor.specialization}. Their name is ${mentor.name}, and I’ll display their contact below for an immediate connection.`;
    }

    if (/sql|database|mongodb|mysql|postgres|oracle/i.test(normalized) || topic.includes('sql') || topic.includes('database')) {
      return randomChoice([
        `For SQL and database administration, focus on query optimization, indexing, backup strategies, and cloud database services.`,
        `DBA roles reward strong data modelling, stored procedure expertise, and a solid grasp of scaling databases safely.`,
        `Certifications like AWS Database Specialty, Azure Database Administrator, or Oracle DBA will strengthen your profile for database roles.`,
      ]);
    }

    if (/cloud|aws|azure|gcp|devops|deployment|kubernetes/i.test(normalized) || topic.includes('cloud')) {
      return randomChoice([
        `Cloud computing mastery comes from hands-on architecture work, secure deployments, and end-to-end automation.`,
        `For Azure/AWS paths, combine infrastructure-as-code with service design patterns and monitoring best practices.`,
        `A strong portfolio for cloud roles includes a deployment pipeline, container orchestration, and multi-region design.`,
      ]);
    }

    if (/ui|ux|figma|design|prototype|user experience/i.test(normalized) || topic.includes('ui') || topic.includes('ux')) {
      return randomChoice([
        `UI/UX is about crafting delightful user journeys — start with research, then iterate on wireframes and prototypes.`,
        `Build experience with design systems, accessibility reviews, and a portfolio that explains your thinking, not just the visuals.`,
        `Figma, user testing, and component libraries are critical tools for a modern UI/UX path.`,
      ]);
    }

    if (/security|cyber|threat|risk/i.test(normalized) || topic.includes('security')) {
      return randomChoice([
        `Cybersecurity advice: learn secure architecture, incident response, and how to harden cloud workloads.`,
        `Pair your skill knowledge with threat modelling and compliance frameworks like ISO 27001 or NIST.`,
        `Red team/blue team projects help you translate security concepts into real-world risk reduction.`,
      ]);
    }

    return randomChoice(genericReplies);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const question = input.trim();
    setMessages((prev) => [...prev, { text: question, isAi: false }]);
    setInput('');

    setTimeout(() => {
      const reply = topicResponse(question);
      setMessages((prev) => [...prev, { text: reply, isAi: true }]);
    }, 600);
  };

  const mentor = mentorDirectory(userField || data.skill);

  return (
    <div className="animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[560px] transition-colors duration-300">
        <div className="bg-slate-50 dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 p-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
            <FiMessageSquare className="text-blue-500" /> AI Career Mentor
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Ask any question about {data.skill}, your field, or next steps.</p>
        </div>

        <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-white dark:bg-slate-950">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.isAi ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${msg.isAi ? 'bg-blue-50 dark:bg-slate-800 text-blue-900 dark:text-blue-200 rounded-tl-none border border-blue-100 dark:border-slate-700' : 'bg-slate-800 text-white rounded-tr-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} autoComplete="off" className="p-4 bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your learning path..."
            className="flex-grow bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-slate-900 dark:text-slate-100"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors shadow-sm">
            <FiSend />
          </button>
        </form>

        {showHumanMentor && (
          <div className="px-4 pb-4">
            <div className="rounded-3xl border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-slate-950 p-4 shadow-sm">
              <div className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-2">Human Mentor Recommended</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Name</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{mentor.name}</p>
                </div>
                <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Specialization</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{mentor.specialization}</p>
                </div>
                <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Phone</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{mentor.phone}</p>
                </div>
                <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Email</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{mentor.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMentorChat;
