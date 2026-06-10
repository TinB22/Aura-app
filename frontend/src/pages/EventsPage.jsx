import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axiosInstance.get('/events');
        setEvents(res.data);
      } catch (err) {
        setError('Greška pri dohvaćanju događanja');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <div className="loading">Učitavanje...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="page-container">
      <h1>Događanja</h1>
      {events.length === 0 ? (
        <p>Nema dostupnih događanja.</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <h3>{event.title}</h3>
              <p className="event-date">
                📅 {new Date(event.date).toLocaleDateString('hr-HR')}
              </p>
              <p className="event-location">📍 {event.location}</p>
              <p className="event-description">{event.description}</p>
              <Link to={`/events/${event._id}`} className="btn-secondary">
                Više detalja
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
