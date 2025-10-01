import { Bell, Search, User, Settings } from 'lucide-react';
import { Dropdown } from 'react-bootstrap';
import './Navbar.scss';

const Navbar = () => {
    return (
        <nav className="top-navbar">
            <div className="navbar-left">
                <h1 className="navbar-title">Employee Management System</h1>
            </div>

            <div className="navbar-right">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-input"
                    />
                </div>

                <button className="icon-btn" title="Notifications">
                    <Bell size={20} />
                    <span className="notification-badge">3</span>
                </button>

                <Dropdown align="end">
                    <Dropdown.Toggle variant="link" className="profile-dropdown">
                        <div className="profile-avatar">
                            <User size={20} />
                        </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="profile-menu">
                        <Dropdown.Item href="#profile">
                            <User size={16} className="me-2" />
                            Profile
                        </Dropdown.Item>
                        <Dropdown.Item href="#settings">
                            <Settings size={16} className="me-2" />
                            Settings
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item href="#logout" className="text-danger">
                            Logout
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </nav>
    );
};

export default Navbar;