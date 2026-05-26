import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import AuthenticatedLayout from './components/Layout/AuthenticatedLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import UserInputPage from './pages/UserInputPage';
import Profile from './pages/Profile';
import SkillsPage from './pages/SkillsPage';
import Predictions from './pages/Predictions';
import AIMentor from './pages/AIMentor';
import SkillDetails from './pages/SkillDetails';
import LearningPath from './pages/LearningPath';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('isAuthenticated') === 'true';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('isAuthenticated', String(isAuthenticated));
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route element={<AuthenticatedLayout setIsAuthenticated={setIsAuthenticated} />}>
            <Route path="/" element={isAuthenticated ? <UserInputPage /> : <Navigate to="/login" replace />} />
            <Route path="/input" element={isAuthenticated ? <UserInputPage /> : <Navigate to="/login" replace />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
            <Route path="/skills" element={isAuthenticated ? <SkillsPage /> : <Navigate to="/login" replace />} />
            <Route path="/skill/:id" element={isAuthenticated ? <SkillDetails /> : <Navigate to="/login" replace />} />
            <Route path="/predictions" element={isAuthenticated ? <Predictions /> : <Navigate to="/login" replace />} />
            <Route path="/mentor" element={isAuthenticated ? <AIMentor /> : <Navigate to="/login" replace />} />
            <Route path="/learning-path" element={isAuthenticated ? <LearningPath /> : <Navigate to="/login" replace />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
