import { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';

const AdminPanelPage = () => {
  const [events, setEvents] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventRegistrations, setEventRegistrations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });

  const [materialForm, setMaterialForm] = useState({
    title: '',
    description: '',
    category: '',
    fileUrl: '',
  });

  const fetchEvents = async () => {
    const res = await axiosInstance.get('/events');
    setEvents(res.data);
  };

  const fetchMaterials = async () => {
    const res = await axiosInstance.get('/materials');
    setMaterials(res.data);
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchEvents(), fetchMaterials()]);
    } catch (err) {
      setError('Greška pri dohvaćanju admin podataka.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchEvents(), fetchMaterials()]);
      } catch {
        setError('Greška pri dohvaćanju admin podataka.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const clearAlerts = () => {
    setMessage('');
    setError('');
  };

  const handleEventInput = (e) => {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleMaterialInput = (e) => {
    setMaterialForm({
      ...materialForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    clearAlerts();

    try {
      await axiosInstance.post('/events', eventForm);

      setMessage('Događaj je uspješno dodan.');
      setEventForm({
        title: '',
        description: '',
        date: '',
        location: '',
      });

      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Greška pri dodavanju događaja.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const confirmDelete = window.confirm(
      'Jeste li sigurni da želite obrisati ovaj događaj? Time se brišu i sve prijave za taj događaj.'
    );

    if (!confirmDelete) return;

    clearAlerts();

    try {
      await axiosInstance.delete(`/events/${eventId}`);
      setMessage('Događaj je uspješno obrisan.');

      if (selectedEvent?._id === eventId) {
        setSelectedEvent(null);
        setEventRegistrations([]);
      }

      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Greška pri brisanju događaja.');
    }
  };

  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    clearAlerts();

    try {
      await axiosInstance.post('/materials', materialForm);

      setMessage('Materijal je uspješno dodan.');
      setMaterialForm({
        title: '',
        description: '',
        category: '',
        fileUrl: '',
      });

      fetchMaterials();
    } catch (err) {
      setError(err.response?.data?.message || 'Greška pri dodavanju materijala.');
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    const confirmDelete = window.confirm(
      'Jeste li sigurni da želite obrisati ovaj materijal?'
    );

    if (!confirmDelete) return;

    clearAlerts();

    try {
      await axiosInstance.delete(`/materials/${materialId}`);
      setMessage('Materijal je uspješno obrisan.');
      fetchMaterials();
    } catch (err) {
      setError(err.response?.data?.message || 'Greška pri brisanju materijala.');
    }
  };

  const handleShowRegistrations = async (event) => {
    clearAlerts();

    try {
      setSelectedEvent(event);
      const res = await axiosInstance.get(`/registrations/event/${event._id}`);
      setEventRegistrations(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Greška pri dohvaćanju prijava za događaj.'
      );
    }
  };

  const handleRemoveRegistration = async (registrationId) => {
    const confirmDelete = window.confirm(
      'Jeste li sigurni da želite ukloniti ovog korisnika s događaja?'
    );

    if (!confirmDelete) return;

    clearAlerts();

    try {
      await axiosInstance.delete(`/registrations/admin/${registrationId}`);
      setMessage('Korisnik je uklonjen s događaja.');

      if (selectedEvent) {
        const res = await axiosInstance.get(
          `/registrations/event/${selectedEvent._id}`
        );
        setEventRegistrations(res.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Greška pri uklanjanju korisnika s događaja.'
      );
    }
  };

  if (loading) {
    return <div className="loading">Učitavanje admin panela...</div>;
  }

  return (
    <div className="page-container admin-page">
      <div className="admin-hero">
        <div>
          <p className="admin-eyebrow">Admin zona</p>
          <h1>Admin panel</h1>
          <p>
            Upravljanje događajima, materijalima i prijavama korisnika na jednom mjestu.
          </p>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="admin-grid">
        <section className="admin-card">
          <h2>Dodaj događaj</h2>

          <form onSubmit={handleCreateEvent}>
            <div className="form-group">
              <label>Naziv događaja *</label>
              <input
                type="text"
                name="title"
                value={eventForm.title}
                onChange={handleEventInput}
                placeholder="npr. Radionica za studente"
                required
              />
            </div>

            <div className="form-group">
              <label>Opis *</label>
              <input
                type="text"
                name="description"
                value={eventForm.description}
                onChange={handleEventInput}
                placeholder="Kratki opis događaja"
                required
              />
            </div>

            <div className="form-group">
              <label>Datum *</label>
              <input
                type="date"
                name="date"
                value={eventForm.date}
                onChange={handleEventInput}
                required
              />
            </div>

            <div className="form-group">
              <label>Lokacija *</label>
              <input
                type="text"
                name="location"
                value={eventForm.location}
                onChange={handleEventInput}
                placeholder="npr. Zgrada A, soba 101"
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Dodaj događaj
            </button>
          </form>
        </section>

        <section className="admin-card">
          <h2>Dodaj materijal</h2>

          <form onSubmit={handleCreateMaterial}>
            <div className="form-group">
              <label>Naziv materijala *</label>
              <input
                type="text"
                name="title"
                value={materialForm.title}
                onChange={handleMaterialInput}
                placeholder="npr. Prilagođeni udžbenik matematike"
                required
              />
            </div>

            <div className="form-group">
              <label>Opis</label>
              <input
                type="text"
                name="description"
                value={materialForm.description}
                onChange={handleMaterialInput}
                placeholder="Kratki opis"
              />
            </div>

            <div className="form-group">
              <label>Kategorija</label>
              <input
                type="text"
                name="category"
                value={materialForm.category}
                onChange={handleMaterialInput}
                placeholder="npr. matematika"
              />
            </div>

            <div className="form-group">
              <label>URL datoteke</label>
              <input
                type="text"
                name="fileUrl"
                value={materialForm.fileUrl}
                onChange={handleMaterialInput}
                placeholder="https://..."
              />
            </div>

            <button type="submit" className="btn-primary">
              Dodaj materijal
            </button>
          </form>
        </section>
      </div>

      <section className="admin-section">
        <div className="admin-section-header">
          <h2>Događaji</h2>
          <span>{events.length} ukupno</span>
        </div>

        {events.length === 0 ? (
          <p>Nema dostupnih događaja.</p>
        ) : (
          <div className="admin-list">
            {events.map((event) => (
              <div key={event._id} className="admin-list-item">
                <div>
                  <h3>{event.title}</h3>
                  <p>
                    📅 {new Date(event.date).toLocaleDateString('hr-HR')} · 📍{' '}
                    {event.location}
                  </p>
                </div>

                <div className="admin-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleShowRegistrations(event)}
                  >
                    Pregled prijava
                  </button>

                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    Obriši
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedEvent && (
        <section className="admin-section">
          <div className="admin-section-header">
            <h2>Prijave: {selectedEvent.title}</h2>
            <span>{eventRegistrations.length} prijava</span>
          </div>

          {eventRegistrations.length === 0 ? (
            <p>Nitko nije prijavljen na ovaj događaj.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ime</th>
                    <th>Email</th>
                    <th>Uloga</th>
                    <th>Datum prijave</th>
                    <th>Akcija</th>
                  </tr>
                </thead>

                <tbody>
                  {eventRegistrations.map((registration) => (
                    <tr key={registration._id}>
                      <td>{registration.user?.name || 'Nepoznato'}</td>
                      <td>{registration.user?.email || 'Nepoznato'}</td>
                      <td>{registration.user?.role || '-'}</td>
                      <td>
                        {new Date(registration.createdAt).toLocaleDateString(
                          'hr-HR'
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-danger btn-small"
                          onClick={() =>
                            handleRemoveRegistration(registration._id)
                          }
                        >
                          Ukloni
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <section className="admin-section">
        <div className="admin-section-header">
          <h2>Materijali</h2>
          <span>{materials.length} ukupno</span>
        </div>

        {materials.length === 0 ? (
          <p>Nema dostupnih materijala.</p>
        ) : (
          <div className="admin-list">
            {materials.map((material) => (
              <div key={material._id} className="admin-list-item">
                <div>
                  <h3>{material.title}</h3>
                  <p>
                    {material.description || 'Bez opisa'} ·{' '}
                    {material.category || 'general'}
                  </p>
                </div>

                <div className="admin-actions">
                  {material.fileUrl && (
                    <a
                      href={material.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      Otvori
                    </a>
                  )}

                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => handleDeleteMaterial(material._id)}
                  >
                    Obriši
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminPanelPage;