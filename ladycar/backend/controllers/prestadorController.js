const bcrypt = require('bcrypt');
const model = require('../models/prestadorModel');

async function createPrestador(req, res) {
  try {
    const { nome, cpf, telefone, email, senha, categoria, descricao, cidade, estado } = req.body;

    console.log('Email recebido:', email);

    // checar email existente
    const existing = await model.findByEmail(email);

    console.log('Existing:', existing);
    
    if (existing) return res.status(400).json({ error: 'Email já cadastrado' });

    const hash = await bcrypt.hash(senha, 10);
    const prestador = await model.createPrestador({
      nome,
      cpf,
      telefone,
      email,
      senha: hash,
      categoria,
      descricao,
      cidade,
      estado,
      avaliacao: 0,
      ativo: true,
    });

    console.log(`Prestador criado: email=${email}, id=${prestador.id_prestador}`);
    res.status(201).json(prestador);
  } catch (err) {
    console.error('Erro createPrestador', err);
    res.status(500).json({ error: 'Erro ao criar prestador' });
  }
}

async function loginPrestador(req, res) {
  try {
    const { email, senha } = req.body;
    const user = await model.findByEmail(email);
    if (!user) {
      console.warn(`Tentativa login prestador falhou: email não encontrado -> ${email}`);
      return res.status(400).json({ error: 'Prestador não encontrado' });
    }

    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) {
      console.warn(`Tentativa login prestador falhou: senha incorreta -> ${email}`);
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    // don't return senha
    const { senha: _, ...safe } = user;
    console.log(`Prestador autenticado: email=${email}, id=${user.id_prestador}`);
    res.json(safe);
  } catch (err) {
    console.error('Erro loginPrestador', err);
    res.status(500).json({ error: 'Erro ao autenticar' });
  }
}

async function getPrestadorById(req, res) {
  try {
    const { id } = req.params;
    const prestador = await model.getPrestadorById(id);
    if (!prestador) return res.status(404).json({ error: 'Prestador não encontrado' });
    const { senha, ...safe } = prestador;
    res.json(safe);
  } catch (err) {
    console.error('Erro getPrestadorById', err);
    res.status(500).json({ error: 'Erro ao buscar prestador' });
  }
}

async function getPrestadoresByCategoria(req, res) {
  try {
    const { categoria } = req.params;
    const rows = await model.getPrestadoresByCategoria(categoria);
    res.json(rows.map(r => { const { senha, ...s } = r; return s; }));
  } catch (err) {
    console.error('Erro getPrestadoresByCategoria', err);
    res.status(500).json({ error: 'Erro ao buscar prestadores' });
  }
}

async function listPrestadores(req, res) {
  try {
    const rows = await model.listPrestadores();
    res.json(rows.map(r => { const { senha, ...s } = r; return s; }));
  } catch (err) {
    console.error('Erro listPrestadores', err);
    res.status(500).json({ error: 'Erro ao listar prestadores' });
  }
}

async function updatePrestador(req, res) {
  try {
    const { id } = req.params;
    const body = req.body;
    // prevent password updates here (se quiser, adicionar rota específica)
    const updated = await model.updatePrestador(id, body);
    if (!updated) return res.status(404).json({ error: 'Prestador não encontrado' });
    const { senha, ...safe } = updated;
    res.json(safe);
  } catch (err) {
    console.error('Erro updatePrestador', err);
    res.status(500).json({ error: 'Erro ao atualizar prestador' });
  }
}

async function deletePrestador(req, res) {
  try {
    const { id } = req.params;
    const deleted = await model.deletePrestador(id);
    if (!deleted) return res.status(404).json({ error: 'Prestador não encontrado' });
    res.json({ message: 'Prestador excluído', id: deleted.id_prestador });
  } catch (err) {
    console.error('Erro deletePrestador', err);
    res.status(500).json({ error: 'Erro ao excluir prestador' });
  }
}

async function getSolicitacoes(req, res) {
  try {
    const { id } = req.params;

    const rows = await model.getSolicitacoesByPrestador(id);

    res.json(rows);
  } catch (err) {
    console.error('Erro getSolicitacoes', err);
    res.status(500).json({ error: 'Erro ao buscar solicitações' });
  }
}

module.exports = {
  createPrestador,
  loginPrestador,
  getPrestadorById,
  getPrestadoresByCategoria,
  listPrestadores,
  updatePrestador,
  deletePrestador,
  getSolicitacoes,
};
