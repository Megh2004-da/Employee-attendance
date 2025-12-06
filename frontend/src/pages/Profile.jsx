import useAuthStore from '../store/useAuthStore';
import { User, Mail, Briefcase, Building, Hash } from 'lucide-react';

const Profile = () => {
    const { user } = useAuthStore();

    return (
        <div>
            <h1 className="text-2xl font-bold text-text-main mb-6">My Profile</h1>

            <div className="glass p-8 rounded-card max-w-2xl mx-auto">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-brand-purple to-brand-indigo rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                        {user?.name?.charAt(0)}
                    </div>
                    <h2 className="text-2xl font-bold text-text-main">{user?.name}</h2>
                    <span className="text-brand-purple bg-brand-purple/10 px-3 py-1 rounded-full text-sm mt-2 capitalize">
                        {user?.role}
                    </span>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-white/50 rounded-lg">
                        <Mail className="text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="font-medium text-text-main">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-white/50 rounded-lg">
                        <Hash className="text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Employee ID</p>
                            <p className="font-medium text-text-main">{user?.employeeId}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-white/50 rounded-lg">
                        <Building className="text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="font-medium text-text-main">{user?.department}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
