import React, { useState } from 'react';

const UserInputPage = ({ onSubmit, onBack }) => {
  const [skills, setSkills] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      skills: skills.split(',').map(s => s.trim()),
      role,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-2xl font-semibold mb-4">Enter Your Professional Details</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Current Role"
          value={role}
          onChange={e => setRole(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Skills (comma separated)"
          value={skills}
          onChange={e => setSkills(e.target.value)}
          required
        />
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Submit</button>
          <button type="button" className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500" onClick={onBack}>Back</button>
        </div>
      </form>
    </div>
  );
};

export default UserInputPage;
