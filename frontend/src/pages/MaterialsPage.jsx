import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';

const MaterialsPage = () => {
  const { user } = useAuth();

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchMaterials = async (searchTerm = '') => {
    try {
      const res = await axiosInstance.get(`/materials?search=${searchTerm}`);
      setMaterials(res.data);
    } catch (err) {
      setError('Greška pri dohvaćanju materijala');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchMaterials(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError('');
    setMessage('');
    setSubmitting(true);

    try {
      await axiosInstance.post('/materials', {
        title,
        description,
        category,
        fileUrl,
      });

      setMessage('Materijal uspješno dodan!');
      setTitle('');
      setDescription('');
      setCategory('');
      setFileUrl('');
      setShowForm(false);
      fetchMaterials(search);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Greška pri dodavanju materijala');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    const confirmDelete = window.confirm(
      'Jeste li sigurni da želite obrisati ovaj materijal?'
    );

    if (!confirmDelete) return;

    setError('');
    setMessage('');

    try {
      await axiosInstance.delete(`/materials/${materialId}`);
      setMessage('Materijal je uspješno obrisan.');
      fetchMaterials(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Greška pri brisanju materijala');
    }
  };

  if (loading) return <div className="loading">Učitavanje...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Materijali</h1>

        {user?.role === 'admin' && (
          <button
            className="btn-primary btn-add"
            onClick={() => {
              setShowForm(!showForm);
              setFormError('');
              setMessage('');
            }}
          >
            {showForm ? 'Zatvori' : '+ Dodaj materijal'}
          </button>
        )}
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {showForm && user?.role === 'admin' && (
        <div className="material-form-card">
          <h3>Novi materijal</h3>

          {formError && <div className="alert alert-error">{formError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Naziv *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Naziv materijala"
                required
              />
            </div>

            <div className="form-group">
              <label>Opis</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kratki opis"
              />
            </div>

            <div className="form-group">
              <label>Kategorija</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="npr. matematika, hrvatski..."
              />
            </div>

            <div className="form-group">
              <label>URL datoteke</label>
              <input
                type="text"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Dodavanje...' : 'Dodaj materijal'}
            </button>
          </form>
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="🔍 Pretraži materijale..."
        />
      </div>

      {materials.length === 0 ? (
        <p>Nema dostupnih materijala.</p>
      ) : (
        <div className="materials-list">
          {materials.map((material) => (
            <div key={material._id} className="material-card">
              <div className="material-info">
                <h3>{material.title}</h3>

                {material.description && (
                  <p className="material-description">{material.description}</p>
                )}

                {material.category && (
                  <span className="material-category">{material.category}</span>
                )}
              </div>

              <div className="material-actions material-actions-row">
                {material.fileUrl ? (
                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    Otvori datoteku
                  </a>
                ) : (
                  <span className="no-file">Nema datoteke</span>
                )}

                {user?.role === 'admin' && (
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => handleDeleteMaterial(material._id)}
                  >
                    Obriši
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialsPage;