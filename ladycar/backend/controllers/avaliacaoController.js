const avaliacaoModel = require('../models/avaliacaoModel');

async function criarAvaliacao(req, res) {
    try {

        const {
            id_agendamento,
            id_cliente,
            id_prestador,
            nota,
            comentario
        } = req.body;

        const avaliacaoExistente = 
            await avaliacaoModel.buscarPorAgendamento(
                id_agendamento
            );

        if (avaliacaoExistente) {

            return res.status(400).json({
                error: 'Este serviço já foi avaliado.'
        });

    }

        if (!nota || nota < 1 || nota > 5) {
            return res.status(400).json({
                error: 'A nota deve estar entre 1 e 5'
            });
        }

        const avaliacao = await avaliacaoModel.criarAvaliacao({
            id_agendamento,
            id_cliente,
            id_prestador,
            nota,
            comentario
        });

        const media = await avaliacaoModel.calcularMediaPrestador(id_prestador);

        await avaliacaoModel.atualizarMediaPrestador(
            id_prestador,
            Number(media).toFixed(1)
        );

        res.status(201).json({
            message: 'Avaliação salva com sucesso',
            avaliacao
        });

    } catch (error) {

        console.error('Erro ao criar avaliação:', error);

        res.status(500).json({
            error: 'Erro ao salvar avaliação'
        });

    }
}

async function listarAvaliacoesPrestador(req, res) {
    try {

        const { id } = req.params;

        const avaliacoes =
            await avaliacaoModel.listarAvaliacoesPrestador(id);

        res.json(avaliacoes);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Erro ao buscar avaliações'
        });

    }
}

module.exports = {
    criarAvaliacao,
    listarAvaliacoesPrestador
};