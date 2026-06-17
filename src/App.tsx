import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import Dashboard from '@/pages/Dashboard';
import Projects from '@/pages/Projects';
import Scheduling from '@/pages/Scheduling';
import Equipment from '@/pages/Equipment';
import Training from '@/pages/Training';
import Personnel from '@/pages/Personnel';
import Records from '@/pages/Records';
import Billing from '@/pages/Billing';
import Customers from '@/pages/Customers';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/scheduling" element={<Scheduling />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/training" element={<Training />} />
          <Route path="/personnel" element={<Personnel />} />
          <Route path="/records" element={<Records />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/customers" element={<Customers />} />
        </Route>
      </Routes>
    </Router>
  );
}
