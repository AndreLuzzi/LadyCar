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

function showPrestadorAvaliacoes() {

    hideAllScreens();

    document
        .getElementById(
            'prestadorAvaliacoesScreen'
        )
        .classList.remove('hidden');

    loadPrestadorAvaliacoes();

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

  const user = JSON.parse(localStorage.getItem('prestador'));

   if (!user) {
    return;
}

  document.getElementById('prestadorProfileName').textContent =
    user.nome || 'Prestador';

  document.getElementById('prestadorAvaliacaoMedia').innerHTML =
    `⭐ ${user.avaliacao || 0} / 5.0`;

  document.getElementById('prestadorNome').value =
    user.nome || '';

  document.getElementById('prestadorEmail').value =
    user.email || '';

  document.getElementById('prestadorTelefone').value =
    user.telefone || '';

  document.getElementById('prestadorCpf').value =
    user.cpf || '';

  document.getElementById('prestadorCategoria').value =
    user.categoria || '';

  document.getElementById('prestadorDescricao').value =
    user.descricao || '';

  document.getElementById('prestadorCep').value =
    user.cep || '';

  document.getElementById('prestadorEndereco').value =
    user.endereco || '';

  document.getElementById('prestadorNumero').value =
    user.numero || '';

  document.getElementById('prestadorBairro').value =
    user.bairro || '';

  document.getElementById('prestadorComplemento').value =
    user.complemento || '';

  document.getElementById('prestadorCidade').value =
    user.cidade || '';

  document.getElementById('prestadorEstado').value =
    user.estado || '';
}

async function loadPrestadorAvaliacoes() {

    const prestador =
        JSON.parse(localStorage.getItem('prestador'));

    if (!prestador) return;

    try {

        const res = await fetch(
            `${API_URL}/avaliacoes/prestador/${prestador.id_prestador}`
        );

        const avaliacoes = await res.json();
        const totalAvaliacoes = avaliacoes.length;
        const lista =
            document.getElementById(
                'listaAvaliacoesPrestador'
            );

        const media =
            document.getElementById(
                'prestadorMediaTexto'
            );

        media.textContent =
            `${prestador.avaliacao || 0} / 5.0`;
          
            document.getElementById('prestadorTotalAvaliacoes').textContent =`Total de avaliações: ${totalAvaliacoes}`;

        if (!avaliacoes.length) {

            lista.innerHTML =
                '<p>Nenhuma avaliação recebida.</p>';

            return;
        }

        lista.innerHTML = '';

        avaliacoes.forEach(av => {

                      lista.innerHTML += `
              <div class="servico-item">

                  <p>
                      <strong>
                          Cliente:
                      </strong>

                      ${av.cliente_nome}
                  </p>

                  <p>
                      ${'⭐'.repeat(av.nota)}
                  </p>

                  <p>
                      ${av.comentario || 'Sem comentário'}
                  </p>

                  <p>
                      ${new Date(
                          av.data_avaliacao
                      ).toLocaleDateString('pt-BR')}
                  </p>

              </div>
          `;

        });

    } catch (error) {

        console.error(error);

    }

}

// Perfil prestador
if (document.getElementById('prestadorProfileScreen')) {

  renderPrestadorProfile();

  const sairBtn = document.getElementById('sairBtn');

  if (sairBtn) {

    sairBtn.addEventListener('click', () => {

      localStorage.removeItem('prestador');

      if (typeof showPrestadorLogin === 'function') {
        showPrestadorLogin();
      }

    });

  }

  const deleteBtn =
    document.getElementById('deletePrestadorBtn');

  if (deleteBtn) {

    deleteBtn.addEventListener('click', async () => {

      const confirmar = confirm(
        'Tem certeza que deseja excluir sua conta?'
      );

      if (!confirmar) return;

      const prestador =
        JSON.parse(
          localStorage.getItem('prestador')
        );

      try {

        const res = await fetch(
          `${PRESTADOR_API_URL}/${prestador.id_prestador}`,
          {
            method: 'DELETE'
          }
        );

        const data = await res.json();

        if (!res.ok) {

          return alert(
            data.error ||
            'Erro ao excluir conta'
          );

        }

        alert(
          'Conta excluída com sucesso.'
        );

        localStorage.removeItem(
          'prestador'
        );

        if (typeof showPrestadorLogin === 'function') {
          showPrestadorLogin();
        }

      } catch (error) {

        console.error(error);

        alert(
          'Erro ao conectar ao servidor.'
        );

      }

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

const prestadorUpdateForm = document.getElementById('prestadorUpdateForm');

if (prestadorUpdateForm) {

  prestadorUpdateForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const prestador = JSON.parse(
      localStorage.getItem('prestador')
    );

    const body = {
      nome: document.getElementById('prestadorNome').value,
      cpf: document.getElementById('prestadorCpf').value,
      telefone: document.getElementById('prestadorTelefone').value,
      email: document.getElementById('prestadorEmail').value,
      categoria: document.getElementById('prestadorCategoria').value,
      descricao: document.getElementById('prestadorDescricao').value,

      cidade: document.getElementById('prestadorCidade').value,
      estado: document.getElementById('prestadorEstado').value,

      cep: document.getElementById('prestadorCep').value,
      endereco: document.getElementById('prestadorEndereco').value,
      numero: document.getElementById('prestadorNumero').value,
      bairro: document.getElementById('prestadorBairro').value,
      complemento: document.getElementById('prestadorComplemento').value,

      avaliacao: prestador.avaliacao,
      ativo: prestador.ativo
    };

    try {

      const response = await fetch(

        `${PRESTADOR_API_URL}/${prestador.id_prestador}`,

        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }

      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.error || 'Erro ao atualizar');

        return;
      }

      localStorage.setItem(
        'prestador',
        JSON.stringify(data)
      );

      alert('Alterações salvas com sucesso!');

      renderPrestadorProfile();

    } catch (error) {

      console.error(error);

      alert('Erro ao conectar com o servidor');

    }

  });

}

function somenteNumeros(idCampo) {

    const campo = document.getElementById(idCampo);

    if (!campo) return;

    campo.addEventListener('input', () => {

        campo.value = campo.value.replace(/\D/g, '');

    });

}

somenteNumeros('prestadorTelefone');
somenteNumeros('prestadorCpf');
somenteNumeros('prestadorCep');
somenteNumeros('prestadorNumero');

// =====================
// MÁSCARAS
// =====================
function mascaraCPF(campo) {
    campo.addEventListener('input', () => {

        let valor = campo.value.replace(/\D/g, '');

        valor = valor.substring(0, 11);

        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        campo.value = valor;

    });

}

function mascaraCEP(campo) {
    campo.addEventListener('input', () => {

        let valor = campo.value.replace(/\D/g, '');

        valor = valor.substring(0, 8);

        valor = valor.replace(/(\d{5})(\d)/, '$1-$2');

        campo.value = valor;

    });

}

function mascaraTelefone(campo) {
    campo.addEventListener('input', () => {

        let valor = campo.value.replace(/\D/g, '');

        valor = valor.substring(0, 11);

        valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');

        valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');

        campo.value = valor;

    });

}

function mascaraNumero(campo) {
    campo.addEventListener('input', () => {

        let valor = campo.value.replace(/\D/g, '');

        valor = valor.substring(0, 4);

        campo.value = valor;

    });

}

const cpfInput = document.getElementById('prestadorCpf');

if (cpfInput) {
    mascaraCPF(cpfInput);
}

const cepInput = document.getElementById('prestadorCep');

if (cepInput) {
    mascaraCEP(cepInput);
}

const telefoneInput = document.getElementById('prestadorTelefone');

if (telefoneInput) {
    mascaraTelefone(telefoneInput);
}

const numeroInput =
    document.getElementById('prestadorNumero');

if (numeroInput) {
    mascaraNumero(numeroInput);
}

const cpfCadastro = document.getElementById('cpf');

if (cpfCadastro) {
    mascaraCPF(cpfCadastro);
}

const telefoneCadastro = document.getElementById('telefone');

if (telefoneCadastro) {
    mascaraTelefone(telefoneCadastro);
}

const cepCadastro = document.getElementById('cep');

if (cepCadastro) {
    mascaraCEP(cepCadastro);
}

const numeroCadastro = document.getElementById('numero');

if (numeroCadastro) {
    mascaraNumero(numeroCadastro);
}
