import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/summary').then((res) => {
      setSummary(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Layout><div className="full-loader"><div className="spinner" /></div></Layout>;

  return (
    <Layout>
      <h1 className="page-title">Dashboard</h1>

      <div className="stat-grid">
        <div className="stat-card glass">
          <span className="stat-label">Total Events</span>
          <span className="stat-value">{summary.totalEvents}</span>
        </div>
        <div className="stat-card glass">
          <span className="stat-label">Upcoming Events</span>
          <span className="stat-value">{summary.upcomingEvents}</span>
        </div>
        <div className="stat-card glass">
          <span className="stat-label">Registered Participants</span>
          <span className="stat-value">{summary.totalParticipants}</span>
        </div>
        <div className="stat-card glass">
          <span className="stat-label">Your Events</span>
          <span className="stat-value">{summary.myEventsCount}</span>
        </div>
      </div>

      <Reveal>
        <div className="panel glass">
          <h2>Recent Activity</h2>
          {summary.recentActivities.length === 0 ? (
            <div className="empty-state">No activity yet.</div>
          ) : (
            <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr><th>User</th><th>Event</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {summary.recentActivities.map((a) => (
                  <tr key={a._id}>
                    <td>{a.user.name}</td>
                    <td>{a.event.title}</td>
                    <td className={a.status === 'confirmed' ? 'positive' : 'negative'}>{a.status}</td>
                    <td>{new Date(a.updatedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </Reveal>
    </Layout>
  );
};

export default Dashboard;
