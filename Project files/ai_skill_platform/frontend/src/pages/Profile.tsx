import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiClock, 
  FiLock, 
  FiPlus, 
  FiX, 
  FiSave, 
  FiShield, 
  FiBriefcase, 
  FiCheckCircle, 
  FiAlertCircle 
} from 'react-icons/fi';
import { useUser } from '../context/UserContext';

const Profile: React.FC = () => {
  const { userProfile, updateUserProfile } = useUser();
  const location = useLocation();
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'password'>('profile');

  // Listen to navigation state to set sub tab
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveSubTab(location.state.activeTab as 'profile' | 'password');
    }
  }, [location.state]);

  // Profile fields state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    contactNumber: '',
    age: 25,
    experienceYears: 0,
    fieldOfInterest: '',
    preferredCareerDomain: '',
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password fields state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Synchronize state from userContext on mount/change
  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        name: userProfile.name || '',
        email: userProfile.email || '',
        contactNumber: userProfile.contactNumber || '',
        age: userProfile.age !== undefined ? userProfile.age : 25,
        experienceYears: userProfile.experienceYears !== undefined ? userProfile.experienceYears : 0,
        fieldOfInterest: userProfile.fieldOfInterest || '',
        preferredCareerDomain: userProfile.preferredCareerDomain || '',
      });
      setSkills(userProfile.currentSkills || []);
    }
  }, [userProfile]);

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    if (!profileForm.name.trim()) {
      setProfileError('Name cannot be empty.');
      return;
    }
    if (!profileForm.email.trim()) {
      setProfileError('Email cannot be empty.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      setProfileError('Please enter a valid email address.');
      return;
    }

    updateUserProfile({
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
      contactNumber: profileForm.contactNumber.trim(),
      age: Number(profileForm.age),
      experienceYears: Number(profileForm.experienceYears),
      fieldOfInterest: profileForm.fieldOfInterest.trim(),
      preferredCareerDomain: profileForm.preferredCareerDomain.trim(),
      currentSkills: skills,
    });

    setProfileSuccess('Profile settings updated successfully!');
    window.setTimeout(() => setProfileSuccess(''), 4000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    const storedPassword = userProfile.password || 'password123';

    if (!passwordForm.currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (passwordForm.currentPassword !== storedPassword) {
      setPasswordError('Incorrect current password.');
      return;
    }
    if (!passwordForm.newPassword) {
      setPasswordError('Please enter a new password.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New password confirmation does not match.');
      return;
    }

    updateUserProfile({
      password: passwordForm.newPassword
    });

    setPasswordSuccess('Password changed successfully!');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
    window.setTimeout(() => setPasswordSuccess(''), 4000);
  };

  const initialLetter = profileForm.name ? profileForm.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 dark:bg-blue-950/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 dark:bg-indigo-950/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto z-10 relative">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Account Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base font-semibold">
            Manage your professional profile, career interests, and account security.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
              {/* Profile Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-blue-500/20 border-4 border-white dark:border-slate-800">
                {initialLetter}
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                {profileForm.name || 'User Name'}
              </h2>
              <span className="text-xs uppercase font-extrabold tracking-wider text-blue-600 dark:text-blue-450 mt-1">
                {userProfile.role || 'Aspiring AI Specialist'}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">
                {profileForm.email || 'user@example.com'}
              </p>

              <div className="w-full border-t border-slate-100 dark:border-slate-800 my-5"></div>

              {/* Sidebar Tabs */}
              <div className="w-full flex flex-col gap-2">
                <button
                  onClick={() => setActiveSubTab('profile')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    activeSubTab === 'profile'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                  }`}
                >
                  <FiUser size={18} />
                  <span>Profile Information</span>
                </button>
                <button
                  onClick={() => setActiveSubTab('password')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    activeSubTab === 'password'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                  }`}
                >
                  <FiLock size={18} />
                  <span>Security & Password</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form Content Area */}
          <div className="lg:col-span-8">
            {activeSubTab === 'profile' ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 animate-fadeIn">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <FiUser className="text-blue-600" /> General Details
                </h3>

                {profileSuccess && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-2xl flex items-center gap-3 text-green-800 dark:text-green-300 text-sm font-bold animate-fadeIn">
                    <FiCheckCircle size={18} />
                    <span>{profileSuccess}</span>
                  </div>
                )}

                {profileError && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-center gap-3 text-red-800 dark:text-red-300 text-sm font-bold animate-fadeIn">
                    <FiAlertCircle size={18} />
                    <span>{profileError}</span>
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Grid for Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Name</label>
                      <div className="relative">
                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/35 focus:border-blue-500 transition-all font-semibold"
                          placeholder="e.g. John Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</label>
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/35 focus:border-blue-500 transition-all font-semibold"
                          placeholder="e.g. email@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Grid for Contact, Age, Experience */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Contact Number</label>
                      <div className="relative">
                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          value={profileForm.contactNumber}
                          onChange={(e) => setProfileForm({ ...profileForm, contactNumber: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/35 focus:border-blue-500 transition-all font-semibold"
                          placeholder="e.g. +1 2345678"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Age</label>
                      <div className="relative">
                        <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="number"
                          value={profileForm.age}
                          onChange={(e) => setProfileForm({ ...profileForm, age: Number(e.target.value) })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/35 focus:border-blue-500 transition-all font-semibold"
                          placeholder="Age"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Years of Exp</label>
                      <div className="relative">
                        <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="number"
                          value={profileForm.experienceYears}
                          onChange={(e) => setProfileForm({ ...profileForm, experienceYears: Number(e.target.value) })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/35 focus:border-blue-500 transition-all font-semibold"
                          placeholder="Exp"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Grid for Domain & Interest */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Field of Interest</label>
                      <input
                        type="text"
                        value={profileForm.fieldOfInterest}
                        onChange={(e) => setProfileForm({ ...profileForm, fieldOfInterest: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/35 focus:border-blue-500 transition-all font-semibold"
                        placeholder="e.g. Web Applications, Data Science"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Preferred Career Domain</label>
                      <input
                        type="text"
                        value={profileForm.preferredCareerDomain}
                        onChange={(e) => setProfileForm({ ...profileForm, preferredCareerDomain: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/35 focus:border-blue-500 transition-all font-semibold"
                        placeholder="e.g. AI & Cloud Architecture"
                      />
                    </div>
                  </div>

                  {/* Skills Editor */}
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Skills Portfolio</label>
                    
                    {/* Tags List */}
                    <div className="flex flex-wrap gap-2 min-h-[44px] p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
                      {skills.length === 0 ? (
                        <span className="text-xs text-slate-400 font-semibold self-center">No skills added yet. Add some below!</span>
                      ) : (
                        skills.map((skill, index) => (
                          <div 
                            key={index} 
                            className="flex items-center gap-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:border-red-300 hover:text-red-600 dark:hover:text-red-400 dark:hover:border-red-950 group"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="focus:outline-none opacity-60 group-hover:opacity-100 transition-opacity ml-1"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Skill Tag Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const cleanSkill = newSkillInput.trim();
                            if (cleanSkill && !skills.some(s => s.toLowerCase() === cleanSkill.toLowerCase())) {
                              setSkills([...skills, cleanSkill]);
                              setNewSkillInput('');
                            }
                          }
                        }}
                        className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/35 focus:border-blue-500 transition-all font-semibold"
                        placeholder="Type a skill (e.g. AWS, Docker) and press Enter or click Add"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          const cleanSkill = newSkillInput.trim();
                          if (cleanSkill && !skills.some(s => s.toLowerCase() === cleanSkill.toLowerCase())) {
                            setSkills([...skills, cleanSkill]);
                            setNewSkillInput('');
                          }
                        }}
                        className="px-5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-750 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 active:scale-[0.98]"
                      >
                        <FiPlus size={16} />
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all flex items-center gap-2 active:scale-[0.98]"
                    >
                      <FiSave size={18} />
                      Save Profile Details
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 animate-fadeIn">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <FiShield className="text-blue-600" /> Account Security
                </h3>

                {passwordSuccess && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-2xl flex items-center gap-3 text-green-800 dark:text-green-300 text-sm font-bold animate-fadeIn">
                    <FiCheckCircle size={18} />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                {passwordError && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-center gap-3 text-red-800 dark:text-red-300 text-sm font-bold animate-fadeIn">
                    <FiAlertCircle size={18} />
                    <span>{passwordError}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/35 focus:border-blue-500 transition-all font-semibold"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">New Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/35 focus:border-blue-500 transition-all font-semibold"
                        placeholder="•••••••• (Min. 6 characters)"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Confirm New Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        value={passwordForm.confirmNewPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/35 focus:border-blue-500 transition-all font-semibold"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all flex items-center gap-2 active:scale-[0.98]"
                    >
                      <FiShield size={18} />
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
