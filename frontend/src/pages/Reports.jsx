import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { FileText, Download, Loader } from 'lucide-react';

const Reports = () => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
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
            console.error('Download failed:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-text-main mb-6 flex items-center gap-2">
                <FileText className="text-brand-purple" />
                Reports
            </h1>

            <div className="glass p-8 rounded-card max-w-xl">
                <h2 className="text-lg font-bold mb-4">Export Attendance Data</h2>
                <p className="text-gray-500 mb-6">
                    Download a complete report of all employee attendance records in CSV format.
                    This report includes check-in/out times, status, and total hours worked.
                </p>

                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="btn-primary flex items-center gap-2 px-6 py-3"
                >
                    {isDownloading ? <Loader className="animate-spin" /> : <Download size={20} />}
                    Download CSV Report
                </button>
            </div>
        </div>
    );
};

export default Reports;
