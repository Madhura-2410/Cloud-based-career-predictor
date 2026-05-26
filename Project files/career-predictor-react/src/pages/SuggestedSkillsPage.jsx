import React from 'react';

const SuggestedSkillsPage = ({ userData, professionalData, skills, onViewSkill, onEditProfile, onLogout }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
    <h2 className="text-2xl font-semibold mb-4">Suggested Skills for {userData?.name || 'You'}</h2>
    <p className="mb-4 text-gray-700">Based on your role: <span className="font-bold">{professionalData?.role}</span></p>
    <ul className="mb-6">
      {skills && skills.length > 0 ? skills.map((skill, idx) => (
        <li key={idx} className="mb-2 flex items-center gap-2">
          <span className="bg-blue-200 px-2 py-1 rounded text-blue-800">{skill}</span>
          <button
            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
            onClick={() => onViewSkill(skill)}
          >
            View
          </button>
        </li>
      )) : <li>No skills entered.</li>}
    </ul>
    <div className="flex gap-2">
      <button className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={onEditProfile}>Edit Profile</button>
      <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={onLogout}>Logout</button>
    </div>
  </div>
);

export default SuggestedSkillsPage;
