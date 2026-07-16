import { Link } from 'react-router-dom';

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

const EventCard = ({ event }) => {
  const isPast = new Date(event.date) < new Date();
  const isFull = event.seatsRemaining <= 0;

  return (
    <Link to={`/events/${event._id}`} className="event-card glass">
      <div className="event-card-image" style={event.imageUrl ? { backgroundImage: `url(${event.imageUrl})` } : {}}>
        {!event.imageUrl && <span className="event-card-placeholder">{event.title.charAt(0)}</span>}
        <span className="event-category-badge">{event.category}</span>
      </div>
      <div className="event-card-body">
        <h3>{event.title}</h3>
        <p className="event-meta">{formatDate(event.date)} · {event.time}</p>
        <p className="event-meta">{event.location}</p>
        <div className="event-card-footer">
          {isPast ? (
            <span className="pill pill-muted">Past event</span>
          ) : isFull ? (
            <span className="pill pill-danger">Fully booked</span>
          ) : (
            <span className="pill pill-success">{event.seatsRemaining} seats left</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
