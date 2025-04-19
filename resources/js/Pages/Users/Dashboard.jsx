import React from 'react';
import Headerlogged from '@/Components/Partials/HeaderLogged';
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
