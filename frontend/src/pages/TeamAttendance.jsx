import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Users, Search } from 'lucide-react';

const TeamAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const { data } = await axiosInstance.get('/attendance/all');
                setAttendance(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        fetchAttendance();
    }, []);

    const filteredAttendance = attendance.filter(record =>
        record.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.user?.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Present': return 'text-green-600 bg-green-100';
            case 'Absent': return 'text-red-600 bg-red-100';
            case 'Late': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
                    <Users className="text-brand-purple" />
                    Team Attendance
                </h1>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search employee..."
                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="glass rounded-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Employee</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Check In</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Check Out</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center">Loading...</td></tr>
                            ) : filteredAttendance.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center">No records found.</td></tr>
                            ) : (
                                filteredAttendance.map((record) => (
                                    <tr key={record._id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple font-bold mr-3">
                                                    {record.user?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{record.user?.name || 'Unknown'}</div>
                                                    <div className="text-xs text-gray-500">{record.user?.employeeId || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{record.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeamAttendance;
