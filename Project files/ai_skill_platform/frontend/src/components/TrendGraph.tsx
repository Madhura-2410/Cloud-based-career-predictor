import React, { useEffect, useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

interface SkillForecast {
  skill: string;
  trend: string;
  growth_rate: number;
  demand_score: number;
}

export const TrendGraph: React.FC = () => {
  const [skillForecasts, setSkillForecasts] = useState<SkillForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrend, setSelectedTrend] = useState<'rising' | 'stable' | 'other'>('rising');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const forecasts = await api.getSkillDemandForecast();
        setSkillForecasts(forecasts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load forecast data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trend forecasts...</p>
        </div>
      </div>
    );
  }

  // Filter by trend
  const filteredForecasts = skillForecasts.filter(s => {
    if (selectedTrend === 'rising') return s.trend === 'rising';
    if (selectedTrend === 'stable') return s.trend === 'stable';
    return true;
  });

  // Prepare data for chart
  const chartData = filteredForecasts.slice(0, 12).map((skill, idx) => ({
    name: skill.skill.substring(0, 10),
    demand: skill.demand_score,
    growth: skill.growth_rate * 100,
    fullName: skill.skill
  }));

  // Count by trend
  const trendCounts = {
    rising: skillForecasts.filter(s => s.trend === 'rising').length,
    stable: skillForecasts.filter(s => s.trend === 'stable').length,
    declining: skillForecasts.filter(s => s.trend === 'declining').length
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <FiTrendingUp className="text-green-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Skill Demand Forecast</h2>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
          <FiAlertCircle />
          {error}
        </div>
      )}

      {/* Trend Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded p-4">
          <div className="text-emerald-600 font-semibold text-sm">RISING</div>
          <div className="text-3xl font-bold text-emerald-700 mt-2">{trendCounts.rising}</div>
          <div className="text-xs text-emerald-600 mt-1">High demand skills</div>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded p-4">
          <div className="text-blue-600 font-semibold text-sm">STABLE</div>
          <div className="text-3xl font-bold text-blue-700 mt-2">{trendCounts.stable}</div>
          <div className="text-xs text-blue-600 mt-1">Consistent demand</div>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 rounded p-4">
          <div className="text-red-600 font-semibold text-sm">DECLINING</div>
          <div className="text-3xl font-bold text-red-700 mt-2">{trendCounts.declining}</div>
          <div className="text-xs text-red-600 mt-1">Decreasing demand</div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        {(['rising', 'stable', 'other'] as const).map(trend => (
          <button
            key={trend}
            onClick={() => setSelectedTrend(trend)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedTrend === trend
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {trend.charAt(0).toUpperCase() + trend.slice(1)}
          </button>
        ))}
      </div>

      {/* Demand vs Growth Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Demand & Growth Trends</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                formatter={(value: any, name: string) => {
                  if (name === 'growth') return [value.toFixed(1) + '%', 'Growth Rate'];
                  return [value, 'Demand Score'];
                }}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="demand"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorDemand)"
                name="Demand Score"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="growth"
                stroke="#10b981"
                strokeWidth={2}
                name="Growth Rate (%)"
                dot={{ fill: '#10b981', r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No forecast data available
          </div>
        )}
      </div>

      {/* Top Skills Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Top {selectedTrend} Skills</h3>
        {filteredForecasts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Skill</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Trend</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Growth Rate</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Demand Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredForecasts.slice(0, 10).map((skill, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800 font-medium">{skill.skill}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        skill.trend === 'rising' ? 'bg-emerald-100 text-emerald-700' :
                        skill.trend === 'stable' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {skill.trend.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-800">
                      <span className="font-semibold">
                        {(skill.growth_rate * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min((skill.demand_score / 100) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-700 text-sm font-medium w-8 text-right">
                          {skill.demand_score}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No skills match the selected filter
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendGraph;
