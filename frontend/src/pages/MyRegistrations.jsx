import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/registrations/mine');
    setRegistrations(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (regId) => {
    if (!confirm('Cancel this registration?')) return;
    await api.put(`/registrations/${regId}/cancel`);
    load();
  };

  return (
    <Layout>
      <h1 className="page-title">My Registrations</h1>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : registrations.length === 0 ? (
        <div className="empty-state glass">
          You haven't registered for any events yet. <Link to="/events">Browse events</Link>
        </div>
      ) : (
        <div className="reg-list">
          {registrations.map((r, i) => (
            <Reveal key={r._id} delay={i * 50}>
              <div className="reg-item glass">
                <div>
                  <h3>{r.event.title}</h3>
                  <p className="event-meta">{formatDate(r.event.date)} · {r.event.time}</p>
                  <p className="event-meta">{r.event.location}</p>
                </div>
                <div className="reg-actions">
                  <Link to={`/events/${r.event._id}`}><button className="secondary">View</button></Link>
                  <button className="danger" onClick={() => handleCancel(r._id)}>Cancel</button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default MyRegistrations;
