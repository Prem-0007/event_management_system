import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';
import { useAuth } from '../context/AuthContext';

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [registered, setRegistered] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: ev }, { data: myRegs }] = await Promise.all([
        api.get(`/events/${id}`),
        api.get('/registrations/mine')
      ]);
      setEvent(ev);
      setRegistered(myRegs.some((r) => r.event._id === ev._id));
    } catch (err) {
      setError('Event not found');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleRegister = async () => {
    setBusy(true);
    setError('');
    try {
      await api.post(`/registrations/${id}`);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setBusy(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    await api.delete(`/events/${id}`);
    navigate('/events');
  };

  if (loading) return <Layout><div className="full-loader"><div className="spinner" /></div></Layout>;
  if (!event) return <Layout><div className="empty-state glass">{error || 'Event not found'}</div></Layout>;

  const isPast = new Date(event.date) < new Date();
  const isOwner = event.organizer?._id === user?._id;

  return (
    <Layout>
      <Reveal>
        <div className="event-detail glass">
          <div
            className="event-detail-image"
            style={event.imageUrl ? { backgroundImage: `url(${event.imageUrl})` } : {}}
          >
            {!event.imageUrl && <span className="event-card-placeholder large">{event.title.charAt(0)}</span>}
          </div>
          <div className="event-detail-body">
            <span className="event-category-badge static">{event.category}</span>
            <h1>{event.title}</h1>
            <p className="event-meta">{formatDate(event.date)} · {event.time}</p>
            <p className="event-meta">{event.location}</p>
            <p className="event-meta">Hosted by {event.organizer?.name}</p>

            <p className="event-description">{event.description}</p>

            {error && <div className="error-msg">{error}</div>}

            <div className="event-detail-footer">
              {isPast ? (
                <span className="pill pill-muted">This event has ended</span>
              ) : registered ? (
                <span className="pill pill-success">You're registered — see it in My Registrations</span>
              ) : event.seatsRemaining <= 0 ? (
                <span className="pill pill-danger">Fully booked</span>
              ) : (
                <button onClick={handleRegister} disabled={busy}>
                  {busy ? 'Registering...' : `Register (${event.seatsRemaining} seats left)`}
                </button>
              )}

              {isOwner && (
                <div className="owner-actions">
                  <Link to={`/edit-event/${event._id}`}><button className="secondary">Edit Event</button></Link>
                  <button className="danger" onClick={handleDelete}>Delete Event</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </Layout>
  );
};

export default EventDetails;
