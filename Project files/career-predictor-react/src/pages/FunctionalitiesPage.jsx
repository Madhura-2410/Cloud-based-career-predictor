import React from 'react';

const FunctionalitiesPage = ({ skill, userData, professionalData, onBack }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
    <h2 className="text-2xl font-semibold mb-4">Skill Details & Functionalities</h2>
    <p className="mb-2 text-gray-700">Skill: <span className="font-bold">{skill}</span></p>
    <p className="mb-2 text-gray-700">User: <span className="font-bold">{userData?.name}</span></p>
    <p className="mb-6 text-gray-700">Role: <span className="font-bold">{professionalData?.role}</span></p>
    <ul className="mb-6 list-disc pl-6 text-left">
      <li>Skill Obsolescence Prediction</li>
      <li>Career Longevity Estimation</li>
      <li>Skill Gap Analysis</li>
      <li>Personalized Learning Pathways</li>
      <li>Mentor Recommendations</li>
      <li>Industry Demand Trends</li>
      <li>ROI Calculator for Upskilling</li>
      <li>Resilience Score</li>
    </ul>
    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={onBack}>Back to Suggestions</button>
  </div>
);

export default FunctionalitiesPage;
