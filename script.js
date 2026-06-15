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

// ── Card catalogs ────────────────────────────────────────
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
const combatFiles  = [];
const defenseFiles = [];

// ── Utilities ────────────────────────────────────────────
const hashVal  = s => [...s].reduce((n,c)=>n+c.charCodeAt(0),0);
const baseName = f => f.replace(/\.png$/i,"").replace(/[-_]/g," ");
const titleCase= s => s.toLowerCase().replace(/(^|\s)\S/g,l=>l.toUpperCase());
const shuffle  = a => [...a].sort(()=>Math.random()-.5);
const pick     = a => a[Math.floor(Math.random()*a.length)];

// ── Card factory ─────────────────────────────────────────
const ROLE_LABELS = {hero:"Herói",animal:"Animal",weapon:"Arma",magic:"Mágica",combat:"Combate",defense:"Defesa"};
const ROLE_ICONS  = {hero:"👑",animal:"🐾",weapon:"⚔️",magic:"✨",combat:"💀",defense:"🛡"};
const ROLE_DESCS  = {
  animal:  "Substitui seu Companheiro Animal (o antigo vai ao Cemitério) ou descarte.",
  weapon:  "Substitui sua Arma (a antiga vai ao Cemitério) ou descarte.",
  magic:   "Adiciona ao seu deck como Item Mágico. Ação específica em breve.",
  defense: c=>`Equipa como Armadura/Escudo, somando +${c.defense} ao Ataque Total.`,
  hero:    "Enfrente este herói em combate — compare Ataques Totais.",
  combat:  "Carta de Combate — enfrente o desafio comparando Ataques Totais.",
};

function makeCard(fileName, folder, role) {
  const name = titleCase(baseName(fileName));
  const seed = hashVal(fileName);
  const types = {
    hero:    ["Guerreiro","Arcano","Furtivo","Sagrado","Selvagem","Sombrio"][seed%6],
    animal:  ["Companheiro Animal","Montaria","Guardião","Predador","Místico"][seed%5],
    weapon:  ["Arma Corpo a Corpo","Arma de Alcance","Arma Rúnica"][seed%3],
    magic:   ["Item Mágico","Relíquia","Artefato","Encantamento"][seed%4],
    combat:  ["Inimigo","Monstro","Chefe de Área"][seed%3],
    defense: ["Escudo","Armadura","Proteção Arcana"][seed%3],
  };
  return {
    role, name,
    file:     `CARDS/${folder}/${encodeURIComponent(fileName)}`,
    type:     types[role],
    strength: 4+(seed%10),
    magic:    3+(seed%9),
    damage:   8+(seed%13),
    defense:  role==="defense" ? 4+(seed%12) : 0,
    health:   role==="animal" ? 25+(seed%36) : role==="combat" ? 30+(seed%50) : 100,
    reward:   role==="animal" ? 5+(seed%16) : 10,
  };
}
const catalog = {
  heroes:   heroFiles.map(f=>makeCard(f,"HEROIS","hero")),
  animals:  animalFiles.map(f=>makeCard(f,"ANIMAIS","animal")),
  weapons:  weaponFiles.map(f=>makeCard(f,"ARMAS","weapon")),
  magic:    magicFiles.map(f=>makeCard(f,"MAGICAS","magic")),
  combats:  combatFiles.map(f=>makeCard(f,"COMBATES","combat")),
  defenses: defenseFiles.map(f=>makeCard(f,"DEFESAS","defense")),
};

// ── Ataque Total ─────────────────────────────────────────
function calcTotalAttack(p) {
  const h=p.hero||{magic:0,strength:0}, a=p.animal||{magic:0,strength:0};
  return (h.magic+h.strength)+(a.magic+a.strength)+(p.weapon?.damage||0)+(p.magicItem?.damage||0)+(p.armor?.defense||0);
}

// ── Screen manager ───────────────────────────────────────
const screens = {
  menu:   document.getElementById("screenMenu"),
  battle: document.getElementById("screenBattle"),
  cards:  document.getElementById("screenCards"),
};
function showScreen(name) {
  Object.entries(screens).forEach(([k,el])=>{ el.hidden = k!==name; });
}

// ── DOM refs ─────────────────────────────────────────────
const tooltip          = document.getElementById("regionTooltip");
const hotspots         = document.querySelectorAll(".region-hotspot");
const menuButtons      = document.querySelectorAll(".menu-button");
// Modals
const modalBackdrop    = document.getElementById("modalBackdrop");
const modalTitle       = document.getElementById("modalTitle");
const modalMessage     = document.getElementById("modalMessage");
const modalClose       = document.getElementById("modalClose");
const setupModal       = document.getElementById("setupModal");
const setupPlayers     = document.getElementById("setupPlayers");
const setupConfirm     = document.getElementById("setupConfirm");
const setupClose       = document.getElementById("setupClose");
const cardViewModal    = document.getElementById("cardViewModal");
const cardViewImg      = document.getElementById("cardViewImg");
const cardViewName     = document.getElementById("cardViewName");
const cardViewCat      = document.getElementById("cardViewCat");
const cardViewStats    = document.getElementById("cardViewStats");
const cardViewDesc     = document.getElementById("cardViewDesc");
const cardViewBtns     = document.getElementById("cardViewBtns");
const cardViewClose    = document.getElementById("cardViewClose");
// Battle
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
// Cards screen
const cardsScreenTitle = document.getElementById("cardsScreenTitle");
const cardsScreenGrid  = document.getElementById("cardsScreenGrid");
const backToBattle     = document.getElementById("backToBattle");

// ── App state ────────────────────────────────────────────
let battleState = null;
let aiTimer     = null;
let roomSocket  = null;
let pendingCardAction = null; // { card, player, onConfirm, onDiscard }

// ── Map tooltip ──────────────────────────────────────────
function positionTooltip(ev) {
  const b=tooltip.getBoundingClientRect(),m=18;
  let l=ev.clientX+16,t=ev.clientY+16;
  if(l+b.width+m>window.innerWidth)  l=ev.clientX-b.width-22;
  if(t+b.height+m>window.innerHeight)t=ev.clientY-b.height-22;
  tooltip.style.left=`${Math.max(m,l)}px`; tooltip.style.top=`${Math.max(m,t)}px`;
}
hotspots.forEach(h=>{
  h.addEventListener("mouseenter",e=>{
    const r=regions[h.dataset.region];
    tooltip.innerHTML=`<h2>${h.dataset.region}</h2><p>${r.description}</p><strong>Facção: ${r.faction}</strong>`;
    tooltip.classList.add("is-visible"); positionTooltip(e);
  });
  h.addEventListener("mousemove",positionTooltip);
  h.addEventListener("mouseleave",()=>tooltip.classList.remove("is-visible"));
});

// ── Generic modal ────────────────────────────────────────
function showMessage(title,msg){
  modalTitle.textContent=title; modalMessage.textContent=msg;
  modalBackdrop.classList.add("is-open"); modalBackdrop.setAttribute("aria-hidden","false");
}
function closeMessage(){ modalBackdrop.classList.remove("is-open"); modalBackdrop.setAttribute("aria-hidden","true"); }
modalClose.addEventListener("click",closeMessage);
modalBackdrop.addEventListener("click",e=>{ if(e.target===modalBackdrop)closeMessage(); });

// ── Setup modal (name players) ───────────────────────────
function openSetupModal() {
  setupPlayers.innerHTML = [0,1,2,3].map(i=>`
    <div class="setup-row">
      <span class="setup-num">${i+1}</span>
      <input class="setup-name-input" id="pname${i}" type="text" maxlength="20"
        placeholder="Nome do jogador ${i+1}" value="Jogador ${i+1}">
      <label class="setup-type-toggle">
        <input type="checkbox" id="ptype${i}" ${i===0?"":"checked"}>
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
        <span class="toggle-label" id="ptypelabel${i}">${i===0?"Humano":"Máquina"}</span>
      </label>
    </div>`).join("");

  // Wire toggles to update labels
  [0,1,2,3].forEach(i=>{
    document.getElementById(`ptype${i}`).addEventListener("change",e=>{
      document.getElementById(`ptypelabel${i}`).textContent = e.target.checked ? "Máquina" : "Humano";
    });
  });

  setupModal.classList.add("is-open"); setupModal.setAttribute("aria-hidden","false");
}
function closeSetupModal(){ setupModal.classList.remove("is-open"); setupModal.setAttribute("aria-hidden","true"); }
setupClose.addEventListener("click", closeSetupModal);
setupModal.addEventListener("click",e=>{ if(e.target===setupModal)closeSetupModal(); });

setupConfirm.addEventListener("click",()=>{
  const playerConfigs = [0,1,2,3].map(i=>({
    name: document.getElementById(`pname${i}`).value.trim() || `Jogador ${i+1}`,
    isMachine: document.getElementById(`ptype${i}`).checked,
  }));
  closeSetupModal();
  startBattle(playerConfigs);
});

menuButtons.forEach(b=>{
  b.addEventListener("click",()=>{
    if(b.dataset.menuAction==="combat"){ openSetupModal(); return; }
    showMessage("Funcionalidade em desenvolvimento","Este caminho ainda está sendo escrito nos anais de Valeth.");
  });
});

// ── Card View Modal (amplified card, for ANY card click) ─
function openCardView(card, actionBtns=[]) {
  cardViewImg.src  = card.file;
  cardViewImg.alt  = card.name;
  cardViewName.textContent = card.name;
  cardViewCat.textContent  = `${ROLE_ICONS[card.role]} ${ROLE_LABELS[card.role]} · ${card.type}`;

  const stats=[];
  if(card.strength) stats.push(`<span>⚔ Força <strong>${card.strength}</strong></span>`);
  if(card.magic)    stats.push(`<span>✨ Magia <strong>${card.magic}</strong></span>`);
  if(card.damage)   stats.push(`<span>💥 Dano <strong>${card.damage}</strong></span>`);
  if(card.defense)  stats.push(`<span>🛡 Defesa <strong>${card.defense}</strong></span>`);
  if(card.health)   stats.push(`<span>❤ Vida <strong>${card.health}</strong></span>`);
  if(card.reward)   stats.push(`<span>🪙 Recomp. <strong>${card.reward}</strong></span>`);
  cardViewStats.innerHTML = stats.join("");

  const d = ROLE_DESCS[card.role];
  cardViewDesc.textContent = typeof d==="function" ? d(card) : (d||"");

  // Render action buttons or just close
  cardViewBtns.innerHTML="";
  if(actionBtns.length){
    actionBtns.forEach(({label,cls,fn})=>{
      const b=document.createElement("button");
      b.className=`card-action-btn ${cls}`; b.textContent=label;
      b.onclick=()=>{ closeCardView(); fn(); };
      cardViewBtns.appendChild(b);
    });
  }

  cardViewModal.classList.add("is-open"); cardViewModal.setAttribute("aria-hidden","false");
}
function closeCardView(){ cardViewModal.classList.remove("is-open"); cardViewModal.setAttribute("aria-hidden","true"); }
cardViewClose.addEventListener("click",closeCardView);
cardViewModal.addEventListener("click",e=>{ if(e.target===cardViewModal)closeCardView(); });

// ── Card pile screen ─────────────────────────────────────
function openCardPileScreen(title, cards) {
  cardsScreenTitle.textContent = title;
  cardsScreenGrid.innerHTML = cards.length
    ? cards.map((c,i)=>`
        <button class="pile-card" data-idx="${i}" title="${c.name}">
          <img src="${c.file}" alt="${c.name}">
          <span>${ROLE_ICONS[c.role]} ${c.name}</span>
        </button>`).join("")
    : `<p class="pile-empty">Nenhuma carta aqui ainda.</p>`;

  cardsScreenGrid.querySelectorAll(".pile-card").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const card=cards[Number(btn.dataset.idx)];
      openCardView(card);
    });
  });
  showScreen("cards");
}
backToBattle.addEventListener("click",()=>showScreen("battle"));

valethDeckEl.addEventListener("click",()=>{
  if(!battleState) return;
  const cur=currentTurnPlayer();
  if(!battleState.initiativeOrder||battleState.finished){ openCardPileScreen("Monte Valeth",battleState?.valethDeck||[]); return; }
  // Right-click (contextmenu) or long-press → show deck; single click → draw
  drawFromValeth(cur);
});
valethDeckEl.addEventListener("contextmenu",e=>{
  e.preventDefault();
  if(battleState) openCardPileScreen("Monte Valeth",battleState.valethDeck||[]);
});
cemeteryEl.addEventListener("click",()=>{
  if(battleState) openCardPileScreen("Cemitério",battleState.cemetery||[]);
});
cemeteryEl.addEventListener("keydown",e=>{ if(e.key==="Enter"||e.key===" ") cemeteryEl.click(); });
valethDeckEl.addEventListener("keydown",e=>{ if(e.key==="Enter"||e.key===" ") valethDeckEl.click(); });

// ── Room / WebSocket ─────────────────────────────────────
function createRoomId(){ return Math.random().toString(36).slice(2,8).toUpperCase(); }
function getRoomFromUrl(){
  const p=new URLSearchParams(location.search);
  const room=p.get("room"),humans=Number(p.get("humans"));
  if(!room||!humans) return null;
  return {room,humans:Math.min(4,Math.max(1,humans)),isGuest:true};
}
function setupRoomPanel(){
  if(!battleState.roomId){ roomPanel.hidden=true; socketStatus.textContent="Solo"; return; }
  const params=new URLSearchParams({room:battleState.roomId,humans:String(battleState.humans)});
  roomPanel.hidden=false;
  roomRole.textContent="Host";
  roomLinkText.textContent="Link da sala:";
  roomLinkInput.value=`${location.origin}${location.pathname}?${params}`;
  socketStatus.textContent="Online: conectando...";
}
function connectRoomSocket(){
  if(roomSocket) roomSocket.close(); roomSocket=null;
  if(!battleState.roomId) return;
  const proto=location.protocol==="https:"?"wss:":"ws:";
  try{ roomSocket=new WebSocket(`${proto}//${location.host}/ws?room=${battleState.roomId}`); }catch{ return; }
  roomSocket.addEventListener("open",()=>{ socketStatus.textContent="Sala conectada"; });
  roomSocket.addEventListener("message",e=>{ const m=JSON.parse(e.data); if(m.type==="state"&&m.payload?.state){battleState=m.payload.state;renderBattle(false);} });
  roomSocket.addEventListener("close",()=>{ socketStatus.textContent="Desconectado"; });
}
function sendRoomMessage(type,payload={}){
  if(!roomSocket||roomSocket.readyState!==WebSocket.OPEN) return;
  roomSocket.send(JSON.stringify({type,payload}));
}

// ── Monte Valeth deck ────────────────────────────────────
function buildValethDeck(usedHeroNames){
  return shuffle([
    ...catalog.heroes.filter(c=>!usedHeroNames.includes(c.name)),
    ...catalog.animals, ...catalog.weapons, ...catalog.magic,
    ...catalog.combats, ...catalog.defenses,
  ]);
}
function renderDecks(){
  const dc=battleState?.valethDeck?.length||0, cc=battleState?.cemetery?.length||0;
  valethCountEl.textContent=dc; cemeteryCountEl.textContent=cc;
  valethDeckEl.classList.toggle("is-empty",dc===0);
  if(cemeteryPreviewEl){
    const top3=(battleState?.cemetery||[]).slice(-3).reverse();
    cemeteryPreviewEl.innerHTML=top3.map(c=>`<span class="cem-thumb" title="${c.name}">${ROLE_ICONS[c.role]}</span>`).join("");
  }
}
function discardCard(card){ if(!card)return; battleState.cemetery.push(card); renderDecks(); }

function drawFromValeth(player){
  if(!battleState.valethDeck?.length){ battleState.log.push("O Monte Valeth está vazio!"); renderBattle(); return; }
  if(battleState.waitingForCard){ battleState.log.push("Resolva a carta atual antes de comprar outra."); renderBattle(); return; }
  if(!player||!player.isHuman){ battleState.log.push("Apenas o jogador da vez pode comprar do Monte Valeth."); renderBattle(); return; }
  const cur=currentTurnPlayer();
  if(!cur||cur.id!==player.id){ battleState.log.push(`Não é a vez de ${player?.name||"?"} — aguarde.`); renderBattle(); return; }

  const card=battleState.valethDeck.shift();
  battleState.log.push(`${player.name} comprou "${card.name}" (${ROLE_LABELS[card.role]}) do Monte Valeth.`);
  battleState.waitingForCard=true;
  renderBattle();
  showValethCardChoice(card, player);
}

function showValethCardChoice(card, player){
  const afterResolve=()=>{ battleState.waitingForCard=false; renderDecks(); renderBattle(); };
  const onDiscard=()=>{ discardCard(card); battleState.log.push(`${player.name} descartou "${card.name}".`); afterResolve(); };

  const confirmActions={
    animal:()=>{ if(player.animal)discardCard(player.animal); player.animal=card; battleState.log.push(`${player.name} adotou ${card.name} como companheiro.`); afterResolve(); },
    weapon:()=>{ if(player.weapon)discardCard(player.weapon); player.weapon=card; battleState.log.push(`${player.name} equipou ${card.name}.`); afterResolve(); },
    magic: ()=>{ if(player.magicItem)discardCard(player.magicItem); player.magicItem=card; player.soul+=Math.max(1,Math.floor(card.magic/3)); battleState.log.push(`${player.name} ativou ${card.name}.`); afterResolve(); },
    defense:()=>{ if(player.armor)discardCard(player.armor); player.armor=card; battleState.log.push(`${player.name} equipou defesa ${card.name} (+${card.defense}).`); afterResolve(); },
    hero:  ()=>resolveCombatCard(card,player,afterResolve),
    combat:()=>resolveCombatCard(card,player,afterResolve),
  };

  const confirmLabels={animal:"🐾 Usar como Companheiro",weapon:"⚔️ Equipar Arma",magic:"✨ Adicionar ao Deck",defense:"🛡 Equipar Defesa",hero:"⚔️ Enfrentar em Combate",combat:"⚔️ Enfrentar em Combate"};
  const btns=[
    { label: confirmLabels[card.role]||"Usar", cls:"confirm", fn: confirmActions[card.role]||onDiscard },
    { label:"🗑 Descartar ao Cemitério", cls:"discard", fn: onDiscard },
  ];
  openCardView(card, btns);
}

function resolveCombatCard(card,player,afterResolve){
  const pAtk=calcTotalAttack(player), cAtk=card.strength+card.magic;
  if(pAtk>=cAtk){
    player.gold+=card.reward; player.xp+=15;
    battleState.log.push(`${player.name} VENCEU contra "${card.name}"! (${pAtk} vs ${cAtk}) +${card.reward} ouro +15 XP.`);
  } else {
    const dmg=Math.max(5,card.damage-Math.floor(pAtk/4));
    player.health=Math.max(0,player.health-dmg);
    battleState.log.push(`${player.name} PERDEU contra "${card.name}"! (${pAtk} vs ${cAtk}) Sofreu ${dmg} de dano.`);
    if(player.health===0){ battleState.log.push(`${player.name} caiu!`); resolveWinner(); }
  }
  discardCard(card); afterResolve();
}

// ── Battle creation ──────────────────────────────────────
function createBattle(playerConfigs){
  const shuffledHeroes=shuffle(catalog.heroes);
  const players=playerConfigs.map((cfg,i)=>({
    id:`p${i+1}`,
    name: cfg.name,
    isHuman: !cfg.isMachine,
    isHost: i===0,
    health:100, soul:10, gold:0, xp:0,
    hero:shuffledHeroes[i],
    animal:pick(catalog.animals),
    weapon:null, magicItem:null, armor:null,
  }));
  const usedHeroNames=players.map(p=>p.hero.name);
  const humans=players.filter(p=>p.isHuman).length;
  return {
    roomId: humans>1 ? createRoomId() : null,
    humans, players,
    log:[`Partida iniciada: ${players.map(p=>`${p.name}(${p.isHuman?"Humano":"Máquina"})`).join(", ")}.`],
    turn:1, finished:false,
    valethDeck:buildValethDeck(usedHeroNames),
    cemetery:[], waitingForCard:false,
    initiativeOrder:null, currentTurnIndex:0,
  };
}

// ── Initiative system ────────────────────────────────────
let initiativeRolls={}, initiativePlayers=[];
const d20Roll=()=>Math.floor(Math.random()*20)+1;
function d20Svg(){
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

function openInitiativePanel(players){
  initiativeRolls={}; initiativePlayers=players;
  initiativeStart.disabled=true; initiativeStart.textContent="Aguardando rolagens...";
  initiativeOrder.hidden=true; initiativeOrderList.innerHTML="";

  initiativeGrid.innerHTML=players.map(p=>`
    <div class="initiative-card ${p.isHuman?"is-human":""}" id="icard-${p.id}">
      <span class="player-label ${p.isHuman?"human-label":""}">${p.name}<small> ${p.isHuman?"Humano":"Máquina"}</small></span>
      <div class="d20-container" id="d20-${p.id}">${d20Svg()}<span class="d20-result" id="d20r-${p.id}"></span></div>
      <span class="d20-hint" id="d20h-${p.id}">${p.isHuman?"Clique para rolar":""}</span>
      ${p.isHuman
        ?`<button class="roll-btn" id="rollbtn-${p.id}" onclick="rollInitiative('${p.id}')">🎲 Rolar D20</button>`
        :`<span class="ai-auto-badge">Rolando...</span>`}
    </div>`).join("");

  initiativePanel.hidden=false;
  players.filter(p=>!p.isHuman).forEach((p,i)=>{
    setTimeout(()=>{ const r=d20Roll(); initiativeRolls[p.id]=r; applyRollVisual(p.id,r); checkAllRolled(); }, 600+i*450);
  });
}
function rollInitiative(pid){
  if(initiativeRolls[pid]!==undefined) return;
  const el=document.getElementById(`d20-${pid}`), btn=document.getElementById(`rollbtn-${pid}`);
  if(!el) return;
  el.classList.add("is-rolling"); if(btn) btn.disabled=true;
  const r=d20Roll();
  setTimeout(()=>{ el.classList.remove("is-rolling"); initiativeRolls[pid]=r; applyRollVisual(pid,r); checkAllRolled(); },580);
}
window.rollInitiative=rollInitiative;
function applyRollVisual(pid,roll){
  const el=document.getElementById(`d20-${pid}`),re=document.getElementById(`d20r-${pid}`),he=document.getElementById(`d20h-${pid}`);
  if(!el||!re) return;
  el.classList.add("is-rolled"); if(roll===20)el.classList.add("nat20");
  re.textContent=roll; if(he)he.style.visibility="hidden";
}
function checkAllRolled(){
  const ps=initiativePlayers;
  if(!ps.length||!ps.every(p=>initiativeRolls[p.id]!==undefined)) return;
  const sorted=[...ps].sort((a,b)=>{ const d=initiativeRolls[b.id]-initiativeRolls[a.id]; return d!==0?d:Math.random()-.5; });
  battleState.initiativeOrder=sorted.map(p=>p.id);
  initiativeOrderList.innerHTML=sorted.map((p,i)=>{
    const s=initiativeRolls[p.id];
    return `<li class="${i===0?"is-first":""}">${i+1}. ${p.name} — <span class="order-score">${s}</span>${s===20?" 🌟":s===1?" 💀":""}</li>`;
  }).join("");
  initiativeOrder.hidden=false; initiativeStart.disabled=false; initiativeStart.textContent="⚔️ Iniciar Batalha";
}
initiativeStart.addEventListener("click",()=>{
  if(initiativeStart.disabled) return;
  initiativePanel.hidden=true;
  const names=battleState.initiativeOrder.map((id,i)=>{ const p=battleState.players.find(pl=>pl.id===id); return `${i+1}º ${p.name}(${initiativeRolls[id]})`; });
  battleState.log.push(`⚔️ Iniciativa: ${names.join(" → ")}`);
  battleState.currentTurnIndex=0; advanceTurnToNextAlive();
  const first=currentTurnPlayer();
  if(first) battleState.log.push(`Vez de ${first.name} — compre do Monte Valeth ou ataque.`);
  renderBattle(); startAi();
});

// ── Turn management ──────────────────────────────────────
function currentTurnPlayer(){
  if(!battleState?.initiativeOrder) return null;
  const order=battleState.initiativeOrder;
  for(let i=0;i<order.length;i++){
    const p=battleState.players.find(p=>p.id===order[(battleState.currentTurnIndex+i)%order.length]);
    if(p?.health>0) return p;
  }
  return null;
}
function advanceTurn(){ if(!battleState?.initiativeOrder)return; battleState.currentTurnIndex=(battleState.currentTurnIndex+1)%battleState.initiativeOrder.length; advanceTurnToNextAlive(); }
function advanceTurnToNextAlive(){
  if(!battleState?.initiativeOrder) return;
  const order=battleState.initiativeOrder;
  for(let i=0;i<order.length;i++){
    const idx=(battleState.currentTurnIndex+i)%order.length;
    const p=battleState.players.find(p=>p.id===order[idx]);
    if(p?.health>0){battleState.currentTurnIndex=idx;return;}
  }
}

// ── Render ───────────────────────────────────────────────
function renderBattle(broadcast=true){
  battleGrid.innerHTML=battleState.players.map(renderPlayer).join("");
  combatLog.innerHTML =battleState.log.slice(-10).map(l=>`<p>${l}</p>`).join("");
  renderDecks();

  const cur=currentTurnPlayer();
  if(!battleState.initiativeOrder||battleState.finished){
    humanAttack.disabled=true; humanAttack.textContent="Atacar";
  } else if(cur?.isHuman){
    humanAttack.disabled=!!battleState.waitingForCard;
    humanAttack.textContent=battleState.waitingForCard?`${cur.name}: resolva a carta…`:`⚔️ Atacar (${cur.name})`;
  } else {
    humanAttack.disabled=true; humanAttack.textContent=cur?`Vez de ${cur.name}…`:"Atacar";
  }
  if(broadcast) sendRoomMessage("state",{state:battleState});
}

function renderPlayer(player){
  const defeated=player.health<=0, cur=currentTurnPlayer();
  const active=cur?.id===player.id&&!battleState.finished;
  const totalAtk=calcTotalAttack(player);
  const h=player.hero||{magic:0,strength:0}, a=player.animal||{magic:0,strength:0};

  return `<article class="player-board ${defeated?"is-defeated":""} ${active?"is-active-turn":""}">
    <header class="player-header">
      <div>
        <strong>${player.name}</strong>
        <span>${initiativeRolls[player.id]!=null?`D20:${initiativeRolls[player.id]} · `:""}${player.isHuman?"Humano":"Máquina"}</span>
      </div>
      <div class="player-badges">
        ${active?`<span class="turn-badge">🗡 Vez</span>`:""}
        <span class="attack-badge">⚔ ${totalAtk}</span>
        <span class="life-badge">❤ ${player.health}</span>
      </div>
    </header>
    <div class="stats-row">
      <span>Alma ${player.soul}</span><span>🪙 ${player.gold}</span><span>XP ${player.xp}</span>
    </div>
    <div class="attack-total-row">
      <span class="atk-label">Ataque Total</span>
      <span class="atk-value">${totalAtk}</span>
      <span class="atk-breakdown">Herói ${h.magic+h.strength} + Animal ${a.magic+a.strength} + Arma ${player.weapon?.damage||0} + Mágica ${player.magicItem?.damage||0} + Defesa ${player.armor?.defense||0}</span>
    </div>
    <div class="deck-slots">
      ${renderSlot("Herói","blue",player.hero,["Força","Magia","Dano"],player)}
      ${renderSlot("Companheiro Animal","green",player.animal,["Força","Magia","Dano"],player)}
      ${renderSlot("Arma","red",player.weapon,["Dano"],player)}
      ${renderSlot("Item Mágico","purple",player.magicItem,["Magia","Dano"],player)}
      ${renderSlot("Armadura/Defesa","gray",player.armor,["Defesa"],player)}
    </div>
  </article>`;
}

function renderSlot(title,color,card,fields,player){
  if(!card) return `<div class="card-slot ${color}"><div class="empty-card"><strong>${title}</strong><span>Vazio</span></div></div>`;
  const vals={Força:card.strength,Magia:card.magic,Dano:card.damage,Defesa:card.defense};
  return `<div class="card-slot ${color} clickable-card" data-card-role="${card.role}" title="Clique para ampliar ${card.name}">
    <img src="${card.file}" alt="${card.name}">
    <div class="card-info"><strong>${title}</strong><em>${card.name}</em>${fields.map(f=>`<span>${f}: ${vals[f]??0}</span>`).join("")}</div>
  </div>`;
}

// Delegate card slot clicks → open amplified view
document.getElementById("battleGrid").addEventListener("click",e=>{
  const slot=e.target.closest(".clickable-card");
  if(!slot) return;
  // Find which player+slot this belongs to
  const board=slot.closest(".player-board");
  const pIdx=Array.from(document.getElementById("battleGrid").children).indexOf(board);
  if(pIdx<0) return;
  const player=battleState.players[pIdx];
  const role=slot.dataset.cardRole;
  const cardMap={hero:player.hero,animal:player.animal,weapon:player.weapon,magic:player.magicItem,defense:player.armor};
  const card=cardMap[role];
  if(card) openCardView(card);
});

// ── Combat logic ─────────────────────────────────────────
function alivePlayers(){ return battleState.players.filter(p=>p.health>0); }
function targetForAttack(me){ return alivePlayers().filter(p=>p.id!==me.id).sort((a,b)=>a.health-b.health)[0]; }

function attack(attacker){
  if(!attacker||attacker.health<=0||battleState.finished) return;
  const target=targetForAttack(attacker); if(!target) return;
  const dmg=Math.max(4,calcTotalAttack(attacker));
  target.health=Math.max(0,target.health-dmg);
  attacker.gold+=target.health===0?10:2; attacker.xp+=target.health===0?20:5;
  battleState.log.push(`${attacker.name} atacou ${target.name} — ${dmg} de dano.`);
  if(target.health===0) battleState.log.push(`${target.name} foi derrotado!`);
  resolveWinner();
  if(!battleState.finished){ advanceTurn(); const next=currentTurnPlayer(); if(next) battleState.log.push(`Vez de ${next.name}.`); }
  renderBattle();
}

function resolveWinner(){
  const alive=alivePlayers();
  if(alive.length===1){ battleState.finished=true; battleState.log.push(`🏆 ${alive[0].name} venceu a batalha de Valeth!`); stopAi(); }
}

function machineAutoEquip(player){
  if(!player.weapon){ player.weapon=pick(catalog.weapons); battleState.log.push(`${player.name} equipou ${player.weapon.name}.`); }
  if(!player.magicItem&&Math.random()>.5){ player.magicItem=pick(catalog.magic); player.soul+=Math.max(1,Math.floor(player.magicItem.magic/3)); battleState.log.push(`${player.name} ativou ${player.magicItem.name}.`); }
}
function machineDrawValeth(player){
  if(!battleState.valethDeck?.length||battleState.waitingForCard||Math.random()>.5) return;
  const card=battleState.valethDeck.shift();
  battleState.log.push(`${player.name} (Máquina) comprou "${card.name}" do Monte Valeth.`);
  if(card.role==="weapon"&&!player.weapon)        { if(player.weapon)discardCard(player.weapon); player.weapon=card; }
  else if(card.role==="animal")                   { if(player.animal)discardCard(player.animal); player.animal=card; }
  else if(card.role==="magic"&&!player.magicItem) { player.magicItem=card; player.soul+=Math.max(1,Math.floor(card.magic/3)); }
  else if(card.role==="defense"&&!player.armor)   { player.armor=card; }
  else if(card.role==="hero"||card.role==="combat"){ resolveCombatCard(card,player,()=>{}); }
  else discardCard(card);
  renderDecks();
}
function aiStep(){
  if(!battleState||battleState.finished||!battleState.initiativeOrder||battleState.waitingForCard) return;
  const cur=currentTurnPlayer(); if(!cur||cur.isHuman) return;
  machineDrawValeth(cur); machineAutoEquip(cur); attack(cur);
}
function startAi(){ aiTimer=window.setInterval(aiStep,3800); }
function stopAi() { if(aiTimer)clearInterval(aiTimer); aiTimer=null; }

function humanTurn(){
  if(!battleState?.initiativeOrder) return;
  const cur=currentTurnPlayer(); if(!cur) return;
  if(!cur.isHuman){ battleState.log.push(`Não é a sua vez — aguarde ${cur.name}.`); renderBattle(); return; }
  if(battleState.waitingForCard){ battleState.log.push("Resolva a carta comprada antes de atacar."); renderBattle(); return; }
  machineAutoEquip(cur); attack(cur);
}

// ── Start battle ─────────────────────────────────────────
function startBattle(playerConfigs){
  stopAi();
  battleState=createBattle(playerConfigs);
  battleTitle.textContent="Campo de Batalha de Valeth";
  setupRoomPanel(); connectRoomSocket();
  showScreen("battle");
  renderBattle();
  openInitiativePanel(battleState.players);
}

// ── Listeners ────────────────────────────────────────────
backToMenu.addEventListener("click",()=>{ stopAi(); if(roomSocket)roomSocket.close(); showScreen("menu"); });
humanAttack.addEventListener("click",humanTurn);
copyRoomLink.addEventListener("click",async()=>{
  if(!roomLinkInput.value) return;
  await navigator.clipboard.writeText(roomLinkInput.value);
  showMessage("Link copiado","Envie o link da sala para os convidados.");
});
document.addEventListener("keydown",e=>{ if(e.key==="Escape"){ closeMessage(); closeCardView(); closeSetupModal(); } });

const incomingRoom=getRoomFromUrl();
if(incomingRoom){
  // Legacy URL support: 1st player human, rest machines
  const cfgs=[0,1,2,3].map(i=>({name:i<incomingRoom.humans?`Jogador ${i+1}`:`Máquina ${i+1-incomingRoom.humans}`,isMachine:i>=incomingRoom.humans}));
  startBattle(cfgs);
}
