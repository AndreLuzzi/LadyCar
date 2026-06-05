const API_URL = 'http://localhost:3000/prestadores';

// Cadastro de prestador
if (document.getElementById('cadastroPrestadorForm')) {
  document.getElementById('cadastroPrestadorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      nome: document.getElementById('nome').value,
      cpf: document.getElementById('cpf').value,
      telefone: document.getElementById('telefone').value,
      email: document.getElementById('email').value,
      senha: document.getElementById('senha').value,
      categoria: document.getElementById('categoria').value,
      descricao: document.getElementById('descricao').value,
      cidade: document.getElementById('cidade').value,
      estado: document.getElementById('estado').value,
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error || 'Erro ao cadastrar');
      alert('Cadastro realizado com sucesso');
      if (typeof showPrestadorLogin === 'function') {
        showPrestadorLogin();
      } else {
        window.location.href = 'loginPrestador.html';
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar com o servidor');
    }
  });
}

// Login prestador
if (document.getElementById('loginPrestadorForm')) {
  document.getElementById('loginPrestadorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      email: document.getElementById('email').value,
      senha: document.getElementById('senha').value,
    };
    try {
      const res = await fetch(API_URL + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error || 'Erro ao autenticar');
      // salvar sessao simples
      localStorage.setItem('prestador', JSON.stringify(data));
      if (typeof showPrestadorProfile === 'function') {
        showPrestadorProfile();
      } else {
        window.location.href = 'perfilPrestador.html';
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar com o servidor');
    }
  });
}

// Perfil prestador
if (document.getElementById('perfilContent')) {
  const user = JSON.parse(localStorage.getItem('prestador'));
  const content = document.getElementById('perfilContent');
  if (!user) {
    content.innerHTML = '<p>Não autenticado. <a href="#" id="linkToPrestadorLogin">Entrar</a></p>';
    const l = document.getElementById('linkToPrestadorLogin');
    if (l) l.addEventListener('click', (e) => { e.preventDefault(); if (typeof showPrestadorLogin === 'function') showPrestadorLogin(); else window.location.href = 'loginPrestador.html'; });
  } else {
    content.innerHTML = `
      <p><strong>Nome:</strong> ${user.nome}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Categoria:</strong> ${user.categoria}</p>
      <p><strong>Cidade/Estado:</strong> ${user.cidade || ''} / ${user.estado || ''}</p>
      <p><strong>Descrição:</strong> ${user.descricao || ''}</p>
      <button id="verSolicitacoesBtn" class="btn-primary full-width" style="margin-top:15px;">Ver Solicitações</button>
    `;
    
    const btnSolicitacoes = document.getElementById('verSolicitacoesBtn');
    if (btnSolicitacoes) {
      btnSolicitacoes.addEventListener('click', () => {
        if (typeof showSolicitacoes === 'function') showSolicitacoes();
        else alert('Função showSolicitacoes não disponível');
      });
    }
  }

  document.getElementById('sairBtn').addEventListener('click', () => {
    localStorage.removeItem('prestador');
    if (typeof showPrestadorLogin === 'function') showPrestadorLogin(); else window.location.href = 'loginPrestador.html';
  });
}

// Listar prestadores
if (document.getElementById('prestadoresList')) {
  const listEl = document.getElementById('prestadoresList');
  const filter = document.getElementById('filterCategoria');

  async function loadPrestadores(categoria) {
    try {
      let url = API_URL;
      if (categoria) url += '/categoria/' + encodeURIComponent(categoria);
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) return listEl.innerHTML = '<p>Erro ao carregar prestadores</p>';
      if (data.length === 0) return listEl.innerHTML = '<p>Nenhum prestador encontrado.</p>';
      listEl.innerHTML = '';
      data.forEach(p => {
        const div = document.createElement('div');
        div.className = 'card service-item';
        div.innerHTML = `<h4>${p.nome}</h4><p>${p.categoria} • ${p.cidade || ''}/${p.estado || ''}</p><p>${p.descricao || ''}</p>`;
        listEl.appendChild(div);
      });
    } catch (err) {
      console.error(err);
      listEl.innerHTML = '<p>Erro de conexão</p>';
    }
  }

  filter.addEventListener('change', () => loadPrestadores(filter.value));
  loadPrestadores('');
}
