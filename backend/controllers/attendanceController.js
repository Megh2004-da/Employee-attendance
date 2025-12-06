import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

// @desc    Check in
// @route   POST /api/attendance/checkin
// @access  Private
const checkIn = async (req, res) => {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];

    const existingAttendance = await Attendance.findOne({ user: userId, date: today });

    if (existingAttendance) {
        res.status(400).json({ message: 'Already checked in today' });
        return;
    }

    const attendance = await Attendance.create({
        user: userId,
        date: today,
        checkInTime: new Date(),
        status: 'Present',
    });

    res.status(201).json(attendance);
};

// @desc    Check out
// @route   POST /api/attendance/checkout
// @access  Private
const checkOut = async (req, res) => {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findOne({ user: userId, date: today });

    if (!attendance) {
        res.status(400).json({ message: 'You have not checked in today' });
        return;
    }

    if (attendance.checkOutTime) {
        res.status(400).json({ message: 'Already checked out today' });
        return;
    }

    attendance.checkOutTime = new Date();

    // Calculate total hours
    const duration = attendance.checkOutTime - attendance.checkInTime;
    const hours = duration / (1000 * 60 * 60);
    attendance.totalHours = hours.toFixed(2);

    await attendance.save();

    res.json(attendance);
};

// @desc    Get my attendance history
// @route   GET /api/attendance/my-history
// @access  Private
const getMyHistory = async (req, res) => {
    const attendance = await Attendance.find({ user: req.user._id }).sort({ date: -1 });
    res.json(attendance);
};

// @desc    Get today's status
// @route   GET /api/attendance/today
// @access  Private
const getTodayStatus = async (req, res) => {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findOne({ user: userId, date: today });

    if (attendance) {
        res.json(attendance);
    } else {
        res.json({ status: 'Not Checked In' });
    }
};

// @desc    Get all employees attendance (Manager)
// @route   GET /api/attendance/all
// @access  Private/Manager
const getAllAttendance = async (req, res) => {
    const attendance = await Attendance.find({}).populate('user', 'name email department employeeId').sort({ date: -1 });
    res.json(attendance);
};

// @desc    Export attendance to CSV
// @route   GET /api/attendance/export
// @access  Private/Manager
const exportAttendance = async (req, res) => {
    const attendance = await Attendance.find({}).populate('user', 'name email employeeId department').sort({ date: -1 });

    let csv = 'Date,Employee ID,Name,Department,Status,Check In,Check Out,Total Hours\n';

    attendance.forEach((record) => {
        const checkIn = record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-';
        const checkOut = record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-';

        csv += `${record.date},${record.user?.employeeId || 'N/A'},${record.user?.name || 'N/A'},${record.user?.department || 'N/A'},${record.status},${checkIn},${checkOut},${record.totalHours}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('attendance_report.csv');
    res.send(csv);
};

// @desc    Get dashboard stats (Manager)
// @route   GET /api/attendance/stats
// @access  Private/Manager
const getDashboardStats = async (req, res) => {
    const totalEmployees = await User.countDocuments({ role: 'employee' });

    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = await Attendance.find({ date: today }).populate('user');

    const presentToday = todayAttendance.filter(r => r.user && r.user.role === 'employee' && (r.status === 'Present' || r.status === 'Late' || r.status === 'Half-day')).length;
    const lateToday = todayAttendance.filter(r => r.user && r.user.role === 'employee' && r.status === 'Late').length;
    const absentToday = totalEmployees - presentToday;

    res.json({
        totalEmployees,
        presentToday,
        absentToday: absentToday < 0 ? 0 : absentToday,
        lateToday
    });
};

// @desc    Get team status (Manager)
// @route   GET /api/attendance/team-status
// @access  Private/Manager
const getTeamStatus = async (req, res) => {
    const today = new Date().toISOString().split('T')[0];

    // Get all employees
    const employees = await User.find({ role: 'employee' }).select('-password');

    // Get today's attendance
    const attendanceRecords = await Attendance.find({ date: today });

    const teamStatus = employees.map(employee => {
        const record = attendanceRecords.find(r => r.user.toString() === employee._id.toString());

        return {
            _id: employee._id,
            name: employee.name,
            email: employee.email,
            employeeId: employee.employeeId,
            department: employee.department,
            status: record ? record.status : 'Absent',
            checkInTime: record ? record.checkInTime : null,
            checkOutTime: record ? record.checkOutTime : null,
            totalHours: record ? record.totalHours : null
        };
    });

    res.json(teamStatus);
};

export { checkIn, checkOut, getMyHistory, getTodayStatus, getAllAttendance, exportAttendance, getDashboardStats, getTeamStatus };
