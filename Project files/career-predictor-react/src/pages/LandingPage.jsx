import React from 'react';

const LandingPage = ({ onSubmit }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-200">
    <h1 className="text-4xl font-bold mb-6 text-gray-800">Cloud Career Longevity & Skill Obsolescence Predictor</h1>
    <p className="mb-8 text-lg text-gray-600 max-w-xl text-center">
      Welcome! Discover how your skills align with the future of work. Start your personalized assessment to predict your career longevity and identify skills at risk of obsolescence.
    </p>
    <button
      className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      onClick={() => onSubmit({ name: 'User' })}
    >
      Start Assessment
    </button>
  </div>
);

export default LandingPage;
