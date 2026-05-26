import React from 'react';

const DashboardPage = ({ userData, onStartAssessment, onLogout }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white">
    <h2 className="text-2xl font-semibold mb-4">Welcome, {userData?.name || 'User'}!</h2>
    <p className="mb-6 text-gray-700">Ready to assess your professional skills and career longevity?</p>
    <button
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-4"
      onClick={onStartAssessment}
    >
      Start Skill Assessment
    </button>
    <button
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      onClick={onLogout}
    >
      Logout
    </button>
  </div>
);

export default DashboardPage;
