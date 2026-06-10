const SOLICITACOES_API_URL = 'http://localhost:3000/prestadores';

// Funções para gerenciar solicitações do prestador
function showSolicitacoes() {
  if (typeof hideAllScreens === 'function') {
    hideAllScreens();
    document.getElementById('solicitacoesScreen').classList.remove('hidden');
    loadSolicitacoes();
  } else {
    alert('Função hideAllScreens não disponível');
  }
}

async function loadSolicitacoes(status = '') {
  const prestador = JSON.parse(localStorage.getItem('prestador'));
  if (!prestador || !prestador.id_prestador) {
    document.getElementById('solicitacoesList').innerHTML = '<p>Prestador não autenticado.</p>';
    return;
  }

  try {
    let url = `${SOLICITACOES_API_URL}/solicitacoes/${prestador.id_prestador}`;
    if (status) url += `?status=${status}`;

    const res = await fetch(url);
    if (!res.ok) {
      document.getElementById('solicitacoesList').innerHTML = '<p>Erro ao carregar solicitações.</p>';
      return;
    }

    const solicitacoes = await res.json();
    renderSolicitacoes(solicitacoes);
  } catch (err) {
    console.error('Erro ao carregar solicitações:', err);
    document.getElementById('solicitacoesList').innerHTML = '<p>Erro de conexão.</p>';
  }
}

function renderSolicitacoes(solicitacoes) {
  const container = document.getElementById('solicitacoesList');
  
  if (!solicitacoes || solicitacoes.length === 0) {
    container.innerHTML = '<p>Nenhuma solicitação encontrada.</p>';
    return;
  }

  container.innerHTML = '';
  solicitacoes.forEach(sol => {
    const div = document.createElement('div');
    div.className = 'solicitacao-card';
    div.innerHTML = `
      <div class="solicitacao-header">
        <strong>${sol.cliente_nome}</strong>
        <span class="status-badge status-${sol.status_solicitacao}">${sol.status_solicitacao}</span>
      </div>
      <p><strong>Serviço:</strong> ${sol.descricao}</p>
      <p><strong>Data/Hora:</strong> ${sol.data} às ${sol.hora}</p>
      <p><strong>Telefone:</strong> ${sol.cliente_telefone}</p>
      <p><strong>Localização:</strong> ${sol.cliente_cidade}</p>
      <div class="solicitacao-actions">
        ${sol.status_solicitacao === 'pendente' ? `
          <button class="btn-primary btn-small" onclick="aceitarSolicitacao(${sol.id_agendamento})">Aceitar</button>
          <button class="btn-secondary btn-small" onclick="recusarSolicitacao(${sol.id_agendamento})">Recusar</button>
        ` : ''}
        ${sol.status_solicitacao === 'aceito' ? `
          <button class="btn-primary btn-small" onclick="completarSolicitacao(${sol.id_agendamento})">Concluir Serviço</button>
        ` : ''}
      </div>
    `;
    container.appendChild(div);
  });
}

async function aceitarSolicitacao(idAgendamento) {
  try {
    const res = await fetch(`${SOLICITACOES_API_URL}/aceitar-solicitacao/${idAgendamento}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      alert('Solicitação aceita com sucesso!');
      loadSolicitacoes();
    } else {
      alert('Erro ao aceitar solicitação');
    }
  } catch (err) {
    console.error(err);
    alert('Erro de conexão');
  }
}

async function recusarSolicitacao(idAgendamento) {
  if (!confirm('Tem certeza que deseja recusar esta solicitação?')) return;

  try {
    const res = await fetch(`${SOLICITACOES_API_URL}/recusar-solicitacao/${idAgendamento}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      alert('Solicitação recusada');
      loadSolicitacoes();
    } else {
      alert('Erro ao recusar solicitação');
    }
  } catch (err) {
    console.error(err);
    alert('Erro de conexão');
  }
}

async function completarSolicitacao(idAgendamento) {
  if (!confirm('Marcar serviço como concluído?')) return;

  try {
    const res = await fetch(`${SOLICITACOES_API_URL}/completar-solicitacao/${idAgendamento}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      alert('Serviço marcado como concluído!');
      loadSolicitacoes();
    } else {
      alert('Erro ao completar solicitação');
    }
  } catch (err) {
    console.error(err);
    alert('Erro de conexão');
  }
}

// Listener para filtro de status
if (document.getElementById('filterStatus')) {
  document.getElementById('filterStatus').addEventListener('change', (e) => {
    loadSolicitacoes(e.target.value);
  });
}
