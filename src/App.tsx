import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DatabasePage from './pages/Database';
import OilManage from './pages/OilManage';
import Analytics from './pages/Analytics';
import Backup from './pages/Backup';
import PartsDatabase from './pages/PartsDatabase';
import PartManage from './pages/PartManage';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Redirect base to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Oils */}
        <Route path="database" element={<DatabasePage />} />
        <Route path="database/add" element={<OilManage />} />
        <Route path="database/edit/:id" element={<OilManage />} />
        
        {/* Parts */}
        <Route path="parts" element={<PartsDatabase />} />
        <Route path="parts/add" element={<PartManage />} />
        <Route path="parts/edit/:id" element={<PartManage />} />

        <Route path="analytics" element={<Analytics />} />
        <Route path="backup" element={<Backup />} />
      </Route>

      {/* Catch-all route -> Redirect to Dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
