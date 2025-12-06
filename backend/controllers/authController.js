import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT token safely for Vercel
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRES_IN || "30d" }
    );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, employeeId, department } = req.body;

        // Check email exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Check employee ID exists
        const employeeIdExists = await User.findOne({ employeeId });
        if (employeeIdExists) {
            return res.status(400).json({ message: 'Employee ID already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role,
            employeeId,
            department,
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid user data' });
        }

        // Success
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            employeeId: user.employeeId,
            department: user.department,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Success → return data
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            employeeId: user.employeeId,
            department: user.department,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Get logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            employeeId: user.employeeId,
        });

    } catch (error) {
        console.error("Profile Error:", error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

export { registerUser, loginUser, getMe };
