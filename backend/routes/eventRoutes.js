const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getEvents).post(protect, createEvent);
router.route('/:id').get(protect, getEvent).put(protect, updateEvent).delete(protect, deleteEvent);

module.exports = router;
