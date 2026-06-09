const API_URL = "http://localhost:3000";

// ⭐️ NOVO: Variável global para guardar o serviço selecionado temporariamente (CRUCIAL PARA AGENDAMENTO)
let SELECTED_SERVICE = null;

// ⭐️ NOVA: Lista de serviços para pesquisa
let AVAILABLE_SERVICES = [];

// ⭐️ NOVO: Variável global para rastrear o agendamento em edição
let AGENDAMENTO_EDITANDO = null;

// ===================================
// FUNÇÕES DE EXIBIÇÃO DE TELA (Mantido)
// ===================================
function hideAllScreens() {
    document.querySelectorAll('.container, .app-screen').forEach(el => el.classList.add('hidden'));
}

function showLogin() {
  hideAllScreens();
  document.getElementById("loginScreen").classList.remove("hidden");
}

function showRegister() {
  hideAllScreens();
  document.getElementById("registerScreen").classList.remove("hidden");
}

function showMain() {
  hideAllScreens();
  document.getElementById("homeScreen").classList.remove("hidden");
}

function showServicos() {
  hideAllScreens();
  document.getElementById("servicosScreen").classList.remove("hidden");
  loadServicos();
}

function renderSearchResults(servicos) {
  const resultsDiv = document.getElementById("searchResults");
  if (!resultsDiv) return;

  if (!Array.isArray(servicos) || servicos.length === 0) {
    resultsDiv.innerHTML = "<p>Nenhum serviço disponível no momento.</p>";
    return;
  }

  resultsDiv.innerHTML = "";
  servicos.forEach(servico => {
    const item = document.createElement("div");
    item.className = "service-item";
    item.innerHTML = `
      <div>
        <strong>${servico.nome_servico}</strong>
        <p>${servico.descricao_servico || "Sem descrição"}</p>
      </div>
      <button class="service-button" type="button">Agendar</button>
    `;

    item.querySelector("button").addEventListener("click", () => {
      SELECTED_SERVICE = servico.nome_servico;
      showServiceDescription(servico.nome_servico);
    });

    resultsDiv.appendChild(item);
  });
}

function getNomeServico(servico) {
  if (!servico) return "";
  return (servico.nome_servico || servico.nome || servico.descricao || "").toString();
}

function normalizarTexto(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function getStatusBadge(status) {
  const normalized = String(status || '').toLowerCase();
  let label = 'Pendente';
  let cssClass = 'status-pendente';

  if (normalized === 'aceito') {
    label = 'Aceito';
    cssClass = 'status-aceito';
  } else if (normalized === 'concluido' || normalized === 'concluído') {
    label = 'Concluído';
    cssClass = 'status-concluido';
  } else if (normalized === 'recusado') {
    label = 'Recusado';
    cssClass = 'status-recusado';
  } else if (normalized === 'sem_prestador') {
    label = 'Sem prestador';
    cssClass = 'status-recusado';
  }

  return `<span class="status-badge ${cssClass}">${label}</span>`;
}

function showSearch() {
  hideAllScreens();
  document.getElementById("searchScreen").classList.remove("hidden");
  const input = document.getElementById("searchInput");
  input.value = "";
  document.getElementById("searchResults").innerHTML = "<p>Digite o nome do serviço para pesquisar.</p>";

  input.removeEventListener("input", onSearchInputChange);
  input.addEventListener("input", onSearchInputChange);

  loadServices().then(() => {
    if (AVAILABLE_SERVICES.length > 0) {
      renderSearchResults(AVAILABLE_SERVICES);
    } else {
      document.getElementById("searchResults").innerHTML = "<p>Nenhum serviço disponível para pesquisa.</p>";
    }
  }).catch(err => {
    console.error("Erro ao carregar serviços para pesquisa:", err);
    document.getElementById("searchResults").innerHTML = "<p>Erro ao carregar serviços para pesquisa.</p>";
  });
}

function onSearchInputChange(e) {
  const termo = e.target.value;
  pesquisarServicos(termo);
}

function pesquisarServicos(query) {
  const resultsDiv = document.getElementById("searchResults");
  if (!resultsDiv) return;

  const termo = String(query || "").trim();

  if (!termo) {
    renderSearchResults(AVAILABLE_SERVICES);
    return;
  }

  if (!Array.isArray(AVAILABLE_SERVICES) || AVAILABLE_SERVICES.length === 0) {
    resultsDiv.innerHTML = "<p>Carregando serviços...</p>";
    loadServices().then(() => pesquisarServicos(query));
    return;
  }

  const termoNormalizado = normalizarTexto(termo);
  const filtrados = AVAILABLE_SERVICES.filter(servico => {
    const nome = normalizarTexto(getNomeServico(servico));
    return nome.includes(termoNormalizado);
  });

  if (filtrados.length === 0) {
    resultsDiv.innerHTML = `<p>Nenhum serviço encontrado para "${query}".</p>`;
    return;
  }

  renderSearchResults(filtrados);
}

function showAgendarSelection() {
  hideAllScreens();
  document.getElementById("agendarSelectionScreen").classList.remove("hidden");
  loadServices();
}
// ⭐️ NOVA: Função para exibir a tela de Esqueci a Senha
function showForgotPassword() {
    hideAllScreens();
    document.getElementById("forgotPasswordScreen").classList.remove("hidden");
}

function showServiceDescription(serviceName) {
    // ⭐️ ATUALIZAÇÃO: Armazena o serviço selecionado globalmente
    SELECTED_SERVICE = serviceName;
    
    hideAllScreens();
    document.getElementById("serviceDescriptionScreen").classList.remove("hidden");
    
    document.getElementById("serviceNameBox").textContent = serviceName;
    document.getElementById("serviceDescriptionText").textContent = `Você está prestes a agendar o serviço de "${serviceName}". Por favor, clique em "Selecionar Serviço" para continuar com a data e hora.`;
}

// ⭐️ NOVO: Função para exibir a tela de Data/Hora (agendarScreen)
function showAgendarFinal() {
    if (!SELECTED_SERVICE) {
        alert("Nenhum serviço selecionado. Por favor, escolha um serviço primeiro.");
        return showAgendarSelection();
    }

    hideAllScreens();
    document.getElementById("agendarScreen").classList.remove("hidden");
    // Exibe o nome do serviço na tela de Data/Hora (assume ID 'agendandoServiceName' no index.html)
    document.getElementById("agendandoServiceName").textContent = `Serviço: ${SELECTED_SERVICE}`;
}

// ==============================
// Prestador (SPA) navigation
// ==============================
function showPrestadorLogin() {
    hideAllScreens();
    document.getElementById('prestadorLoginScreen').classList.remove('hidden');
}

function showPrestadorRegister() {
    hideAllScreens();
    document.getElementById('prestadorRegisterScreen').classList.remove('hidden');
}

function showPrestadorProfile() {
    hideAllScreens();
    document.getElementById('prestadorProfileScreen').classList.remove('hidden');
    // trigger prestador profile render if script created one
    if (typeof renderPrestadorProfile === 'function') renderPrestadorProfile();
}

function showPrestadorList() {
    hideAllScreens();
    document.getElementById('prestadorListScreen').classList.remove('hidden');
    // trigger list refresh (the prestador.js attaches a change listener)
    const f = document.getElementById('filterCategoria');
    if (f) f.dispatchEvent(new Event('change'));
}

function showSolicitacoes() {
    if (typeof loadSolicitacoes === 'function') {
        hideAllScreens();
        document.getElementById('solicitacoesScreen').classList.remove('hidden');
        loadSolicitacoes();
    } else {
        alert('Função loadSolicitacoes não disponível');
    }
}

// buttons
document.getElementById('btnPrestador') && document.getElementById('btnPrestador').addEventListener('click', (e) => { e.preventDefault(); showPrestadorLogin(); });
document.getElementById('goToPrestadorRegister') && document.getElementById('goToPrestadorRegister').addEventListener('click', (e) => { e.preventDefault(); showPrestadorRegister(); });
document.getElementById('backToPrestadorLogin') && document.getElementById('backToPrestadorLogin').addEventListener('click', (e) => { e.preventDefault(); showPrestadorLogin(); });
document.getElementById('backToClientLogin') && document.getElementById('backToClientLogin').addEventListener('click', (e) => { e.preventDefault(); showLogin(); });


function showProfile() {
    hideAllScreens();
    document.getElementById("profileScreen").classList.remove("hidden");
    loadUserProfile();
}

// ⭐️ NOVO: Mostrar tela de edição de agendamento
function showEditarAgendamento() {
    hideAllScreens();
    document.getElementById("editarAgendamentoScreen").classList.remove("hidden");
}

function abrirTelaEdicao(id_agendamento, descricao, data, hora) {
    console.log("Abrindo tela de edição:", { id_agendamento, descricao, data, hora });
    AGENDAMENTO_EDITANDO = id_agendamento;
    showEditarAgendamento();
    document.getElementById("editarServiceName").textContent = `Serviço: ${descricao}`;
    document.getElementById("editarData").value = data;
    document.getElementById("editarHora").value = hora;
    console.log("Campos preenchidos:", {
        serviceName: document.getElementById("editarServiceName").textContent,
        data: document.getElementById("editarData").value,
        hora: document.getElementById("editarHora").value
    });
}

async function salvarEdicaoAgendamento(novaData, novaHora) {
    if (!AGENDAMENTO_EDITANDO) {
        alert("Nenhum agendamento selecionado para edição.");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/editar-agendamento/${AGENDAMENTO_EDITANDO}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: novaData, hora: novaHora }),
        });

        if (res.ok) {
            alert("Agendamento atualizado com sucesso!");
            AGENDAMENTO_EDITANDO = null;
            showServicos();
        } else {
            const err = await res.json();
            alert("Erro ao atualizar agendamento: " + err.error);
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao conectar com o servidor ao atualizar agendamento.");
    }
}

async function cancelarAgendamento(id_agendamento) {
    if (!confirm("Deseja cancelar este agendamento?")) return;
    try {
        const res = await fetch(`${API_URL}/cancelar-agendamento/${id_agendamento}`, { method: "DELETE" });
        if (res.ok) {
            alert("Agendamento cancelado com sucesso");
            showServicos();
        } else {
            const err = await res.json();
            alert("Erro ao cancelar: " + err.error);
        }
    } catch (err) {
        console.error(err);
        alert("Erro ao conectar com o servidor.");
    }
}

// ===================================
// 1. EVENTOS DE LOGIN/CADASTRO (Mantido)
// ===================================

// Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      showMain();
    } else {
      alert(data.error);
    }
  } catch (err) {
    alert("Erro ao conectar com o servidor");
    console.error(err);
  }
});

// Cadastro Completo
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = document.getElementById("registerNome").value;
  const email = document.getElementById("registerEmail").value;
  const documento = document.getElementById("registerDocumento").value; 
  const telefone = document.getElementById("registerTelefone").value;
  const cep = document.getElementById("registerCEP").value;
  const endereco = document.getElementById("registerEndereco").value;
  const numero = document.getElementById("registerNumero").value;
  const bairro = document.getElementById("registerBairro").value;
  const complemento = document.getElementById("registerComplemento").value;
  const cidade_estado = document.getElementById("registerCidadeEstado").value;
  const senha = document.getElementById("registerSenha").value;
  
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        nome, email, senha, documento, telefone, 
        cep, endereco, numero, bairro, complemento, cidade_estado 
      }),
    });

    if (res.ok) {
      alert("Cadastro realizado com sucesso! Faça login para continuar.");
      showLogin();
    } else {
      const err = await res.json();
      alert(err.error);
    }
  } catch (err) {
    alert("Erro ao conectar com o servidor");
    console.error(err);
  }
});

// Logout (Mantido)
document.getElementById("logoutBtn") && document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user");
  showLogin();
});
// ⭐️ LIGAÇÃO: Link "Esqueceu a senha?" (Leva para a nova tela)
document.getElementById("forgotPasswordLink") && document.getElementById("forgotPasswordLink").addEventListener("click", (e) => {
    e.preventDefault();
    showForgotPassword();
});

// ⭐️ VOLTAR: Botão Voltar da tela de recuperação
document.getElementById("backToLoginFromForgot") && document.getElementById("backToLoginFromForgot").addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
});


// ⭐️ ENVIO: Submissão do formulário de recuperação de senha
document.getElementById("forgotPasswordForm") && document.getElementById("forgotPasswordForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("resetEmail").value;

    try {
        const res = await fetch(`${API_URL}/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        // NOTA DE SEGURANÇA: Retornar uma mensagem genérica evita que invasores
        // descubram quais e-mails estão cadastrados no sistema.
        if (res.ok) {
            alert("Se o e-mail estiver cadastrado, as instruções de recuperação foram enviadas. Verifique sua caixa de entrada.");
            showLogin(); // Volta para o login após o envio
        } else {
            // Em caso de erro de rede ou servidor
            alert("Erro ao solicitar recuperação. Tente novamente mais tarde.");
        }
    } catch (err) {
        alert("Erro ao conectar com o servidor para recuperar a senha.");
        console.error(err);
    }
});

// Troca de telas (Login/Cadastro)
document.getElementById("goToRegister").addEventListener("click", (e) => {
  e.preventDefault();
  showRegister();
});

document.getElementById("goToLogin").addEventListener("click", (e) => {
  e.preventDefault();
  showLogin();
});


// ===================================
// 2. LÓGICA DE PERFIL (EDIÇÃO DE CADASTRO E EXCLUSÃO)
// ===================================

function loadUserProfile() {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user) {
        alert("Sessão expirada. Faça login novamente.");
        showLogin();
        return;
    }
    
    document.getElementById("profileName").textContent = user.nome || "Usuário";
    
    document.getElementById("profileNomeInput").value = user.nome || "";
    document.getElementById("profileEmailInput").value = user.email || "";
    document.getElementById("profileDocumentoInput").value = user.documento || "";
    document.getElementById("profileTelefoneInput").value = user.telefone || "";
    document.getElementById("profileCEPInput").value = user.cep || "";
    document.getElementById("profileEnderecoInput").value = user.endereco || "";
    document.getElementById("profileNumeroInput").value = user.numero || "";
    document.getElementById("profileBairroInput").value = user.bairro || "";
    document.getElementById("profileComplementoInput").value = user.complemento || "";
    document.getElementById("profileCidadeEstadoInput").value = user.cidade_estado || "";
}

// Rota para atualizar o cadastro do usuário
document.getElementById("profileUpdateForm") && document.getElementById("profileUpdateForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return showLogin();

    const id_cliente = user.id;
    const nome = document.getElementById("profileNomeInput").value;
    const email = document.getElementById("profileEmailInput").value;
    const documento = document.getElementById("profileDocumentoInput").value;
    const telefone = document.getElementById("profileTelefoneInput").value;
    const cep = document.getElementById("profileCEPInput").value;
    const endereco = document.getElementById("profileEnderecoInput").value;
    const numero = document.getElementById("profileNumeroInput").value;
    const bairro = document.getElementById("profileBairroInput").value;
    const complemento = document.getElementById("profileComplementoInput").value;
    const cidade_estado = document.getElementById("profileCidadeEstadoInput").value;
    
    try {
        const res = await fetch(`${API_URL}/update_profile/${id_cliente}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                nome, email, documento, telefone, 
                cep, endereco, numero, bairro, complemento, cidade_estado
            }),
        });

        const data = await res.json();

        if (res.ok) {
            alert("Cadastro atualizado com sucesso!");
            localStorage.setItem("user", JSON.stringify(data)); 
            loadUserProfile();
        } else {
            const data = await res.json(); // Reatribuído por segurança
            alert("Erro ao atualizar: " + data.error);
        }
    } catch (err) {
        alert("Erro ao conectar com o servidor para atualizar o perfil.");
        console.error(err);
    }
});

// ⭐️ FUNÇÃO: Excluir Conta
async function deleteAccount() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) return showLogin();

    if (!confirm("ATENÇÃO: Você tem certeza que deseja excluir sua conta? Esta ação é irreversível e removerá todos os seus dados e agendamentos.")) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/delete_account/${user.id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            alert("Conta excluída com sucesso. Esperamos te ver de novo!");
            localStorage.removeItem("user");
            showLogin();
        } else {
            const data = await res.json();
            alert("Erro ao excluir conta: " + data.error);
        }
    } catch (err) {
        alert("Erro ao conectar com o servidor para exclusão.");
        console.error(err);
    }
}

// ⭐️ Evento para o botão de Excluir Conta
document.getElementById("deleteAccountBtn") && document.getElementById("deleteAccountBtn").addEventListener("click", deleteAccount);

// ⭐️ Evento para o botão Voltar para a Tela Inicial
document.getElementById("backToHomeBtn") && document.getElementById("backToHomeBtn").addEventListener("click", showMain);


// ===================================
// 3. LÓGICA DE AGENDAMENTO (FLUXO COMPLETO CORRIGIDO)
// ===================================

// ⭐️ CORREÇÃO PRINCIPAL: Evento para o botão "AGENDAR SERVIÇOS" na Home. (Se o ID for 'btnAgendar')
document.getElementById("btnAgendar") && document.getElementById("btnAgendar").addEventListener("click", showSearch);

// ⭐️ NOVO: Botão Voltar da Pesquisa de Serviço para a Tela Inicial
document.getElementById("voltarDaPesquisa") && document.getElementById("voltarDaPesquisa").addEventListener("click", showMain);
document.getElementById("voltarPesquisaParaHome") && document.getElementById("voltarPesquisaParaHome").addEventListener("click", showMain);

// ⭐️ NOVO: Botão Voltar da Descrição de Serviço para a Lista de Serviços
document.getElementById("voltarParaSelecaoDeServicos") && document.getElementById("voltarParaSelecaoDeServicos").addEventListener("click", showSearch);

// ... (navegação pela barra inferior e botões)

// ⭐️ Lógica de Transição para a tela final de Agendamento
// Botão "SELECIONAR SERVIÇO" na Descrição (AGORA LEVA PARA A TELA FINAL)
document.getElementById("selectServiceBtn") && document.getElementById("selectServiceBtn").addEventListener("click", showAgendarFinal);

document.getElementById("voltarParaDescricaoBtn") && document.getElementById("voltarParaDescricaoBtn").addEventListener("click", () => {
    showServiceDescription(SELECTED_SERVICE);
});

// Botão Voltar da Tela Final para a Descrição (ID 'voltarParaDescricao' no index.html)
document.getElementById("voltarParaDescricao") && document.getElementById("voltarParaDescricao").addEventListener("click", () => {
    // Retorna para a descrição do serviço, usando o serviço guardado
    showServiceDescription(SELECTED_SERVICE); 
});

// Confirmação e Envio do Agendamento (Lógica da tela final)
document.getElementById("finalAgendamentoForm") && document.getElementById("finalAgendamentoForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
        alert("Sessão expirada. Faça login novamente.");
        return showLogin();
    }
    
    if (!SELECTED_SERVICE) {
        alert("Erro: Serviço não definido.");
        return showAgendarSelection();
    }
    
    const id_cliente = user.id;
    const data = document.getElementById("agendarData").value;
    const hora = document.getElementById("agendarHora").value;
    const descricao = SELECTED_SERVICE;

    if (!data || !hora) {
        alert("Por favor, informe data e hora para o agendamento.");
        return;
    }

    const agendamentoDate = new Date(`${data}T${hora}`);
    const agora = new Date();
    if (agendamentoDate < agora && !confirm("A data/hora informada já passou. Deseja agendar mesmo assim?")) {
        return;
    }

    if (!confirm(`Deseja confirmar o agendamento de ${descricao} para ${data} às ${hora}?`)) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/agendar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_cliente, data, hora, descricao }),
        });

        const responseData = await res.json();

        if (res.ok) {
            alert(`Agendamento de "${descricao}" para ${data} às ${hora} confirmado!`);
            SELECTED_SERVICE = null;
            showServicos();
        } else {
            alert("Erro ao agendar: " + (responseData.error || "Falha desconhecida."));
        }
    } catch (err) {
        alert("Erro ao conectar com o servidor para agendamento.");
        console.error(err);
    }
});


// ===================================
// 4. LÓGICA DE SERVIÇOS E NAVEGAÇÃO (Mantido)
// ===================================

async function loadServices() {
    // ... (restante da função loadServices)
    const serviceListDiv = document.getElementById("agendarSelectionScreen").querySelector(".service-list");
    serviceListDiv.innerHTML = "<p>Carregando serviços...</p>";

    try {
        const res = await fetch(`${API_URL}/services`);
        const services = await res.json();
        AVAILABLE_SERVICES = Array.isArray(services) ? services : [];

        if (res.ok && services.length > 0) {
            serviceListDiv.innerHTML = "";
            
            services.forEach(service => {
                const button = document.createElement("button");
                button.classList.add("service-button");
                button.setAttribute("data-service", service.nome_servico);
                button.textContent = service.nome_servico.toUpperCase();
                
                button.addEventListener("click", () => {
                    showServiceDescription(service.nome_servico);
                });

                serviceListDiv.appendChild(button);
            });
        } else {
            serviceListDiv.innerHTML = "<p>Nenhum serviço disponível no momento.</p>";
        }

    } catch (err) {
        serviceListDiv.innerHTML = "<p>Erro ao carregar serviços do servidor.</p>";
        console.error(err);
    }
}

document.getElementById("btnServicos") && document.getElementById("btnServicos").addEventListener("click", showServicos);

async function loadServicos() {
  const user = JSON.parse(localStorage.getItem("user"));
  const lista = document.getElementById("listaServicos");
  lista.innerHTML = "<p>Carregando...</p>";

  if (!user || !user.id) {
    lista.innerHTML = "<p>Faça login para ver seus serviços.</p>";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/agendamentos/${user.id}`);
    const data = await res.json();

    if (res.ok) {
      if (!Array.isArray(data) || data.length === 0) {
        lista.innerHTML = "<p>Ainda não há serviços cadastrados.</p>";
      } else {
        lista.innerHTML = "";
        data.forEach((ag) => {
          const div = document.createElement("div");
          div.classList.add("servico-item");
          const dataFormatada = new Date(ag.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
          const statusBadge = getStatusBadge(ag.status_solicitacao);

          let prestadorInfo = "<p><strong>Prestador:</strong> Aguardando atribuição.</p>";
          if (ag.prestador_nome) {
            prestadorInfo = `
              <p><strong>Prestador:</strong> ${ag.prestador_nome} (${ag.prestador_categoria || 'Categoria não informada'})</p>
              <p><strong>Contato:</strong> ${ag.prestador_telefone || 'Não informado'}</p>
            `;
          } else if (ag.status_solicitacao === 'sem_prestador') {
            prestadorInfo = `<p><strong>Prestador:</strong> Ainda não encontramos um prestador para este serviço.</p>`;
          } else if (ag.status_solicitacao === 'recusado') {
            prestadorInfo = `<p><strong>Prestador:</strong> A solicitação foi recusada. Refazer agendamento pode encontrar outro prestador.</p>`;
          }

          div.innerHTML = `
            <p><strong>Data:</strong> ${dataFormatada}</p>
            <p><strong>Hora:</strong> ${ag.hora}</p>
            <p><strong>Serviço:</strong> ${ag.descricao}</p>
            <p><strong>Status:</strong> ${statusBadge}</p>
            ${prestadorInfo}
            <div class="servico-actions">
              <button class="btn-editar btn-primary" onclick="abrirTelaEdicao(${ag.id_agendamento}, '${ag.descricao}', '${ag.data}', '${ag.hora}')">✏️ Editar</button>
              <button class="btn-cancelar btn-secondary" onclick="cancelarAgendamento(${ag.id_agendamento})">❌ Cancelar</button>
            </div>
            <hr>
          `;
          lista.appendChild(div);
        });
      }
    } else {
      lista.innerHTML = "<p>Erro ao carregar serviços.</p>";
    }
  } catch (err) {
    lista.innerHTML = "<p>Erro ao conectar com o servidor.</p>";
    console.error(err);
  }
}

// Navegação pela barra inferior e botões
document.getElementById("voltarHome2") && document.getElementById("voltarHome2").addEventListener("click", showMain);
document.querySelectorAll(".nav-home").forEach(el => el.addEventListener("click", (e) => { e.preventDefault(); showMain(); }));
document.querySelectorAll(".nav-search").forEach(el => el.addEventListener("click", (e) => { e.preventDefault(); showSearch(); }));
document.querySelectorAll(".nav-cart").forEach(el => el.addEventListener("click", (e) => { e.preventDefault(); showServicos(); }));
document.querySelectorAll(".nav-chat").forEach(el => el.addEventListener("click", (e) => { e.preventDefault(); alert("Chat em desenvolvimento"); }));
document.querySelectorAll(".nav-profile").forEach(el => el.addEventListener("click", (e) => { e.preventDefault(); showProfile(); }));

document.getElementById("searchInput") && document.getElementById("searchInput").addEventListener("keyup", (e) => {
    pesquisarServicos(e.target.value);
});

document.getElementById("agendarCarrinhoBtn") && document.getElementById("agendarCarrinhoBtn").addEventListener("click", showAgendarSelection);

// Tela de edição
document.getElementById("cancelarEdicaoBtn") && document.getElementById("cancelarEdicaoBtn").addEventListener("click", () => {
    AGENDAMENTO_EDITANDO = null;
    showServicos();
});

document.getElementById("voltarParaServicos") && document.getElementById("voltarParaServicos").addEventListener("click", () => {
    AGENDAMENTO_EDITANDO = null;
    showServicos();
});

document.getElementById("editarAgendamentoForm") && document.getElementById("editarAgendamentoForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const novaData = document.getElementById("editarData").value;
    const novaHora = document.getElementById("editarHora").value;
    await salvarEdicaoAgendamento(novaData, novaHora);
});