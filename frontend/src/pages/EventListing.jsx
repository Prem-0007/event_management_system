import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import EventCard from '../components/EventCard';
import Reveal from '../components/Reveal';

const CATEGORIES = ['All', 'Technology', 'Business', 'Music', 'Sports', 'Arts', 'Education', 'Other'];

const EventListing = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category !== 'All') params.category = category;
    if (filter !== 'all') params.filter = filter;
    const { data } = await api.get('/events', { params });
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, [category, filter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadEvents();
  };

  return (
    <Layout>
      <h1 className="page-title">All Events</h1>

      <form className="filter-bar glass" onSubmit={handleSearchSubmit}>
        <input
          placeholder="Search by title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All dates</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <div className="empty-state">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="empty-state glass">No events match your filters.</div>
      ) : (
        <div className="event-grid">
          {events.map((ev, i) => (
            <Reveal key={ev._id} delay={Math.min(i * 40, 300)}>
              <EventCard event={ev} />
            </Reveal>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default EventListing;
