// Aplica o modo escuro imediatamente no <body> antes de qualquer renderização
if (localStorage.getItem("temaRPG") === "escuro") {
  document.body.classList.add("dark-mode")
}
let itemEditandoIndex = null // variável
/* ---------- VARIÁVEIS GLOBAIS PARA EDIÇÃO ---------- */
let editingHabilidadeIndex = -1 // Para Habilidades comuns
let editingFrutaIndex = -1 // Para Habilidades da Fruta

/* Ao carregar a página */
window.addEventListener("DOMContentLoaded", () => {
  console.log("=== INICIANDO SISTEMA ===")
  
  // Aplicar tema antes de tudo
  if (localStorage.getItem("temaRPG") === "escuro") {
    document.body.classList.add("dark-mode")
    
    // Atualizar botões do tema
    const toggleBtn = document.getElementById("toggleThemeBtn")
    if (toggleBtn) {
      toggleBtn.textContent = "Modo Claro"
    }
    
    const toggleMenuBtn = document.getElementById("toggleThemeMenuBtn")
    if (toggleMenuBtn) {
      toggleMenuBtn.textContent = "Modo Claro"
    }
  }
  
  // Limpar sessão anterior para sempre iniciar no menu
  personagemAtualId = null
  localStorage.removeItem("fichaOnePiece")
  
  // Configurar interface básica
  configurarUploadAvatar()
  configurarAbas()
  
  // Debug: verificar estado do localStorage
  const personagens = carregarPersonagens()
  
  console.log("Personagens salvos:", Object.keys(personagens).length)
  console.log("personagemAtualId:", personagemAtualId)
  
  // SEMPRE mostrar o menu primeiro - não criar fichas automaticamente
  console.log("Mostrando menu inicial...")
  mostrarMenu()
})

/* Sistema de Abas */
function configurarAbas() {
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.getAttribute("data-tab")

      // Desativar todas as abas
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Ativar a aba clicada
      button.classList.add("active")
      document.getElementById(tabId).classList.add("active")
    })
  })
}

/* Upload de Avatar */
function configurarUploadAvatar() {
  const avatarInput = document.getElementById("avatarInput")
  const avatarPreview = document.getElementById("avatarPreview")

  avatarInput.addEventListener("change", function () {
    if (this.files && this.files.length > 0) {
      const reader = new FileReader()
      reader.onload = (e) => {
        avatarPreview.src = e.target.result
      }
      reader.readAsDataURL(this.files[0])
    }
  })
}

/* Barras de Status */
function atualizarBarrasStatus() {
  const data = carregarDoLocalStorage()

  const vidaMaxOriginal = Number.parseInt(document.getElementById("vidaMax").value) || 10
  const vigorMaxOriginal = Number.parseInt(document.getElementById("vigorMax").value) || 6

  const reducaoVida = data.ferimentos ? data.ferimentos.reduce((total, fer) => total + fer.dano, 0) : 0
  const reducaoVigor = data.lesoes ? data.lesoes.reduce((acc, les) => acc + les.dano, 0) : 0

  const vidaMax = Math.max(vidaMaxOriginal - reducaoVida, 0)
  const vigorMax = Math.max(vigorMaxOriginal - reducaoVigor, 0)

  const vidaAtual = Math.min(Number.parseInt(document.getElementById("vidaAtual").value) || vidaMax, vidaMax)
  const vigorAtual = Math.min(Number.parseInt(document.getElementById("vigorAtual").value) || vigorMax, vigorMax)

  document.getElementById("vidaAtual").value = vidaAtual
  document.getElementById("vigorAtual").value = vigorAtual

  document.getElementById("vidaMax").style.color = reducaoVida ? "#d50000" : "inherit"
  document.getElementById("vigorMax").style.color = reducaoVigor ? "#d50000" : "inherit"

  // Atualiza visualmente a barra de Vida considerando penalidades
  const vidaPercentual = (vidaAtual / vidaMaxOriginal) * 100
  const vigorPercentual = (vigorAtual / vigorMaxOriginal) * 100

  document.getElementById("vidaBar").style.width = `${vidaPercentual}%`
  document.getElementById("vigorBar").style.width = `${vigorPercentual}%`

  // Aplica visualmente a penalidade na barra de Vigor também
  if (reducaoVigor > 0) {
    document.getElementById("vigorBar").style.background = "linear-gradient(to right, #ffa726, #ef6c00)"
  } else {
    document.getElementById("vigorBar").style.background = "linear-gradient(to right, #66bb6a, #388e3c)"
  }

  if (reducaoVida > 0) {
    document.getElementById("vidaBar").style.background = "linear-gradient(to right, #ff5252, #d32f2f)"
  } else {
    document.getElementById("vidaBar").style.background = "linear-gradient(to right, #ff5252, #d32f2f)"
  }
}

/* ------------------ Cálculos de Atributos ------------------ */
function atualizarAtributos() {
  // Principais
  const forBase = Number.parseInt(document.getElementById("forcaBase").value) || 0
  const forBonus = Number.parseInt(document.getElementById("forcaBonus").value) || 0
  const forTotal = forBase + forBonus
  document.getElementById("forcaTotal").value = forTotal

  const desBase = Number.parseInt(document.getElementById("destrezaBase").value) || 0
  const desBonus = Number.parseInt(document.getElementById("destrezaBonus").value) || 0
  const desTotal = desBase + desBonus
  document.getElementById("destrezaTotal").value = desTotal

  const vitBase = Number.parseInt(document.getElementById("vitalidadeBase").value) || 0
  const vitBonus = Number.parseInt(document.getElementById("vitalidadeBonus").value) || 0
  const vitTotal = vitBase + vitBonus
  document.getElementById("vitalidadeTotal").value = vitTotal

  const apaBase = Number.parseInt(document.getElementById("aparenciaBase").value) || 0
  const apaBonus = Number.parseInt(document.getElementById("aparenciaBonus").value) || 0
  const apaTotal = apaBase + apaBonus
  document.getElementById("aparenciaTotal").value = apaTotal

  const conBase = Number.parseInt(document.getElementById("conhecimentoBase").value) || 0
  const conBonus = Number.parseInt(document.getElementById("conhecimentoBonus").value) || 0
  const conTotal = conBase + conBonus
  document.getElementById("conhecimentoTotal").value = conTotal

  const racBase = Number.parseInt(document.getElementById("raciocinioBase").value) || 0
  const racBonus = Number.parseInt(document.getElementById("raciocinioBonus").value) || 0
  const racTotal = racBase + racBonus
  document.getElementById("raciocinioTotal").value = racTotal

  const vonBase = Number.parseInt(document.getElementById("vontadeBase").value) || 0
  const vonBonus = Number.parseInt(document.getElementById("vontadeBonus").value) || 0
  const vonTotal = vonBase + vonBonus
  document.getElementById("vontadeTotal").value = vonTotal

  const destBase = Number.parseInt(document.getElementById("destinoBase").value) || 0
  const destBonus = Number.parseInt(document.getElementById("destinoBonus").value) || 0
  const destTotal = destBase + destBonus
  document.getElementById("destinoTotal").value = destTotal

  const velBase = Number.parseInt(document.getElementById("velocidadeBase").value) || 0
  const velBonus = Number.parseInt(document.getElementById("velocidadeBonus").value) || 0
  const velTotal = velBase + velBonus
  document.getElementById("velocidadeTotal").value = velTotal

  const resiBase = Number.parseInt(document.getElementById("resilienciaBase").value) || 0
  const resiBonus = Number.parseInt(document.getElementById("resilienciaBonus").value) || 0
  const resiTotal = resiBase + resiBonus
  document.getElementById("resilienciaTotal").value = resiTotal

  // Derivados
  const agiBase = desTotal + velTotal
  document.getElementById("agilidadeBase").value = agiBase
  const agiBonus = Number.parseInt(document.getElementById("agilidadeBonus").value) || 0
  document.getElementById("agilidadeTotal").value = agiBase + agiBonus

  const resBase = forTotal + resiTotal
  document.getElementById("resistenciaBase").value = resBase
  const resBonus = Number.parseInt(document.getElementById("resistenciaBonus").value) || 0
  document.getElementById("resistenciaTotal").value = resBase + resBonus

  const persBase = conTotal + vitTotal
  document.getElementById("persistenciaBase").value = persBase
  const persBonus = Number.parseInt(document.getElementById("persistenciaBonus").value) || 0
  document.getElementById("persistenciaTotal").value = persBase + persBonus

  const discBase = racTotal + vonTotal
  document.getElementById("disciplinaBase").value = discBase
  const discBonus = Number.parseInt(document.getElementById("disciplinaBonus").value) || 0
  document.getElementById("disciplinaTotal").value = discBase + discBonus

  const carisBase = apaTotal + destTotal
  document.getElementById("carismaBase").value = carisBase
  const carisBonus = Number.parseInt(document.getElementById("carismaBonus").value) || 0
  document.getElementById("carismaTotal").value = carisBase + carisBonus

  calcularReservas()
  atualizarInformacoesCombate()
}

function atualizarInformacoesCombate() {
  // Obtendo valores dos atributos derivados
  const resistencia = Number.parseInt(document.getElementById("resistenciaTotal").value) || 0
  const agilidade = Number.parseInt(document.getElementById("agilidadeTotal").value) || 0
  const persistencia = Number.parseInt(document.getElementById("persistenciaTotal").value) || 0
  const disciplina = Number.parseInt(document.getElementById("disciplinaTotal").value) || 0
  const bonusMaestria = Number.parseInt(document.getElementById("bonusMaestria").value) || 0

  // Calculando valores de CA e CD
  const maiorEntreResAgilidade = Math.max(resistencia, agilidade)
  const maiorEntrePersDisciplina = Math.max(persistencia, disciplina)

  const classeAcerto = 1 + maiorEntreResAgilidade
  const classeDificuldade = bonusMaestria + maiorEntrePersDisciplina

  // Calculando deslocamento
  const deslocamento = agilidade >= 1 ? 3 * agilidade + "m" + " (" + (3 * agilidade) / 1.5 + " quadrados)" : "1.5m"

  // Atualizando os valores nos inputs
  document.getElementById("classeAcerto").value = classeAcerto
  document.getElementById("classeDificuldade").value = classeDificuldade
  document.getElementById("deslocamento").value = deslocamento
}
// Disparar atualização sempre que um atributo derivado mudar
;["resistenciaTotal", "agilidadeTotal", "persistenciaTotal", "disciplinaTotal", "bonusMaestria"].forEach((id) => {
  document.getElementById(id).addEventListener("input", atualizarInformacoesCombate)
})

// Executar ao carregar a página
// window.addEventListener("DOMContentLoaded", atualizarInformacoesCombate)

/* ---------------- DANOS ---------------- */
function sofrerDano() {
  const dano = Number.parseInt(document.getElementById("danoSofrido").value) || 0
  const vidaAtual = document.getElementById("vidaAtual")
  vidaAtual.value = Math.max(vidaAtual.value - dano, 0)
  atualizarBarrasStatus()
}

function gastarVigor() {
  const gasto = Number.parseInt(document.getElementById("danoSofrido").value) || 0
  const vigorAtual = document.getElementById("vigorAtual")
  vigorAtual.value = Math.max(vigorAtual.value - gasto, 0)
  atualizarBarrasStatus()
}

function resetarStatus() {
  document.getElementById("vidaAtual").value = document.getElementById("vidaMax").value
  document.getElementById("vigorAtual").value = document.getElementById("vigorMax").value
  atualizarBarrasStatus()
}

function recuperarDano() {
  const cura = Number.parseInt(document.getElementById("recuperar").value) || 0
  const vidaAtual = document.getElementById("vidaAtual")
  const vidaMax = Number.parseInt(document.getElementById("vidaMax").value) || 0

  vidaAtual.value = Math.min(Number.parseInt(vidaAtual.value) + cura, vidaMax)

  atualizarBarrasStatus()
}

function recuperarVigor() {
  const cura = Number.parseInt(document.getElementById("recuperar").value) || 0
  const vigorAtual = document.getElementById("vigorAtual")
  const vigorMax = Number.parseInt(document.getElementById("vigorMax").value) || 0

  vigorAtual.value = Math.min(Number.parseInt(vigorAtual.value) + cura, vigorMax)

  atualizarBarrasStatus()
}
// Atualiza as barras conforme inputs alterados
;["vidaAtual", "vidaMax", "vigorAtual", "vigorMax"].forEach((id) => {
  document.getElementById(id).addEventListener("change", atualizarBarrasStatus)
})

// Atualizar automaticamente os dados de Personagem
/*
document.addEventListener("DOMContentLoaded", () => {
  const campos = ["raca", "classe", "profissao", "potencial"]

  // Carregar dados do LocalStorage
  campos.forEach((id) => {
    const elemento = document.getElementById(id)
    if (localStorage.getItem(id)) {
      elemento.value = localStorage.getItem(id)
    }

    // Salvar alterações automaticamente
    elemento.addEventListener("change", function () {
      localStorage.setItem(id, this.value)
    })
  })
})
*/

/* --------- FERIMENTOS & LESÕES ------------- */
function addFerimento() {
  const local = document.getElementById("localFerida").value.trim()
  const dano = Number.parseInt(document.getElementById("danoFerida").value) || 0

  if (!local || dano <= 0) {
    alert("Preencha corretamente Local e Dano.")
    return
  }

  const data = carregarDoLocalStorage()
  data.ferimentos = data.ferimentos || []
  data.ferimentos.push({ local, dano })

  localStorage.setItem("fichaOnePiece", JSON.stringify(data))
  exibirFerimentosLesoes()
  atualizarBarrasStatus()
}

function addLesao() {
  const local = document.getElementById("localFerida").value.trim()
  const dano = Number.parseInt(document.getElementById("danoFerida").value) || 0

  if (!local || dano <= 0) {
    alert("Preencha corretamente Local e Dano.")
    return
  }

  const data = carregarDoLocalStorage()
  data.lesoes = data.lesoes || []
  data.lesoes.push({ local, dano })

  localStorage.setItem("fichaOnePiece", JSON.JSON.stringify(data))
  exibirFerimentosLesoes()
  atualizarBarrasStatus()
}

function exibirFerimentosLesoes() {
  const container = document.getElementById("listaFerimentosLesoes")
  container.innerHTML = ""
  const data = carregarDoLocalStorage()

  if (data.ferimentos) {
    data.ferimentos.forEach((fer, idx) => {
      container.innerHTML += `
        <div class="list-item">
          <strong>Ferimento:</strong> ${fer.local} (-${fer.dano} Vida máx.)
          <button class="btn btn-sm btn-danger" onclick="removerFerLes('ferimentos', ${idx})">X</button>
        </div>`
    })
  }

  if (data.lesoes) {
    data.lesoes.forEach((les, idx) => {
      container.innerHTML += `
        <div class="list-item">
          <strong>Lesão:</strong> ${les.local} (-${les.dano} Vigor máx.)
          <button class="btn btn-sm btn-danger" onclick="removerFerLes('lesoes', ${idx})">X</button>
        </div>`
    })
  }
}

function removerFerLes(tipo, idx) {
  const data = carregarDoLocalStorage()
  data[tipo].splice(idx, 1)
  localStorage.setItem("fichaOnePiece", JSON.stringify(data))
  exibirFerimentosLesoes()
  atualizarBarrasStatus()
}

/* --------- RESERVAS ------------ */
function calcularReservas() {
  const resistencia = Number.parseInt(document.getElementById("resistenciaTotal").value) || 0
  const persistencia = Number.parseInt(document.getElementById("persistenciaTotal").value) || 0

  // Obter valores salvos ou usar o nível como padrão
  const nivelClasse = Number.parseInt(document.getElementById("nivel-classe").value) || 1
  const nivelProfissao = Number.parseInt(document.getElementById("nivel-profissao").value) || 1

  // Carregar valores salvos ou usar os níveis como padrão
  const data = carregarDoLocalStorage()
  document.getElementById("reservaVidaQtd").value = data.reservaVidaQtd ?? nivelClasse
  document.getElementById("reservaVigorQtd").value = data.reservaVigorQtd ?? nivelProfissao

  // Atualizar os dados baseados nos atributos
  document.getElementById("reservaVidaDados").textContent = calcularDadosReserva(resistencia)
  document.getElementById("reservaVigorDados").textContent = calcularDadosReserva(persistencia)
}

function calcularDadosReserva(pontos) {
  if (pontos < 0) return "0"
  if (pontos === 0) return "1"
  if (pontos <= 2) return "1d2"
  if (pontos <= 4) return "1d4"
  if (pontos <= 6) return "1d6"
  if (pontos <= 8) return "1d8"
  if (pontos <= 10) return "1d10"
  if (pontos <= 12) return "2d6"
  if (pontos <= 14) return "1d8 + 1d6"
  if (pontos <= 16) return "2d8"
  if (pontos <= 18) return "1d10 + 1d8"
  return "2d10"
}
// Atualiza ao digitar em total de resistência e persistência
;["resistenciaTotal", "persistenciaTotal"].forEach((id) => {
  document.getElementById(id).addEventListener("input", calcularReservas)
})

// Salvar mudanças manuais
;["reservaVidaQtd", "reservaVigorQtd"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => {
    const data = carregarDoLocalStorage()
    data.reservaVidaQtd = Number.parseInt(document.getElementById("reservaVidaQtd").value) || 0
    data.reservaVigorQtd = Number.parseInt(document.getElementById("reservaVigorQtd").value) || 0
    localStorage.setItem("fichaOnePiece", JSON.stringify(data))
  })
})

// Supondo que você tenha já esses valores atualizados na ficha
// const resistencia = obterValorAtributo("resistencia"); // derivado de Força + Resiliência
// const persistencia = obterValorAtributo("persistencia"); // derivado de Conhecimento + Vitalidade

// document.getElementById('reservaVidaDados').textContent = calcularDadosReserva(resistencia);
// document.getElementById('reservaVigorDados').textContent = calcularDadosReserva(persistencia);

// Carregar quantidade salva (ou padrão)
const data = carregarDoLocalStorage()
document.getElementById("reservaVidaQtd").value = data.reservaVidaQtd ?? data.nivel ?? 1
document.getElementById("reservaVigorQtd").value = data.reservaVigorQtd ?? data.nivel ?? 1

/* --------- ATAQUES ------------- */
function adicionarAtaque() {
  const nome = document.getElementById("ataqueNome").value.trim()
  const bonus = document.getElementById("ataqueBonus").value.trim()
  const dano = document.getElementById("ataqueDano").value.trim()

  if (!nome || !bonus || !dano) {
    alert("Preencha todos os campos para adicionar um ataque.")
    return
  }

  const container = document.getElementById("listaAtaques")
  const div = document.createElement("div")
  div.className = "ataque-item"
  div.innerHTML = `
      <span class="ataque-nome">${nome}</span>
      <span class="ataque-bonus">+${bonus}</span>
      <span class="ataque-dano">Dano: ${dano}</span>
      <div class="ataque-actions">
          <button type="button" class="btn btn-sm btn-danger" onclick="removerAtaque(this)">Remover</button>
      </div>
  `
  container.appendChild(div)

  salvarAtaquesLocal()

  // Limpar os campos
  document.getElementById("ataqueNome").value = ""
  document.getElementById("ataqueBonus").value = ""
  document.getElementById("ataqueDano").value = ""
}

function removerAtaque(button) {
  button.parentElement.parentElement.remove()
  salvarAtaquesLocal()
}

function salvarAtaquesLocal() {
  const ataques = []
  document.querySelectorAll(".ataque-item").forEach((item) => {
    const nome = item.querySelector(".ataque-nome").innerText
    const bonus = item.querySelector(".ataque-bonus").innerText.replace("Bônus: ", "").trim()
    const dano = item.querySelector(".ataque-dano").innerText.replace("Dano: ", "").trim()
    ataques.push({ nome, bonus, dano })
  })

  localStorage.setItem("ataques", JSON.stringify(ataques))
}

function carregarAtaques() {
  const ataques = JSON.parse(localStorage.getItem("ataques")) || []
  const container = document.getElementById("listaAtaques")
  container.innerHTML = ""
  ataques.forEach(({ nome, bonus, dano }) => {
    const div = document.createElement("div")
    div.className = "ataque-item"
    div.innerHTML = `
            <span class="ataque-nome">${nome}</span>
            <span class="ataque-bonus">Bônus: ${bonus}</span>
            <span class="ataque-dano">Dano: ${dano}</span>
            <div class="ataque-actions">
                <button type="button" class="btn btn-sm btn-danger" onclick="removerAtaque(this)">Remover</button>
            </div>
        `
    container.appendChild(div)
  })
}

// Carregar ataques salvos ao abrir a ficha
window.addEventListener("DOMContentLoaded", carregarAtaques)

// Inicia as barras ao carregar
window.onload = () => {
  if (localStorage.getItem("temaRPG") === "escuro") {
    document.body.classList.add("dark-mode")
    document.getElementById("toggleThemeBtn").textContent = "Modo Claro"
  }

  carregarFicha() // Primeiro, carrega todos os dados da ficha
  carregarCompetenciasEAptidoes() // Depois, garante que competências e aptidões são carregadas

  exibirFerimentosLesoes() // Agora pode exibir ferimentos corretamente
  atualizarBarrasStatus() // Atualiza os status corretamente após todos os dados carregarem
  exibirItens(carregarDoLocalStorage().listaItens || [])
  calcularReservas()

  console.log("Ficha carregada com sucesso!")
}

/* -------------- COMPETÊNCIAS -------------- */
function adicionarCompetencia() {
  const tipo = document.getElementById("compTipo").value
  const nome = document.getElementById("compNome").value.trim()
  const nivel = Number.parseInt(document.getElementById("compNivel").value.trim()) || 0
  const obs = document.getElementById("compObs").value.trim()

  if (!nome) {
    alert("Preencha o nome da " + (tipo === "competencia" ? "Competência" : "Aptidão"))
    return
  }

  let container
  if (tipo === "competencia") container = document.getElementById("listaCompetencias")
  else if (tipo === "aptidao") container = document.getElementById("listaAptidoes")
  else container = document.getElementById("listaTrunfos")
  const div = document.createElement("div")
  div.className = "list-item col-2" // Ajustado para ocupar 1/5 da linha
  div.innerHTML = `
    <div class="list-item-header">
      <span class="list-item-title">${nome}</span>
      ${tipo !== "trunfo" ? `<span class="list-item-subtitle">Nível: ${nivel}</span>` : ""}
    </div>
    <div class="list-item-content">${obs}</div>
    <div class="list-item-actions">
      <button type="button" class="btn btn-sm btn-secondary" onclick="alterarNivel(this, 1, '${tipo}')">+</button>
      <button type="button" class="btn btn-sm btn-secondary" onclick="alterarNivel(this, -1, '${tipo}')">-</button>
      <button type="button" class="btn btn-sm btn-danger" onclick="removerItem(this, '${tipo}')">Remover</button>
    </div>
  `
  container.appendChild(div)

  salvarNoLocalStorage(tipo)

  document.getElementById("compNome").value = ""
  document.getElementById("compNivel").value = 0
  document.getElementById("compObs").value = ""
}

function toggleNivelInput() {
  // toogle de nível para trunfo
  const tipo = document.getElementById("compTipo").value
  const nivelWrapper = document.getElementById("nivelWrapper")
  nivelWrapper.style.display = tipo === "trunfo" ? "none" : "block"
}

function alterarNivel(button, delta, tipo) {
  const nivelSpan = button.parentElement.parentElement.querySelector(".list-item-subtitle")
  let nivel = Number.parseInt(nivelSpan.innerText.replace("Nível: ", "")) || 0
  nivel = Math.max(0, nivel + delta)
  nivelSpan.innerText = "Nível: " + nivel

  salvarNoLocalStorage(tipo)
}

function removerItem(button, tipo) {
  let container
  if (tipo === "competencia") container = document.getElementById("listaCompetencias")
  else if (tipo === "aptidao") container = document.getElementById("listaAptidoes")
  else container = document.getElementById("listaTrunfos")

  const nomeItem = button.parentElement.parentElement.querySelector(".list-item-title").innerText

  button.parentElement.parentElement.remove()

  let items = JSON.parse(localStorage.getItem(tipo)) || []
  items = items.filter((item) => item.nome !== nomeItem)
  localStorage.setItem(tipo, JSON.stringify(items))

  atualizarInformacoesCombate()
}

function salvarNoLocalStorage(tipo) {
  let container
  if (tipo === "competencia") container = document.getElementById("listaCompetencias")
  else if (tipo === "aptidao") container = document.getElementById("listaAptidoes")
  else container = document.getElementById("listaTrunfos")

  const storedItems = JSON.parse(localStorage.getItem(tipo)) || []

  const newItems = []
  container.querySelectorAll(".list-item").forEach((item) => {
    const nome = item.querySelector(".list-item-title").innerText.trim()
    const nivel = Number.parseInt(item.querySelector(".list-item-subtitle").innerText.replace("Nível: ", "")) || 0
    const obs = item.querySelector(".list-item-content").innerText.trim()

    // Verifica se já existe a competência com o mesmo nome
    const existingItemIndex = storedItems.findIndex((existing) => existing.nome === nome)
    if (existingItemIndex !== -1) {
      storedItems[existingItemIndex].nivel = nivel
      storedItems[existingItemIndex].obs = obs
    } else {
      newItems.push({ nome, nivel, obs })
    }
  })

  // Substitui completamente o array salvo, garantindo que não haja dados corrompidos
  const updatedItems = [
    ...storedItems.filter((existing) => !newItems.some((newItem) => newItem.nome === existing.nome)),
    ...newItems,
  ]

  // Salvar as reservas no localStorage
  const data = carregarDoLocalStorage()
  data.reservaVidaQtd = Number.parseInt(document.getElementById("reservaVidaQtd").value) || 0
  data.reservaVigorQtd = Number.parseInt(document.getElementById("reservaVigorQtd").value) || 0
  localStorage.setItem("fichaOnePiece", JSON.stringify(data))

  console.log("Salvando no localStorage:", updatedItems)
  localStorage.setItem(tipo, JSON.stringify(updatedItems))
}

function carregarCompetenciasEAptidoes() {
  ;["competencia", "aptidao", "trunfo"].forEach((tipo) => {
    let container
    if (tipo === "competencia") container = document.getElementById("listaCompetencias")
    else if (tipo === "aptidao") container = document.getElementById("listaAptidoes")
    else container = document.getElementById("listaTrunfos")

    container.innerHTML = "" // Limpa a lista antes de carregar

    const items = JSON.parse(localStorage.getItem(tipo)) || []
    console.log(`Carregando do localStorage (${tipo}):`, items)

    items.forEach(({ nome, nivel, obs }) => {
      const div = document.createElement("div")
      div.className = "list-item col-2"
      div.innerHTML = `
            <div class="list-item-header">
              <span class="list-item-title">${nome}</span>
              <span class="list-item-subtitle">Nível: ${nivel}</span>
            </div>
            <div class="list-item-content">${obs}</div>
            <div class="list-item-actions">
              <button type="button" class="btn btn-sm btn-secondary" onclick="alterarNivel(this, 1, '${tipo}')">+</button>
              <button type="button" class="btn btn-sm btn-secondary" onclick="alterarNivel(this, -1, '${tipo}')">-</button>
              <button type="button" class="btn btn-sm btn-danger" onclick="removerItem(this, '${tipo}')">Remover</button>
            </div>
          `
      container.appendChild(div)
    })
  })

  console.log("Competências e Aptidões carregadas corretamente.")
}

/* -------------- HABILIDADES (COMUNS) - EDIÇÃO -------------- */
function adicionarOuSalvarEdicaoHabilidade() {
  if (editingHabilidadeIndex !== -1) {
    salvarEdicaoHabilidade()
  } else {
    adicionarHabilidade()
  }
}

function adicionarHabilidade() {
  const nome = document.getElementById("habNome").value.trim()
  const custo = document.getElementById("habCusto").value.trim()
  const desc = document.getElementById("habDesc").value.trim()
  const custoCompra = Number.parseInt(document.getElementById("habCustoCompra").value.trim()) || 0
  const alcance = document.getElementById("habAlcance").value.trim()

  if (!nome && !custo && !desc) {
    alert("Preencha ao menos algum campo para a habilidade!")
    return
  }
  const data = carregarDoLocalStorage()
  if (!data.habilidades) data.habilidades = []

  data.habilidades.push({ nome, custo, custoCompra, alcance, desc })
  localStorage.setItem("fichaOnePiece", JSON.stringify(data))

  // limpa campos
  document.getElementById("habNome").value = ""
  document.getElementById("habCusto").value = ""
  document.getElementById("habDesc").value = ""
  document.getElementById("habCustoCompra").value = ""
  document.getElementById("habAlcance").value = ""

  carregarFicha()
}

function editarHabilidade(index) {
  const data = carregarDoLocalStorage()
  const hab = data.habilidades[index]

  // Carrega nos campos
  document.getElementById("habNome").value = hab.nome
  document.getElementById("habCusto").value = hab.custo
  document.getElementById("habDesc").value = hab.desc
  document.getElementById("habCustoCompra").value = hab.custoCompra || 0
  document.getElementById("habAlcance").value = hab.alcance || ""

  editingHabilidadeIndex = index
  document.getElementById("btnHabilidade").textContent = "Salvar Edição"
}

function salvarEdicaoHabilidade() {
  const nome = document.getElementById("habNome").value.trim()
  const custo = document.getElementById("habCusto").value.trim()
  const desc = document.getElementById("habDesc").value.trim()
  const custoCompra = Number.parseInt(document.getElementById("habCustoCompra").value.trim()) || 0
  const alcance = document.getElementById("habAlcance").value.trim()

  if (!nome && !custo && !desc) {
    alert("Preencha ao menos algum campo para a habilidade!")
    return
  }
  const data = carregarDoLocalStorage()
  if (!data.habilidades) data.habilidades = []

  data.habilidades[editingHabilidadeIndex] = { nome, custo, custoCompra, alcance, desc }
  localStorage.setItem("fichaOnePiece", JSON.stringify(data))

  // limpa
  document.getElementById("habNome").value = ""
  document.getElementById("habCusto").value = ""
  document.getElementById("habDesc").value = ""
  document.getElementById("habCustoCompra").value = ""
  document.getElementById("habAlcance").value = ""

  editingHabilidadeIndex = -1
  document.getElementById("btnHabilidade").textContent = "Adicionar Habilidade"

  carregarFicha()
}

/* -------------- ITENS -------------- */

function adicionarItem() {
  const nome = document.getElementById("itemNome").value.trim()
  const desc = document.getElementById("itemDesc").value.trim()
  const durabilidade = document.getElementById("itemDurabilidade").value

  if (!nome && !desc) {
    alert("Preencha ao menos o nome ou descrição!")
    return
  }

  const data = carregarDoLocalStorage()
  if (!data.listaItens) data.listaItens = []

  const novoItem = {
    nome,
    desc,
    durabilidadeOriginal: durabilidade,
    durabilidadeAtual: durabilidade,
  }

  if (Number.isInteger(itemEditandoIndex) && itemEditandoIndex >= 0) {
    data.listaItens[itemEditandoIndex] = novoItem
    itemEditandoIndex = null
    document.getElementById("btnAdicionarItem").textContent = "Adicionar Item"
  } else {
    data.listaItens.push(novoItem)
  }

  localStorage.setItem("fichaOnePiece", JSON.stringify(data))

  document.getElementById("itemNome").value = ""
  document.getElementById("itemDesc").value = ""
  document.getElementById("itemDurabilidade").value = ""
  itemEditandoIndex = null

  carregarFicha()
}

function exibirItens(lista) {
  const container = document.getElementById("listaItens")
  container.innerHTML = ""

  if (!lista || lista.length === 0) return

  lista.forEach((item, index) => {
    const div = document.createElement("div")
    div.className = "list-item col-6"

    const atual = item.durabilidadeAtual ?? item.durabilidadeOriginal ?? "-"
    const original = item.durabilidadeOriginal ?? "-"

    div.innerHTML = `
      <div class="list-item-header">
        <span class="list-item-title">${item.nome || "(sem nome)"}</span>
        <span class="list-item-subtitle">Durabilidade ou Usos: ${atual} / ${original}</span>
      </div>
      <div class="list-item-content">${item.desc || "(sem descrição)"}</div>
      <div class="list-item-actions">
        <button type="button" class="btn btn-sm btn-secondary" onclick="alterarDurabilidade(${index}, 1)">+</button>
        <button type="button" class="btn btn-sm btn-secondary" onclick="alterarDurabilidade(${index}, -1)">−</button>
        <button type="button" class="btn btn-sm btn-primary" onclick="editarItem(${index})">Editar</button>
        <button type="button" class="btn btn-sm btn-danger" onclick="removerEquipamento(${index})">Remover</button>
      </div>
    `
    container.appendChild(div)
  })
}

function removerEquipamento(index) {
  const data = carregarDoLocalStorage()
  data.listaItens.splice(index, 1)
  localStorage.setItem("fichaOnePiece", JSON.stringify(data))
  carregarFicha()
}

function alterarDurabilidade(index, delta) {
  const data = carregarDoLocalStorage()
  const item = data.listaItens[index]

  if (item.durabilidadeAtual == null && item.durabilidadeOriginal != null) {
    item.durabilidadeAtual = item.durabilidadeOriginal
  }

  item.durabilidadeAtual = Math.max(0, Number.parseInt(item.durabilidadeAtual) + delta)
  localStorage.setItem("fichaOnePiece", JSON.stringify(data))
  exibirItens(data.listaItens)
}

function editarItem(index) {
  const data = carregarDoLocalStorage()
  const item = data.listaItens[index]

  document.getElementById("itemNome").value = item.nome || ""
  document.getElementById("itemDesc").value = item.desc || ""
  document.getElementById("itemDurabilidade").value = item.durabilidadeOriginal || ""

  itemEditandoIndex = index

  document.getElementById("btnAdicionarItem").textContent = "Salvar Alterações"
}

/* -------------- FRUTA (COM EDIÇÃO) -------------- */
// Função dos subtipos da fruta
function atualizarSubtipos() {
  const tipo = document.getElementById("akumaTipo").value
  const subtipo = document.getElementById("akumaSubtipo")
  subtipo.innerHTML = "" // limpa opções anteriores

  const subtiposPorTipo = {
    Paramecia: [
      "Criação",
      "Alteração Corporal — Eterna",
      "Alteração Corporal — Momentânea",
      "Controle de Ambiente",
      "Manipulação de Conceito",
      "Paramecia Especial",
    ],
    Zoan: ["Normal", "Ancestral", "Mítica"],
    Logia: ["Elemental (Padrão)"],
  }

  subtiposPorTipo[tipo].forEach((opcao) => {
    const el = document.createElement("option")
    el.value = opcao
    el.textContent = opcao
    subtipo.appendChild(el)
  })

  // manter subtipo anterior se possível
  const saved = localStorage.getItem("fichaOnePiece")
  if (saved) {
    const data = JSON.parse(saved)
    if (data.akumaSubtipo) {
      subtipo.value = data.akumaSubtipo
    }
  }
}

function adicionarOuSalvarEdicaoFruta() {
  if (editingFrutaIndex !== -1) {
    salvarEdicaoFruta()
  } else {
    adicionarFrutaHabilidade()
  }
}

function adicionarFrutaHabilidade() {
  const nome = document.getElementById("frutaNome").value.trim()
  const custo = document.getElementById("frutaCusto").value.trim()
  const custoCompra = Number.parseInt(document.getElementById("frutaCustoCompra").value.trim()) || 0
  const alcance = document.getElementById("frutaAlcance").value.trim()
  const desc = document.getElementById("frutaDesc").value.trim()

  if (!nome && !custo && !desc) {
    alert("Preencha ao menos algum campo para a habilidade da fruta!")
    return
  }
  const data = carregarDoLocalStorage()
  if (!data.frutaHabilidades) data.frutaHabilidades = []

  data.frutaHabilidades.push({ nome, custo, custoCompra, alcance, desc })
  localStorage.setItem("fichaOnePiece", JSON.stringify(data))

  document.getElementById("frutaNome").value = ""
  document.getElementById("frutaCusto").value = ""
  document.getElementById("frutaDesc").value = ""
  document.getElementById("frutaCustoCompra").value = ""
  document.getElementById("frutaAlcance").value = ""

  carregarFicha()
}

function editarFrutaHabilidade(index) {
  const data = carregarDoLocalStorage()
  const hab = data.frutaHabilidades[index]

  // Carrega nos campos
  document.getElementById("frutaNome").value = hab.nome
  document.getElementById("frutaCusto").value = hab.custo
  document.getElementById("frutaDesc").value = hab.desc
  document.getElementById("frutaCustoCompra").value = hab.custoCompra || 0
  document.getElementById("frutaAlcance").value = hab.alcance || ""

  editingFrutaIndex = index
  document.getElementById("btnFruta").textContent = "Salvar Edição"
}

function salvarEdicaoFruta() {
  const nome = document.getElementById("frutaNome").value.trim()
  const custo = document.getElementById("frutaCusto").value.trim()
  const desc = document.getElementById("frutaDesc").value.trim()
  const custoCompra = Number.parseInt(document.getElementById("frutaCustoCompra").value.trim()) || 0
  const alcance = document.getElementById("frutaAlcance").value.trim()

  if (!nome && !custo && !desc) {
    alert("Preencha ao menos algum campo para a habilidade da fruta!")
    return
  }
  const data = carregarDoLocalStorage()
  if (!data.frutaHabilidades) data.frutaHabilidades = []

  data.frutaHabilidades[editingFrutaIndex] = { nome, custo, custoCompra, alcance, desc }
  localStorage.setItem("fichaOnePiece", JSON.stringify(data))

  // limpa
  document.getElementById("frutaNome").value = ""
  document.getElementById("frutaCusto").value = ""
  document.getElementById("frutaDesc").value = ""
  document.getElementById("frutaCustoCompra").value = ""
  document.getElementById("frutaAlcance").value = ""

  editingFrutaIndex = -1
  document.getElementById("btnFruta").textContent = "Adicionar Habilidade da Fruta"

  carregarFicha()
}

/* -------------- LISTAGEM DE HABILIDADES (Com "Editar") -------------- */
function mostrarHabilidades(lista, targetId) {
  const container = document.getElementById(targetId)
  container.innerHTML = ""

  lista.forEach((hab, index) => {
    const div = document.createElement("div")
    div.className = "list-item"

    // Se for "listaHabilidades", chamamos editarHabilidade(index)
    // Se for "listaFruta", chamamos editarFrutaHabilidade(index)
    const isFruta = targetId === "listaFruta"
    const editarFunc = isFruta ? `editarFrutaHabilidade(${index})` : `editarHabilidade(${index})`
    const removerFunc = `removerHabilidade('${targetId}', ${index})`

    div.innerHTML = `
      <details ${hab.expanded ? "open" : ""} onchange="salvarEstadoAccordion('${targetId}', ${index}, this.open)">
        <summary class="accordion-summary">
          <strong>${hab.nome}</strong>
        </summary>
        <div class="accordion-body">
          <div style="display: flex; justify-content: space-between;">
            <em>Custo de Uso: ${hab.custo || "-"}</em>
            <span style="font-size: 0.9em;">Custo de Compra: ${hab.custoCompra || 0} PH</span>
          </div>
          <p><strong>Alcance / Duração:</strong> ${hab.alcance || "-"}</p>
          <p style="white-space: pre-line;">${hab.desc || ""}</p>
          <div class="list-item-actions" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <button type="button" class="btn btn-sm btn-primary" onclick="${editarFunc}">Editar</button>
              <button type="button" class="btn btn-sm btn-danger" onclick="${removerFunc}">Remover</button>
            </div>
            <label style="display: flex; align-items: center; gap: 5px;" onclick="event.stopPropagation();">
              <input type="checkbox" onchange="marcarHabilidadeComprada('${targetId}', ${index}, this.checked)" ${hab.comprada ? "checked" : ""}>
              <span style="color: ${hab.comprada ? "var(--success)" : "inherit"};">Comprada</span>
            </label>
          </div>
        </div>
      </details>
    `

    container.appendChild(div)
  })
}

/* -------------- REMOVER HABILIDADE (Comum ou Fruta) -------------- */
function removerHabilidade(section, index) {
  const data = carregarDoLocalStorage()
  if (section === "listaHabilidades") {
    data.habilidades.splice(index, 1)

    // Se estávamos editando este item, resetar
    if (editingHabilidadeIndex === index) {
      editingHabilidadeIndex = -1
      document.getElementById("btnHabilidade").textContent = "Adicionar Habilidade"
      document.getElementById("habNome").value = ""
      document.getElementById("habCusto").value = ""
      document.getElementById("habDesc").value = ""
    }
  } else {
    data.frutaHabilidades.splice(index, 1)

    if (editingFrutaIndex === index) {
      editingFrutaIndex = -1
      document.getElementById("btnFruta").textContent = "Adicionar Habilidade da Fruta"
      document.getElementById("frutaNome").value = ""
      document.getElementById("frutaCusto").value = ""
      document.getElementById("frutaDesc").value = ""
    }
  }
  localStorage.setItem("fichaOnePiece", JSON.stringify(data))
  carregarFicha()
}

function marcarHabilidadeComprada(section, index, isChecked) {
  const data = carregarDoLocalStorage()
  const lista = section === "listaHabilidades" ? data.habilidades : data.frutaHabilidades

  if (lista && lista[index]) {
    lista[index].comprada = isChecked
    localStorage.setItem("fichaOnePiece", JSON.stringify(data))
    carregarFicha()
  }
}

/* -------------- SESSÕES -------------- */
function adicionarSessao() {
  const titulo = document.getElementById("sessaoTitulo").value.trim()
  const resumo = document.getElementById("sessaoResumo").value.trim()
  if (!titulo && !resumo) {
    alert("Preencha ao menos Título ou Resumo da Sessão!")
    return
  }
  const data = carregarDoLocalStorage()
  if (!data.listaSessoes) {
    data.listaSessoes = []
  }
  data.listaSessoes.push({ titulo, resumo })
  localStorage.setItem("fichaOnePiece", JSON.stringify(data))
  document.getElementById("sessaoTitulo").value = ""
  document.getElementById("sessaoResumo").value = ""
  carregarFicha()
}

function exibirSessoes(lista) {
  const container = document.getElementById("listaSessoes")
  container.innerHTML = ""
  lista.forEach((sessao, index) => {
    const div = document.createElement("div")
    div.className = "list-item"
    div.innerHTML = `
      <div class="list-item-header">
        <span class="list-item-title">${sessao.titulo}</span>
      </div>
      <div class="list-item-content">${sessao.resumo}</div>
      <div class="list-item-actions">
        <button type="button" class="btn btn-sm btn-danger" onclick="removerSessao(${index})">Remover</button>
      </div>
    `
    container.appendChild(div)
  })
}

function removerSessao(index) {
  const data = carregarDoLocalStorage()
  data.listaSessoes.splice(index, 1)
  localStorage.setItem("fichaOnePiece", JSON.stringify(data))
  carregarFicha()
}

// Sincronizar nível da aba atributos com a aba pessoal
function sincronizarNiveisEntreAbas() {
  const nivelClassePrincipal = document.getElementById("nivel-classe")
  const nivelProfissaoPrincipal = document.getElementById("nivel-profissao")
  const nivelClasseSecundario = document.getElementById("nivelClasse")
  const nivelProfissaoSecundario = document.getElementById("nivelProfissao")

  // Sempre que o principal mudar, atualizar o secundário
  nivelClassePrincipal.addEventListener("input", () => {
    nivelClasseSecundario.value = nivelClassePrincipal.value
  })

  nivelProfissaoPrincipal.addEventListener("input", () => {
    nivelProfissaoSecundario.value = nivelProfissaoPrincipal.value
  })
}

// Iniciar sincronização ao carregar a página
window.addEventListener("DOMContentLoaded", sincronizarNiveisEntreAbas)

/* -------------- CARREGAR / SALVAR / EXPORT / IMPORT / LIMPAR -------------- */
function carregarDoLocalStorage() {
  const str = localStorage.getItem("fichaOnePiece")
  if (!str) return {}
  return JSON.parse(str)
}

function carregarFicha() {
  try {
    // Verificar se estamos na ficha e não no menu
    const fichaContainer = document.getElementById("ficha-container")
    if (!fichaContainer || fichaContainer.style.display === "none") {
      return // Não carregar se não estivermos na ficha
    }

    const data = carregarDoLocalStorage()

    // Avatar
    if (data.avatarBase64) {
      const avatarPreview = document.getElementById("avatarPreview")
      if (avatarPreview) {
        avatarPreview.src = data.avatarBase64
      }
    }

    // Básico
    const nomeEl = document.getElementById("nome")
    if (nomeEl) nomeEl.value = data.nome || ""

    const racaEl = document.getElementById("raca")
    if (racaEl) racaEl.value = data.raca || "Humano"

    const classeEl = document.getElementById("classe")
    if (classeEl) classeEl.value = data.classe || "Lutador"

    const profissaoEl = document.getElementById("profissao")
    if (profissaoEl) profissaoEl.value = data.profissao || "Combatente"

    const potencialEl = document.getElementById("potencial")
    if (potencialEl) potencialEl.value = data.potencial || "Monstro"

    const nivelClasseEl = document.getElementById("nivel-classe")
    if (nivelClasseEl) nivelClasseEl.value = data.nivelClasse || 1

    const nivelProfissaoEl = document.getElementById("nivel-profissao")
    if (nivelProfissaoEl) nivelProfissaoEl.value = data.nivelProfissao || 1

    // Status
    document.getElementById("vidaAtual").value = data.vida || 10
    document.getElementById("vidaMax").value = data.vidaMax || 10
    document.getElementById("vigorAtual").value = data.vigor || 6
    document.getElementById("vigorMax").value = data.vigorMax || 6
    document.getElementById("classeAcerto").value = data.classeAcerto || ""
    document.getElementById("classeDificuldade").value = data.classeDificuldade || ""
    document.getElementById("determinacao").value = data.determinacao || ""
    document.getElementById("bonusMaestria").value = data.bonusMaestria || 1
    document.getElementById("sorte").value = data.sorte || ""
    document.getElementById("deslocamento").value = data.deslocamento || ""

    // Principais
    document.getElementById("forcaBase").value = data.forcaBase || 0
    document.getElementById("forcaBonus").value = data.forcaBonus || 0
    document.getElementById("forcaTotal").value = data.forcaTotal || 0

    document.getElementById("destrezaBase").value = data.destrezaBase || 0
    document.getElementById("destrezaBonus").value = data.destrezaBonus || 0
    document.getElementById("destrezaTotal").value = data.destrezaTotal || 0

    document.getElementById("vitalidadeBase").value = data.vitalidadeBase || 0
    document.getElementById("vitalidadeBonus").value = data.vitalidadeBonus || 0
    document.getElementById("vitalidadeTotal").value = data.vitalidadeTotal || 0

    document.getElementById("aparenciaBase").value = data.aparenciaBase || 0
    document.getElementById("aparenciaBonus").value = data.aparenciaBonus || 0
    document.getElementById("aparenciaTotal").value = data.aparenciaTotal || 0

    document.getElementById("conhecimentoBase").value = data.conhecimentoBase || 0
    document.getElementById("conhecimentoBonus").value = data.conhecimentoBonus || 0
    document.getElementById("conhecimentoTotal").value = data.conhecimentoTotal || 0

    document.getElementById("raciocinioBase").value = data.raciocinioBase || 0
    document.getElementById("raciocinioBonus").value = data.raciocinioBonus || 0
    document.getElementById("raciocinioTotal").value = data.raciocinioTotal || 0

    document.getElementById("vontadeBase").value = data.vontadeBase || 0
    document.getElementById("vontadeBonus").value = data.vontadeBonus || 0
    document.getElementById("vontadeTotal").value = data.vontadeTotal || 0

    document.getElementById("destinoBase").value = data.destinoBase || 0
    document.getElementById("destinoBonus").value = data.destinoBonus || 0
    document.getElementById("destinoTotal").value = data.destinoTotal || 0

    document.getElementById("velocidadeBase").value = data.velocidadeBase || 0
    document.getElementById("velocidadeBonus").value = data.velocidadeBonus || 0
    document.getElementById("velocidadeTotal").value = data.velocidadeTotal || 0

    document.getElementById("resilienciaBase").value = data.resilienciaBase || 0
    document.getElementById("resilienciaBonus").value = data.resilienciaBonus || 0
    document.getElementById("resilienciaTotal").value = data.resilienciaTotal || 0

    // Derivados
    document.getElementById("agilidadeBase").value = data.agilidadeBase || 0
    document.getElementById("agilidadeBonus").value = data.agilidadeBonus || 0
    document.getElementById("agilidadeTotal").value = data.agilidadeTotal || 0

    document.getElementById("resistenciaBase").value = data.resistenciaBase || 0
    document.getElementById("resistenciaBonus").value = data.resistenciaBonus || 0
    document.getElementById("resistenciaTotal").value = data.resistenciaTotal || 0

    document.getElementById("persistenciaBase").value = data.persistenciaBase || 0
    document.getElementById("persistenciaBonus").value = data.persistenciaBonus || 0
    document.getElementById("persistenciaTotal").value = data.persistenciaTotal || 0

    document.getElementById("disciplinaBase").value = data.disciplinaBase || 0
    document.getElementById("disciplinaBonus").value = data.disciplinaBonus || 0
    document.getElementById("disciplinaTotal").value = data.disciplinaTotal || 0

    document.getElementById("carismaBase").value = data.carismaBase || 0
    document.getElementById("carismaBonus").value = data.carismaBonus || 0
    document.getElementById("carismaTotal").value = data.carismaTotal || 0

    // Competencias e Aptidões
    if (data.listaCompetencias) {
      localStorage.setItem("competencia", JSON.stringify(data.listaCompetencias))
    }
    if (data.listaAptidoes) {
      localStorage.setItem("aptidao", JSON.stringify(data.listaAptidoes))
    }

    // Competências
    carregarCompetenciasEAptidoes(data.listaCompetencias || [])

    // Pontos de Competência e Aptidão
    document.getElementById("competencia-pontos").value = data.competenciaPontos || 0
    document.getElementById("aptidao-pontos").value = data.aptidaoPontos || 0

    // Ferimentos e Lesões
    exibirFerimentosLesoes(data.ferimentos, data.lesoes)

    // Reservas
    document.getElementById("reservaVidaQtd").value = data.reservaVidaQtd ?? (data.nivel || 1)
    document.getElementById("reservaVigorQtd").value = data.reservaVigorQtd ?? (data.nivel || 1)

    // Habilidades
    mostrarHabilidades(data.habilidades || [], "listaHabilidades")

    // Pontos de Habilidade
    document.getElementById("habilidade-pontos").value = data.habilidadePontos || 0
    document.getElementById("habilidade-fruta-pontos").value = data.habilidadeFrutaPontos || 0

    // Itens
    exibirItens(data.listaItens || [])

    // Ataques
    carregarAtaques()

    // Fruta
    document.getElementById("akumaNome").value = data.akumaNome || ""
    document.getElementById("akumaTipo").value = data.akumaTipo || "Paramecia"
    document.getElementById("akumaTematica").value = data.akumaTematica || ""
    document.getElementById("akumaDesejo").value = data.akumaDesejo || ""
    document.getElementById("akumaSubtipo").value = data.akumaSubtipo || ""
    atualizarSubtipos()

    document.getElementById("nivelFruta").value = data.nivelFruta || 0
    mostrarHabilidades(data.frutaHabilidades || [], "listaFruta")

    // Sessões
    exibirSessoes(data.listaSessoes || [])

    // Infos Pessoais
    document.getElementById("ilhaOrigem").value = data.ilhaOrigem || ""
    document.getElementById("historia").value = data.historia || ""
    document.getElementById("sonho").value = data.sonho || ""
    document.getElementById("pessoaImportante").value = data.pessoaImportante || ""
    document.getElementById("objetivos").value = data.objetivos || ""
    document.getElementById("qualidades").value = data.qualidades || ""
    document.getElementById("habilidadeInutil").value = data.habilidadeInutil || ""
    document.getElementById("defeitos").value = data.defeitos || ""
    document.getElementById("reputacao").value = data.reputacao || ""
    document.getElementById("moral").value = data.moral || ""

    // Progresso / Extras
    document.getElementById("bounty").value = data.bounty || ""
    document.getElementById("dinheiro").value = data.dinheiro || ""
    document.getElementById("anotacoesGerais").value = data.anotacoesGerais || ""
    // Sincronizar níveis após carregar a ficha
    document.getElementById("nivelClasse").value = document.getElementById("nivel-classe").value
    document.getElementById("nivelProfissao").value = document.getElementById("nivel-profissao").value

    // Recalcular
    atualizarAtributos()
    atualizarBarrasStatus()
    calcularReservas()
  } catch (error) {
    console.warn("Erro ao carregar ficha:", error)
    // Silenciosamente ignorar erros quando não estamos na ficha
  }
}

function salvarFicha() {
  const data = coletarDados()

  data.listaCompetencias = JSON.parse(localStorage.getItem("competencia")) || []
  data.listaAptidoes = JSON.parse(localStorage.getItem("aptidao")) || []

  localStorage.setItem("fichaOnePiece", JSON.stringify(data))
  //alert("Ficha salva no navegador (localStorage)!");
}

function coletarDados() {
  const oldData = carregarDoLocalStorage()
  const data = {}

  // Avatar
  data.avatarBase64 = document.getElementById("avatarPreview").src || ""

  // Informações Básicas
  data.nome = document.getElementById("nome").value || ""
  data.raca = document.getElementById("raca").value || ""
  data.classe = document.getElementById("classe").value || ""
  data.profissao = document.getElementById("profissao").value || ""
  data.potencial = document.getElementById("potencial").value || ""
  data.nivelClasse = document.getElementById("nivel-classe").value
  data.nivelProfissao = document.getElementById("nivel-profissao").value

  // Status
  data.vida = document.getElementById("vidaAtual").value
  data.vidaMax = document.getElementById("vidaMax").value
  data.vigor = document.getElementById("vigorAtual").value
  data.vigorMax = document.getElementById("vigorMax").value
  data.classeAcerto = document.getElementById("classeAcerto").value
  data.classeDificuldade = document.getElementById("classeDificuldade").value
  data.determinacao = document.getElementById("determinacao").value
  data.bonusMaestria = document.getElementById("bonusMaestria").value
  data.sorte = document.getElementById("sorte").value
  data.deslocamento = document.getElementById("deslocamento").value

  // Principais
  data.forcaBase = document.getElementById("forcaBase").value
  data.forcaBonus = document.getElementById("forcaBonus").value
  data.forcaTotal = document.getElementById("forcaTotal").value

  data.destrezaBase = document.getElementById("destrezaBase").value
  data.destrezaBonus = document.getElementById("destrezaBonus").value
  data.destrezaTotal = document.getElementById("destrezaTotal").value

  data.vitalidadeBase = document.getElementById("vitalidadeBase").value
  data.vitalidadeBonus = document.getElementById("vitalidadeBonus").value
  data.vitalidadeTotal = document.getElementById("vitalidadeTotal").value

  data.aparenciaBase = document.getElementById("aparenciaBase").value
  data.aparenciaBonus = document.getElementById("aparenciaBonus").value
  data.aparenciaTotal = document.getElementById("aparenciaTotal").value

  data.conhecimentoBase = document.getElementById("conhecimentoBase").value
  data.conhecimentoBonus = document.getElementById("conhecimentoBonus").value
  data.conhecimentoTotal = document.getElementById("conhecimentoTotal").value

  data.raciocinioBase = document.getElementById("raciocinioBase").value
  data.raciocinioBonus = document.getElementById("raciocinioBonus").value
  data.raciocinioTotal = document.getElementById("raciocinioTotal").value

  data.vontadeBase = document.getElementById("vontadeBase").value
  data.vontadeBonus = document.getElementById("vontadeBonus").value
  data.vontadeTotal = document.getElementById("vontadeTotal").value

  data.destinoBase = document.getElementById("destinoBase").value
  data.destinoBonus = document.getElementById("destinoBonus").value
  data.destinoTotal = document.getElementById("destinoTotal").value

  data.velocidadeBase = document.getElementById("velocidadeBase").value
  data.velocidadeBonus = document.getElementById("velocidadeBonus").value
  data.velocidadeTotal = document.getElementById("velocidadeTotal").value

  data.resilienciaBase = document.getElementById("resilienciaBase").value
  data.resilienciaBonus = document.getElementById("resilienciaBonus").value
  data.resilienciaTotal = document.getElementById("resilienciaTotal").value

  // Derivados
  data.agilidadeBase = document.getElementById("agilidadeBase").value
  data.agilidadeBonus = document.getElementById("agilidadeBonus").value
  data.agilidadeTotal = document.getElementById("agilidadeTotal").value

  data.resistenciaBase = document.getElementById("resistenciaBase").value
  data.resistenciaBonus = document.getElementById("resistenciaBonus").value
  data.resistenciaTotal = document.getElementById("resistenciaTotal").value

  data.persistenciaBase = document.getElementById("persistenciaBase").value
  data.persistenciaBonus = document.getElementById("persistenciaBonus").value
  data.persistenciaTotal = document.getElementById("persistenciaTotal").value

  data.disciplinaBase = document.getElementById("disciplinaBase").value
  data.disciplinaBonus = document.getElementById("disciplinaBonus").value
  data.disciplinaTotal = document.getElementById("disciplinaTotal").value

  data.carismaBase = document.getElementById("carismaBase").value
  data.carismaBonus = document.getElementById("carismaBonus").value
  data.carismaTotal = document.getElementById("carismaTotal").value

  // Competências e Aptidões
  data.listaCompetencias = JSON.parse(localStorage.getItem("competencia")) || []
  data.listaAptidoes = JSON.parse(localStorage.getItem("aptidao")) || []

  // Pontos de Competência e Aptidão
  data.competenciaPontos = Number.parseInt(document.getElementById("competencia-pontos").value) || 0
  data.aptidaoPontos = Number.parseInt(document.getElementById("aptidao-pontos").value) || 0

  // Lista de Ataques
  data.listaAtaques = JSON.parse(localStorage.getItem("ataques")) || []

  // Ferimentos e Lesões
  data.ferimentos = oldData.ferimentos || []
  data.lesoes = oldData.lesoes || []

  // Reservas
  data.reservaVidaQtd = document.getElementById("reservaVidaQtd").value
  data.reservaVigorQtd = document.getElementById("reservaVigorQtd").value

  // Pontos de Habilidade
  data.habilidadePontos = document.getElementById("habilidade-pontos").value
  data.habilidadeFrutaPontos = document.getElementById("habilidade-fruta-pontos").value

  // Informações Pessoais
  data.ilhaOrigem = document.getElementById("ilhaOrigem").value
  data.historia = document.getElementById("historia").value
  data.sonho = document.getElementById("sonho").value
  data.pessoaImportante = document.getElementById("pessoaImportante").value
  data.objetivos = document.getElementById("objetivos").value
  data.qualidades = document.getElementById("qualidades").value
  data.habilidadeInutil = document.getElementById("habilidadeInutil").value
  data.defeitos = document.getElementById("defeitos").value
  data.reputacao = document.getElementById("reputacao").value
  data.moral = document.getElementById("moral").value

  // Progresso / Extras
  data.nivelFruta = document.getElementById("nivelFruta").value
  data.bounty = document.getElementById("bounty").value
  data.dinheiro = document.getElementById("dinheiro").value
  data.anotacoesGerais = document.getElementById("anotacoesGerais").value

  // Akuma no Mi
  data.akumaNome = document.getElementById("akumaNome").value
  data.akumaTipo = document.getElementById("akumaTipo").value
  data.akumaSubtipo = document.getElementById("akumaSubtipo").value
  data.akumaTematica = document.getElementById("akumaTematica").value
  data.akumaDesejo = document.getElementById("akumaDesejo").value

  // Listas Dinâmicas
  // Mantemos as que já existiam, para não perder
  data.listaCompetencias = oldData.listaCompetencias || []
  data.listaItens = oldData.listaItens || []
  data.habilidades = oldData.habilidades || []
  data.frutaHabilidades = oldData.frutaHabilidades || []
  data.listaSessoes = oldData.listaSessoes || []

  return data
}

function exportarJSON() {
  const data = coletarDados()
  let nomePersonagem = data.nome || "Personagem"
  nomePersonagem = nomePersonagem.replace(/[^a-zA-Z0-9_-]+/g, "_")

  const str = JSON.stringify(data, null, 2)
  const blob = new Blob([str], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = `fichaOnePiece_${nomePersonagem}.json`
  link.click()

  URL.revokeObjectURL(url)
}

function importarJSON(input) {
  const file = input.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const str = e.target.result
    try {
      const data = JSON.parse(str)
      localStorage.setItem("fichaOnePiece", JSON.stringify(data))

      // Salvar também as competências e aptidões separadamente
      if (data.listaCompetencias) {
        localStorage.setItem("competencia", JSON.stringify(data.listaCompetencias))
      }
      if (data.listaAptidoes) {
        localStorage.setItem("aptidao", JSON.stringify(data.listaAptidoes))
      }
      if (data.listaAtaques) {
        localStorage.setItem("ataques", JSON.stringify(data.listaAtaques))
      }

      carregarFicha()
      carregarCompetenciasEAptidoes()
      alert("Importado com sucesso!")
    } catch (err) {
      alert("Erro ao ler JSON: " + err)
    }
  }
  reader.readAsText(file)
}

function limparFicha() {
  if (confirm("Tem certeza que deseja apagar TODOS os dados salvos?")) {
    // Remover dados do localStorage
    localStorage.removeItem("fichaOnePiece")
    localStorage.removeItem("competencia")
    localStorage.removeItem("aptidao")
    localStorage.removeItem("ataques")

    // Resetar campos básicos
    document.getElementById("nome").value = ""
    document.getElementById("raca").value = "umano"
    document.getElementById("classe").value = "Lutador"
    document.getElementById("profissao").value = "Combatente"
    document.getElementById("potencial").value = "Monstro"
    document.getElementById("nivel-classe").value = "1"
    document.getElementById("nivel-profissao").value = "1"

    // Resetar status
    document.getElementById("vidaAtual").value = "10"
    document.getElementById("vidaMax").value = "10"
    document.getElementById("vigorAtual").value = "6"
    document.getElementById("vigorMax").value = "6"

    // Resetar atributos principais
    const atributosBase = [
      "forcaBase",
      "destrezaBase",
      "vitalidadeBase",
      "aparenciaBase",
      "conhecimentoBase",
      "raciocinioBase",
      "vontadeBase",
      "destinoBase",
      "velocidadeBase",
      "resilienciaBase",
    ]

    const atributosBonus = [
      "forcaBonus",
      "destrezaBonus",
      "vitalidadeBonus",
      "aparenciaBonus",
      "conhecimentoBonus",
      "raciocinioBonus",
      "vontadeBonus",
      "destinoBonus",
      "velocidadeBonus",
      "resilienciaBonus",
    ]

    // Resetar atributos derivados
    const atributosDerivadosBonus = [
      "persistenciaBonus",
      "disciplinaBonus",
      "carismaBonus",
      "agilidadeBonus",
      "resistenciaBonus",
    ]

    // Limpar todos os atributos
    ;[...atributosBase, ...atributosBonus, ...atributosDerivadosBonus].forEach((id) => {
      document.getElementById(id).value = "0"
    })

    // Limpar listas dinâmicas
    document.getElementById("listaAtaques").innerHTML = ""
    document.getElementById("listaCompetencias").innerHTML = ""
    document.getElementById("listaAptidoes").innerHTML = ""
    document.getElementById("listaFerimentosLesoes").innerHTML = ""
    document.getElementById("listaHabilidades").innerHTML = ""
    document.getElementById("listaFruta").innerHTML = ""
    document.getElementById("listaItens").innerHTML = ""
    document.getElementById("listaSessoes").innerHTML = ""

    // Limpar campos de texto
    document.getElementById("akumaNoMi").value = ""
    document.getElementById("nivelFruta").value = "0"
    document.getElementById("ilhaOrigem").value = ""
    document.getElementById("historia").value = ""
    document.getElementById("sonho").value = ""
    document.getElementById("pessoaImportante").value = ""
    document.getElementById("objetivos").value = ""
    document.getElementById("qualidades").value = ""
    document.getElementById("habilidadeInutil").value = ""
    document.getElementById("defeitos").value = ""
    document.getElementById("reputacao").value = ""
    document.getElementById("moral").value = ""

    // Resetar avatar
    document.getElementById("avatarPreview").src = "/placeholder.svg"

    // Recalcular valores
    atualizarAtributos()
    atualizarBarrasStatus()
    calcularReservas()

    alert("Ficha limpa com sucesso!")
  }
}

function limparInterfacePersonagem() {
  // Função auxiliar para limpar a interface sem prompt
  // Remover dados do localStorage
  localStorage.removeItem("fichaOnePiece")
  localStorage.removeItem("competencia")
  localStorage.removeItem("aptidao")
  localStorage.removeItem("ataques")

  // Resetar campos básicos
  document.getElementById("nome").value = ""
  document.getElementById("raca").value = "Humano"
  document.getElementById("classe").value = "Lutador"
  document.getElementById("profissao").value = "Combatente"
  document.getElementById("potencial").value = "Monstro"
  document.getElementById("nivel-classe").value = "1"
  document.getElementById("nivel-profissao").value = "1"

  // Resetar status
  document.getElementById("vidaAtual").value = "10"
  document.getElementById("vidaMax").value = "10"
  document.getElementById("vigorAtual").value = "6"
  document.getElementById("vigorMax").value = "6"
  document.getElementById("determinacao").value = ""
  document.getElementById("bonusMaestria").value = "1"
  document.getElementById("sorte").value = ""
  document.getElementById("classeAcerto").value = ""
  document.getElementById("classeDificuldade").value = ""
  document.getElementById("deslocamento").value = ""

  // Resetar atributos principais
  const atributosBase = [
    "forcaBase",
    "destrezaBase",
    "vitalidadeBase",
    "aparenciaBase",
    "conhecimentoBase",
    "raciocinioBase",
    "vontadeBase",
    "destinoBase",
    "velocidadeBase",
    "resilienciaBase",
  ]

  const atributosBonus = [
    "forcaBonus",
    "destrezaBonus",
    "vitalidadeBonus",
    "aparenciaBonus",
    "conhecimentoBonus",
    "raciocinioBonus",
    "vontadeBonus",
    "destinoBonus",
    "velocidadeBonus",
    "resilienciaBonus",
  ]

  // Resetar atributos derivados
  const atributosDerivadosBonus = [
    "persistenciaBonus",
    "disciplinaBonus",
    "carismaBonus",
    "agilidadeBonus",
    "resistenciaBonus",
  ]

  // Limpar todos os atributos
  ;[...atributosBase, ...atributosBonus, ...atributosDerivadosBonus].forEach((id) => {
    document.getElementById(id).value = "0"
  })

  // Limpar listas dinâmicas
  document.getElementById("listaAtaques").innerHTML = ""
  document.getElementById("listaCompetencias").innerHTML = ""
  document.getElementById("listaAptidoes").innerHTML = ""
  document.getElementById("listaFerimentosLesoes").innerHTML = ""
  document.getElementById("listaHabilidades").innerHTML = ""
  document.getElementById("listaFruta").innerHTML = ""
  document.getElementById("listaItens").innerHTML = ""
  document.getElementById("listaSessoes").innerHTML = ""

  // Limpar pontos de habilidade
  document.getElementById("habilidade-pontos").value = "0"
  document.getElementById("habilidade-fruta-pontos").value = "0"
  document.getElementById("competencia-pontos").value = "0"
  document.getElementById("aptidao-pontos").value = "0"

  // Limpar Akuma no Mi
  document.getElementById("akumaNome").value = ""
  document.getElementById("akumaTipo").value = ""
  document.getElementById("akumaSubtipo").value = ""
  document.getElementById("akumaTematica").value = ""
  document.getElementById("akumaDesejo").value = ""
  document.getElementById("nivelFruta").value = "0"

  // Limpar campos de texto pessoais
  document.getElementById("ilhaOrigem").value = ""
  document.getElementById("historia").value = ""
  document.getElementById("sonho").value = ""
  document.getElementById("pessoaImportante").value = ""
  document.getElementById("objetivos").value = ""
  document.getElementById("qualidades").value = ""
  document.getElementById("habilidadeInutil").value = ""
  document.getElementById("defeitos").value = ""
  document.getElementById("reputacao").value = ""
  document.getElementById("moral").value = ""
  document.getElementById("bounty").value = ""
  document.getElementById("dinheiro").value = ""
  document.getElementById("anotacoesGerais").value = ""

  // Limpar reservas
  document.getElementById("reservaVidaQtd").value = "0"
  document.getElementById("reservaVigorQtd").value = "0"

  // Resetar avatar para placeholder
  document.getElementById("avatarPreview").src = "/placeholder.svg"

  // Recalcular valores
  // Recalcular valores
  atualizarAtributos()
  atualizarBarrasStatus()
  calcularReservas()
}
// Salvar automaticamente mudanças no localStorage
;["vidaAtual", "vidaMax", "vigorAtual", "vigorMax", "nivel-classe", "nivel-profissao"].forEach((id) => {
  document.getElementById(id).addEventListener("change", () => {
    salvarFicha()
    atualizarBarrasStatus()
  })
})

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    salvarFicha() // Salva os dados automaticamente ao sair da aba
  }
})
;["competencia-pontos", "aptidao-pontos"].forEach((id) => {
  document.getElementById(id).addEventListener("change", () => {
    salvarFicha()
  })
})

// Modo Escuro DARKMODE
function alternarTema() {
  const body = document.body
  const escuro = body.classList.toggle("dark-mode")

  // Atualizar botão do tema se existir (na ficha)
  const btn = document.getElementById("toggleThemeBtn")
  if (btn) {
    btn.textContent = escuro ? "Modo Claro" : "Modo Escuro"
  }

  // Atualizar botão do tema se existir (no menu)
  const menuBtn = document.getElementById("toggleThemeMenuBtn")
  if (menuBtn) {
    menuBtn.textContent = escuro ? "Modo Claro" : "Modo Escuro"
  }

  localStorage.setItem("temaRPG", escuro ? "escuro" : "claro")
}

// Tema aplicado no evento principal DOMContentLoaded

// Salva e restaura estado de <details>
document.querySelectorAll("details").forEach((detalhe, index) => {
  const key = `detailsState-${index}`

  // Restaurar estado salvo
  const aberto = localStorage.getItem(key)
  if (aberto === "true") detalhe.setAttribute("open", true)
  else detalhe.removeAttribute("open")

  // Monitorar mudanças
  detalhe.addEventListener("toggle", () => {
    localStorage.setItem(key, detalhe.open)
  })
})
// Estado habilidades
function salvarEstadoAccordion(section, index, isOpen) {
  const data = carregarDoLocalStorage()
  const lista = section === "listaHabilidades" ? data.habilidades : data.frutaHabilidades

  if (lista && lista[index]) {
    lista[index].expanded = isOpen
    localStorage.setItem("fichaOnePiece", JSON.stringify(data))
  }
}

// Função auxiliar para obter valor de atributo
function obterValorAtributo(nomeAtributo) {
  const elemento = document.getElementById(nomeAtributo + "Total")
  return elemento ? Number.parseInt(elemento.value) || 0 : 0
}

// Função de debug para testar o sistema
window.testarSistema = () => {
  console.log("=== TESTE DO SISTEMA ===")
  console.log("personagemAtualId:", personagemAtualId)
  console.log("Menu visível:", document.getElementById("menu-inicial").style.display)
  console.log("Ficha visível:", document.getElementById("ficha-container").style.display)
  console.log("Personagens salvos:", localStorage.getItem("personagensOnePiece"))

  console.log("Testando voltarParaMenu...")
  voltarParaMenu()
}

// Expor funções para debug global
window.voltarParaMenu = voltarParaMenu
window.mostrarMenu = mostrarMenu
window.mostrarFicha = mostrarFicha

// === SISTEMA DE MÚLTIPLAS FICHAS ===
let personagemAtualId = null

// Funções para gerenciar múltiplas fichas
function carregarPersonagens() {
  const personagens = JSON.parse(localStorage.getItem("personagensOnePiece")) || {}
  return personagens
}

function salvarPersonagem(id, data) {
  const personagens = carregarPersonagens()
  personagens[id] = data
  localStorage.setItem("personagensOnePiece", JSON.stringify(personagens))
}

function criarNovoPersonagem() {
  const id = "personagem_" + Date.now()
  personagemAtualId = id

  console.log("Criando novo personagem com ID:", id)
  
  // Ir para a ficha e criar uma ficha vazia
  mostrarFicha()
  
  // Criar dados básicos para novo personagem
  const dadosVazios = {
    nome: "",
    raca: "Humano",
    classe: "Lutador",
    profissao: "Combatente",
    potencial: "Monstro",
    nivelClasse: "1",
    nivelProfissao: "1",
    vidaAtual: "10",
    vidaMax: "10",
    vigorAtual: "6", 
    vigorMax: "6",
    forcaBase: 0,
    destrezaBase: 0,
    vitalidadeBase: 0,
    aparenciaBase: 0,
    conhecimentoBase: 0,
    raciocinioBase: 0,
    vontadeBase: 0,
    destinoBase: 0,
    velocidadeBase: 0,
    resilienciaBase: 0,
    habilidades: [],
    frutaHabilidades: [],
    listaCompetencias: [],
    listaItens: [],
    listaSessoes: []
  }
  
  // Salvar como localStorage temporário
  localStorage.setItem("fichaOnePiece", JSON.stringify(dadosVazios))
  
  // Carregar a ficha vazia
  carregarFicha()
  atualizarBarrasStatus()
}

function carregarPersonagem(id) {
  personagemAtualId = id
  const personagens = carregarPersonagens()
  const data = personagens[id]

  if (data) {
    localStorage.setItem("fichaOnePiece", JSON.stringify(data))
    if (data.listaCompetencias) {
      localStorage.setItem("competencia", JSON.stringify(data.listaCompetencias))
    }
    if (data.listaAptidoes) {
      localStorage.setItem("aptidao", JSON.stringify(data.listaAptidoes))
    }
    if (data.listaAtaques) {
      localStorage.setItem("ataques", JSON.stringify(data.listaAtaques))
    }
  }

  mostrarFicha()
  carregarFicha()
}

function mostrarMenu() {
  try {
    console.log("Mostrando menu...")
    const menuInicial = document.getElementById("menu-inicial")
    const fichaContainer = document.getElementById("ficha-container")

    if (menuInicial && fichaContainer) {
      menuInicial.style.display = "block"
      fichaContainer.style.display = "none"
      carregarGridPersonagens()
      console.log("Menu mostrado com sucesso!")
    } else {
      console.error("Elementos não encontrados:", { menuInicial, fichaContainer })
    }
  } catch (error) {
    console.error("Erro ao mostrar menu:", error)
  }
}

function mostrarFicha() {
  document.getElementById("menu-inicial").style.display = "none"
  document.getElementById("ficha-container").style.display = "block"
}

function voltarParaMenu() {
  try {
    // Salvar personagem atual antes de voltar
    if (personagemAtualId) {
      console.log("Salvando personagem:", personagemAtualId)
      const data = coletarDados()
      salvarPersonagem(personagemAtualId, data)
    }

    console.log("Voltando para o menu...")
    mostrarMenu()
  } catch (error) {
    console.error("Erro ao voltar para o menu:", error)
    // Tentar voltar mesmo com erro
    mostrarMenu()
  }
}

function carregarGridPersonagens() {
  const personagens = carregarPersonagens()
  const grid = document.getElementById("personagens-grid")
  grid.innerHTML = ""

  if (Object.keys(personagens).length === 0) {
    grid.innerHTML =
      '<div class="sem-personagens">Nenhum personagem criado ainda. Clique em "Criar Novo Personagem" para começar!</div>'
    return
  }

  Object.entries(personagens).forEach(([id, data]) => {
    const card = document.createElement("div")
    card.className = "personagem-card"

    const nome = data.nome || "Sem nome"
    const classe = data.classe || "Sem classe"
    const nivel = data.nivelClasse || 1

    // Gerenciar avatar de forma mais robusta
    let avatarHtml = ''
    if (data.avatarBase64 && data.avatarBase64.trim() !== '') {
      avatarHtml = `<img src="${data.avatarBase64}" alt="${nome}" onerror="this.src='/placeholder.svg'">`
    } else {
      avatarHtml = `<div class="placeholder"></div>`
    }

    card.innerHTML = `
      <div class="personagem-avatar">
        ${avatarHtml}
      </div>
      <div class="personagem-info">
        <h3>${nome}</h3>
        <p><strong>Classe:</strong> ${classe}</p>
        <p><strong>Nível:</strong> ${nivel}</p>
      </div>
      <div class="personagem-actions">
        <button class="btn btn-primary" onclick="carregarPersonagem('${id}')">
          Jogar
        </button>
        <button class="btn btn-secondary" onclick="duplicarPersonagem('${id}')">
          Duplicar
        </button>
        <button class="btn btn-success" onclick="exportarPersonagem('${id}')">
          Exportar
        </button>
        <button class="btn btn-danger" onclick="excluirPersonagem('${id}')">
          Excluir
        </button>
      </div>
    `

    grid.appendChild(card)
  })
}

function duplicarPersonagem(id) {
  const personagens = carregarPersonagens()
  const original = personagens[id]

  if (original) {
    const novoId = "personagem_" + Date.now()
    const copia = JSON.parse(JSON.stringify(original))
    copia.nome = (copia.nome || "Sem nome") + " (Cópia)"

    salvarPersonagem(novoId, copia)
    carregarGridPersonagens()
  }
}

function excluirPersonagem(id) {
  const personagens = carregarPersonagens()
  const nome = personagens[id]?.nome || "este personagem"

  if (confirm(`Tem certeza que deseja excluir ${nome}?`)) {
    delete personagens[id]
    localStorage.setItem("personagensOnePiece", JSON.stringify(personagens))
    carregarGridPersonagens()
  }
}

function exportarPersonagem(id) {
  const personagens = carregarPersonagens()
  const data = personagens[id]

  if (data) {
    const nomePersonagem = (data.nome || "Personagem").replace(/[^a-zA-Z0-9_-]+/g, "_")
    const str = JSON.stringify(data, null, 2)
    const blob = new Blob([str], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `${nomePersonagem}.json`
    link.click()

    URL.revokeObjectURL(url)
  }
}

function importarPersonagem(input) {
  const file = input.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      const id = "personagem_" + Date.now()

      salvarPersonagem(id, data)
      carregarGridPersonagens()
      fecharImportExport()
      alert("Personagem importado com sucesso!")
    } catch (err) {
      alert("Erro ao importar personagem: " + err.message)
    }
  }
  reader.readAsText(file)
}

function mostrarImportExport() {
  document.getElementById("modal-import-export").style.display = "flex"
}

function fecharImportExport() {
  document.getElementById("modal-import-export").style.display = "none"
  document.getElementById("importPersonagem").value = ""
}

function limparTodosPersonagens() {
  if (confirm("ATENÇÃO: Isso irá excluir TODOS os personagens salvos. Tem certeza?")) {
    localStorage.removeItem("personagensOnePiece")
    carregarGridPersonagens()
    alert("Todos os personagens foram excluídos.")
  }
}

// Modificar a função salvarFicha original para salvar no sistema de múltiplas fichas
const salvarFichaOriginal = salvarFicha
salvarFicha = () => {
  salvarFichaOriginal() // Manter compatibilidade

  if (personagemAtualId) {
    const data = coletarDados()
    salvarPersonagem(personagemAtualId, data)
  }
}

// Sistema inicializado no evento principal DOMContentLoaded acima
