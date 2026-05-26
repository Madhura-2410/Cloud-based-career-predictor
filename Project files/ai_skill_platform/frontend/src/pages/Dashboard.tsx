import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  FiLayout, FiTrendingUp, FiTarget, FiZap, FiBook,
  FiMessageSquare, FiBarChart2, FiUser, FiLogOut
} from 'react-icons/fi';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { userProfile } = useUser();

    const quickLinks = [
        { label: 'Suggested Skills', icon: <FiBook size={22} />, path: '/skills', color: 'from-blue-500 to-indigo-600' },
        { label: 'Predictions', icon: <FiBarChart2 size={22} />, path: '/predictions', color: 'from-purple-500 to-pink-600' },
        { label: 'AI Mentor', icon: <FiMessageSquare size={22} />, path: '/mentor', color: 'from-emerald-500 to-teal-600' },
        { label: 'My Profile', icon: <FiUser size={22} />, path: '/profile', color: 'from-orange-500 to-red-500' },
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 pb-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px]"></div>

            {/* Header section */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
                                <FiLayout className="text-white" size={22} />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                                    Skill Intelligence Dashboard
                                </h1>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Analytics Hub</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:block text-right">
                                <div className="text-sm font-bold text-slate-900">{userProfile.name}</div>
                                <div className="text-xs text-slate-500 font-medium">{userProfile.role}</div>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border border-white">
                                {userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <button
                                onClick={() => navigate('/login')}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Logout"
                            >
                                <FiLogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Welcome Banner */}
                <div className="relative bg-white border border-slate-200 rounded-3xl p-8 md:p-12 mb-8 overflow-hidden shadow-xl shadow-slate-200/50">
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl" style={{ animationDelay: '1s' }}></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{userProfile.name.split(' ')[0]}</span>! 👋
                        </h2>
                        <p className="text-slate-600 text-lg max-w-xl font-medium">
                            Your career intelligence is ready. Explore skills, track trends, and plan your next move.
                        </p>
                    </div>
                </div>

                {/* Quick Navigation Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {quickLinks.map((link) => (
                        <button
                            key={link.path}
                            onClick={() => navigate(link.path)}
                            className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-left shadow-sm"
                        >
                            <div className={`w-12 h-12 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-110 transition-transform`}>
                                {link.icon}
                            </div>
                            <div className="font-bold text-slate-900 text-sm">{link.label}</div>
                        </button>
                    ))}
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Job Postings"
                        value="12,482"
                        change="+14%"
                        icon={<FiTrendingUp className="text-green-600" />}
                    />
                    <StatCard
                        title="Rising Skills"
                        value="42"
                        change="+5"
                        icon={<FiZap className="text-yellow-600" />}
                    />
                    <StatCard
                        title="Market Efficiency"
                        value="86%"
                        change="-2%"
                        icon={<FiTarget className="text-blue-600" />}
                        isRed={true}
                    />
                    <StatCard
                        title="Active Users"
                        value="1,204"
                        change="+82"
                        icon={<FiLayout className="text-purple-600" />}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Removed detailed charts and AI insights. The Dashboard now shows only quick stats. */}
                    {/* You can add more content later if needed. */}
                </div>
            </main>
        </div>
    );
};

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    icon: React.ReactNode;
    isRed?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, isRed }) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 transition-all hover:border-slate-300 hover:shadow-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">{icon}</div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isRed ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'
            }`}>
                {change}
            </span>
        </div>
        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</div>
        <div className="text-2xl font-black text-slate-900">{value}</div>
    </div>
);

export default Dashboard;
