const express = require('express');
const router = express.Router();
const controller = require('../controllers/prestadorController');

// Criar prestador
router.post('/', controller.createPrestador);

// Login do prestador
router.post('/login', controller.loginPrestador);

// Listar por categoria (definir antes de /:id para evitar conflito)
router.get('/categoria/:categoria', controller.getPrestadoresByCategoria);


router.get('/solicitacoes/:id', controller.getSolicitacoes);

// Listar todos
router.get('/', controller.listPrestadores);

// Buscar por id
router.get('/:id', controller.getPrestadorById);

router.put('/aceitar-solicitacao/:id', controller.aceitarSolicitacao);

router.put('/recusar-solicitacao/:id', controller.recusarSolicitacao);

router.put('/completar-solicitacao/:id', controller.completarSolicitacao);

// Atualizar
router.put('/:id', controller.updatePrestador);

// Excluir
router.delete('/:id', controller.deletePrestador);

module.exports = router;
