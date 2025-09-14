
const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const User = require('../models/User');
const Feedback = require('../models/Feedback');
const Course = require('../models/Course');
const { toCSV } = require('../utils/csv');

router.use(auth(true), requireRole('admin'));

// Users management
router.get('/users', async (req, res) => {
  const page = parseInt(req.query.page || '1');
  const limit = parseInt(req.query.limit || '10');
  const search = (req.query.search || '').trim();
  const q = search ? { $or: [ { name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') } ] } : {};
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    User.find(q).select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(q)
  ]);
  res.json({ items, total, page, pages: Math.ceil(total/limit) });
});

router.patch('/users/:id/block', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true }).select('-passwordHash');
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json({ user });
});

router.patch('/users/:id/unblock', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true }).select('-passwordHash');
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json({ user });
});

router.delete('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  await User.deleteOne({ _id: user._id });
  res.json({ message: 'Deleted' });
});

// Feedback admin list with filters
router.get('/feedback', async (req, res) => {
  const { courseId, rating, studentEmail } = req.query;
  const page = parseInt(req.query.page || '1');
  const limit = parseInt(req.query.limit || '10');
  const skip = (page - 1) * limit;

  const q = {};
  if (courseId) q.course = courseId;
  if (rating) q.rating = parseInt(rating);
  if (studentEmail) {
    const users = await User.find({ email: new RegExp(studentEmail, 'i') }).select('_id');
    q.student = { $in: users.map(u => u._id) };
  }

  const [items, total] = await Promise.all([
    Feedback.find(q).populate('course', 'title').populate('student', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Feedback.countDocuments(q)
  ]);
  res.json({ items, total, page, pages: Math.ceil(total/limit) });
});

// CSV export
router.get('/feedback/export', async (req, res) => {
  const { courseId, rating, studentEmail } = req.query;
  const q = {};
  if (courseId) q.course = courseId;
  if (rating) q.rating = parseInt(rating);
  if (studentEmail) {
    const users = await User.find({ email: new RegExp(studentEmail, 'i') }).select('_id');
    q.student = { $in: users.map(u => u._id) };
  }
  const items = await Feedback.find(q).populate('course', 'title').populate('student', 'name email');
  const rows = items.map(i => ({
    course: i.course?.title,
    studentName: i.student?.name,
    studentEmail: i.student?.email,
    rating: i.rating,
    message: i.message,
    createdAt: i.createdAt.toISOString(),
  }));
  const csv = toCSV(rows, ['course','studentName','studentEmail','rating','message','createdAt']);
  res.header('Content-Type', 'text/csv');
  res.attachment('feedback.csv');
  res.send(csv);
});

// Metrics: total feedback, total students, avg rating per course
router.get('/metrics', async (req, res) => {
  const [feedbackCount, studentCount, averages] = await Promise.all([
    Feedback.countDocuments({}),
    User.countDocuments({ role: 'student' }),
    Feedback.aggregate([
      { $group: { _id: '$course', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
      { $unwind: '$course' },
      { $project: { _id: 0, courseId: '$course._id', courseTitle: '$course.title', avgRating: { $round: ['$avgRating', 2] }, count: 1 } },
      { $sort: { courseTitle: 1 } }
    ])
  ]);
  res.json({ feedbackCount, studentCount, averages });
});

module.exports = router;
