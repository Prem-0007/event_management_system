const Event = require('../models/Event');
const Registration = require('../models/Registration');

const getEvents = async (req, res) => {
  const { search, category, filter } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } }
    ];
  }
  if (category) {
    query.category = category;
  }
  if (filter === 'upcoming') {
    query.date = { $gte: new Date() };
  } else if (filter === 'past') {
    query.date = { $lt: new Date() };
  }

  const events = await Event.find(query).populate('organizer', 'name email').sort({ date: 1 });
  res.json(events);
};

const getEvent = async (req, res) => {
  const event = await Event.findById(req.params.id).populate('organizer', 'name email');
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
};

const createEvent = async (req, res) => {
  const { title, description, category, date, time, location, imageUrl, capacity } = req.body;

  if (!title || !description || !category || !date || !time || !location || !capacity) {
    return res.status(400).json({ message: 'Missing required event fields' });
  }

  const event = await Event.create({
    title,
    description,
    category,
    date,
    time,
    location,
    imageUrl: imageUrl || '',
    capacity,
    seatsRemaining: capacity,
    organizer: req.user._id
  });

  res.status(201).json(event);
};

const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Only the organizer can edit this event' });
  }

  const { capacity, ...rest } = req.body;
  if (capacity && capacity !== event.capacity) {
    const seatsUsed = event.capacity - event.seatsRemaining;
    if (capacity < seatsUsed) {
      return res.status(400).json({ message: `Cannot set capacity below ${seatsUsed} (already registered)` });
    }
    event.seatsRemaining = capacity - seatsUsed;
    event.capacity = capacity;
  }

  Object.assign(event, rest);
  await event.save();
  res.json(event);
};

const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Only the organizer can delete this event' });
  }

  await Registration.deleteMany({ event: event._id });
  await event.deleteOne();
  res.json({ message: 'Event removed' });
};

module.exports = { getEvents, getEvent, createEvent, updateEvent, deleteEvent };
