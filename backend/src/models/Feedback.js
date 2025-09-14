
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  message: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
