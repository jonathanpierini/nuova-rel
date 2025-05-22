const express = require('express');
const router = express.Router();
const { calculateHalifaxProfile } = require('../utils/halifax');

router.post('/submit', (req, res) => {
  const responses = req.body.responses; // formato: [{questionId: 'q1', answerIndex: 3}, ...]
  const profile = calculateHalifaxProfile(responses);
  res.json({ profile });
});

module.exports = router;
