// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRouter = require('./routes/auth'); 
const profileRouter = require('./routes/profile'); 
const foodRoutes = require('./routes/food');
const dairyRoutes = require('./routes/diary')

const app = express();
connectDB();

app.use(express.json());
app.use(require('cors')());

app.get('/', (req, res) => res.send('API is running'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/foods', foodRoutes);
app.use('/api/dairy', dairyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));