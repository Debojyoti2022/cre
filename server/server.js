
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Routes
const authRoutes = require('./routes/authRoutes');
const feedRoutes = require('./routes/feed');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// CORS Configuration for frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Middleware to parse JSON
app.use(express.json());

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);


// Log to check if Mongo URI is being read correctly
console.log('MONGO_URI:', process.env.MONGO_URI);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(` Server running on port ${port}`));
})
.catch(err => {
  console.error(' MongoDB connection failed:', err.message);
});
