import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">AAC Aplikacija</Link>
      </div>

      <div className="navbar-links">
        <Link to="/events">Događanja</Link>
        <Link to="/materials">Materijali</Link>

        {user && <Link to="/my-registrations">Moje prijave</Link>}

        {user?.role === 'admin' && (
          <Link to="/admin" className="admin-nav-link">
            Admin panel
          </Link>
        )}

        {user ? (
          <div className="navbar-user">
            <span>Zdravo, {user.name}</span>
            <button onClick={handleLogout} className="btn-logout">
              Odjava
            </button>
          </div>
        ) : (
          <div className="navbar-auth">
            <Link to="/login">Prijava</Link>
            <Link to="/register">Registracija</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;