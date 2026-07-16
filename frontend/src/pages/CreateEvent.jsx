import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';

const CATEGORIES = ['Technology', 'Business', 'Music', 'Sports', 'Arts', 'Education', 'Other'];

const emptyForm = {
  title: '', description: '', category: 'Technology', date: '', time: '',
  location: '', imageUrl: '', capacity: ''
};

const CreateEvent = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/events/${id}`).then(({ data }) => {
      setForm({
        title: data.title,
        description: data.description,
        category: data.category,
        date: data.date.slice(0, 10),
        time: data.time,
        location: data.location,
        imageUrl: data.imageUrl || '',
        capacity: data.capacity
      });
      setLoading(false);
    });
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const payload = { ...form, capacity: Number(form.capacity) };
      if (isEdit) {
        await api.put(`/events/${id}`, payload);
        navigate(`/events/${id}`);
      } else {
        const { data } = await api.post('/events', payload);
        navigate(`/events/${data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
    setBusy(false);
  };

  if (loading) return <Layout><div className="full-loader"><div className="spinner" /></div></Layout>;

  return (
    <Layout>
      <h1 className="page-title">{isEdit ? 'Edit Event' : 'Create Event'}</h1>

      <form className="form-card glass" onSubmit={handleSubmit}>
        {error && <div className="error-msg">{error}</div>}

        <label>Title</label>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

        <label>Description</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <div className="form-row">
          <div>
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label>Capacity</label>
            <input type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </div>
          <div>
            <label>Time</label>
            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
          </div>
        </div>

        <label>Location</label>
        <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />

        <label>Image URL (optional)</label>
        <input
          placeholder="https://..."
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />

        <button type="submit" disabled={busy}>{busy ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Event'}</button>
      </form>
    </Layout>
  );
};

export default CreateEvent;
