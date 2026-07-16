const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true, default: '' },
    capacity: { type: Number, required: true, min: 1 },
    seatsRemaining: { type: Number, required: true, min: 0 },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

eventSchema.virtual('isPast').get(function () {
  return this.date < new Date();
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
