
const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const { validationResult } = require('express-validator');
const { courseCreateValidator } = require('../utils/validators');
const Course = require('../models/Course');

// Public list (active only)
router.get('/', async (req, res) => {
  const courses = await Course.find({ isActive: true }).sort({ title: 1 });
  res.json({ courses });
});

// Admin CRUD
router.post('/', auth(true), requireRole('admin'), courseCreateValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { title, description } = req.body;
  const exists = await Course.findOne({ title });
  if (exists) return res.status(400).json({ message: 'Course already exists' });
  const course = await Course.create({ title, description });
  res.status(201).json({ course });
});

router.get('/all', auth(true), requireRole('admin'), async (req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.json({ courses });
});

router.put('/:id', auth(true), requireRole('admin'), async (req, res) => {
  const { title, description, isActive } = req.body;
  const course = await Course.findByIdAndUpdate(req.params.id, { title, description, isActive }, { new: true });
  if (!course) return res.status(404).json({ message: 'Not found' });
  res.json({ course });
});

router.delete('/:id', auth(true), requireRole('admin'), async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
