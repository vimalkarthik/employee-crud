const express = require('express');
const router = express.Router();

// GET /api/countries  (Laravel: countryController@index)
router.get('/', (req, res) => {
  const countries = [
    { id: 1, Name: 'India' },
    { id: 2, Name: 'Singapore' },
    { id: 3, Name: 'UAE' },
    { id: 4, Name: 'Qatar' },
    { id: 5, Name: 'Australia' },
  ];

  return res.json(countries);
});

module.exports = router;
