import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { FiPieChart } from 'react-icons/fi';

interface FrequencyData {
  name: string;
  value: number;
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#6366f1', '#14b8a6', '#f97316'
];

export const FrequencyChart: React.FC = () => {
  const [frequencyData, setFrequencyData] = useState<FrequencyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const distribution = await api.getSkillFrequencyDistribution();
        
        // Convert to array format
        const data = Object.entries(distribution).map(([skill, frequency]) => ({
          name: skill,
          value: frequency as number
        })).sort((a, b) => b.value - a.value).slice(0, 15);
        
        setFrequencyData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load frequency data');
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading frequency data...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalFrequency = frequencyData.reduce((sum, item) => sum + item.value, 0);
  const averageFrequency = (totalFrequency / frequencyData.length).toFixed(0);
  const maxFrequency = frequencyData.length > 0 ? frequencyData[0].value : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <FiPieChart className="text-purple-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Skill Frequency Distribution</h2>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div className="text-sm text-purple-600 font-semibold">Total Skills</div>
          <div className="text-3xl font-bold text-purple-700 mt-2">{frequencyData.length}</div>
          <div className="text-xs text-purple-600 mt-1">Unique skills identified</div>
        </div>
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
          <div className="text-sm text-indigo-600 font-semibold">Total Occurrences</div>
          <div className="text-3xl font-bold text-indigo-700 mt-2">{totalFrequency.toLocaleString()}</div>
          <div className="text-xs text-indigo-600 mt-1">Across all job postings</div>
        </div>
        <div className="bg-violet-50 rounded-lg p-4 border border-violet-100">
          <div className="text-sm text-violet-600 font-semibold">Average Frequency</div>
          <div className="text-3xl font-bold text-violet-700 mt-2">{averageFrequency}</div>
          <div className="text-xs text-violet-600 mt-1">Per skill on average</div>
        </div>
      </div>

      {/* Chart Type Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setChartType('bar')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            chartType === 'bar'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Bar Chart
        </button>
        <button
          onClick={() => setChartType('pie')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            chartType === 'pie'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pie Chart
        </button>
      </div>

      {/* Chart Display */}
      <div className="mb-8">
        {frequencyData.length > 0 ? (
          <>
            {chartType === 'bar' ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={frequencyData.slice(0, 12)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                    formatter={(value: any) => value.toLocaleString()}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#a855f7"
                    radius={[8, 8, 0, 0]}
                    name="Frequency"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={frequencyData.slice(0, 10)}
                    cx="50%"
                    cy="50%"
                    labeLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {frequencyData.slice(0, 10).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => value.toLocaleString()}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500 py-12">
            No frequency data available
          </div>
        )}
      </div>

      {/* Detailed Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Skill Frequency Ranking</h3>
        {frequencyData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Skill</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Frequency</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">% of Total</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Distribution</th>
                </tr>
              </thead>
              <tbody>
                {frequencyData.map((skill, idx) => {
                  const percentage = ((skill.value / totalFrequency) * 100).toFixed(1);
                  return (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-bold text-gray-800">#{idx + 1}</td>
                      <td className="py-3 px-4 text-gray-800 font-medium">{skill.name}</td>
                      <td className="py-3 px-4 text-right text-gray-800">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                          {skill.value.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-800">
                        <span className="font-semibold">{percentage}%</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(skill.value / maxFrequency) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No frequency data available
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">💡 Insight:</span> The top skill appears{' '}
          <span className="font-bold text-purple-600">{maxFrequency}</span> times, representing approximately{' '}
          <span className="font-bold text-purple-600">
            {((maxFrequency / totalFrequency) * 100).toFixed(1)}%
          </span>{' '}
          of all skill mentions in job postings.
        </p>
      </div>
    </div>
  );
};

export default FrequencyChart;
