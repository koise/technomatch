import React from 'react';
import Headerlogged from '@/Components/Partials/HeaderLogged';
import Leaderboards from '@/Components/Dashboard/LeaderDashboard'
import ProblemBanks from '@/Components/Dashboard/ProblemBanks';
import StoreAvailables from '@/Components/Dashboard/StoreAvailables';
import { ThemeProvider } from '@/context/ThemeContext';
import '../../../scss/Pages/Dashboard.scss'

const Dashboard = () => {
  return (
    <div>
      <ThemeProvider>
        <Headerlogged />
        <Leaderboards />
        <ProblemBanks />
        <StoreAvailables />
      </ThemeProvider>
    </div>
  );
};
export default Dashboard;
