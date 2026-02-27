import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Events } from '@/pages/Events';
import { Investors } from '@/pages/Investors';
import { Login } from '@/pages/Login';
import { Startups } from '@/pages/Startups';
import { PrivateRoute } from '@/routes/PrivateRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* <Route element={<PrivateRoute />}> */}
      <Route element={<DashboardLayout />}>
        <Route path="/events" element={<Events />} />
        <Route path="/investors" element={<Investors />} />
        <Route path="/startups" element={<Startups />} />
        {/* </Route> */}
      </Route>
      <Route path="*" element={<Navigate to="/events" replace />} />
    </Routes>
  );
}
