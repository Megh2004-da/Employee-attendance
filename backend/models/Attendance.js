import mongoose from 'mongoose';

const attendanceSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        date: {
            type: String, // Format: YYYY-MM-DD
            required: true,
        },
        checkInTime: {
            type: Date,
        },
        checkOutTime: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late', 'Half-day'],
            default: 'Absent',
        },
        totalHours: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
