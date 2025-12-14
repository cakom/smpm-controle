const express = require('express');
const router = express.Router();
const {
  criarManutencao,
  listarManutencoes,
  buscarManutencao,
  atualizarManutencao,
  deletarManutencao,
  historicoMaquina,
  obterKPIs
} = require('../controllers/maintenanceController');
const { proteger, autorizar } = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(proteger);

/**
 * @swagger
 * /api/maintenances/kpis:
 *   get:
 *     summary: Obter KPIs de manutenção
 *     tags: [Maintenances]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: KPIs de manutenção
 */
router.get('/kpis', obterKPIs);

router.get('/machine/:machineId', historicoMaquina);

router.route('/')
  .get(listarManutencoes)
  .post(autorizar('admin', 'tecnico'), criarManutencao);

router.route('/:id')
  .get(buscarManutencao)
  .put(autorizar('admin', 'tecnico'), atualizarManutencao)
  .delete(autorizar('admin'), deletarManutencao);

module.exports = router;