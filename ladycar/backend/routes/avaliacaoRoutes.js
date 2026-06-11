const express = require('express');
const router = express.Router();

const avaliacaoController = require('../controllers/avaliacaoController');

router.post('/', avaliacaoController.criarAvaliacao);

module.exports = router;