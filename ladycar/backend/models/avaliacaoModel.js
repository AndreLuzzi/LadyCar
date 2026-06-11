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

module.exports = {
    criarAvaliacao,
    calcularMediaPrestador,
    atualizarMediaPrestador
};