// Helper para buscar prestador mais próximo
const pool = require('../db');

async function findNearestPrestador(categoria, cidade) {
  try {
    // Busca prestador ativo na mesma categoria e cidade, ordem por avaliação
    const query = `
      SELECT * FROM prestador_servico 
      WHERE categoria = $1 
      AND cidade = $2 
      AND ativo = true
      ORDER BY avaliacao DESC, criado_em ASC
      LIMIT 1
    `;
    const result = await pool.query(query, [categoria, cidade]);
    return result.rows[0] || null;
  } catch (err) {
    console.error('Erro ao buscar prestador mais próximo:', err);
    return null;
  }
}

// Se não encontrar na mesma cidade, buscar por categoria apenas
async function findPrestadorByCategoria(categoria) {
  try {
    const query = `
      SELECT * FROM prestador_servico 
      WHERE categoria = $1 
      AND ativo = true
      ORDER BY avaliacao DESC, criado_em ASC
      LIMIT 1
    `;
    const result = await pool.query(query, [categoria]);
    return result.rows[0] || null;
  } catch (err) {
    console.error('Erro ao buscar prestador por categoria:', err);
    return null;
  }
}

module.exports = {
  findNearestPrestador,
  findPrestadorByCategoria,
};
