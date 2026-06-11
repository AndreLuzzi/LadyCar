const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./db");
const prestadorHelper = require("./helpers/prestadorHelper");

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com PostgreSQL: utilizamos o pool central em './db.js' (importado acima)

// Teste inicial
app.get("/", (req, res) => {
  res.send("Servidor backend rodando 🚗🌸");
});

// Rota de cadastro COMPLETO
app.post("/register", async (req, res) => {
  // ⭐️ ALTERAÇÃO: Recebendo todos os novos campos
  const { nome, email, senha, documento, telefone, cep, endereco, numero, bairro, complemento, cidade_estado } = req.body;

  try {
    // Verificar se o email já existe
    const checkEmail = await pool.query("SELECT * FROM cliente WHERE email=$1", [email]);
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ error: "E-mail já cadastrado" });
    }
    
    // Hash da senha
    const hash = await bcrypt.hash(senha, 10);

    // ⭐️ ALTERAÇÃO: Inserir TODOS os novos campos no banco
    const query = `
      INSERT INTO cliente 
      (nome, email, senha, documento, telefone, cep, endereco, numero, bairro, complemento, cidade_estado) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING id_cliente, nome, email, documento, telefone, cep, endereco, numero, bairro, complemento, cidade_estado
    `;
    const result = await pool.query(query, 
      [nome, email, hash, documento, telefone, cep, endereco, numero, bairro, complemento, cidade_estado]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro no cadastro:", err);
    res.status(500).json({ error: "Erro ao cadastrar" });
  }
});

// Rota de login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    // SELECT * garante que todos os campos (incluindo os novos) são buscados
    const result = await pool.query("SELECT * FROM cliente WHERE email=$1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) {
      return res.status(400).json({ error: "Senha incorreta" });
    }

    // ⭐️ ALTERAÇÃO: Incluir TODOS os campos na resposta JSON para o frontend (Perfil)
    res.json({ 
        id: user.id_cliente, 
        nome: user.nome, 
        email: user.email,
        documento: user.documento,
        telefone: user.telefone,
        cep: user.cep,
        endereco: user.endereco,
        numero: user.numero,
        bairro: user.bairro,
        complemento: user.complemento,
        cidade_estado: user.cidade_estado
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro ao autenticar" });
  }
});

// ⭐️ NOVA Rota para ATUALIZAR o cadastro COMPLETO (Usada na tela de Perfil)
app.put("/update_profile/:id_cliente", async (req, res) => {
  const { id_cliente } = req.params;
  const { nome, email, documento, telefone, cep, endereco, numero, bairro, complemento, cidade_estado } = req.body;

  try {
    const query = `
      UPDATE cliente SET 
        nome = $1, 
        email = $2, 
        documento = $3, 
        telefone = $4, 
        cep = $5, 
        endereco = $6, 
        numero = $7, 
        bairro = $8, 
        complemento = $9, 
        cidade_estado = $10
      WHERE id_cliente = $11
      RETURNING id_cliente, nome, email, documento, telefone, cep, endereco, numero, bairro, complemento, cidade_estado
    `;
    
    const result = await pool.query(query, 
      [nome, email, documento, telefone, cep, endereco, numero, bairro, complemento, cidade_estado, id_cliente]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    res.status(500).json({ error: "Erro ao atualizar perfil" });
  }

  
});

// ⭐️ NOVA Rota para EXCLUIR a conta do cliente (Usada na tela de Perfil)
app.delete("/delete_account/:id_cliente", async (req, res) => {
  const { id_cliente } = req.params;

  try {
    // ⚠️ IMPORTANTE: Deleta primeiro todos os agendamentos do cliente
    // Se o agendamento tiver uma chave estrangeira, isso deve ser feito primeiro.
    await pool.query("DELETE FROM agendamento WHERE id_cliente = $1", [id_cliente]);
    
    // Deleta o cliente
    const result = await pool.query("DELETE FROM cliente WHERE id_cliente = $1 RETURNING id_cliente", [id_cliente]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({ message: "Conta excluída com sucesso." });
  } catch (err) {
    console.error("Erro ao excluir conta:", err);
    res.status(500).json({ error: "Erro ao excluir conta" });
  }
});

// Rota para listar todos os serviços disponíveis (para o carrinho)
app.get("/services", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id_servico, nome_servico, descricao_servico FROM servicos ORDER BY nome_servico"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar serviços:", err);
    res.status(500).json({ error: "Erro ao buscar serviços" });
  }
});

// Rota de agendamento - NOVO: com roteamento automático de prestador
app.post("/agendar", async (req, res) => {
  const { id_cliente, data, hora, descricao } = req.body;

  try {
    // 1. Buscar dados do cliente (para obter cidade)
    const clienteRes = await pool.query(
      "SELECT cidade_estado FROM cliente WHERE id_cliente=$1",
      [id_cliente]
    );
    if (clienteRes.rows.length === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }
    const cidade = clienteRes.rows[0].cidade_estado;

    // 2. Determinar categoria do serviço pela descrição
    // Aqui fazemos um mapeamento simples; em produção, teria id_servico
    let categoria = "Mecânico"; // padrão
    if (descricao.toLowerCase().includes("pneu")) categoria = "Borracheiro";
    if (descricao.toLowerCase().includes("bateria")) categoria = "Eletricista";
    if (descricao.toLowerCase().includes("lavag")) categoria = "Lavagem";
    if (descricao.toLowerCase().includes("fusív")) categoria = "Eletricista";

    // 3. Buscar prestador mais próximo
    let prestador = await prestadorHelper.findNearestPrestador(categoria, cidade);
    if (!prestador) {
      prestador = await prestadorHelper.findPrestadorByCategoria(categoria);
    }

    // 4. Inserir agendamento (com ou sem prestador)
    const id_prestador = prestador ? prestador.id_prestador : null;
    const status_solicitacao = prestador ? "pendente" : "sem_prestador";

    const query = `
      INSERT INTO agendamento 
      (id_cliente, data, hora, descricao, id_prestador, status_solicitacao, status) 
      VALUES ($1, $2, $3, $4, $5, $6, 'Pendente') 
      RETURNING *
    `;
    const result = await pool.query(query, [id_cliente, data, hora, descricao, id_prestador, status_solicitacao]);

    res.json({
      ...result.rows[0],
      prestador_atribuido: prestador ? `${prestador.nome} (${prestador.categoria})` : "Nenhum prestador disponível"
    });
  } catch (err) {
    console.error("Erro ao agendar:", err);
    res.status(500).json({ error: "Erro ao criar agendamento" });
  }
});

// Rota para listar agendamentos de um cliente com dados do prestador atribuído
app.get("/agendamentos/:id_cliente", async (req, res) => {
  const { id_cliente } = req.params;

  try {
    const result = await pool.query(
      `SELECT a.*, p.nome AS prestador_nome, p.categoria AS prestador_categoria, p.telefone AS prestador_telefone, p.cidade AS prestador_cidade
       FROM agendamento a
       LEFT JOIN prestador_servico p ON a.id_prestador = p.id_prestador
       WHERE a.id_cliente = $1
       ORDER BY a.data DESC, a.hora DESC`,
      [id_cliente]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar agendamentos:", err);
    res.status(500).json({ error: "Erro ao listar agendamentos" });
  }
});

// Rota detalhada para obter um agendamento específico e seu prestador atribuído
app.get("/agendamento/:id_agendamento", async (req, res) => {
  const { id_agendamento } = req.params;

  try {
    const result = await pool.query(
      `SELECT a.*, p.nome AS prestador_nome, p.categoria AS prestador_categoria, p.telefone AS prestador_telefone, p.cidade AS prestador_cidade
       FROM agendamento a
       LEFT JOIN prestador_servico p ON a.id_prestador = p.id_prestador
       WHERE a.id_agendamento = $1`,
      [id_agendamento]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao buscar agendamento:", err);
    res.status(500).json({ error: "Erro ao buscar agendamento" });
  }
});

app.delete("/cancelar-agendamento/:id_agendamento", async (req, res) => {
  const { id_agendamento } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM agendamento WHERE id_agendamento=$1 RETURNING *",
      [id_agendamento]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }

    res.json({ message: "Agendamento cancelado com sucesso" });
  } catch (err) {
    console.error("Erro ao cancelar agendamento:", err);
    res.status(500).json({ error: "Erro ao cancelar agendamento" });
  }
});

app.put("/editar-agendamento/:id_agendamento", async (req, res) => {
  const { id_agendamento } = req.params;
  const { data, hora } = req.body;

  try {
    const result = await pool.query(
      "UPDATE agendamento SET data=$1, hora=$2 WHERE id_agendamento=$3 RETURNING *",
      [data, hora, id_agendamento]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao editar agendamento:", err);
    res.status(500).json({ error: "Erro ao editar agendamento" });
  }
});

// ⭐️ NOVO: Endpoints de Solicitações para Prestador ⭐️
// Listar solicitações de um prestador (pendentes, aceitas, concluídas)
app.get("/solicitacoes/:id_prestador", async (req, res) => {
  const { id_prestador } = req.params;
  const { status } = req.query; // opcional: 'pendente', 'aceito', 'concluido', 'recusado'

  try {
    let query = `
      SELECT a.*, c.nome as cliente_nome, c.telefone as cliente_telefone, c.cidade_estado as cliente_cidade
      FROM agendamento a
      JOIN cliente c ON a.id_cliente = c.id_cliente
      WHERE a.id_prestador = $1
    `;
    const params = [id_prestador];

    if (status) {
      query += " AND a.status_solicitacao = $2";
      params.push(status);
    }

    query += " ORDER BY a.data ASC, a.hora ASC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar solicitações:", err);
    res.status(500).json({ error: "Erro ao listar solicitações" });
  }
});

// Aceitar solicitação
app.put("/aceitar-solicitacao/:id_agendamento", async (req, res) => {
  const { id_agendamento } = req.params;

  try {
    const result = await pool.query(
      "UPDATE agendamento SET status_solicitacao = 'aceito' WHERE id_agendamento = $1 RETURNING *",
      [id_agendamento]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Solicitação não encontrada" });
    }

    res.json({ message: "Solicitação aceita", agendamento: result.rows[0] });
  } catch (err) {
    console.error("Erro ao aceitar solicitação:", err);
    res.status(500).json({ error: "Erro ao aceitar solicitação" });
  }
});

// Recusar solicitação
app.put("/recusar-solicitacao/:id_agendamento", async (req, res) => {
  const { id_agendamento } = req.params;

  try {
    // Recusar = limpar id_prestador e marcar como sem_prestador, assim roteará para outro
    const result = await pool.query(
      "UPDATE agendamento SET id_prestador = NULL, status_solicitacao = 'recusado' WHERE id_agendamento = $1 RETURNING *",
      [id_agendamento]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Solicitação não encontrada" });
    }

    res.json({ message: "Solicitação recusada", agendamento: result.rows[0] });
  } catch (err) {
    console.error("Erro ao recusar solicitação:", err);
    res.status(500).json({ error: "Erro ao recusar solicitação" });
  }
});

// Completar solicitação (serviço realizado)
app.put("/completar-solicitacao/:id_agendamento", async (req, res) => {
  const { id_agendamento } = req.params;

  try {
    const result = await pool.query(
      "UPDATE agendamento SET status_solicitacao = 'concluido' WHERE id_agendamento = $1 RETURNING *",
      [id_agendamento]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Solicitação não encontrada" });
    }

    res.json({ message: "Solicitação marcada como concluída", agendamento: result.rows[0] });
  } catch (err) {
    console.error("Erro ao completar solicitação:", err);
    res.status(500).json({ error: "Erro ao completar solicitação" });
  }
});

// ⭐️ NOVO: Rota de Esqueceu a Senha ⭐️
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query("SELECT id_cliente, nome FROM cliente WHERE email=$1", [email]);
    
    // 1. Segurança: Sempre retorna sucesso para o cliente, mesmo se o e-mail não existir.
    if (result.rows.length === 0) {
        // Em produção, você logaria isso, mas para o cliente retorna sucesso.
        return res.status(200).json({ message: "Se o e-mail estiver cadastrado, as instruções foram enviadas." });
    }

    const user = result.rows[0];
    
    // 2. Aqui, em uma aplicação real, você faria:
    // a) **Geração de Token:** Gerar um token único e seguro (ex: JWT ou token aleatório).
    // b) **Salvar no DB:** Salvar este token no banco de dados, associado ao user.id_cliente, com um prazo de validade (ex: 1 hora).
    // c) **Envio de E-mail:** Usar um serviço de envio (como Nodemailer, SendGrid, etc.) para enviar um e-mail para 'user.email' contendo um link de redefinição (ex: 'http://seuapp.com/reset?token=SEU_TOKEN').

    // Por enquanto, apenas simulamos o envio:
    console.log(`[SIMULAÇÃO] Instruções de recuperação enviadas para: ${user.nome} (${email})`);

    // Retorna o sucesso.
    res.status(200).json({ message: "Se o e-mail estiver cadastrado, as instruções foram enviadas." });

  } catch (err) {
    console.error("Erro na rota /forgot-password:", err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Inicia o servidor
// Import prestador routes
const prestadorRoutes = require("./routes/prestadorRoutes");
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');
app.use("/prestadores", prestadorRoutes);
app.use('/avaliacoes', avaliacaoRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});