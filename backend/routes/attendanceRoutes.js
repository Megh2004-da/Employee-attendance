import express from 'express';
import {
    checkIn,
    checkOut,
    getMyHistory,
    getTodayStatus,
    getAllAttendance,
    exportAttendance,
    getDashboardStats,
    getTeamStatus,
} from '../controllers/attendanceController.js';
import { protect, manager } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/my-history', protect, getMyHistory);
router.get('/today', protect, getTodayStatus);
router.get('/all', protect, manager, getAllAttendance);
router.get('/stats', protect, manager, getDashboardStats);
router.get('/export', protect, manager, exportAttendance);
router.get('/team-status', protect, manager, getTeamStatus);

export default router;
