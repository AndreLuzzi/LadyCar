const pool = require('../db');

async function criarAvaliacao(avaliacao) {
    const result = await pool.query(
        `
        INSERT INTO avaliacao
        (
            id_agendamento,
            id_cliente,
            id_prestador,
            nota,
            comentario
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *
        `,
        [
            avaliacao.id_agendamento,
            avaliacao.id_cliente,
            avaliacao.id_prestador,
            avaliacao.nota,
            avaliacao.comentario
        ]
    );

    return result.rows[0];
}

async function calcularMediaPrestador(idPrestador) {
    const result = await pool.query(
        `
        SELECT AVG(nota) AS media
        FROM avaliacao
        WHERE id_prestador = $1
        `,
        [idPrestador]
    );

    return result.rows[0].media;
}

async function atualizarMediaPrestador(idPrestador, media) {
    await pool.query(
        `
        UPDATE prestador_servico
        SET avaliacao = $1
        WHERE id_prestador = $2
        `,
        [media, idPrestador]
    );
}

async function listarAvaliacoesPrestador(idPrestador) {

    const result = await pool.query(
        `
        SELECT
            a.nota,
            a.comentario,
            a.data_avaliacao,
            c.nome AS cliente_nome

        FROM avaliacao a

        INNER JOIN cliente c
            ON c.id_cliente = a.id_cliente

        WHERE a.id_prestador = $1

        ORDER BY a.data_avaliacao DESC
        `,
        [idPrestador]
    );

    return result.rows;
}

async function buscarPorAgendamento(idAgendamento) {

    const result = await pool.query(
        `
        SELECT *
        FROM avaliacao
        WHERE id_agendamento = $1
        `,
        [idAgendamento]
    );

    return result.rows[0];
}

module.exports = {
    criarAvaliacao,
    calcularMediaPrestador,
    atualizarMediaPrestador,
    listarAvaliacoesPrestador,
    buscarPorAgendamento,
};