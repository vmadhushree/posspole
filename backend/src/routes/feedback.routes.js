
const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const { validationResult } = require('express-validator');
const { feedbackCreateValidator } = require('../utils/validators');
const Feedback = require('../models/Feedback');
const Course = require('../models/Course');

// Create feedback
router.post('/', auth(true), feedbackCreateValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { courseId, rating, message } = req.body;
  const course = await Course.findById(courseId);
  if (!course || !course.isActive) return res.status(400).json({ message: 'Invalid course' });
  const fb = await Feedback.create({ course: courseId, student: req.user._id, rating, message });
  res.status(201).json({ feedback: fb });
});

// List my feedback (paginated)
router.get('/mine', auth(true), async (req, res) => {
  const page = parseInt(req.query.page || '1');
  const limit = parseInt(req.query.limit || '10');
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Feedback.find({ student: req.user._id }).populate('course', 'title').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Feedback.countDocuments({ student: req.user._id })
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

// Update my feedback
router.put('/:id', auth(true), async (req, res) => {
  const { rating, message } = req.body;
  const fb = await Feedback.findOne({ _id: req.params.id, student: req.user._id });
  if (!fb) return res.status(404).json({ message: 'Not found' });
  if (rating !== undefined) fb.rating = rating;
  if (message !== undefined) fb.message = message;
  await fb.save();
  res.json({ feedback: fb });
});

// Delete my feedback
router.delete('/:id', auth(true), async (req, res) => {
  const fb = await Feedback.findOneAndDelete({ _id: req.params.id, student: req.user._id });
  if (!fb) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
