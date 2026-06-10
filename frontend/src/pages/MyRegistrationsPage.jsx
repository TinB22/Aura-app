import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

const MyRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/registrations/me');
      setRegistrations(res.data);
    } catch (err) {
      setError('Greška pri dohvaćanju prijava');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleUnregister = async (eventId) => {
    const confirmDelete = window.confirm(
      'Jeste li sigurni da se želite odjaviti s ovog događaja?'
    );

    if (!confirmDelete) return;

    setError('');
    setMessage('');

    try {
      await axiosInstance.delete(`/registrations/${eventId}`);
      setMessage('Uspješno ste se odjavili s događaja.');
      fetchRegistrations();
    } catch (err) {
      setError(err.response?.data?.message || 'Greška pri odjavi s događaja');
    }
  };

  if (loading) return <div className="loading">Učitavanje...</div>;

  return (
    <div className="page-container">
      <h1>Moje prijave</h1>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {registrations.length === 0 ? (
        <p>Niste prijavljeni ni na jedno događanje.</p>
      ) : (
        <div className="events-grid">
          {registrations.map((reg) => (
            <div key={reg._id} className="event-card">
              <h3>{reg.event?.title}</h3>

              <p className="event-date">
                📅 {new Date(reg.event?.date).toLocaleDateString('hr-HR')}
              </p>

              <p className="event-location">📍 {reg.event?.location}</p>

              <p className="registration-date">
                Prijavljeni:{' '}
                {new Date(reg.createdAt).toLocaleDateString('hr-HR')}
              </p>

              <button
                type="button"
                className="btn-danger"
                onClick={() => handleUnregister(reg.event?._id)}
              >
                Odjavi se
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrationsPage;