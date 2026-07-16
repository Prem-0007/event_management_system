const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations
} = require('../controllers/registrationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/mine', getMyRegistrations);
router.post('/:eventId', registerForEvent);
router.put('/:id/cancel', cancelRegistration);

module.exports = router;
