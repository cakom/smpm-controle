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

// Rotas especiais (devem vir antes de /:id)
router.get('/kpis', obterKPIs);
router.get('/machine/:machineId', historicoMaquina);

// Rotas principais
router.route('/')
  .get(listarManutencoes)
  .post(autorizar('admin', 'tecnico'), criarManutencao);

router.route('/:id')
  .get(buscarManutencao)
  .put(autorizar('admin', 'tecnico'), atualizarManutencao)
  .delete(autorizar('admin'), deletarManutencao);

module.exports = router;