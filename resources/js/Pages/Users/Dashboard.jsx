import React from 'react';
import Headerlogged from '@/Components/Partials/HeaderLogged';
import Leaderboards from '@/Components/Dashboard/LeaderDashboard';
import ProblemBanks from '@/Components/Dashboard/ProblemBanks';
import StoreAvailables from '@/Components/Dashboard/StoreAvailables';
import { ThemeProvider } from '@/context/ThemeContext';
import '../../../scss/Pages/Dashboard.scss';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <ThemeProvider>
        <Headerlogged />
        
        <div className="dashboard__container">
          <div className="dashboard__row">
            <div className="dashboard__cell dashboard__cell--full">
              <Leaderboards />
            </div>
          </div>
          
          <div className="dashboard__row">
            <div className="dashboard__cell dashboard__cell--half">
              <StoreAvailables />
            </div>
            <div className="dashboard__cell dashboard__cell--half">
              <ProblemBanks />
            </div>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default Dashboard;