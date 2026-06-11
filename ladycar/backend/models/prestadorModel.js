const pool = require('../db');

async function createPrestador(prestador) {
  const query = `
    INSERT INTO prestador_servico
    (nome, cpf, telefone, email, senha, categoria, descricao, cidade, estado, avaliacao, ativo)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *
  `;
  const values = [
    prestador.nome,
    prestador.cpf,
    prestador.telefone,
    prestador.email,
    prestador.senha,
    prestador.categoria,
    prestador.descricao || null,
    prestador.cidade || null,
    prestador.estado || null,
    prestador.avaliacao || 0,
    prestador.ativo === undefined ? true : prestador.ativo,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

async function getPrestadorById(id) {
  const result = await pool.query(
    'SELECT * FROM prestador_servico WHERE id_prestador = $1',
    [id]
  );
  return result.rows[0];
}

async function getPrestadoresByCategoria(categoria) {
  const result = await pool.query(
    'SELECT * FROM prestador_servico WHERE categoria = $1 ORDER BY nome',
    [categoria]
  );
  return result.rows;
}

async function listPrestadores() {
  const result = await pool.query('SELECT * FROM prestador_servico ORDER BY nome');
  return result.rows;
}

async function updatePrestador(id, prestador) {
  const query = `
    UPDATE prestador_servico SET
      nome=$1, cpf=$2, telefone=$3, email=$4, categoria=$5, descricao=$6, cidade=$7, estado=$8, avaliacao=$9, ativo=$10
    WHERE id_prestador=$11
    RETURNING *
  `;
  const values = [
    prestador.nome,
    prestador.cpf,
    prestador.telefone,
    prestador.email,
    prestador.categoria,
    prestador.descricao || null,
    prestador.cidade || null,
    prestador.estado || null,
    prestador.avaliacao || 0,
    prestador.ativo === undefined ? true : prestador.ativo,
    id,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
}

async function deletePrestador(id) {
  const result = await pool.query('DELETE FROM prestador_servico WHERE id_prestador=$1 RETURNING *', [id]);
  return result.rows[0];
}

async function findByEmail(email) {
  const result = await pool.query(
    'SELECT * FROM prestador_servico WHERE LOWER(email)=LOWER($1)',
    [email]
  );
  return result.rows[0];
}

async function getSolicitacoesByPrestador(idPrestador) {

  const prestadorResult = await pool.query(
    `SELECT categoria
     FROM prestador_servico
     WHERE id_prestador = $1`,
    [idPrestador]
  );

  if (prestadorResult.rows.length === 0) {
    return [];
  }

  const categoria = prestadorResult.rows[0].categoria;

  let servicosPermitidos = [];

  if (categoria === 'Borracheiro') {
    servicosPermitidos = [
      'Calibragem de Pneus',
      'Reparo de Pneus'
    ];
  }

  else if (categoria === 'Lavagem') {
    servicosPermitidos = [
      'Lavagem a Seco',
      'Limpeza de Ar-Condicionado'
    ];
  }

  else if (categoria === 'Mecânico') {
    servicosPermitidos = [
      'Troca de Óleo',
      'Verificação de Nível de Fluídos'
    ];
  }

  const result = await pool.query(`
    SELECT
      a.*,
      c.nome AS cliente_nome,
      c.telefone AS cliente_telefone,
      c.cidade_estado AS cliente_cidade
    FROM agendamento a
    INNER JOIN cliente c
      ON c.id_cliente = a.id_cliente
    WHERE a.descricao = ANY($1)
    ORDER BY a.data_agendamento DESC
  `, [servicosPermitidos]);

  return result.rows;
}

async function aceitarSolicitacao(idAgendamento) {
  const result = await pool.query(
    `
    UPDATE agendamento
    SET status_solicitacao = 'aceito'
    WHERE id_agendamento = $1
    RETURNING *
    `,
    [idAgendamento]
  );

  return result.rows[0];
}

async function recusarSolicitacao(idAgendamento) {
  const result = await pool.query(
    `
    UPDATE agendamento
    SET status_solicitacao = 'recusado'
    WHERE id_agendamento = $1
    RETURNING *
    `,
    [idAgendamento]
  );

  return result.rows[0];
}

async function completarSolicitacao(idAgendamento) {
  const result = await pool.query(
    `
    UPDATE agendamento
    SET status_solicitacao = 'concluido'
    WHERE id_agendamento = $1
    RETURNING *
    `,
    [idAgendamento]
  );

  return result.rows[0];
}

module.exports = {
  createPrestador,
  getPrestadorById,
  getPrestadoresByCategoria,
  listPrestadores,
  updatePrestador,
  deletePrestador,
  findByEmail,
  getSolicitacoesByPrestador,
  aceitarSolicitacao,
  recusarSolicitacao,
  completarSolicitacao,
};

