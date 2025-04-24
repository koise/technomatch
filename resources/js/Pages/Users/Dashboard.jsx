import React from 'react';
import Headerlogged from '@/Components/Partials/HeaderUnverified';
import { ThemeProvider } from '@/context/ThemeContext';

const Dashboard = () => {
  return (
    <div>
      <ThemeProvider>
        <Headerlogged />
      </ThemeProvider>
    </div>
  );
};

export default Dashboard;
