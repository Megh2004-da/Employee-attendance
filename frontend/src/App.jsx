

import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AttendanceHistory from './pages/AttendanceHistory';
import TeamAttendance from './pages/TeamAttendance';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './store/useAuthStore';

function App() {
    const { isAuthenticated, user, checkAuth } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            checkAuth();
        }
    }, [checkAuth, isAuthenticated]);

    return (
        <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/" element={user?.role === 'manager' || user?.role === 'admin' ? <ManagerDashboard /> : <Dashboard />} />
                    <Route path="/history" element={<AttendanceHistory />} />
                    <Route path="/team" element={<TeamAttendance />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;
