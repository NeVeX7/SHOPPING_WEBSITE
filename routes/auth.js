const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controller/authController');

// Expects JSON body: { name, email, password }
router.post('/register', registerUser);

// Expects JSON body: { email, password }
router.post('/login', loginUser);

module.exports = router;
