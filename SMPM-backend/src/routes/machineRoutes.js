const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  updateMe, 
  updatePassword,
  listarUsuarios,
  buscarUsuario,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario
} = require('../controllers/authController');
const { proteger, autorizar } = require('../middleware/auth');

// ============================================
// ROTAS PÚBLICAS
// ============================================
router.post('/register', register);
router.post('/login', login);

// ============================================
// ROTAS DO USUÁRIO LOGADO
// ============================================
router.get('/me', proteger, getMe);
router.put('/me', proteger, updateMe);
router.put('/updatepassword', proteger, updatePassword);

// ============================================
// CRUD COMPLETO DE USUÁRIOS (ADMIN APENAS)
// ============================================
router.route('/users')
  .get(proteger, autorizar('admin'), listarUsuarios)
  .post(proteger, autorizar('admin'), criarUsuario);

router.route('/users/:id')
  .get(proteger, autorizar('admin'), buscarUsuario)
  .put(proteger, autorizar('admin'), atualizarUsuario)
  .delete(proteger, autorizar('admin'), deletarUsuario);

module.exports = router;