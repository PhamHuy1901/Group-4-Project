const express = require('express');
const router = express.Router();

let users = [];

router.get('/', (req, res) => res.json(users));

router.post('/', (req, res) => {
  const user = { id: Date.now(), ...req.body };
  users.push(user);
  res.status(201).json(user);
});

module.exports = router;