const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = require('../config/db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

// POST /api/register  (Laravel: AuthController@register)
router.post('/register', async (req, res) => {
  try {
    const { fName, email, password } = req.body;

    if (!fName || !email || !password) {
      return res.status(422).json({ message: 'fName, email and password are required' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(422).json({ message: 'Email is already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [fName, email, hashed]
    );

    const user = { id: result.insertId, name: fName, email };
    const token = signToken(user);

    return res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error while registering' });
  }
});

// POST /api/login  (Laravel: AuthController@login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ message: 'email and password are required' });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const token = signToken(user);

    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error while logging in' });
  }
});

// POST /api/logout  (Laravel: AuthController@logout)
// JWTs are stateless, so "logout" just tells the client to discard the token.
router.post('/logout', requireAuth, (req, res) => {
  return res.json({ message: 'Logged out successfully' });
});

// GET /api/user  (Laravel: routes/api.php -> /user)
router.get('/user', requireAuth, (req, res) => {
  return res.json(req.user);
});

module.exports = router;
