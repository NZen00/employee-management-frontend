// src/shared/components/layouts/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { Building2, Users, LayoutDashboard } from 'lucide-react';
import './Sidebar.scss';

const Sidebar = () => {
    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/departments', icon: Building2, label: 'Departments' },
        { path: '/employees', icon: Users, label: 'Employees' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <Building2 size={32} className="logo-icon" />
                    <span className="logo-text">EMS</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <item.icon size={20} className="nav-icon" />
                        <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <p className="footer-text">© 2025 EMS</p>
            </div>
        </aside>
    );
};

export default Sidebar;