import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Attendance from './models/Attendance.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        // Drop collections to clear old indexes
        try {
            await User.collection.drop();
        } catch (e) {
            console.log('User collection not found, skipping drop...');
        }
        try {
            await Attendance.collection.drop();
        } catch (e) {
            console.log('Attendance collection not found, skipping drop...');
        }

        const users = [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
                employeeId: 'ADMIN001',
                department: 'Management',
            },
            {
                name: 'Manager User',
                email: 'manager@example.com',
                password: 'password123',
                role: 'manager',
                employeeId: 'MGR001',
                department: 'Sales',
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'employee',
                employeeId: 'EMP001',
                department: 'Sales',
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: 'password123',
                role: 'employee',
                employeeId: 'EMP002',
                department: 'Marketing',
            },
        ];

        await User.insertMany(users);

        // Fetch users to ensure we have IDs
        const adminUser = await User.findOne({ email: 'admin@example.com' });
        const managerUser = await User.findOne({ email: 'manager@example.com' });
        const john = await User.findOne({ email: 'john@example.com' });
        const jane = await User.findOne({ email: 'jane@example.com' });

        console.log('Users Imported!');

        // Create some attendance records
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        const attendance = [
            {
                user: john._id,
                date: yesterday,
                checkInTime: new Date(Date.now() - 86400000 - 28800000), // Yesterday 9 AM
                checkOutTime: new Date(Date.now() - 86400000 - 3600000), // Yesterday 5 PM
                status: 'Present',
                totalHours: 8,
            },
            {
                user: john._id,
                date: today,
                checkInTime: new Date(),
                status: 'Present',
            },
            {
                user: jane._id,
                date: yesterday,
                status: 'Absent',
            },
        ];

        await Attendance.insertMany(attendance);

        console.log('Attendance Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
