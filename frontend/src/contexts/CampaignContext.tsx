import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

type Campaign = {
  id: number;
  tv_budget: number;
  digital_budget: number;
  email_budget: number;
  reach: number;
  sales: number;
  roi: number;
  timestamp: string;
};

type CampaignInput = {
  tv_budget: number;
  digital_budget: number;
  email_budget: number;
};

type CampaignContextType = {
  campaigns: Campaign[];
  isLoading: boolean;
  error: Error | null;
  simulateCampaign: (data: CampaignInput) => Promise<Campaign>;
  simulateRandomCampaign: () => Promise<Campaign>;
  resetCampaigns: () => Promise<void>;
};

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Fetch all campaigns
  const { data: campaigns = [], isLoading, error } = useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data } = await api.get('/api/results');
      return data.data || [];
    },
  });

  // Mutation for simulating a new campaign
  const { mutateAsync: simulateCampaign } = useMutation<Campaign, Error, CampaignInput>({
    mutationFn: async (campaignData) => {
      const { data } = await api.post('/api/simulate', campaignData);
      return data.data;
    },
    onSuccess: () => {
      // Invalidate and refetch the campaigns query to update the list
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });

  // Mutation for simulating a random campaign
  const { mutateAsync: simulateRandomCampaign } = useMutation<Campaign>({
    mutationFn: async () => {
      const { data } = await api.post('/api/simulate/random');
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });

  // Mutation for resetting campaigns
  const { mutateAsync: resetCampaigns } = useMutation({
    mutationFn: async () => {
      await api.delete('/api/reset');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        isLoading,
        error: error as Error | null,
        simulateCampaign,
        simulateRandomCampaign,
        resetCampaigns,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaigns = (): CampaignContextType => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaigns must be used within a CampaignProvider');
  }
  return context;
};
