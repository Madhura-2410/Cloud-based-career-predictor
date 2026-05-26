import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBriefcase, FiClock, FiStar, FiTag, FiArrowRight, FiX } from 'react-icons/fi';
import { useUser } from '../context/UserContext';

const UserInputPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateUserProfile } = useUser();
  const [formData, setFormData] = useState({
    fieldOfExperience: '',
    yearsOfExperience: '',
    areaOfInterest: '',
  });
  
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentSkill.trim() !== '') {
      e.preventDefault();
      if (!skills.includes(currentSkill.trim())) {
        setSkills([...skills, currentSkill.trim()]);
      }
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fieldOfExperience: formData.fieldOfExperience,
      experienceYears: parseInt(formData.yearsOfExperience) || 0,
      currentSkills: skills,
      learningGoals: formData.areaOfInterest ? [formData.areaOfInterest] : [],
    });
    // Navigate to suggested skills page
    navigate('/skills');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px]"></div>

      <div className="z-10 text-center mb-10 max-w-2xl mt-12">
        <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight uppercase text-slate-900">
          Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Profile</span>
        </h1>
        <p className="text-lg text-slate-600">
          Tell us about your background so our AI can predict skill obsolescence and generate a personalized learning path.
        </p>
      </div>

      <div className="z-10 w-full max-w-xl mb-12">
        <form autoComplete="off" onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl p-8 space-y-6 transition-colors duration-300">
          
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Field of Experience</label>
            <div className="relative group">
              <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                autoComplete="off"
                name="fieldOfExperience"
                placeholder="e.g. Software Engineering, Data Science"
                value={formData.fieldOfExperience}
                onChange={handleInputChange}
                required
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900 dark:text-slate-100 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Years of Experience</label>
            <div className="relative group">
              <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="number"
                autoComplete="off"
                name="yearsOfExperience"
                min="0"
                placeholder="e.g. 5"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                required
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900 dark:text-slate-100 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Area of Interest</label>
            <div className="relative group">
              <FiStar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                autoComplete="off"
                name="areaOfInterest"
                placeholder="e.g. Artificial Intelligence, Cloud Computing"
                value={formData.areaOfInterest}
                onChange={handleInputChange}
                required
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900 dark:text-slate-100 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Skills Possessed (Press Enter to add)</label>
            <div className="relative group">
              <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                autoComplete="off"
                placeholder="e.g. Python, React, AWS"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyDown={handleAddSkill}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900 dark:text-slate-100 shadow-sm"
              />
            </div>
            
            {/* Skills Tags Area */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                {skills.map((skill, index) => (
                  <span key={index} className="flex items-center gap-1 bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors ml-1">
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
          >
            Generate Suggested Skills
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserInputPage;
