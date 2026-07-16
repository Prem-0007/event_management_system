const Event = require('../models/Event');
const Registration = require('../models/Registration');

const registerForEvent = async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (event.date < new Date()) {
    return res.status(400).json({ message: 'This event has already ended' });
  }
  if (event.seatsRemaining <= 0) {
    return res.status(400).json({ message: 'This event is fully booked' });
  }

  let registration = await Registration.findOne({ event: event._id, user: req.user._id });

  if (registration && registration.status === 'confirmed') {
    return res.status(400).json({ message: 'You are already registered for this event' });
  }

  if (registration) {
    registration.status = 'confirmed';
    await registration.save();
  } else {
    registration = await Registration.create({ event: event._id, user: req.user._id });
  }

  event.seatsRemaining -= 1;
  await event.save();

  res.status(201).json(registration);
};

const cancelRegistration = async (req, res) => {
  const registration = await Registration.findById(req.params.id);
  if (!registration) return res.status(404).json({ message: 'Registration not found' });

  if (registration.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  if (registration.status === 'cancelled') {
    return res.status(400).json({ message: 'Registration already cancelled' });
  }

  registration.status = 'cancelled';
  await registration.save();

  const event = await Event.findById(registration.event);
  if (event) {
    event.seatsRemaining = Math.min(event.capacity, event.seatsRemaining + 1);
    await event.save();
  }

  res.json({ message: 'Registration cancelled' });
};

const getMyRegistrations = async (req, res) => {
  const registrations = await Registration.find({ user: req.user._id, status: 'confirmed' })
    .populate({
      path: 'event',
      populate: { path: 'organizer', select: 'name email' }
    })
    .sort({ createdAt: -1 });

  res.json(registrations.filter((r) => r.event));
};

module.exports = { registerForEvent, cancelRegistration, getMyRegistrations };
