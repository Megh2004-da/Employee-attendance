import { useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import axiosInstance from '../api/axiosInstance';
import { Users, Clock, AlertCircle } from 'lucide-react';

const ManagerDashboard = () => {
    const { user } = useAuthStore();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        presentToday: 0,
        absentToday: 0,
        lateToday: 0
    });
    const [teamData, setTeamData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await axiosInstance.get('/attendance/stats');
                const teamRes = await axiosInstance.get('/attendance/team-status');

                setStats(statsRes.data);
                setTeamData(teamRes.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const downloadReport = async () => {
        try {
            const response = await axiosInstance.get('/attendance/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading report:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Present': return 'text-green-600 bg-green-100';
            case 'Absent': return 'text-red-600 bg-red-100';
            case 'Late': return 'text-yellow-600 bg-yellow-100';
            case 'Half-day': return 'text-orange-600 bg-orange-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-text-main">
                    Manager Dashboard
                </h1>
                <button
                    onClick={downloadReport}
                    className="btn-primary flex items-center gap-2"
                >
                    <Users size={18} />
                    Download Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="glass p-6 rounded-card card-gradient">
                    <h3 className="text-gray-500 text-sm font-medium">Total Employees</h3>
                    <p className="text-2xl font-bold text-brand-purple mt-2">{stats.totalEmployees}</p>
                </div>

                <div className="glass p-6 rounded-card">
                    <h3 className="text-gray-500 text-sm font-medium">Present Today</h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">{stats.presentToday}</p>
                </div>

                <div className="glass p-6 rounded-card">
                    <h3 className="text-gray-500 text-sm font-medium">Absent Today</h3>
                    <p className="text-2xl font-bold text-red-600 mt-2">{stats.absentToday}</p>
                </div>

                <div className="glass p-6 rounded-card">
                    <h3 className="text-gray-500 text-sm font-medium">Late Arrivals</h3>
                    <p className="text-2xl font-bold text-yellow-600 mt-2">{stats.lateToday}</p>
                </div>
            </div>

            <div className="glass p-6 rounded-card overflow-hidden">
                <h2 className="text-lg font-bold mb-4">Team Overview</h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Employee</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ID</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Department</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Check In</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Check Out</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamData.map((employee) => (
                                <tr key={employee._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="font-medium text-text-main">{employee.name}</div>
                                        <div className="text-xs text-gray-400">{employee.email}</div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{employee.employeeId}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{employee.department}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                                            {employee.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                        {employee.checkInTime ? new Date(employee.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                        {employee.checkOutTime ? new Date(employee.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                    </td>
                                </tr>
                            ))}
                            {teamData.length === 0 && (
                                <tr>
                                    <td colspan="6" className="py-8 text-center text-gray-400">
                                        No employees found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
