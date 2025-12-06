import useAuthStore from '../store/useAuthStore';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuthStore();

    return (
        <nav className="glass h-16 fixed top-0 left-0 right-0 z-50 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-purple to-brand-indigo rounded-lg flex items-center justify-center text-white font-bold">
                    A
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-indigo">
                    AttendanceSys
                </span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                    <User size={20} />
                    <span className="font-medium">{user?.name}</span>
                    <span className="text-xs bg-brand-purple/10 text-brand-purple px-2 py-1 rounded-full capitalize">
                        {user?.role}
                    </span>
                </div>
                <button
                    onClick={logout}
                    className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg transition-colors"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
