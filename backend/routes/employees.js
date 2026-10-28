const express = require('express');
const pool = require('../config/db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// All employee routes require a logged-in user, same as the
// `->middleware(['auth', 'nocache'])` group in Laravel's routes/web.php
router.use(requireAuth);

// GET /api/employees  (Laravel: EmployeeController@read / @index)
router.get('/', async (req, res) => {
  try {
    const [employees] = await pool.query('SELECT * FROM employees ORDER BY id DESC');
    return res.json(employees);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error while fetching employees' });
  }
});

// GET /api/employees/search/:param  (Laravel: EmployeeController@search)
router.get('/search/:param', async (req, res) => {
  try {
    const { param } = req.params;
    const [employees] = await pool.query(
      'SELECT * FROM employees WHERE name LIKE ? ORDER BY id DESC',
      [`%${param}%`]
    );
    return res.json(employees);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error while searching employees' });
  }
});

// GET /api/employees/:id  (Laravel: EmployeeController@edit)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error while fetching employee' });
  }
});

// POST /api/employees  (Laravel: EmployeeController@store)
router.post('/', async (req, res) => {
  try {
    const { name, employeeId, designation } = req.body;

    if (!name || !employeeId || !designation) {
      return res.status(422).json({ message: 'name, employeeId and designation are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO employees (name, employeeId, designation) VALUES (?, ?, ?)',
      [name, employeeId, designation]
    );

    return res.status(201).json({
      message: 'Employee created successfully',
      employee: { id: result.insertId, name, employeeId, designation },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error while creating employee' });
  }
});

// PUT /api/employees/:id  (Laravel: EmployeeController@update)
router.put('/:id', async (req, res) => {
  try {
    const { name, employeeId, designation } = req.body;
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM employees WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await pool.query(
      'UPDATE employees SET name = ?, employeeId = ?, designation = ? WHERE id = ?',
      [name, employeeId, designation, id]
    );

    return res.json({ message: 'Employee updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error while updating employee' });
  }
});

// DELETE /api/employees/:id  (Laravel: EmployeeController@destroy)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM employees WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await pool.query('DELETE FROM employees WHERE id = ?', [id]);

    return res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error while deleting employee' });
  }
});

module.exports = router;
