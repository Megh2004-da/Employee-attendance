import { NavLink } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { LayoutDashboard, Calendar, FileText, Users, UserCircle } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const { user } = useAuthStore();

    const links = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['employee', 'manager', 'admin'] },
        { to: '/history', icon: Calendar, label: 'My History', roles: ['employee'] },
        { to: '/team', icon: Users, label: 'Team Attendance', roles: ['manager', 'admin'] },
        { to: '/reports', icon: FileText, label: 'Reports', roles: ['manager', 'admin'] },
        { to: '/profile', icon: UserCircle, label: 'Profile', roles: ['employee', 'manager', 'admin'] },
    ];

    const filteredLinks = links.filter((link) => link.roles.includes(user?.role));

    return (
        <aside className="fixed left-0 top-16 bottom-0 w-64 glass border-t-0 z-40 hidden md:block">
            <div className="p-4 space-y-2">
                {filteredLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            clsx(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                                isActive
                                    ? 'bg-brand-purple/10 text-brand-purple font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                            )
                        }
                    >
                        <link.icon size={20} />
                        {link.label}
                    </NavLink>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
