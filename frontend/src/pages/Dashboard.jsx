
import { useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import useAttendanceStore from '../store/useAttendanceStore';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuthStore();
    const { todayStatus, getTodayStatus, checkIn, checkOut, isLoading, error, history, getMyHistory } = useAttendanceStore();

    useEffect(() => {
        getTodayStatus();
        getMyHistory();
    }, [getTodayStatus, getMyHistory]);

    const handleCheckIn = async () => {
        try {
            await checkIn();
        } catch (err) {
            // Error handled in store
        }
    };

    const handleCheckOut = async () => {
        try {
            await checkOut();
        } catch (err) {
            // Error handled in store
        }
    };

    const isCheckedIn = todayStatus?.checkInTime && !todayStatus?.checkOutTime;
    const isCheckedOut = !!todayStatus?.checkOutTime;
    const isPresent = todayStatus?.status === 'Present';

    // Calculate Attendance Rate
    const totalDays = history.length;
    const presentDays = history.filter(r => r.status === 'Present' || r.status === 'Late' || r.status === 'Half-day').length;
    const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    return (
        <div>
            <h1 className="text-2xl font-bold text-text-main mb-6">
                Welcome back, {user?.name}!
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass p-6 rounded-card card-gradient relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-gray-500 text-sm font-medium">Today's Status</h3>
                        <p className="text-2xl font-bold text-brand-purple mt-2">
                            {isPresent ? 'Present' : 'Not Checked In'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {todayStatus?.checkInTime ? `In: ${new Date(todayStatus.checkInTime).toLocaleTimeString()} ` : 'Mark your attendance'}
                        </p>
                        {todayStatus?.checkOutTime && (
                            <p className="text-xs text-gray-400">
                                Out: {new Date(todayStatus.checkOutTime).toLocaleTimeString()}
                            </p>
                        )}
                    </div>
                    <Clock className="absolute right-4 bottom-4 text-brand-purple/10" size={64} />
                </div>

                <div className="glass p-6 rounded-card flex flex-col justify-center items-center">
                    {!isPresent && !isCheckedOut && (
                        <button
                            onClick={handleCheckIn}
                            disabled={isLoading}
                            className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={24} />
                            Check In
                        </button>
                    )}

                    {isPresent && !isCheckedOut && (
                        <button
                            onClick={handleCheckOut}
                            disabled={isLoading}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
                        >
                            <XCircle size={24} />
                            Check Out
                        </button>
                    )}

                    {isCheckedOut && (
                        <div className="text-center text-green-600 font-medium flex flex-col items-center">
                            <CheckCircle size={32} className="mb-2" />
                            Completed for today
                        </div>
                    )}
                </div>

                <div className="glass p-6 rounded-card">
                    <h3 className="text-gray-500 text-sm font-medium">Attendance Rate</h3>
                    <p className="text-2xl font-bold text-text-main mt-2">{attendanceRate}%</p>
                    <p className="text-xs text-gray-400 mt-1">Based on history</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

