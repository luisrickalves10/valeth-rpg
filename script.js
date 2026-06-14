const regions = {
  Valeth: {
    description: "Capital do reino e sede do Conselho Real, onde alianças e traições decidem o futuro do continente.",
    faction: "Conselho Real de Valeth"
  },
  Corália: {
    description: "Cidade portuária rica, movida por comércio, navios mercantes e acordos feitos longe dos olhos da coroa.",
    faction: "Liga dos Navegantes"
  },
  Thurvael: {
    description: "Floresta ancestral protegida por antigos juramentos élficos e trilhas que mudam ao luar.",
    faction: "Guardas de Thurvael"
  },
  Valdruun: {
    description: "Fortaleza sombria no território dos vampiros, marcada por torres negras e pactos de sangue.",
    faction: "Corte Carmesim"
  },
  "A Forja": {
    description: "Reino montanhoso dos anões, célebre por armas sagradas, minas profundas e honra inflexível.",
    faction: "Clãs da Bigorna"
  },
  Eriadun: {
    description: "Areias infinitas guardando ruínas, profecias soterradas e caravanas que raramente retornam intactas.",
    faction: "Senhores das Dunas"
  },
  Vorzak: {
    description: "Bastião hostil dos orcs e ogros, onde força, fogo e conquista ditam a lei.",
    faction: "Horda de Vorzak"
  },
  Uldor: {
    description: "Terras dos clãs livres, endurecidas por frio, pedra e guerras antigas contra invasores do norte.",
    faction: "Clãs de Uldor"
  },
  "Lua Silenciosa": {
    description: "Domínio isolado de monges e magos, conhecido por observatórios, neve eterna e segredos arcanos.",
    faction: "Ordem da Lua Silenciosa"
  },
  Lodamar: {
    description: "Pântano de águas negras onde viajantes desaparecem entre névoa, raízes e sussurros antigos.",
    faction: "Bruxos de Lodamar"
  },
  "Cinturão de Magmar": {
    description: "Arquipélago vulcânico de ilhas perigosas, cinzas vivas e portos controlados por forças rivais.",
    faction: "Pactos de Magmar"
  }
};

const heroFiles = [
  "alquimista.png", "ANAO.png", "ASSASSINO.png", "Barbara.png", "BARBARO.png", "BARDO.png", "bruxo.png", "cavaleiro.png",
  "CLERIGO.png", "Draconato.png", "druida.png", "Elfo.png", "feiticeira.png", "gladiador.png", "ilusionista.png",
  "LADINA.png", "mago.png", "mercenario.png", "metamorfo.png", "monge.png", "nagah.png", "ninja.png", "OGRO.png",
  "ORC.png", "PIRATA.png", "pistoleiro.png", "Raj o Paladino.png", "ranger.png", "sacerdotiza.png", "samurai.png",
  "vampiro.png", "xama.png"
];

const animalFiles = [
  "alazao.png", "alazaon.png", "camelo.png", "cao.png", "cervo.png", "coruja.png", "corvo.png", "Dragão.png",
  "elefante.png", "escorpiao.png", "falcao.png", "FENIX.png", "gorila.png", "grifo.png", "guepardo.png", "javali.png",
  "leao.png", "lobo.png", "onça.png", "potro.png", "puma.png", "raposa.png", "serpente.png", "tigre.png", "urso.png"
];

const weaponFiles = [
  "adaga.png", "alabarda.png", "arco.png", "besta.png", "cajado.png", "Chakram.png", "chicote.png", "cimitarra.png",
  "clava.png", "EXCALIBUR.png", "foice.png", "lamina.png", "lanca.png", "machado.png", "mangual.png", "martelo.png",
  "revolver.png", "tridente.png", "urumi.png", "ZARABATANA.png"
];

const magicFiles = [
  "anelarcano.png", "areia.png", "BALISTAFATAL.png", "bardos.png", "cacaarcana.png", "cacacura.png", "cacadefensores.png",
  "cacaespecialistas.png", "cacafurtividade.png", "cacaguerreiros.png", "cacanatureza.png", "capa.png", "CATAPULTA.png",
  "cavalaria.png", "chapeu.png", "cogumelos.png", "conselho.png", "cordao.png", "cura100.png", "cura1d20.png",
  "cura2d20.png", "Emboscada Mortal.png", "encantador.png", "erronavegacao.png", "forja.png", "gema.png",
  "GIGANTEALIADO.png", "Grimório.png", "inverno.png", "joiacoroa.png", "mapa.png", "Nythor.png", "pergaminho.png",
  "Presságio Sombrio.png", "saqueadores.png", "suborno.png", "taberna.png", "tesoureiro.png", "tesouro.png", "trevo.png",
  "trevodasorte30.png", "trevodasorte40.png", "TRIBUTO.png"
];

const tooltip = document.getElementById("regionTooltip");
const hotspots = document.querySelectorAll(".region-hotspot");
const menuButtons = document.querySelectorAll(".menu-button");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalClose = document.getElementById("modalClose");
const combatModal = document.getElementById("combatModal");
const combatModalClose = document.getElementById("combatModalClose");
const combatChoices = document.querySelectorAll(".combat-choice");
const mainMenu = document.getElementById("mainMenu");
const battlefield = document.getElementById("battlefield");
const battleGrid = document.getElementById("battleGrid");
const combatLog = document.getElementById("combatLog");
const battleTitle = document.getElementById("battleTitle");
const backToMenu = document.getElementById("backToMenu");
const humanAttack = document.getElementById("humanAttack");
const roomPanel = document.getElementById("roomPanel");
const roomRole = document.getElementById("roomRole");
const roomLinkText = document.getElementById("roomLinkText");
const roomLinkInput = document.getElementById("roomLinkInput");
const copyRoomLink = document.getElementById("copyRoomLink");
const socketStatus = document.getElementById("socketStatus");

let battleState = null;
let aiTimer = null;
let roomSocket = null;

function renderTooltip(regionName) {
  const region = regions[regionName];
  tooltip.innerHTML = `
    <h2>${regionName}</h2>
    <p>${region.description}</p>
    <strong>Facção dominante: ${region.faction}</strong>
  `;
}

function positionTooltip(event) {
  const margin = 18;
  const bounds = tooltip.getBoundingClientRect();
  let left = event.clientX + 16;
  let top = event.clientY + 16;

  if (left + bounds.width + margin > window.innerWidth) {
    left = event.clientX - bounds.width - 22;
  }

  if (top + bounds.height + margin > window.innerHeight) {
    top = event.clientY - bounds.height - 22;
  }

  tooltip.style.left = `${Math.max(margin, left)}px`;
  tooltip.style.top = `${Math.max(margin, top)}px`;
}

hotspots.forEach((hotspot) => {
  hotspot.addEventListener("mouseenter", (event) => {
    renderTooltip(hotspot.dataset.region);
    tooltip.classList.add("is-visible");
    positionTooltip(event);
  });

  hotspot.addEventListener("mousemove", positionTooltip);
  hotspot.addEventListener("mouseleave", () => tooltip.classList.remove("is-visible"));
  hotspot.addEventListener("focus", (event) => {
    renderTooltip(hotspot.dataset.region);
    tooltip.classList.add("is-visible");
    positionTooltip({
      clientX: event.target.getBoundingClientRect().left,
      clientY: event.target.getBoundingClientRect().top
    });
  });
  hotspot.addEventListener("blur", () => tooltip.classList.remove("is-visible"));
});

function showMessage(title, message) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modalBackdrop.classList.add("is-open");
  modalBackdrop.setAttribute("aria-hidden", "false");
  modalClose.focus();
}

function closeMessage() {
  modalBackdrop.classList.remove("is-open");
  modalBackdrop.setAttribute("aria-hidden", "true");
}

function openCombatModal() {
  combatModal.classList.add("is-open");
  combatModal.setAttribute("aria-hidden", "false");
}

function closeCombatModal() {
  combatModal.classList.remove("is-open");
  combatModal.setAttribute("aria-hidden", "true");
}

menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.menuAction === "combat") {
      openCombatModal();
      return;
    }

    showMessage("Funcionalidade em desenvolvimento", "Este caminho ainda está sendo escrito nos anais de Valeth.");
  });
});

modalClose.addEventListener("click", closeMessage);
combatModalClose.addEventListener("click", closeCombatModal);

[modalBackdrop, combatModal].forEach((backdrop) => {
  backdrop.addEventListener("click", (event) => {
    if (event.target === modalBackdrop) closeMessage();
    if (event.target === combatModal) closeCombatModal();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMessage();
    closeCombatModal();
  }
});

function baseName(fileName) {
  return fileName.replace(/\.png$/i, "").replace(/[-_]/g, " ");
}

function titleCase(value) {
  return value.toLowerCase().replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

function hashValue(value) {
  return [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function makeCard(fileName, folder, role) {
  const name = titleCase(baseName(fileName));
  const seed = hashValue(fileName);
  const heroTypes = ["Guerreiro", "Arcano", "Furtivo", "Sagrado", "Selvagem", "Sombrio"];
  const animalTypes = ["Companheiro Animal", "Montaria", "Guardião", "Predador", "Místico"];
  const weaponTypes = ["Arma Corpo a Corpo", "Arma de Alcance", "Arma Rúnica"];
  const magicTypes = ["Item Mágico", "Relíquia", "Artefato", "Encantamento"];

  const typeMap = {
    hero: heroTypes[seed % heroTypes.length],
    animal: animalTypes[seed % animalTypes.length],
    weapon: weaponTypes[seed % weaponTypes.length],
    magic: magicTypes[seed % magicTypes.length]
  };

  return {
    name,
    file: `CARDS/${folder}/${encodeURIComponent(fileName)}`,
    type: typeMap[role],
    magic: 3 + (seed % 9),
    strength: 4 + (seed % 10),
    damage: 8 + (seed % 13),
    health: role === "animal" ? 25 + (seed % 36) : 100,
    reward: role === "animal" ? 5 + (seed % 16) : 0
  };
}

const catalog = {
  heroes: heroFiles.map((file) => makeCard(file, "HEROIS", "hero")),
  animals: animalFiles.map((file) => makeCard(file, "ANIMAIS", "animal")),
  weapons: weaponFiles.map((file) => makeCard(file, "ARMAS", "weapon")),
  magic: magicFiles.map((file) => makeCard(file, "MAGICAS", "magic"))
};

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function createRoomId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function getRoomFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const room = params.get("room");
  const humans = Number(params.get("humans"));

  if (!room || !humans) return null;
  return { room, humans: Math.min(4, Math.max(1, humans)), isGuest: true };
}

function createBattle(humans, roomData = null) {
  const roomId = roomData?.room || (humans > 1 ? createRoomId() : null);
  const shuffledHeroes = shuffle(catalog.heroes);

  const players = Array.from({ length: 4 }, (_, index) => {
    const isHuman = index < humans;
    const hero = shuffledHeroes[index];
    const animal = pick(catalog.animals);

    return {
      id: `p${index + 1}`,
      name: isHuman ? `Jogador ${index + 1}` : `IA ${index + 1}`,
      isHuman,
      isHost: index === 0 && humans > 1 && !roomData?.isGuest,
      health: 100,
      soul: 10,
      gold: 0,
      xp: 0,
      hero,
      animal,
      weapon: null,
      magicItem: null,
      armor: null
    };
  });

  return {
    roomId,
    humans,
    players,
    log: [
      humans === 1
        ? "Partida solo iniciada: 1 humano + 3 IA."
        : `Sala ${roomId} criada: ${humans} humanos e ${4 - humans} IA.`
    ],
    turn: 1,
    finished: false
  };
}

function startBattle(humans, roomData = null) {
  closeCombatModal();
  stopAi();
  battleState = createBattle(humans, roomData);
  mainMenu.hidden = true;
  battlefield.hidden = false;
  battleTitle.textContent = humans === 1 ? "Jogar Solo" : `Sala Online ${battleState.roomId}`;
  setupRoomPanel(roomData);
  connectRoomSocket();
  renderBattle();
  startAi();
}

function setupRoomPanel(roomData) {
  if (!battleState.roomId) {
    roomPanel.hidden = true;
    socketStatus.textContent = "Solo: IA local ativa";
    return;
  }

  const params = new URLSearchParams({ room: battleState.roomId, humans: String(battleState.humans) });
  const link = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  roomPanel.hidden = false;
  roomRole.textContent = roomData?.isGuest ? "Convidado" : "Host";
  roomLinkText.textContent = "Compartilhe este link para convidados entrarem na sala:";
  roomLinkInput.value = link;
  socketStatus.textContent = "Online: conectando sala...";
}

function connectRoomSocket() {
  if (roomSocket) roomSocket.close();
  roomSocket = null;

  if (!battleState.roomId) return;

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const url = `${protocol}//${window.location.host}/ws?room=${battleState.roomId}`;

  try {
    roomSocket = new WebSocket(url);
  } catch {
    socketStatus.textContent = "Online: servidor WebSocket indisponível";
    return;
  }

  roomSocket.addEventListener("open", () => {
    socketStatus.textContent = "Online: sala conectada";
    sendRoomMessage("join", { room: battleState.roomId, humans: battleState.humans });
  });

  roomSocket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "state" && message.payload?.state) {
      battleState = message.payload.state;
      renderBattle(false);
    }
  });

  roomSocket.addEventListener("close", () => {
    socketStatus.textContent = "Online: sala local sem WebSocket ativo";
  });

  roomSocket.addEventListener("error", () => {
    socketStatus.textContent = "Online: WebSocket não disponível neste deploy";
  });
}

function sendRoomMessage(type, payload = {}) {
  if (!roomSocket || roomSocket.readyState !== WebSocket.OPEN) return;
  roomSocket.send(JSON.stringify({ type, payload }));
}

function renderBattle(shouldBroadcast = true) {
  battleGrid.innerHTML = battleState.players.map(renderPlayer).join("");
  combatLog.innerHTML = battleState.log.slice(-8).map((item) => `<p>${item}</p>`).join("");
  if (shouldBroadcast) {
    sendRoomMessage("state", { state: battleState });
  }
}

function renderPlayer(player) {
  const statusClass = player.health <= 0 ? "is-defeated" : "";
  return `
    <article class="player-board ${statusClass}">
      <header class="player-header">
        <div>
          <strong>${player.name}</strong>
          <span>${player.isHuman ? "Humano" : "IA"}${player.isHost ? " / Host" : ""}</span>
        </div>
        <span class="life-badge">${player.health} VIDA</span>
      </header>
      <div class="stats-row">
        <span>Alma ${player.soul}</span>
        <span>Ouro ${player.gold}</span>
        <span>XP ${player.xp}</span>
      </div>
      <div class="deck-slots">
        ${renderSlot("Herói", "blue", player.hero, ["Nome", "Tipo", "Vida", "Alma", "Ouro", "XP"], player)}
        ${renderSlot("Companheiro Animal", "green", player.animal, ["Nome", "Tipo", "Vida", "Força", "Magia", "Dano", "Recompensa"], player)}
        ${renderSlot("Arma", "red", player.weapon, ["Nome", "Tipo", "Força", "Dano"], player)}
        ${renderSlot("Item Mágico", "purple", player.magicItem, ["Nome", "Tipo", "Magia", "Dano"], player)}
        ${renderSlot("Armadura/Escudo", "gray", player.armor, ["Nome", "Tipo"], player)}
      </div>
    </article>
  `;
}

function renderSlot(title, color, card, fields, player) {
  if (!card) {
    return `
      <div class="card-slot ${color}">
        <div class="empty-card">
          <strong>${title}</strong>
          <span>Espaço vazio</span>
        </div>
      </div>
    `;
  }

  const values = {
    Nome: card.name,
    Tipo: card.type,
    Vida: title === "Herói" ? player.health : card.health,
    Alma: player.soul,
    Ouro: player.gold,
    XP: player.xp,
    Força: card.strength,
    Magia: card.magic,
    Dano: card.damage,
    Recompensa: card.reward
  };

  return `
    <div class="card-slot ${color}">
      <img src="${card.file}" alt="${card.name}">
      <div class="card-info">
        <strong>${title}</strong>
        ${fields.map((field) => `<span>${field}: ${values[field]}</span>`).join("")}
      </div>
    </div>
  `;
}

function alivePlayers() {
  return battleState.players.filter((player) => player.health > 0);
}

function targetLowestLife(attacker) {
  return alivePlayers()
    .filter((player) => player.id !== attacker.id)
    .sort((a, b) => a.health - b.health)[0];
}

function playerDamage(player) {
  return Math.max(6, player.hero.damage + Math.floor(player.hero.strength / 3) + (player.weapon?.damage || 0));
}

function attack(attacker) {
  if (!attacker || attacker.health <= 0 || battleState.finished) return;

  const target = targetLowestLife(attacker);
  if (!target) return;

  const damage = playerDamage(attacker);
  target.health = Math.max(0, target.health - damage);
  attacker.xp += target.health === 0 ? 20 : 5;
  attacker.gold += target.health === 0 ? 10 : 2;
  battleState.log.push(`${attacker.name} atacou ${target.name} e causou ${damage} de dano.`);

  if (target.health === 0) {
    battleState.log.push(`${target.name} caiu no campo de batalha.`);
  }

  resolveWinner();
  renderBattle();
}

function equipAutomatically(player) {
  if (player.health <= 0) return;

  if (!player.weapon) {
    player.weapon = pick(catalog.weapons);
    battleState.log.push(`${player.name} equipou ${player.weapon.name}.`);
  } else if (!player.magicItem && Math.random() > 0.45) {
    player.magicItem = pick(catalog.magic);
    player.soul += Math.max(1, Math.floor(player.magicItem.magic / 3));
    battleState.log.push(`${player.name} ativou ${player.magicItem.name}.`);
  }
}

function resolveWinner() {
  const alive = alivePlayers();
  if (alive.length === 1) {
    battleState.finished = true;
    battleState.log.push(`${alive[0].name} venceu a partida de Valeth.`);
    stopAi();
  }
}

function aiStep() {
  if (!battleState || battleState.finished) return;

  const aiPlayers = battleState.players.filter((player) => !player.isHuman && player.health > 0);
  aiPlayers.forEach((player) => {
    equipAutomatically(player);
    attack(player);
  });
}

function startAi() {
  aiTimer = window.setInterval(aiStep, 3600);
}

function stopAi() {
  if (aiTimer) window.clearInterval(aiTimer);
  aiTimer = null;
}

function humanTurn() {
  if (!battleState) return;
  const human = battleState.players.find((player) => player.isHuman && player.health > 0);
  equipAutomatically(human);
  attack(human);
}

combatChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    startBattle(Number(choice.dataset.humans));
  });
});

backToMenu.addEventListener("click", () => {
  stopAi();
  if (roomSocket) roomSocket.close();
  battlefield.hidden = true;
  mainMenu.hidden = false;
});

humanAttack.addEventListener("click", humanTurn);

copyRoomLink.addEventListener("click", async () => {
  if (!roomLinkInput.value) return;
  await navigator.clipboard.writeText(roomLinkInput.value);
  showMessage("Link copiado", "Envie o link da sala para os convidados entrarem na partida.");
});

const incomingRoom = getRoomFromUrl();
if (incomingRoom) {
  startBattle(incomingRoom.humans, incomingRoom);
}
