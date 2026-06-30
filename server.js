require('dotenv').config();
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');

const linkRoutes = require('./routes/links');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3000;

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// rate limit only the link-creation endpoint, not redirects (redirects need to stay fast for everyone)
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 30,
  message: 'Too many links created from this IP, please try again later.'
});
app.use('/shorten', createLimiter);

app.use('/', dashboardRoutes);
app.use('/', linkRoutes);

// catch-all 404
app.use((req, res) => {
  res.status(404).render('404', { shortCode: req.path });
});

async function start() {
  await connectDB();
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
