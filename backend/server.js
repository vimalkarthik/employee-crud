const express = require('express');
const cors = require('cors');
require('dotenv').config();

const nocache = require('./middleware/nocache');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const countryRoutes = require('./routes/countries');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(nocache);

app.get('/', (req, res) => {
  res.json({ message: 'Employee CRUD API is running' });
});

app.use('/api', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/countries', countryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
