import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CampaignSimulator from './pages/CampaignSimulator';
import CampaignHistory from './pages/CampaignHistory';
import { CampaignProvider } from './contexts/CampaignContext';
import './App.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CampaignProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="py-6 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/simulate" element={<CampaignSimulator />} />
                  <Route path="/history" element={<CampaignHistory />} />
                </Routes>
              </div>
            </main>
            <Toaster position="bottom-right" />
          </div>
        </Router>
      </CampaignProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
