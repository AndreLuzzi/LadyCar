console.log('PRESTADOR JS CARREGADO');

const PRESTADOR_API_URL = 'http://localhost:3000/prestadores';

function navigateToPrestadorProfile() {
  console.log('navigateToPrestadorProfile called');
  if (typeof showPrestadorProfile === 'function') {
    showPrestadorProfile();
    if (typeof renderPrestadorProfile === 'function') renderPrestadorProfile();
    return;
  }
 
  const screen = document.getElementById('prestadorProfileScreen');
  if (screen) {
    if (typeof hideAllScreens === 'function') hideAllScreens();
    screen.classList.remove('hidden');
    if (typeof renderPrestadorProfile === 'function') renderPrestadorProfile();
    return;
  }

  console.log('Redirecionando para perfilPrestador.html fallback');
  window.location.href = 'perfilPrestador.html';
}

// Cadastro de prestador
if (document.getElementById('cadastroPrestadorForm')) {
  document.getElementById('cadastroPrestadorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      nome: document.getElementById('nome').value,
      cpf: document.getElementById('cpf').value,
      telefone: document.getElementById('telefone').value,
      email: document.getElementById('emailPrestadorCadastro').value,
      senha: document.getElementById('senhaPrestadorCadastro').value,
      categoria: document.getElementById('categoria').value,
      descricao: document.getElementById('descricao').value,
      cidade: document.getElementById('cidade').value,
      estado: document.getElementById('estado').value,

      cep: document.getElementById('cep').value,
      endereco: document.getElementById('endereco').value,
      numero: document.getElementById('numero').value,
      bairro: document.getElementById('bairro').value,
      complemento: document.getElementById('complemento').value
    };
    
    try {
      const res = await fetch(PRESTADOR_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log('prestador register response', res.status, data);
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
      email: document.getElementById('emailPrestadorLogin').value,
      senha: document.getElementById('senhaPrestadorLogin').value,
    };
    try {
      const res = await fetch(PRESTADOR_API_URL + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log('prestador login response', res.status, data);
      if (!res.ok) return alert(data.error || 'Erro ao autenticar');
      // salvar sessao simples
      localStorage.setItem('prestador', JSON.stringify(data));
        if (typeof showSolicitacoes === 'function') {
          showSolicitacoes();
        } else {
          navigateToPrestadorProfile();
        }
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar com o servidor');
    }
  });
}

function renderPrestadorProfile() {
  const content = document.getElementById('perfilContent');
  if (!content) return;

  const user = JSON.parse(localStorage.getItem('prestador'));
  if (!user) {
    content.innerHTML = '<p>Não autenticado. <a href="#" id="linkToPrestadorLogin">Entrar</a></p>';
    const l = document.getElementById('linkToPrestadorLogin');
    if (l) l.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof showPrestadorLogin === 'function') showPrestadorLogin();
      else window.location.href = 'loginPrestador.html';
    });
  } else {
    content.innerHTML = `
  <p><strong>Nome:</strong> ${user.nome}</p>
  <p><strong>Email:</strong> ${user.email}</p>
  <p><strong>Categoria:</strong> ${user.categoria}</p>
  <p><strong>Cidade/Estado:</strong> ${user.cidade || ''} / ${user.estado || ''}</p>
  <p><strong>Descrição:</strong> ${user.descricao || ''}</p>

  <hr>

  <p>
    <strong>Avaliação Média:</strong>
    ${user.avaliacao || 0} ⭐
  </p>
`;
  }
}

// Perfil prestador
if (document.getElementById('perfilContent')) {
  renderPrestadorProfile();
  const sairBtn = document.getElementById('sairBtn');
  if (sairBtn) {
    sairBtn.addEventListener('click', () => {
      localStorage.removeItem('prestador');
      if (typeof showPrestadorLogin === 'function') showPrestadorLogin();
      else window.location.href = 'loginPrestador.html';
    });
  }
}

// Listar prestadores
if (document.getElementById('prestadoresList')) {
  const listEl = document.getElementById('prestadoresList');
  const filter = document.getElementById('filterCategoria');

  async function loadPrestadores(categoria) {
    try {
      let url = PRESTADOR_API_URL;
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
