// ── Region data ──────────────────────────────────────────
const regions = {
  Valeth:               { description: "Capital do reino e sede do Conselho Real, onde alianças e traições decidem o futuro do continente.", faction: "Conselho Real de Valeth" },
  Corália:              { description: "Cidade portuária rica, movida por comércio, navios mercantes e acordos feitos longe dos olhos da coroa.", faction: "Liga dos Navegantes" },
  Thurvael:             { description: "Floresta ancestral protegida por antigos juramentos élficos e trilhas que mudam ao luar.", faction: "Guardas de Thurvael" },
  Valdruun:             { description: "Fortaleza sombria no território dos vampiros, marcada por torres negras e pactos de sangue.", faction: "Corte Carmesim" },
  "A Forja":            { description: "Reino montanhoso dos anões, célebre por armas sagradas, minas profundas e honra inflexível.", faction: "Clãs da Bigorna" },
  Eriadun:              { description: "Areias infinitas guardando ruínas, profecias soterradas e caravanas que raramente retornam intactas.", faction: "Senhores das Dunas" },
  Vorzak:               { description: "Bastião hostil dos orcs e ogros, onde força, fogo e conquista ditam a lei.", faction: "Horda de Vorzak" },
  Uldor:                { description: "Terras dos clãs livres, endurecidas por frio, pedra e guerras antigas contra invasores do norte.", faction: "Clãs de Uldor" },
  "Lua Silenciosa":     { description: "Domínio isolado de monges e magos, conhecido por observatórios, neve eterna e segredos arcanos.", faction: "Ordem da Lua Silenciosa" },
  Lodamar:              { description: "Pântano de águas negras onde viajantes desaparecem entre névoa, raízes e sussurros antigos.", faction: "Bruxos de Lodamar" },
  "Cinturão de Magmar": { description: "Arquipélago vulcânico de ilhas perigosas, cinzas vivas e portos controlados por forças rivais.", faction: "Pactos de Magmar" },
};

// ── Card file lists ──────────────────────────────────────
const heroFiles = [
  "alquimista.png","ANAO.png","ASSASSINO.png","Barbara.png","BARBARO.png","BARDO.png","bruxo.png","cavaleiro.png",
  "CLERIGO.png","Draconato.png","druida.png","Elfo.png","feiticeira.png","gladiador.png","ilusionista.png",
  "LADINA.png","mago.png","mercenario.png","metamorfo.png","monge.png","nagah.png","ninja.png","OGRO.png",
  "ORC.png","PIRATA.png","pistoleiro.png","Raj o Paladino.png","ranger.png","sacerdotiza.png","samurai.png",
  "vampiro.png","xama.png",
];
const animalFiles = [
  "alazao.png","alazaon.png","camelo.png","cao.png","cervo.png","coruja.png","corvo.png","Dragão.png",
  "elefante.png","escorpiao.png","falcao.png","FENIX.png","gorila.png","grifo.png","guepardo.png","javali.png",
  "leao.png","lobo.png","onça.png","potro.png","puma.png","raposa.png","serpente.png","tigre.png","urso.png",
];
const weaponFiles = [
  "adaga.png","alabarda.png","arco.png","besta.png","cajado.png","Chakram.png","chicote.png","cimitarra.png",
  "clava.png","EXCALIBUR.png","foice.png","lamina.png","lanca.png","machado.png","mangual.png","martelo.png",
  "revolver.png","tridente.png","urumi.png","ZARABATANA.png",
];
const magicFiles = [
  "anelarcano.png","areia.png","BALISTAFATAL.png","bardos.png","cacaarcana.png","cacacura.png","cacadefensores.png",
  "cacaespecialistas.png","cacafurtividade.png","cacaguerreiros.png","cacanatureza.png","capa.png","CATAPULTA.png",
  "cavalaria.png","chapeu.png","cogumelos.png","conselho.png","cordao.png","cura100.png","cura1d20.png",
  "cura2d20.png","Emboscada Mortal.png","encantador.png","erronavegacao.png","forja.png","gema.png",
  "GIGANTEALIADO.png","Grimório.png","inverno.png","joiacoroa.png","mapa.png","Nythor.png","pergaminho.png",
  "Presságio Sombrio.png","saqueadores.png","suborno.png","taberna.png","tesoureiro.png","tesouro.png","trevo.png",
  "trevodasorte30.png","trevodasorte40.png","TRIBUTO.png",
];
// Combates e Defesas: em elaboração — arrays vazios por ora, prontos para receber arquivos
const combatFiles  = [];
const defenseFiles = [];

// ── Utilities ────────────────────────────────────────────
function hashValue(s) { return [...s].reduce((n, c) => n + c.charCodeAt(0), 0); }
function baseName(f)  { return f.replace(/\.png$/i, "").replace(/[-_]/g, " "); }
function titleCase(s) { return s.toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase()); }
function shuffle(a)   { return [...a].sort(() => Math.random() - 0.5); }
function pick(a)      { return a[Math.floor(Math.random() * a.length)]; }

// ── Card factory ─────────────────────────────────────────
function makeCard(fileName, folder, role) {
  const name = titleCase(baseName(fileName));
  const seed = hashValue(fileName);
  const types = {
    hero:    ["Guerreiro","Arcano","Furtivo","Sagrado","Selvagem","Sombrio"][seed % 6],
    animal:  ["Companheiro Animal","Montaria","Guardião","Predador","Místico"][seed % 5],
    weapon:  ["Arma Corpo a Corpo","Arma de Alcance","Arma Rúnica"][seed % 3],
    magic:   ["Item Mágico","Relíquia","Artefato","Encantamento"][seed % 4],
    combat:  ["Inimigo","Monstro","Chefe de Área"][seed % 3],
    defense: ["Escudo","Armadura","Proteção Arcana"][seed % 3],
  };
  return {
    role,
    name,
    file:     `CARDS/${folder}/${encodeURIComponent(fileName)}`,
    type:     types[role],
    strength: 4  + (seed % 10),
    magic:    3  + (seed % 9),
    damage:   8  + (seed % 13),
    defense:  role === "defense" ? 4 + (seed % 12) : 0,
    health:   role === "animal" ? 25 + (seed % 36) : role === "combat" ? 30 + (seed % 50) : 100,
    reward:   role === "animal" ? 5  + (seed % 16) : 10,
  };
}

const catalog = {
  heroes:   heroFiles.map(f    => makeCard(f, "HEROIS",   "hero")),
  animals:  animalFiles.map(f  => makeCard(f, "ANIMAIS",  "animal")),
  weapons:  weaponFiles.map(f  => makeCard(f, "ARMAS",    "weapon")),
  magic:    magicFiles.map(f   => makeCard(f, "MAGICAS",  "magic")),
  combats:  combatFiles.map(f  => makeCard(f, "COMBATES", "combat")),
  defenses: defenseFiles.map(f => makeCard(f, "DEFESAS",  "defense")),
};

// ── Ataque Total ─────────────────────────────────────────
function calcTotalAttack(player) {
  const h = player.hero     || { magic: 0, strength: 0 };
  const a = player.animal   || { magic: 0, strength: 0 };
  const w = player.weapon   || { damage: 0 };
  const m = player.magicItem|| { damage: 0 };
  const d = player.armor    || { defense: 0 };
  return (h.magic + h.strength) + (a.magic + a.strength) + w.damage + m.damage + d.defense;
}

// ── DOM refs ─────────────────────────────────────────────
const tooltip          = document.getElementById("regionTooltip");
const hotspots         = document.querySelectorAll(".region-hotspot");
const menuButtons      = document.querySelectorAll(".menu-button");
const modalBackdrop    = document.getElementById("modalBackdrop");
const modalTitle       = document.getElementById("modalTitle");
const modalMessage     = document.getElementById("modalMessage");
const modalClose       = document.getElementById("modalClose");
const combatModal      = document.getElementById("combatModal");
const combatModalClose = document.getElementById("combatModalClose");
const combatChoices    = document.querySelectorAll(".combat-choice");
const mainMenu         = document.getElementById("mainMenu");
const battlefield      = document.getElementById("battlefield");
const battleGrid       = document.getElementById("battleGrid");
const combatLog        = document.getElementById("combatLog");
const battleTitle      = document.getElementById("battleTitle");
const backToMenu       = document.getElementById("backToMenu");
const humanAttack      = document.getElementById("humanAttack");
const roomPanel        = document.getElementById("roomPanel");
const roomRole         = document.getElementById("roomRole");
const roomLinkText     = document.getElementById("roomLinkText");
const roomLinkInput    = document.getElementById("roomLinkInput");
const copyRoomLink     = document.getElementById("copyRoomLink");
const socketStatus     = document.getElementById("socketStatus");
// Initiative
const initiativePanel     = document.getElementById("initiativePanel");
const initiativeGrid      = document.getElementById("initiativeGrid");
const initiativeOrder     = document.getElementById("initiativeOrder");
const initiativeOrderList = document.getElementById("initiativeOrderList");
const initiativeStart     = document.getElementById("initiativeStart");
// Decks
const valethDeckEl     = document.getElementById("valethDeck");
const valethCountEl    = document.getElementById("valethDeckCount");
const cemeteryEl       = document.getElementById("cemetery");
const cemeteryCountEl  = document.getElementById("cemeteryCount");
const cemeteryPreviewEl= document.getElementById("cemeteryPreview");
// Card action modal
const cardActionModal  = document.getElementById("cardActionModal");
const cardActionImg    = document.getElementById("cardActionImg");
const cardActionName   = document.getElementById("cardActionName");
const cardActionDesc   = document.getElementById("cardActionDesc");
const cardActionStats  = document.getElementById("cardActionStats");
const cardActionCat    = document.getElementById("cardActionCategory");
const cardActionBtns   = document.getElementById("cardActionBtns");

// ── App state ────────────────────────────────────────────
let battleState = null;
let aiTimer     = null;
let roomSocket  = null;

// ── Map tooltip ──────────────────────────────────────────
function positionTooltip(ev) {
  const b = tooltip.getBoundingClientRect(), m = 18;
  let l = ev.clientX + 16, t = ev.clientY + 16;
  if (l + b.width  + m > window.innerWidth)  l = ev.clientX - b.width  - 22;
  if (t + b.height + m > window.innerHeight) t = ev.clientY - b.height - 22;
  tooltip.style.left = `${Math.max(m, l)}px`;
  tooltip.style.top  = `${Math.max(m, t)}px`;
}
hotspots.forEach(h => {
  h.addEventListener("mouseenter", e => {
    const r = regions[h.dataset.region];
    tooltip.innerHTML = `<h2>${h.dataset.region}</h2><p>${r.description}</p><strong>Facção: ${r.faction}</strong>`;
    tooltip.classList.add("is-visible"); positionTooltip(e);
  });
  h.addEventListener("mousemove",  positionTooltip);
  h.addEventListener("mouseleave", () => tooltip.classList.remove("is-visible"));
});

// ── Generic modal ────────────────────────────────────────
function showMessage(title, msg) {
  modalTitle.textContent = title; modalMessage.textContent = msg;
  modalBackdrop.classList.add("is-open"); modalBackdrop.setAttribute("aria-hidden","false");
}
function closeMessage()   { modalBackdrop.classList.remove("is-open"); modalBackdrop.setAttribute("aria-hidden","true"); }
function openCombatModal(){ combatModal.classList.add("is-open");    combatModal.setAttribute("aria-hidden","false"); }
function closeCombatModal(){ combatModal.classList.remove("is-open"); combatModal.setAttribute("aria-hidden","true"); }

menuButtons.forEach(b => {
  b.addEventListener("click", () => {
    if (b.dataset.menuAction === "combat") { openCombatModal(); return; }
    showMessage("Funcionalidade em desenvolvimento","Este caminho ainda está sendo escrito nos anais de Valeth.");
  });
});
modalClose.addEventListener("click", closeMessage);
combatModalClose.addEventListener("click", closeCombatModal);
[modalBackdrop, combatModal].forEach(bd => {
  bd.addEventListener("click", e => {
    if (e.target === modalBackdrop) closeMessage();
    if (e.target === combatModal)   closeCombatModal();
  });
});
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeMessage(); closeCombatModal(); closeCardAction(); } });

// ── Card Action Modal ────────────────────────────────────
const ROLE_LABELS = { hero:"Herói", animal:"Animal", weapon:"Arma", magic:"Mágica", combat:"Combate", defense:"Defesa" };
const ROLE_ICONS  = { hero:"👑", animal:"🐾", weapon:"⚔️", magic:"✨", combat:"💀", defense:"🛡" };

function openCardAction(card, player, onConfirm, onDiscard) {
  cardActionImg.src = card.file;
  cardActionImg.alt = card.name;
  cardActionName.textContent = card.name;
  cardActionCat.textContent  = `${ROLE_ICONS[card.role]} ${ROLE_LABELS[card.role]} · ${card.type}`;

  const stats = [];
  if (card.strength) stats.push(`<span>⚔ Força <strong>${card.strength}</strong></span>`);
  if (card.magic)    stats.push(`<span>✨ Magia <strong>${card.magic}</strong></span>`);
  if (card.damage)   stats.push(`<span>💥 Dano <strong>${card.damage}</strong></span>`);
  if (card.defense)  stats.push(`<span>🛡 Defesa <strong>${card.defense}</strong></span>`);
  if (card.health)   stats.push(`<span>❤ Vida <strong>${card.health}</strong></span>`);
  if (card.reward)   stats.push(`<span>🪙 Recomp. <strong>${card.reward}</strong></span>`);
  cardActionStats.innerHTML = stats.join("");

  const descs = {
    animal:  "Substitui seu Companheiro Animal atual (o antigo vai ao Cemitério) ou descarte.",
    weapon:  "Substitui sua Arma atual (a antiga vai ao Cemitério) ou descarte.",
    magic:   "Adiciona ao seu deck como Item Mágico. Ação específica da carta em breve.",
    defense: `Equipa como Armadura/Escudo, somando +${card.defense} ao seu Ataque Total.`,
    hero:    "Enfrente este herói inimigo em combate — compare Ataques Totais.",
    combat:  "Carta de Combate — enfrente o desafio comparando Ataques Totais.",
  };
  cardActionDesc.textContent = descs[card.role] || "";

  cardActionBtns.innerHTML = "";

  if (onConfirm) {
    const labels = { animal:"🐾 Usar como Companheiro", weapon:"⚔️ Equipar Arma", magic:"✨ Adicionar ao Deck", defense:"🛡 Equipar Defesa", hero:"⚔️ Enfrentar em Combate", combat:"⚔️ Enfrentar em Combate" };
    const btn = document.createElement("button");
    btn.className = "card-action-btn confirm"; btn.textContent = labels[card.role] || "Usar";
    btn.onclick = () => { closeCardAction(); onConfirm(); };
    cardActionBtns.appendChild(btn);
  }
  const btnD = document.createElement("button");
  btnD.className = "card-action-btn discard"; btnD.textContent = "🗑 Descartar ao Cemitério";
  btnD.onclick = () => { closeCardAction(); onDiscard(); };
  cardActionBtns.appendChild(btnD);

  cardActionModal.classList.add("is-open"); cardActionModal.setAttribute("aria-hidden","false");
}
function closeCardAction() { cardActionModal.classList.remove("is-open"); cardActionModal.setAttribute("aria-hidden","true"); }
cardActionModal.addEventListener("click", e => { if (e.target === cardActionModal) closeCardAction(); });

// ── Room / WebSocket ─────────────────────────────────────
function createRoomId() { return Math.random().toString(36).slice(2,8).toUpperCase(); }
function getRoomFromUrl() {
  const p = new URLSearchParams(window.location.search);
  const room = p.get("room"), humans = Number(p.get("humans"));
  if (!room || !humans) return null;
  return { room, humans: Math.min(4, Math.max(1, humans)), isGuest: true };
}
function setupRoomPanel(roomData) {
  if (!battleState.roomId) { roomPanel.hidden = true; socketStatus.textContent = "Solo: IA local ativa"; return; }
  const params = new URLSearchParams({ room: battleState.roomId, humans: String(battleState.humans) });
  roomPanel.hidden = false;
  roomRole.textContent = roomData?.isGuest ? "Convidado" : "Host";
  roomLinkText.textContent = "Compartilhe este link:";
  roomLinkInput.value = `${location.origin}${location.pathname}?${params}`;
  socketStatus.textContent = "Online: conectando sala...";
}
function connectRoomSocket() {
  if (roomSocket) roomSocket.close(); roomSocket = null;
  if (!battleState.roomId) return;
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  try { roomSocket = new WebSocket(`${proto}//${location.host}/ws?room=${battleState.roomId}`); } catch { return; }
  roomSocket.addEventListener("open",    () => { socketStatus.textContent = "Online: sala conectada"; });
  roomSocket.addEventListener("message", e  => { const m = JSON.parse(e.data); if (m.type==="state"&&m.payload?.state) { battleState=m.payload.state; renderBattle(false); } });
  roomSocket.addEventListener("close",   () => { socketStatus.textContent = "Online: sala desconectada"; });
  roomSocket.addEventListener("error",   () => { socketStatus.textContent = "Online: WebSocket indisponível"; });
}
function sendRoomMessage(type, payload={}) {
  if (!roomSocket || roomSocket.readyState !== WebSocket.OPEN) return;
  roomSocket.send(JSON.stringify({ type, payload }));
}

// ── Monte Valeth ─────────────────────────────────────────
function buildValethDeck(usedHeroNames) {
  return shuffle([
    ...catalog.heroes.filter(c => !usedHeroNames.includes(c.name)),
    ...catalog.animals,
    ...catalog.weapons,
    ...catalog.magic,
    ...catalog.combats,
    ...catalog.defenses,
  ]);
}

function renderDecks() {
  const dc = battleState?.valethDeck?.length || 0;
  const cc = battleState?.cemetery?.length   || 0;
  valethCountEl.textContent   = dc;
  cemeteryCountEl.textContent = cc;
  valethDeckEl.classList.toggle("is-empty", dc === 0);
  // Cemetery top-3 preview
  if (cemeteryPreviewEl) {
    const top3 = (battleState?.cemetery || []).slice(-3).reverse();
    cemeteryPreviewEl.innerHTML = top3.map(c =>
      `<div class="cem-thumb" title="${c.name}">${ROLE_ICONS[c.role]}</div>`
    ).join("");
  }
}

function discardCard(card) {
  if (!card) return;
  battleState.cemetery.push(card);
  renderDecks();
}

function drawFromValeth(player) {
  if (!battleState.valethDeck?.length) {
    battleState.log.push("O Monte Valeth está vazio!");
    renderBattle(); return;
  }
  if (battleState.waitingForCard) {
    battleState.log.push("Resolva a carta anterior antes de comprar outra.");
    renderBattle(); return;
  }
  const card = battleState.valethDeck.shift();
  battleState.log.push(`${player.name} comprou "${card.name}" (${ROLE_LABELS[card.role]}) do Monte Valeth.`);
  battleState.waitingForCard = true;
  renderBattle();
  handleValethCard(card, player);
}

function handleValethCard(card, player) {
  const afterResolve = () => { battleState.waitingForCard = false; renderDecks(); renderBattle(); };
  const onDiscard = () => { discardCard(card); battleState.log.push(`${player.name} descartou "${card.name}" ao Cemitério.`); afterResolve(); };

  const actions = {
    animal: () => openCardAction(card, player, () => {
      if (player.animal) discardCard(player.animal);
      player.animal = card;
      battleState.log.push(`${player.name} substituiu o companheiro animal por ${card.name}.`);
      afterResolve();
    }, onDiscard),

    weapon: () => openCardAction(card, player, () => {
      if (player.weapon) discardCard(player.weapon);
      player.weapon = card;
      battleState.log.push(`${player.name} equipou ${card.name} como arma.`);
      afterResolve();
    }, onDiscard),

    magic: () => openCardAction(card, player, () => {
      if (player.magicItem) discardCard(player.magicItem);
      player.magicItem = card;
      player.soul += Math.max(1, Math.floor(card.magic / 3));
      battleState.log.push(`${player.name} adicionou ${card.name} ao deck (+${Math.max(1,Math.floor(card.magic/3))} alma).`);
      afterResolve();
    }, onDiscard),

    defense: () => openCardAction(card, player, () => {
      if (player.armor) discardCard(player.armor);
      player.armor = card;
      battleState.log.push(`${player.name} equipou ${card.name} como defesa (+${card.defense} ataque).`);
      afterResolve();
    }, onDiscard),

    hero:   () => openCardAction(card, player, () => { resolveCombatCard(card, player, afterResolve); }, onDiscard),
    combat: () => openCardAction(card, player, () => { resolveCombatCard(card, player, afterResolve); }, onDiscard),
  };

  (actions[card.role] || (() => { openCardAction(card, player, null, onDiscard); }))();
}

function resolveCombatCard(card, player, afterResolve) {
  const playerAtk = calcTotalAttack(player);
  const cardAtk   = card.strength + card.magic;
  if (playerAtk >= cardAtk) {
    player.gold += card.reward;
    player.xp   += 15;
    battleState.log.push(`${player.name} venceu o combate contra "${card.name}"! Ataque ${playerAtk} vs ${cardAtk}. +${card.reward} ouro, +15 XP.`);
  } else {
    const dmg = Math.max(5, card.damage - Math.floor(playerAtk / 4));
    player.health = Math.max(0, player.health - dmg);
    battleState.log.push(`${player.name} perdeu o combate contra "${card.name}"! Ataque ${playerAtk} vs ${cardAtk}. Sofreu ${dmg} de dano.`);
    if (player.health === 0) { battleState.log.push(`${player.name} caiu!`); resolveWinner(); }
  }
  discardCard(card);
  afterResolve();
}

// Valeth deck click — only human on current turn can draw
valethDeckEl.addEventListener("click", () => {
  if (!battleState || battleState.finished || !battleState.initiativeOrder) return;
  const current = currentTurnPlayer();
  if (!current || !current.isHuman) {
    battleState.log.push("Apenas o jogador da vez pode comprar do Monte Valeth.");
    renderBattle(); return;
  }
  drawFromValeth(current);
});
valethDeckEl.addEventListener("keydown", e => { if (e.key==="Enter"||e.key===" ") valethDeckEl.click(); });

// ── Battle creation ──────────────────────────────────────
function createBattle(humans, roomData = null) {
  const roomId = roomData?.room || (humans > 1 ? createRoomId() : null);
  const shuffledHeroes = shuffle(catalog.heroes);
  const players = Array.from({ length: 4 }, (_, i) => {
    const isHuman = i < humans;
    return {
      id: `p${i+1}`,
      name: isHuman ? `Jogador ${i+1}` : `IA ${i+1}`,
      isHuman, isHost: i===0 && humans>1 && !roomData?.isGuest,
      health: 100, soul: 10, gold: 0, xp: 0,
      hero:   shuffledHeroes[i],
      animal: pick(catalog.animals),
      weapon: null, magicItem: null, armor: null,
    };
  });
  const usedHeroNames = players.map(p => p.hero.name);
  return {
    roomId, humans, players,
    log: [humans===1 ? "Partida solo iniciada: 1 humano + 3 IA." : `Sala ${roomId} criada: ${humans} humanos e ${4-humans} IA.`],
    turn: 1, finished: false,
    valethDeck: buildValethDeck(usedHeroNames),
    cemetery: [],
    waitingForCard: false,
    initiativeOrder: null, currentTurnIndex: 0,
  };
}

// ── Initiative system ────────────────────────────────────
let initiativeRolls   = {};
let initiativePlayers = [];

function d20Roll() { return Math.floor(Math.random() * 20) + 1; }

function d20Svg() {
  return `<svg class="d20-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <polygon points="50,4 96,28 96,72 50,96 4,72 4,28" fill="#1a1208" stroke="#d6a24a" stroke-width="2.5"/>
  <polygon points="50,4 96,28 50,50"  fill="none" stroke="rgba(214,162,74,0.4)" stroke-width="1"/>
  <polygon points="96,28 96,72 50,50" fill="none" stroke="rgba(214,162,74,0.4)" stroke-width="1"/>
  <polygon points="96,72 50,96 50,50" fill="none" stroke="rgba(214,162,74,0.4)" stroke-width="1"/>
  <polygon points="50,96 4,72 50,50"  fill="none" stroke="rgba(214,162,74,0.4)" stroke-width="1"/>
  <polygon points="4,72 4,28 50,50"   fill="none" stroke="rgba(214,162,74,0.4)" stroke-width="1"/>
  <polygon points="4,28 50,4 50,50"   fill="none" stroke="rgba(214,162,74,0.4)" stroke-width="1"/>
</svg>`;
}

function openInitiativePanel(players) {
  initiativeRolls   = {};
  initiativePlayers = players;
  initiativeStart.disabled = true;
  initiativeStart.textContent = "Aguardando rolagens...";
  initiativeOrder.hidden = true;
  initiativeOrderList.innerHTML = "";

  initiativeGrid.innerHTML = players.map(p => `
    <div class="initiative-card ${p.isHuman?"is-human":""}" id="icard-${p.id}">
      <span class="player-label ${p.isHuman?"human-label":""}">${p.name}<small> ${p.isHuman?"Humano":"IA"}</small></span>
      <div class="d20-container" id="d20-${p.id}">${d20Svg()}<span class="d20-result" id="d20r-${p.id}"></span></div>
      <span class="d20-hint" id="d20h-${p.id}">${p.isHuman?"Clique para rolar":""}</span>
      ${p.isHuman
        ? `<button class="roll-btn" id="rollbtn-${p.id}" onclick="rollInitiative('${p.id}')">🎲 Rolar D20</button>`
        : `<span class="ai-auto-badge">Rolando...</span>`}
    </div>`).join("");

  initiativePanel.hidden = false;

  players.filter(p => !p.isHuman).forEach((p, i) => {
    setTimeout(() => {
      const roll = d20Roll();
      initiativeRolls[p.id] = roll;
      applyRollVisual(p.id, roll);
      checkAllRolled();
    }, 600 + i * 450);
  });
}

function rollInitiative(pid) {
  if (initiativeRolls[pid] !== undefined) return;
  const container = document.getElementById(`d20-${pid}`);
  const btn = document.getElementById(`rollbtn-${pid}`);
  if (!container) return;
  container.classList.add("is-rolling");
  if (btn) btn.disabled = true;
  const roll = d20Roll();
  setTimeout(() => {
    container.classList.remove("is-rolling");
    initiativeRolls[pid] = roll;
    applyRollVisual(pid, roll);
    checkAllRolled();
  }, 580);
}
window.rollInitiative = rollInitiative;

function applyRollVisual(pid, roll) {
  const el = document.getElementById(`d20-${pid}`);
  const re = document.getElementById(`d20r-${pid}`);
  const he = document.getElementById(`d20h-${pid}`);
  if (!el || !re) return;
  el.classList.add("is-rolled");
  if (roll === 20) el.classList.add("nat20");
  re.textContent = roll;
  if (he) he.style.visibility = "hidden";
}

function checkAllRolled() {
  const players = initiativePlayers;
  if (!players.length || !players.every(p => initiativeRolls[p.id] !== undefined)) return;

  const sorted = [...players].sort((a, b) => {
    const d = initiativeRolls[b.id] - initiativeRolls[a.id];
    return d !== 0 ? d : Math.random() - 0.5;
  });
  battleState.initiativeOrder = sorted.map(p => p.id);

  initiativeOrderList.innerHTML = sorted.map((p, i) => {
    const s = initiativeRolls[p.id];
    return `<li class="${i===0?"is-first":""}">${i+1}. ${p.name} — <span class="order-score">${s}</span>${s===20?" 🌟":s===1?" 💀":""}</li>`;
  }).join("");

  initiativeOrder.hidden = false;
  initiativeStart.disabled = false;
  initiativeStart.textContent = "⚔️ Iniciar Batalha";
}

initiativeStart.addEventListener("click", () => {
  if (initiativeStart.disabled) return;
  initiativePanel.hidden = true;
  const names = battleState.initiativeOrder.map((id, i) => {
    const p = battleState.players.find(pl => pl.id === id);
    return `${i+1}º ${p.name}(${initiativeRolls[id]})`;
  });
  battleState.log.push(`⚔️ Iniciativa: ${names.join(" → ")}`);
  battleState.currentTurnIndex = 0;
  advanceTurnToNextAlive();
  const first = currentTurnPlayer();
  if (first) battleState.log.push(`Vez de ${first.name} — compre do Monte Valeth ou ataque.`);
  renderBattle();
  startAi();
});

// ── Turn management ──────────────────────────────────────
function currentTurnPlayer() {
  if (!battleState?.initiativeOrder) return null;
  const order = battleState.initiativeOrder;
  for (let i = 0; i < order.length; i++) {
    const p = battleState.players.find(p => p.id === order[(battleState.currentTurnIndex + i) % order.length]);
    if (p?.health > 0) return p;
  }
  return null;
}
function advanceTurn() {
  if (!battleState?.initiativeOrder) return;
  battleState.currentTurnIndex = (battleState.currentTurnIndex + 1) % battleState.initiativeOrder.length;
  advanceTurnToNextAlive();
}
function advanceTurnToNextAlive() {
  if (!battleState?.initiativeOrder) return;
  const order = battleState.initiativeOrder;
  for (let i = 0; i < order.length; i++) {
    const idx = (battleState.currentTurnIndex + i) % order.length;
    const p   = battleState.players.find(p => p.id === order[idx]);
    if (p?.health > 0) { battleState.currentTurnIndex = idx; return; }
  }
}

// ── Render ───────────────────────────────────────────────
function renderBattle(broadcast = true) {
  battleGrid.innerHTML = battleState.players.map(renderPlayer).join("");
  combatLog.innerHTML  = battleState.log.slice(-10).map(l => `<p>${l}</p>`).join("");
  renderDecks();

  const cur = currentTurnPlayer();
  if (!battleState.initiativeOrder || battleState.finished) {
    humanAttack.disabled = true; humanAttack.textContent = "Atacar";
  } else if (cur?.isHuman) {
    humanAttack.disabled = false; humanAttack.textContent = `⚔️ Atacar (${cur.name})`;
  } else {
    humanAttack.disabled = true; humanAttack.textContent = cur ? `Vez de ${cur.name}…` : "Atacar";
  }

  if (broadcast) sendRoomMessage("state", { state: battleState });
}

function renderPlayer(player) {
  const defeated = player.health <= 0;
  const cur      = currentTurnPlayer();
  const active   = cur?.id === player.id && !battleState.finished;
  const totalAtk = calcTotalAttack(player);
  const initScore= initiativeRolls[player.id];

  // Breakdown
  const h = player.hero     || { magic:0, strength:0 };
  const a = player.animal   || { magic:0, strength:0 };
  const heroAtk   = h.magic + h.strength;
  const animalAtk = a.magic + a.strength;
  const weaponAtk = player.weapon?.damage  || 0;
  const magicAtk  = player.magicItem?.damage || 0;
  const defAtk    = player.armor?.defense   || 0;

  return `<article class="player-board ${defeated?"is-defeated":""} ${active?"is-active-turn":""}">
    <header class="player-header">
      <div>
        <strong>${player.name}</strong>
        <span>${initScore!=null?`D20:${initScore} · `:""}${player.isHuman?"Humano":"IA"}${player.isHost?" · Host":""}</span>
      </div>
      <div class="player-badges">
        ${active?`<span class="turn-badge">🗡 Vez</span>`:""}
        <span class="attack-badge" title="Ataque Total">⚔ ${totalAtk}</span>
        <span class="life-badge">❤ ${player.health}</span>
      </div>
    </header>
    <div class="stats-row">
      <span>Alma ${player.soul}</span><span>🪙 ${player.gold}</span><span>XP ${player.xp}</span>
    </div>
    <div class="attack-total-row">
      <span class="atk-label">Ataque Total</span>
      <span class="atk-value">${totalAtk}</span>
      <span class="atk-breakdown">Herói ${heroAtk} + Animal ${animalAtk} + Arma ${weaponAtk} + Mágica ${magicAtk} + Defesa ${defAtk}</span>
    </div>
    <div class="deck-slots">
      ${renderSlot("Herói",             "blue",   player.hero,       ["Força","Magia","Dano"], player)}
      ${renderSlot("Companheiro Animal","green",  player.animal,     ["Força","Magia","Dano"], player)}
      ${renderSlot("Arma",             "red",    player.weapon,     ["Dano"], player)}
      ${renderSlot("Item Mágico",      "purple", player.magicItem,  ["Magia","Dano"], player)}
      ${renderSlot("Armadura/Defesa",  "gray",   player.armor,      ["Defesa"], player)}
    </div>
  </article>`;
}

function renderSlot(title, color, card, fields, player) {
  if (!card) return `<div class="card-slot ${color}"><div class="empty-card"><strong>${title}</strong><span>Vazio</span></div></div>`;
  const vals = { Força:card.strength, Magia:card.magic, Dano:card.damage, Defesa:card.defense, Vida:title==="Herói"?player.health:card.health };
  return `<div class="card-slot ${color}">
    <img src="${card.file}" alt="${card.name}">
    <div class="card-info"><strong>${title}</strong><em>${card.name}</em>${fields.map(f=>`<span>${f}: ${vals[f]??0}</span>`).join("")}</div>
  </div>`;
}

// ── Combat logic ─────────────────────────────────────────
function alivePlayers()      { return battleState.players.filter(p => p.health > 0); }
function targetForAttack(me) { return alivePlayers().filter(p => p.id !== me.id).sort((a,b) => a.health-b.health)[0]; }

function attack(attacker) {
  if (!attacker || attacker.health <= 0 || battleState.finished) return;
  const target = targetForAttack(attacker);
  if (!target) return;
  const dmg = Math.max(4, calcTotalAttack(attacker));
  target.health = Math.max(0, target.health - dmg);
  attacker.gold += target.health === 0 ? 10 : 2;
  attacker.xp   += target.health === 0 ? 20 : 5;
  battleState.log.push(`${attacker.name} atacou ${target.name} — ${dmg} dano (Ataque Total ${calcTotalAttack(attacker)}).`);
  if (target.health === 0) battleState.log.push(`${target.name} foi derrotado!`);
  resolveWinner();
  if (!battleState.finished) {
    advanceTurn();
    const next = currentTurnPlayer();
    if (next) battleState.log.push(`Vez de ${next.name}.`);
  }
  renderBattle();
}

function resolveWinner() {
  const alive = alivePlayers();
  if (alive.length === 1) {
    battleState.finished = true;
    battleState.log.push(`🏆 ${alive[0].name} venceu a batalha de Valeth!`);
    stopAi();
  }
}

function aiAutoEquip(player) {
  if (!player.weapon) {
    player.weapon = pick(catalog.weapons);
    battleState.log.push(`${player.name} equipou ${player.weapon.name}.`);
  }
  if (!player.magicItem && Math.random() > 0.5) {
    player.magicItem = pick(catalog.magic);
    player.soul += Math.max(1, Math.floor(player.magicItem.magic / 3));
    battleState.log.push(`${player.name} ativou ${player.magicItem.name}.`);
  }
}

function aiDrawValeth(player) {
  if (!battleState.valethDeck?.length || battleState.waitingForCard) return;
  if (Math.random() > 0.45) return; // not every turn
  const card = battleState.valethDeck.shift();
  battleState.log.push(`${player.name} (IA) comprou "${card.name}" do Monte Valeth.`);
  // AI auto-resolves
  if      (card.role === "weapon"  && !player.weapon)   { if(player.weapon)discardCard(player.weapon); player.weapon=card; battleState.log.push(`${player.name} equipou ${card.name}.`); }
  else if (card.role === "animal")                       { if(player.animal)discardCard(player.animal); player.animal=card; battleState.log.push(`${player.name} trocou companheiro por ${card.name}.`); }
  else if (card.role === "magic"   && !player.magicItem) { player.magicItem=card; player.soul+=Math.max(1,Math.floor(card.magic/3)); battleState.log.push(`${player.name} ativou ${card.name}.`); }
  else if (card.role === "defense" && !player.armor)     { player.armor=card; battleState.log.push(`${player.name} equipou defesa ${card.name} (+${card.defense}).`); }
  else if (card.role === "hero" || card.role === "combat") { resolveCombatCard(card, player, () => {}); }
  else discardCard(card);
  renderDecks();
}

function aiStep() {
  if (!battleState || battleState.finished || !battleState.initiativeOrder || battleState.waitingForCard) return;
  const cur = currentTurnPlayer();
  if (!cur || cur.isHuman) return;
  aiDrawValeth(cur);
  aiAutoEquip(cur);
  attack(cur);
}

function startAi()  { aiTimer = window.setInterval(aiStep, 3800); }
function stopAi()   { if (aiTimer) clearInterval(aiTimer); aiTimer = null; }

function humanTurn() {
  if (!battleState?.initiativeOrder) return;
  const cur = currentTurnPlayer();
  if (!cur) return;
  if (!cur.isHuman) { battleState.log.push(`Não é a sua vez — aguarde ${cur.name}.`); renderBattle(); return; }
  aiAutoEquip(cur);
  attack(cur);
}

// ── Start battle ─────────────────────────────────────────
function startBattle(humans, roomData = null) {
  closeCombatModal();
  stopAi();
  battleState = createBattle(humans, roomData);
  mainMenu.hidden    = true;
  battlefield.hidden = false;
  battleTitle.textContent = humans === 1 ? "Jogar Solo" : `Sala Online ${battleState.roomId}`;
  setupRoomPanel(roomData);
  connectRoomSocket();
  renderBattle();
  openInitiativePanel(battleState.players);
}

// ── Event listeners ──────────────────────────────────────
combatChoices.forEach(c => c.addEventListener("click", () => startBattle(Number(c.dataset.humans))));
backToMenu.addEventListener("click", () => { stopAi(); if(roomSocket)roomSocket.close(); battlefield.hidden=true; mainMenu.hidden=false; });
humanAttack.addEventListener("click", humanTurn);
copyRoomLink.addEventListener("click", async () => {
  if (!roomLinkInput.value) return;
  await navigator.clipboard.writeText(roomLinkInput.value);
  showMessage("Link copiado","Envie o link da sala para os convidados entrarem na partida.");
});

const incomingRoom = getRoomFromUrl();
if (incomingRoom) startBattle(incomingRoom.humans, incomingRoom);
