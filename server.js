// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db.js');
const authRouter = require('./routes/auth.js'); 
const profileRouter = require('./routes/profile.js'); 
const foodRoutes = require('./routes/food.js');
const diaryRoutes = require('./routes/diary.js');
const waterRoutes = require('./routes/water.js');
const weightRoutes = require('./routes/weight');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
connectDB();

app.use(express.json());
app.use(require('cors')());

app.get('/', (req, res) => res.send('API is running'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/foods', foodRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));