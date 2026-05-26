import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiBarChart2, FiTrendingUp } from 'react-icons/fi';

interface SkillData {
  skill: string;
  count: number;
  percentage: number;
}

interface IndustryData {
  industry: string;
  job_count: number;
  avg_salary: number;
  percentage: number;
}

export const SkillHeatmap: React.FC = () => {
  const [trendingSkills, setTrendingSkills] = useState<SkillData[]>([]);
  const [jobTrends, setJobTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch trending skills
        const skillsResponse = await api.getTrendingSkills(90, 15);
        setTrendingSkills(skillsResponse);
        
        // Fetch job trends
        const trendsResponse = await api.getJobMarketTrends();
        setJobTrends(trendsResponse);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading skill heatmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <FiBarChart2 className="text-blue-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Skill Demand Heatmap</h2>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Trending Skills Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Trending Skills (Last 90 Days)</h3>
        {trendingSkills.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendingSkills}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="skill" 
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
              />
              <Bar 
                dataKey="count" 
                fill="#3b82f6" 
                radius={[8, 8, 0, 0]}
                name="Job Postings"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No trending skills data available
          </div>
        )}
      </div>

      {/* Skill Percentage Distribution */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Skill Market Share (%)</h3>
        {trendingSkills.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trendingSkills.map((skill, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="font-semibold text-gray-800 text-sm mb-2 truncate">
                  {skill.skill}
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(skill.percentage * 10, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600">
                  {skill.percentage.toFixed(1)}% • {skill.count} jobs
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No percentage data available
          </div>
        )}
      </div>

      {/* Industry Job Distribution */}
      {jobTrends && jobTrends.by_industry && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            <FiTrendingUp className="inline mr-2" />
            Job Market by Industry
          </h3>
          {jobTrends.by_industry.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Industry</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Job Count</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg Salary</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Market %</th>
                  </tr>
                </thead>
                <tbody>
                  {jobTrends.by_industry.map((industry: IndustryData, idx: number) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{industry.industry}</td>
                      <td className="py-3 px-4 text-right text-gray-800">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {industry.job_count}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-800">
                        ${(industry.avg_salary / 1000).toFixed(0)}K
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${industry.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-700 text-sm font-medium w-10 text-right">
                            {industry.percentage.toFixed(1)}%
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
              No industry data available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillHeatmap;
