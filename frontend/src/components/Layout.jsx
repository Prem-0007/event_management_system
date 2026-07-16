import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/my-registrations', label: 'My Registrations' },
  { to: '/create-event', label: 'Create Event' }
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="topnav glass">
        <NavLink to="/" className="brand">EventHive</NavLink>
        <nav className="nav-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-right">
          <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <span className="user-chip">{user?.name}</span>
          <button className="secondary logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main className="content">{children}</main>
    </div>
  );
};

export default Layout;
