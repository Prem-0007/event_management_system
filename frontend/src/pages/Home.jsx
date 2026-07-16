import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import EventCard from '../components/EventCard';
import Reveal from '../components/Reveal';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events', { params: { filter: 'upcoming' } }).then((res) => {
      setEvents(res.data.slice(0, 6));
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <Reveal>
        <div className="hero glass">
          <h1>Discover and host great events</h1>
          <p>Create events, manage registrations, and track everything from one elegant dashboard.</p>
          <Link to="/create-event"><button>+ Create an Event</button></Link>
        </div>
      </Reveal>

      <div className="page-header">
        <h2 className="section-title">Upcoming Events</h2>
        <Link to="/events" className="link-more">View all →</Link>
      </div>

      {loading ? (
        <div className="empty-state">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="empty-state glass">No upcoming events yet. Be the first to create one.</div>
      ) : (
        <div className="event-grid">
          {events.map((ev, i) => (
            <Reveal key={ev._id} delay={i * 60}>
              <EventCard event={ev} />
            </Reveal>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Home;
