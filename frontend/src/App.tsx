import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ToolDetail from './pages/ToolDetail';
import Faqs from './pages/Faqs';
import TrainingRequest from './pages/TrainingRequest';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminTools from './pages/admin/AdminTools';
import AdminToolForm from './pages/admin/AdminToolForm';
import AdminTraining from './pages/admin/AdminTraining';
import { useAuth } from './auth';
import type { ReactNode } from 'react';

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-gray-500">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools/:slug" element={<ToolDetail />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/training/request" element={<TrainingRequest />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/tools"
          element={
            <RequireAuth>
              <AdminTools />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/tools/new"
          element={
            <RequireAuth>
              <AdminToolForm />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/tools/:id/edit"
          element={
            <RequireAuth>
              <AdminToolForm />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/training"
          element={
            <RequireAuth>
              <AdminTraining />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
