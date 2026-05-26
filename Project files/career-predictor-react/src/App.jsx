import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import UserInputPage from './pages/UserInputPage';
import SuggestedSkillsPage from './pages/SuggestedSkillsPage';
import FunctionalitiesPage from './pages/FunctionalitiesPage';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [userData, setUserData] = useState(null);
  const [professionalData, setProfessionalData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('userData');
    if (saved) {
      const user = JSON.parse(saved);
      setUserData(user);
      setCurrentPage('dashboard');
    }
    
    const savedProfessional = localStorage.getItem('professionalData');
    if (savedProfessional) {
      const prof = JSON.parse(savedProfessional);
      setProfessionalData(prof);
      setSkills(prof.skills || []);
    }
  }, []);

  const handleLandingSubmit = (data) => {
    setUserData(data);
    localStorage.setItem('userData', JSON.stringify(data));
    setCurrentPage('dashboard');
  };

  const handleStartAssessment = () => {
    setCurrentPage('user-input');
  };

  const handleUserInputSubmit = (data) => {
    setProfessionalData(data);
    setSkills(data.skills);
    localStorage.setItem('professionalData', JSON.stringify(data));
    setCurrentPage('suggested-skills');
  };

  const handleViewSkill = (skillName) => {
    setSelectedSkill(skillName);
    setCurrentPage('functionalities');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setUserData(null);
      setProfessionalData(null);
      setSkills([]);
      localStorage.clear();
      setCurrentPage('landing');
    }
  };

  const handleBackToSuggestions = () => {
    setCurrentPage('suggested-skills');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleBackToInput = () => {
    setCurrentPage('user-input');
  };

  return (
    <div className="min-h-screen bg-gradient-main">
      {currentPage === 'landing' && (
        <LandingPage onSubmit={handleLandingSubmit} />
      )}
      {currentPage === 'dashboard' && userData && (
        <DashboardPage 
          userData={userData}
          onStartAssessment={handleStartAssessment}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'user-input' && userData && (
        <UserInputPage 
          onSubmit={handleUserInputSubmit}
          onBack={handleBackToDashboard}
        />
      )}
      {currentPage === 'suggested-skills' && userData && professionalData && (
        <SuggestedSkillsPage 
          userData={userData}
          professionalData={professionalData}
          skills={skills}
          onViewSkill={handleViewSkill}
          onEditProfile={handleBackToInput}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'functionalities' && userData && selectedSkill && (
        <FunctionalitiesPage 
          skill={selectedSkill}
          userData={userData}
          professionalData={professionalData}
          onBack={handleBackToSuggestions}
        />
      )}
    </div>
  );
}

export default App;
