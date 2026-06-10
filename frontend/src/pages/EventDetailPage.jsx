import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';

const EventDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axiosInstance.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        setError('Greška pri dohvaćanju događanja.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axiosInstance.post(`/registrations/${id}`);
      setMessage('Uspješno ste se prijavili na događanje!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Greška pri prijavi na događanje.');
      setMessage('');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Učitavanje događanja...</div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error}</div>

        <button onClick={() => navigate('/events')} className="btn-back">
          ← Natrag na događanja
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      {event && (
        <div className="event-detail">
          <button onClick={() => navigate('/events')} className="btn-back">
            ← Natrag na događanja
          </button>

          <h1>{event.title}</h1>

          <div className="event-detail-info">
            <p>
              📅{' '}
              {new Date(event.date).toLocaleDateString('hr-HR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>

            <p>📍 {event.location}</p>

            <p>👤 Organizator: {event.createdBy?.name || 'Nepoznato'}</p>
          </div>

          <p className="event-detail-description">{event.description}</p>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <button onClick={handleRegister} className="btn-primary">
            Prijavi se na događanje
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;