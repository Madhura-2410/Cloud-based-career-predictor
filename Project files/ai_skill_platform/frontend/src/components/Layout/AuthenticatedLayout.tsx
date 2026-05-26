import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useUser } from '../../context/UserContext';

interface AuthenticatedLayoutProps {
  setIsAuthenticated: (value: boolean) => void;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ setIsAuthenticated }) => {
  const { userProfile } = useUser();

  return (
    <div className={`min-h-screen ${userProfile.theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Header setIsAuthenticated={setIsAuthenticated} />
      <main className="pt-24 transition-colors duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
