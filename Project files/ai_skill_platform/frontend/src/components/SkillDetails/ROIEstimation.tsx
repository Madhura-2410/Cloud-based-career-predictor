import React, { useMemo, useState } from 'react';
import { FiTrendingUp, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import { generateDynamicData } from '../../utils/dynamicData';
import { useUser } from '../../context/UserContext';

interface Props { skillId?: string; }

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
};

const conversionRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  INR: 82,
};

const ROIEstimation: React.FC<Props> = ({ skillId }) => {
  const { userProfile, setPreferredCurrency } = useUser();
  const [selectedCurrency, setSelectedCurrency] = useState(userProfile.preferredCurrency);
  const data = generateDynamicData(skillId);

  const currencySymbol = currencySymbols[selectedCurrency];
  const conversionRate = conversionRates[selectedCurrency];
  const salaryImpact = useMemo(() => {
    const base = 90000 + (data.roi.salaryIncrease * 1200);
    return Math.round(base * conversionRate);
  }, [data.roi.salaryIncrease, conversionRate]);
  const monthlyPayback = useMemo(() => {
    const months = Math.max(2, data.roi.paybackPeriod - 1);
    return `${months} months`;
  }, [data.roi.paybackPeriod]);

  const handleCurrencyChange = (currency: keyof typeof currencySymbols) => {
    setSelectedCurrency(currency);
    setPreferredCurrency(currency);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-300">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <FiTrendingUp className="text-green-500" /> Learning ROI for {data.skill}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Select a currency to view ROI estimates in your preferred financial context.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 shadow-sm">
            <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Currency</label>
            <select
              value={selectedCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value as keyof typeof currencySymbols)}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {Object.keys(currencySymbols).map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-green-50 dark:bg-slate-950/80 rounded-2xl border border-green-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
            <FiDollarSign className="text-green-500 mb-2" size={32} />
            <div className="text-4xl font-black text-green-600 dark:text-green-300 mb-1">{currencySymbol}{salaryImpact.toLocaleString()}</div>
            <div className="text-gray-600 dark:text-slate-300 font-medium">Estimated Annual ROI</div>
          </div>

          <div className="p-6 bg-blue-50 dark:bg-slate-950/80 rounded-2xl border border-blue-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
            <div className="text-4xl font-black text-blue-600 dark:text-blue-300 mb-1">{monthlyPayback}</div>
            <div className="text-gray-600 dark:text-slate-300 font-medium">Time to Payback</div>
          </div>
        </div>

        <div className="p-5 bg-gray-50 dark:bg-slate-950/80 rounded-xl border border-gray-200 dark:border-slate-800">
          <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-2">Market Impact</h4>
          <p className="text-gray-600 dark:text-slate-300 text-sm">
            Acquiring this skill opens up approximately <strong className="text-blue-600 dark:text-blue-300">{data.roi.newOpportunities}+ new job roles</strong> that match your updated profile, primarily in remote and hybrid environments.
          </p>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 text-blue-600 dark:text-blue-300 font-semibold">
          <FiArrowRight /> All numbers are shown in {selectedCurrency} with market-aware conversion.
        </div>
      </div>
    </div>
  );
};
  export default ROIEstimation;
