const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { proteger } = require('../middleware/auth');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, tecnico, operador]
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obter usuário logado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 */
router.get('/me', proteger, getMe);

module.exports = router;