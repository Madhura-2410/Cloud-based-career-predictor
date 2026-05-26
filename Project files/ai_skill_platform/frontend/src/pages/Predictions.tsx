import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FiTrendingUp, FiArrowRight, FiShield, FiCalendar } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Predictions: React.FC = () => {
    const [prediction, setPrediction] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrediction = async () => {
            try {
                // Mock user ID
                const userId = "user_123";
                const data = await api.predictNextRole(userId);
                setPrediction(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPrediction();
    }, []);

    if (loading) return <div className="p-12 text-center">Predicting your future...</div>;

    const timelineData = [
        { name: 'Now', level: 0 },
        { name: '3 Months', level: 40 },
        { name: '6 Months', level: 80 },
        { name: '9 Months', level: 95 },
        { name: '1 Year', level: 100 },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-8 text-white">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FiTrendingUp /> Future Role Prediction
                    </h1>
                    <p className="mt-2 text-purple-100 italic">"Engineering your career path with precision."</p>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Prediction Results */}
                    <div>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Predicted Target</h2>
                            <div className="flex items-center gap-4">
                                <div className="text-5xl font-black text-indigo-900">{prediction?.predicted_role}</div>
                                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                    {(prediction?.confidence_score * 100).toFixed(0)}% MATCH
                                </div>
                            </div>
                            <p className="mt-4 text-gray-600 leading-relaxed">
                                Based on your current proficiency in Python and Cloud Architecture, your fastest path to a $140k+ salary is transitioning into {prediction?.predicted_role}.
                            </p>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FiShield className="text-green-500" /> Required Skills & Milestones
                            </h3>
                            <div className="space-y-4">
                                {prediction?.required_skills.map((skill: string, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-all group">
                                        <span className="font-semibold text-gray-700">{skill}</span>
                                        <FiArrowRight className="text-gray-300 group-hover:text-indigo-500 transform group-hover:translate-x-1" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Visualization */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FiCalendar className="text-blue-500" /> Career Readiness Timeline
                            </h3>
                            <div className="h-64 mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={timelineData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                            labelStyle={{ fontWeight: 'bold' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="level"
                                            stroke="#8b5cf6"
                                            strokeWidth={4}
                                            dot={{ r: 6, fill: '#8b5cf6' }}
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-center text-sm text-gray-500 mt-4">Estimated time to role: <span className="font-bold text-indigo-600">{prediction?.estimated_time_months} Months</span></p>
                        </div>

                        <div className="mt-8 p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                            <h4 className="font-bold text-indigo-900 mb-2">Mentor Quick Tip</h4>
                            <p className="text-indigo-700 text-sm italic">
                                "Start with the Cloud cert. It's the highest weighted skill for this transition."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Predictions;
