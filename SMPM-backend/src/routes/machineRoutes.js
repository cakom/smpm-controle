const express = require('express');
const router = express.Router();
const {
  criarMaquina,
  listarMaquinas,
  buscarMaquina,
  atualizarMaquina,
  deletarMaquina
} = require('../controllers/machineController');
const { proteger, autorizar } = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(proteger);

/**
 * @swagger
 * /api/machines:
 *   get:
 *     summary: Listar todas as máquinas
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: setor
 *         schema:
 *           type: string
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de máquinas
 */
router.route('/')
  .get(listarMaquinas)
  .post(autorizar('admin', 'tecnico'), criarMaquina);

router.route('/:id')
  .get(buscarMaquina)
  .put(autorizar('admin', 'tecnico'), atualizarMaquina)
  .delete(autorizar('admin'), deletarMaquina);

module.exports = router;