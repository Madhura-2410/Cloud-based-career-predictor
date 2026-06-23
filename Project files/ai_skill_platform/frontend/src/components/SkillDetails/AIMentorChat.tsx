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

  const generateDynamicReply = (history: { text: string; isAi: boolean }[], currentQuestion: string) => {
    const normalized = currentQuestion.toLowerCase();
    
    let contextSubject = data.skill;
    if (history.length >= 2) {
       const lastUserMsg = history.filter(m => !m.isAi).pop()?.text.toLowerCase() || '';
       if (!/skill|cert|salary|job|role|course|python|aws|azure/i.test(normalized)) {
          if (lastUserMsg.includes('certification') || lastUserMsg.includes('cert')) contextSubject = "certifications";
          else if (lastUserMsg.includes('salary') || lastUserMsg.includes('pay')) contextSubject = "compensation";
          else if (lastUserMsg.includes('job') || lastUserMsg.includes('role')) contextSubject = "the job market";
       }
    }

    // 1. Greeting or Identity
    if (/^(hi|hello|hey|greetings)/i.test(normalized) || /who are you|what are you/i.test(normalized)) {
      return `Hello! I'm your AI Mentor specializing in ${data.skill}. I can analyze salary trends, estimate ROI for certifications, or connect you with human experts. What would you like to know?`;
    }

    // 2. Human Mentor Connection
    if (/human|person|someone|other|different|connect|talk/i.test(normalized)) {
      setShowHumanMentor(true);
      return "I'll connect you with a specialized human mentor who can provide 1-on-1 guidance. Their contact details are now displayed below.";
    }

    // 3. Quantitative / ROI
    if (/(percentage|%|increase|roi|probability|chance|likelihood)/i.test(normalized)) {
      const isResume = /resume|cv/i.test(normalized);
      const isSalary = /salary|pay|compensation|earn/i.test(normalized);
      const isHiring = /hire|job|get|interview/i.test(normalized);

      if (isResume) return `Based on current market demand, adding ${contextSubject} to your profile increases your resume's competitive value by approximately 18–25% in enterprise screening algorithms.`;
      if (isSalary) return `Market data indicates that mastering ${contextSubject} yields an estimated 12–20% salary premium compared to baseline roles.`;
      if (isHiring) return `Your probability of securing an interview for a senior role increases by roughly 35% when you demonstrate hands-on production experience in this area.`;
      
      return `The estimated ROI for this competency is highly favorable, typically yielding a 20-30% improvement in overall career velocity within 12 months.`;
    }

    // 4. Salary / Compensation
    if (/salary|pay|compensation|how much|worth|value|earn|income/i.test(normalized)) {
      return `For ${data.skill}, the current market salary range spans from $95,000 to $160,000+ depending on your region and seniority. Advanced certifications tend to push you toward the upper end of that bracket.`;
    }

    // 5. Follow-ups
    if (normalized.includes('what about') || normalized.includes('and for') || normalized.includes('how about')) {
      return `Regarding ${contextSubject}, the fundamental dynamic remains the same. Hiring managers prioritize candidates who combine theoretical knowledge with verifiable, deployed projects.`;
    }

    // 6. Time Estimation
    if (/how long|time|months|days|weeks|duration|fast/i.test(normalized)) {
      return `Assuming dedicated study of 10-15 hours a week, reaching professional proficiency in ${contextSubject} takes approximately 3 to 5 months.`;
    }

    // 7. Certifications
    if (/cert|certificate|exam|credential/i.test(normalized)) {
      return `Certifications act as strong trust signals. Target one advanced, vendor-specific certification that involves a practical lab component rather than accumulating multiple fundamental badges.`;
    }

    // 8. Trends and Growth
    if (/trend|future|growth|demand|outlook/i.test(normalized)) {
      return `The market trajectory for ${data.skill} shows sustained 15-20% YoY growth. Enterprise modernization efforts are currently driving a massive deficit in qualified engineers for these stacks.`;
    }

    // 9. How to start
    if (/how to|what should|start|begin|learn|guide/i.test(normalized)) {
      return `The most effective approach is to architect a small solution from scratch. Build an end-to-end project that solves a real business problem using ${data.skill}.`;
    }

    // Fallback: analyze the prompt directly instead of giving generic advice.
    return `I see you are asking about "${currentQuestion}". To give you the most accurate metrics for ${data.skill}, could you specify if you are looking for salary impact, learning timelines, or certification value?`;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const question = input.trim();
    
    // Add user message to history instantly
    const newHistory = [...messages, { text: question, isAi: false }];
    setMessages(newHistory);
    setInput('');

    setTimeout(() => {
      // Pass the updated history and the new question to the generator
      const reply = generateDynamicReply(newHistory, question);
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
