import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiBookOpen, FiLogOut, FiRefreshCw, FiSettings, FiLock, FiMoon, FiSun } from 'react-icons/fi';
import { useUser } from '../../context/UserContext';

interface HeaderProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, toggleTheme } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const hideBackButton = ['/','/input'].includes(location.pathname);
  const initial = userProfile.name?.trim()?.charAt(0).toUpperCase() || 'G';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/10">
            <FiBookOpen size={20} />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-300">AI Career Hub</div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">Skill Intelligence</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!hideBackButton && (
            <button
              onClick={() => navigate('/input')}
              className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-100 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Back To Home
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-slate-700 dark:text-slate-100 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            aria-label="Toggle theme"
          >
            {userProfile.theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <button
            onClick={() => navigate('/learning-path')}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            My Learning Path
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold shadow-md hover:bg-slate-800 transition"
            >
              {initial}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-300/20 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 transition-all duration-200">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{userProfile.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{userProfile.role}</div>
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/profile', { state: { activeTab: 'profile' } });
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                >
                  <span className="inline-flex items-center gap-2"><FiSettings /> Profile Settings</span>
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/profile', { state: { activeTab: 'password' } });
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                >
                  <span className="inline-flex items-center gap-2"><FiLock /> Change Password</span>
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setIsAuthenticated(false);
                    localStorage.removeItem('isAuthenticated');
                    navigate('/login');
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                >
                  <span className="inline-flex items-center gap-2"><FiRefreshCw /> Switch Account</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-sm font-bold text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition rounded-b-3xl"
                >
                  <span className="inline-flex items-center gap-2"><FiLogOut /> Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
