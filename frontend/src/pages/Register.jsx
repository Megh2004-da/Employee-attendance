import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { User, Mail, Lock, Briefcase, Building, Loader } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        employeeId: '',
        department: '',
        role: 'employee', // Default
    });
    const { register, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            // Error handled in store
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-soft p-4">
            <div className="glass p-8 rounded-card w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-brand-purple">Create Account</h2>
                <p className="text-center text-gray-500 mb-8">Join the attendance system</p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Briefcase className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            name="employeeId"
                            placeholder="Employee ID (e.g. EMP001)"
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                            value={formData.employeeId}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Building className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            name="department"
                            placeholder="Department"
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input type="radio" name="role" value="employee" checked={formData.role === 'employee'} onChange={handleChange} className="mr-2" />
                            Employee
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="role" value="manager" checked={formData.role === 'manager'} onChange={handleChange} className="mr-2" />
                            Manager
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary flex justify-center items-center mt-6"
                    >
                        {isLoading ? <Loader className="animate-spin" /> : 'Register'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-brand-purple font-medium hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
