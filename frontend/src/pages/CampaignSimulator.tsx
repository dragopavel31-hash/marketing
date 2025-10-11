import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCampaigns } from '../contexts/CampaignContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Define the form data types
type FormData = {
  tv_budget: number;
  digital_budget: number;
  email_budget: number;
};

const CampaignSimulator: React.FC = () => {
  const { simulateCampaign } = useCampaigns();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      tv_budget: 1000,
      digital_budget: 1000,
      email_budget: 1000,
    },
  });

  const tvBudget = watch('tv_budget') || 0;
  const digitalBudget = watch('digital_budget') || 0;
  const emailBudget = watch('email_budget') || 0;
  const totalBudget = tvBudget + digitalBudget + emailBudget;

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await simulateCampaign({
        tv_budget: Number(data.tv_budget),
        digital_budget: Number(data.digital_budget),
        email_budget: Number(data.email_budget),
      });
      
      toast.success('Campaign simulated successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error simulating campaign:', error);
      toast.error('Failed to simulate campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRandomize = () => {
    reset({
      tv_budget: Math.floor(Math.random() * 10000) + 500,
      digital_budget: Math.floor(Math.random() * 10000) + 500,
      email_budget: Math.floor(Math.random() * 5000) + 100,
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">Campaign Simulator</h1>
        <p className="mt-2 text-sm text-gray-600">
          Allocate your marketing budget across different channels and simulate the results.
        </p>
      </div>

      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* TV Budget */}
            <div>
              <div className="flex justify-between">
                <label htmlFor="tv_budget" className="block text-sm font-medium text-gray-700">
                  TV Budget
                </label>
                <span className="text-sm text-gray-500">${tvBudget.toLocaleString()}</span>
              </div>
              <div className="mt-1">
                <input
                  type="range"
                  id="tv_budget"
                  min="0"
                  max="20000"
                  step="100"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  {...register('tv_budget', { valueAsNumber: true })}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>$0</span>
                <span>$10,000</span>
                <span>$20,000</span>
              </div>
            </div>

            {/* Digital Budget */}
            <div>
              <div className="flex justify-between">
                <label htmlFor="digital_budget" className="block text-sm font-medium text-gray-700">
                  Digital Budget
                </label>
                <span className="text-sm text-gray-500">${digitalBudget.toLocaleString()}</span>
              </div>
              <div className="mt-1">
                <input
                  type="range"
                  id="digital_budget"
                  min="0"
                  max="20000"
                  step="100"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  {...register('digital_budget', { valueAsNumber: true })}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>$0</span>
                <span>$10,000</span>
                <span>$20,000</span>
              </div>
            </div>

            {/* Email Budget */}
            <div>
              <div className="flex justify-between">
                <label htmlFor="email_budget" className="block text-sm font-medium text-gray-700">
                  Email Budget
                </label>
                <span className="text-sm text-gray-500">${emailBudget.toLocaleString()}</span>
              </div>
              <div className="mt-1">
                <input
                  type="range"
                  id="email_budget"
                  min="0"
                  max="10000"
                  step="100"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  {...register('email_budget', { valueAsNumber: true })}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>$0</span>
                <span>$5,000</span>
                <span>$10,000</span>
              </div>
            </div>

            {/* Budget Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Total Budget</h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${totalBudget.toLocaleString()}
                  </p>
                </div>
                <div className="space-x-3">
                  <button
                    type="button"
                    onClick={handleRandomize}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Randomize
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || totalBudget === 0}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      isSubmitting || totalBudget === 0 ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Simulating...' : 'Run Simulation'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Budget Allocation Chart */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Allocation</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">TV</span>
                <span>{((tvBudget / (totalBudget || 1)) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(tvBudget / (totalBudget || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Digital</span>
                <span>{((digitalBudget / (totalBudget || 1)) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: `${(digitalBudget / (totalBudget || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Email</span>
                <span>{((emailBudget / (totalBudget || 1)) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{ width: `${(emailBudget / (totalBudget || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignSimulator;
