const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  updateMe, 
  updatePassword 
} = require('../controllers/authController');
const { proteger } = require('../middleware/auth');

// Rotas públicas
router.post('/register', register);
router.post('/login', login);

// Rotas protegidas
router.get('/me', proteger, getMe);
router.put('/me', proteger, updateMe);
router.put('/updatepassword', proteger, updatePassword);

module.exports = router;