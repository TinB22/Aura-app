import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-center">
        <div className="auth-warning-card">
          <h2>Učitavanje...</h2>
          <p>Molimo pričekajte trenutak.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-center">
        <div className="auth-warning-card">
          <h1>Niste prijavljeni</h1>
          <p>Za pristup admin panelu potrebno je prijaviti se.</p>

          <div className="auth-warning-actions">
            <Link to="/login" className="primary-btn">
              Prijava
            </Link>

            <Link to="/register" className="secondary-btn">
              Registracija
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="page-center">
        <div className="auth-warning-card">
          <h1>Nemate ovlasti</h1>
          <p>Ova stranica dostupna je samo administratorima.</p>

          <div className="auth-warning-actions">
            <Link to="/events" className="primary-btn">
              Povratak na događanja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default AdminRoute;