const Event = require('../models/Event');
const Registration = require('../models/Registration');

const getSummary = async (req, res) => {
  const totalEvents = await Event.countDocuments();
  const upcomingEvents = await Event.countDocuments({ date: { $gte: new Date() } });

  const participantsAgg = await Registration.aggregate([
    { $match: { status: 'confirmed' } },
    { $count: 'total' }
  ]);
  const totalParticipants = participantsAgg.length ? participantsAgg[0].total : 0;

  const recentActivities = await Registration.find()
    .populate('user', 'name')
    .populate('event', 'title')
    .sort({ updatedAt: -1 })
    .limit(10);

  const myEventsCount = await Event.countDocuments({ organizer: req.user._id });

  res.json({
    totalEvents,
    upcomingEvents,
    totalParticipants,
    myEventsCount,
    recentActivities: recentActivities.filter((r) => r.event && r.user)
  });
};

module.exports = { getSummary };
