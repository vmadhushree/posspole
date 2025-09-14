
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler, notFound } = require('./middleware/error');

const app = express();

// Middleware
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_URL?.split(',') || '*',
  credentials: false,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// DB connect
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('Missing MONGO_URI in env');
  process.exit(1);
}
mongoose.connect(MONGO_URI).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error', err);
  process.exit(1);
});

// Routes
app.get('/', (req, res) => res.json({ status: 'ok', name: 'POSSPOLE API' }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/profile', require('./routes/profile.routes'));
app.use('/api/courses', require('./routes/courses.routes'));
app.use('/api/feedback', require('./routes/feedback.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
