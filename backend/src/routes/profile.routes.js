
const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { validationResult } = require('express-validator');
const { profileUpdateValidator, changePasswordValidator } = require('../utils/validators');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { cloudinary, enabled } = require('../utils/cloudinary');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

router.get('/me', auth(true), async (req, res) => {
  const user = await User.findById(req.user._id).select('-passwordHash');
  res.json({ user });
});

router.put('/', auth(true), profileUpdateValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const updates = (({ name, phone, dob, address }) => ({ name, phone, dob, address }))(req.body);
  Object.keys(updates).forEach(k => updates[k] === undefined && delete updates[k]);
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-passwordHash');
  res.json({ user });
});

router.put('/password', auth(true), changePasswordValidator, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) return res.status(400).json({ message: 'Current password incorrect' });
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password updated' });
});

router.post('/avatar', auth(true), upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  if (!enabled) return res.status(400).json({ message: 'Cloudinary not configured' });
  try {
    const b64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(b64, { folder: 'posspole/avatars' });
    const user = await User.findByIdAndUpdate(req.user._id, { avatarUrl: result.secure_url }, { new: true }).select('-passwordHash');
    res.json({ user, url: result.secure_url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;
