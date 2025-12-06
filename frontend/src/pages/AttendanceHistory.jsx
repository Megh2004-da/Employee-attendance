import { useEffect } from 'react';
import useAttendanceStore from '../store/useAttendanceStore';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AttendanceHistory = () => {
    const { history, getMyHistory, isLoading, error } = useAttendanceStore();

    useEffect(() => {
        getMyHistory();
    }, [getMyHistory]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Present':
                return 'text-green-600 bg-green-100';
            case 'Absent':
                return 'text-red-600 bg-red-100';
            case 'Late':
                return 'text-yellow-600 bg-yellow-100';
            case 'Half-day':
                return 'text-orange-600 bg-orange-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-text-main mb-6 flex items-center gap-2">
                <Calendar className="text-brand-purple" />
                Attendance History
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <div className="glass rounded-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check In</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check Out</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Hours</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading history...</td>
                                </tr>
                            ) : history.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No attendance records found.</td>
                                </tr>
                            ) : (
                                history.map((record) => (
                                    <tr key={record._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {record.totalHours ? `${record.totalHours}h` : '-'}
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

export default AttendanceHistory;
