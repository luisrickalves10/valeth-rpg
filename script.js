// ═══════════════════════════════════════════════════════
//  VALETH RPG — script.js
// ═══════════════════════════════════════════════════════

// ── Region data ──────────────────────────────────────────
const regions = {
  Valeth:               {description:"Capital do reino e sede do Conselho Real, onde alianças e traições decidem o futuro do continente.",faction:"Conselho Real de Valeth"},
  Corália:              {description:"Cidade portuária rica, movida por comércio, navios mercantes e acordos feitos longe dos olhos da coroa.",faction:"Liga dos Navegantes"},
  Thurvael:             {description:"Floresta ancestral protegida por antigos juramentos élficos e trilhas que mudam ao luar.",faction:"Guardas de Thurvael"},
  Valdruun:             {description:"Fortaleza sombria no território dos vampiros, marcada por torres negras e pactos de sangue.",faction:"Corte Carmesim"},
  "A Forja":            {description:"Reino montanhoso dos anões, célebre por armas sagradas, minas profundas e honra inflexível.",faction:"Clãs da Bigorna"},
  Eriadun:              {description:"Areias infinitas guardando ruínas, profecias soterradas e caravanas que raramente retornam intactas.",faction:"Senhores das Dunas"},
  Vorzak:               {description:"Bastião hostil dos orcs e ogros, onde força, fogo e conquista ditam a lei.",faction:"Horda de Vorzak"},
  Uldor:                {description:"Terras dos clãs livres, endurecidas por frio, pedra e guerras antigas contra invasores do norte.",faction:"Clãs de Uldor"},
  "Lua Silenciosa":     {description:"Domínio isolado de monges e magos, conhecido por observatórios, neve eterna e segredos arcanos.",faction:"Ordem da Lua Silenciosa"},
  Lodamar:              {description:"Pântano de águas negras onde viajantes desaparecem entre névoa, raízes e sussurros antigos.",faction:"Bruxos de Lodamar"},
  "Cinturão de Magmar": {description:"Arquipélago vulcânico de ilhas perigosas, cinzas vivas e portos controlados por forças rivais.",faction:"Pactos de Magmar"},
};

// ── Card catalogs ─────────────────────────────────────────
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
const combatFiles  = [];  // em elaboração
const defenseFiles = [];  // em elaboração

// ── Utilities ─────────────────────────────────────────────
const hashVal  = s=>[...s].reduce((n,c)=>n+c.charCodeAt(0),0);
const baseName = f=>f.replace(/\.png$/i,"").replace(/[-_]/g," ");
const titleCase= s=>s.toLowerCase().replace(/(^|\s)\S/g,l=>l.toUpperCase());
const shuffle  = a=>[...a].sort(()=>Math.random()-.5);
const pick     = a=>a[Math.floor(Math.random()*a.length)];
const d20Roll  = ()=>Math.floor(Math.random()*20)+1;
const clamp    = (v,mn,mx)=>Math.max(mn,Math.min(mx,v));

// ── Card constants ────────────────────────────────────────
const ROLE_LABELS = {hero:"Herói",animal:"Animal",weapon:"Arma",magic:"Mágica",combat:"Combate",defense:"Defesa"};
const ROLE_ICONS  = {hero:"👑",animal:"🐾",weapon:"⚔️",magic:"✨",combat:"💀",defense:"🛡"};

// ── Card factory ──────────────────────────────────────────
function makeCard(fileName,folder,role){
  const name=titleCase(baseName(fileName));
  const seed=hashVal(fileName);
  const types={
    hero:    ["Guerreiro","Arcano","Furtivo","Sagrado","Selvagem","Sombrio"][seed%6],
    animal:  ["Companheiro Animal","Montaria","Guardião","Predador","Místico"][seed%5],
    weapon:  ["Arma Corpo a Corpo","Arma de Alcance","Arma Rúnica"][seed%3],
    magic:   ["Item Mágico","Relíquia","Artefato","Encantamento"][seed%4],
    combat:  ["Inimigo","Monstro","Chefe de Área"][seed%3],
    defense: ["Escudo","Armadura","Proteção Arcana"][seed%3],
  };
  return {
    role,name,file:`CARDS/${folder}/${encodeURIComponent(fileName)}`,type:types[role],
    strength:4+(seed%10), magic:3+(seed%9), damage:8+(seed%13),
    defense: role==="defense"?4+(seed%12):0,
    health:  role==="animal"?25+(seed%36):role==="combat"?30+(seed%50):100,
    reward:  10,
  };
}
const catalog={
  heroes:   heroFiles.map(f=>makeCard(f,"HEROIS","hero")),
  animals:  animalFiles.map(f=>makeCard(f,"ANIMAIS","animal")),
  weapons:  weaponFiles.map(f=>makeCard(f,"ARMAS","weapon")),
  magic:    magicFiles.map(f=>makeCard(f,"MAGICAS","magic")),
  combats:  combatFiles.map(f=>makeCard(f,"COMBATES","combat")),
  defenses: defenseFiles.map(f=>makeCard(f,"DEFESAS","defense")),
};

// ── Ataque Total ──────────────────────────────────────────
function calcTotalAttack(p){
  const h=p.hero||{magic:0,strength:0},a=p.animal||{magic:0,strength:0};
  return (h.magic+h.strength)+(a.magic+a.strength)+(p.weapon?.damage||0)+(p.magicItem?.damage||0)+(p.armor?.defense||0);
}

// ── Magic effects table ───────────────────────────────────
// Each entry: fn(player) => descriptive string of what happened
const MAGIC_FX = {
  "Tesouro":          p=>{p.gold+=20;  return "+20 🪙 ouro"},
  "Tributo":          p=>{p.gold+=15;  return "+15 🪙 ouro"},
  "Tributo":          p=>{p.gold+=15;  return "+15 🪙 ouro"},
  "Suborno":          p=>{p.gold+=10;  return "+10 🪙 ouro"},
  "Saqueadores":      p=>{p.gold=Math.max(0,p.gold-10);return "-10 🪙 ouro"},
  "Taberna":          p=>{p.gold+=5;   return "+5 🪙 ouro"},
  "Cura100":          p=>{p.health=100;return "❤ vida restaurada a 100"},
  "Cura1D20":         p=>{const v=d20Roll();p.health=clamp(p.health+v,1,200);return `+${v} ❤ vida`},
  "Cura2D20":         p=>{const v=d20Roll()+d20Roll();p.health=clamp(p.health+v,1,200);return `+${v} ❤ vida`},
  "Trevo Da Sorte30": p=>{p.gold+=30;  return "+30 🪙 ouro"},
  "Trevo Da Sorte40": p=>{p.gold+=40;  return "+40 🪙 ouro"},
  "Trevo":            p=>{p.gold+=10;  return "+10 🪙 ouro"},
  "Gema":             p=>{p.gold+=8;   return "+8 🪙 ouro"},
  "Joia Coroa":       p=>{p.gold+=25;  return "+25 🪙 ouro"},
  "Tesoureiro":       p=>{p.gold+=12;  return "+12 🪙 ouro"},
  "Erro Navegacao":   p=>{p.gold=Math.max(0,p.gold-5);return "-5 🪙 ouro"},
  "Emboscada Mortal": p=>{p.health=Math.max(1,p.health-15);return "-15 ❤ vida"},
  "Presságio Sombrio":p=>{p.health=Math.max(1,p.health-10);return "-10 ❤ vida"},
  "Inverno":          p=>{p.health=Math.max(1,p.health-8); return "-8 ❤ vida"},
  "Cogumelos":        p=>{p.health=clamp(p.health+5,1,200);return "+5 ❤ vida"},
  "Areia":            p=>{p.health=Math.max(1,p.health-3); return "-3 ❤ vida"},
  "Mapa":             p=>{p.gold+=5;   return "+5 🪙 ouro"},
  "Pergaminho":       p=>{p.xp+=1;     return "+1 XP"},
  "Grimório":         p=>{p.xp+=2;     return "+2 XP"},
  "Nythor":           p=>{p.xp+=3;     return "+3 XP"},
  "Chapeu":           p=>{p.xp+=1;     return "+1 XP"},
  "Capa":             p=>{p.health=clamp(p.health+2,1,200);return "+2 ❤ vida"},
  "Cordao":           p=>{p.soul+=1;   return "+1 alma"},
  "Anel Arcano":      p=>{p.soul+=3;   return "+3 alma"},
  "Encantador":       p=>{p.soul+=2;   return "+2 alma"},
  "Cura Cura":        p=>{p.health=clamp(p.health+10,1,200);return "+10 ❤ vida"},
  "Forja":            p=>{if(p.weapon)p.weapon.damage+=3;p.gold+=5;return "+3 dano na arma, +5 🪙"},
  "Barda":            p=>{p.soul+=1;p.gold+=5;return "+1 alma, +5 🪙"},
  "Conselho":         p=>{p.xp+=2;p.soul+=1;return "+2 XP, +1 alma"},
  "Cavalaria":        p=>{const v=calcTotalAttack(p)>15?10:5;p.gold+=v;return `+${v} 🪙 ouro`},
  "Catapulta":        p=>{p.health=Math.max(1,p.health-12);return "-12 ❤ vida (projétil inimigo)"},
  "Balista Fatal":    p=>{p.health=Math.max(1,p.health-18);return "-18 ❤ vida (balista inimiga)"},
  "Gigante Aliado":   p=>{p.health=clamp(p.health+20,1,200);p.gold+=8;return "+20 ❤ vida, +8 🪙"},
};

function applyMagicEffect(card, player){
  // Try exact match first, then partial
  for(const [key,fn] of Object.entries(MAGIC_FX)){
    if(card.name.toLowerCase()===key.toLowerCase()) return fn(player);
  }
  for(const [key,fn] of Object.entries(MAGIC_FX)){
    if(card.name.toLowerCase().includes(key.toLowerCase())) return fn(player);
  }
  // Fallback by seed parity
  const seed=hashVal(card.name);
  if(seed%3===0){player.gold+=8;return "+8 🪙 ouro";}
  if(seed%3===1){player.health=clamp(player.health+5,1,200);return "+5 ❤ vida";}
  player.gold=Math.max(0,player.gold-5);return "-5 🪙 ouro";
}

function getMagicDesc(card){
  for(const [key] of Object.entries(MAGIC_FX)){
    if(card.name.toLowerCase()===key.toLowerCase()||card.name.toLowerCase().includes(key.toLowerCase())){
      // describe without applying
      const seed=hashVal(card.name);
      const preview={
        "Tesouro":"+20 Ouro","Tributo":"+15 Ouro","Suborno":"+10 Ouro","Saqueadores":"-10 Ouro","Taberna":"+5 Ouro",
        "Cura100":"Vida → 100","Cura1D20":"+1d20 Vida","Cura2D20":"+2d20 Vida","Trevo Da Sorte30":"+30 Ouro",
        "Trevo Da Sorte40":"+40 Ouro","Trevo":"+10 Ouro","Gema":"+8 Ouro","Joia Coroa":"+25 Ouro",
        "Tesoureiro":"+12 Ouro","Erro Navegacao":"-5 Ouro","Emboscada Mortal":"-15 Vida",
        "Presságio Sombrio":"-10 Vida","Inverno":"-8 Vida","Cogumelos":"+5 Vida","Areia":"-3 Vida",
        "Mapa":"+5 Ouro","Pergaminho":"+1 XP","Grimório":"+2 XP","Nythor":"+3 XP","Chapeu":"+1 XP",
        "Capa":"+2 Vida","Cordao":"+1 Alma","Anel Arcano":"+3 Alma","Encantador":"+2 Alma",
        "Forja":"+3 Dano na Arma, +5 Ouro","Barda":"+1 Alma, +5 Ouro","Conselho":"+2 XP, +1 Alma",
        "Cavalaria":"Bônus de Ouro por Ataque Total","Catapulta":"-12 Vida","Balista Fatal":"-18 Vida",
        "Gigante Aliado":"+20 Vida, +8 Ouro","Cura Cura":"+10 Vida",
      };
      if(preview[key]) return preview[key];
    }
  }
  const seed=hashVal(card.name);
  return seed%3===0?"+8 Ouro":seed%3===1?"+5 Vida":"-5 Ouro";
}

// ── Screen manager ────────────────────────────────────────
const screens={
  menu:   document.getElementById("screenMenu"),
  battle: document.getElementById("screenBattle"),
  cards:  document.getElementById("screenCards"),
};
function showScreen(name){Object.entries(screens).forEach(([k,el])=>{el.hidden=k!==name;});}

// ── DOM refs ──────────────────────────────────────────────
const tooltip          =document.getElementById("regionTooltip");
const hotspots         =document.querySelectorAll(".region-hotspot");
const menuButtons      =document.querySelectorAll(".menu-button");
const modalBackdrop    =document.getElementById("modalBackdrop");
const modalTitle       =document.getElementById("modalTitle");
const modalMessage     =document.getElementById("modalMessage");
const modalClose       =document.getElementById("modalClose");
const setupModal       =document.getElementById("setupModal");
const setupPlayers     =document.getElementById("setupPlayers");
const setupConfirm     =document.getElementById("setupConfirm");
const setupClose       =document.getElementById("setupClose");
const cardViewModal    =document.getElementById("cardViewModal");
const cardViewImg      =document.getElementById("cardViewImg");
const cardViewName     =document.getElementById("cardViewName");
const cardViewCat      =document.getElementById("cardViewCat");
const cardViewStats    =document.getElementById("cardViewStats");
const cardViewDesc     =document.getElementById("cardViewDesc");
const cardViewBtns     =document.getElementById("cardViewBtns");
const cardViewClose    =document.getElementById("cardViewClose");
const battleGrid       =document.getElementById("battleGrid");
const combatLog        =document.getElementById("combatLog");
const battleTitle      =document.getElementById("battleTitle");
const backToMenu       =document.getElementById("backToMenu");
const humanAttack      =document.getElementById("humanAttack");
const roomPanel        =document.getElementById("roomPanel");
const roomRole         =document.getElementById("roomRole");
const roomLinkText     =document.getElementById("roomLinkText");
const roomLinkInput    =document.getElementById("roomLinkInput");
const copyRoomLink     =document.getElementById("copyRoomLink");
const socketStatus     =document.getElementById("socketStatus");
const initiativePanel     =document.getElementById("initiativePanel");
const initiativeGrid      =document.getElementById("initiativeGrid");
const initiativeOrder     =document.getElementById("initiativeOrder");
const initiativeOrderList =document.getElementById("initiativeOrderList");
const initiativeStart     =document.getElementById("initiativeStart");
const valethDeckEl     =document.getElementById("valethDeck");
const valethCountEl    =document.getElementById("valethDeckCount");
const cemeteryEl       =document.getElementById("cemetery");
const cemeteryCountEl  =document.getElementById("cemeteryCount");
const cemeteryPreviewEl=document.getElementById("cemeteryPreview");
const cardsScreenTitle =document.getElementById("cardsScreenTitle");
const cardsScreenGrid  =document.getElementById("cardsScreenGrid");
const backToBattle     =document.getElementById("backToBattle");

// ── App state ─────────────────────────────────────────────
let battleState=null, aiTimer=null, roomSocket=null;
let initiativeRolls={}, initiativePlayers=[];

// ── Log helper ────────────────────────────────────────────
function logEvent(msg){if(battleState)battleState.log.push(msg);}

// ── Map tooltip ───────────────────────────────────────────
function positionTooltip(ev){
  const b=tooltip.getBoundingClientRect(),m=18;
  let l=ev.clientX+16,t=ev.clientY+16;
  if(l+b.width+m>window.innerWidth)  l=ev.clientX-b.width-22;
  if(t+b.height+m>window.innerHeight)t=ev.clientY-b.height-22;
  tooltip.style.left=`${Math.max(m,l)}px`;tooltip.style.top=`${Math.max(m,t)}px`;
}
hotspots.forEach(h=>{
  h.addEventListener("mouseenter",e=>{
    const r=regions[h.dataset.region];
    tooltip.innerHTML=`<h2>${h.dataset.region}</h2><p>${r.description}</p><strong>Facção: ${r.faction}</strong>`;
    tooltip.classList.add("is-visible");positionTooltip(e);
  });
  h.addEventListener("mousemove",positionTooltip);
  h.addEventListener("mouseleave",()=>tooltip.classList.remove("is-visible"));
});

// ── Generic modal ─────────────────────────────────────────
function showMessage(title,msg){
  modalTitle.textContent=title;modalMessage.textContent=msg;
  modalBackdrop.classList.add("is-open");modalBackdrop.setAttribute("aria-hidden","false");
}
function closeMessage(){modalBackdrop.classList.remove("is-open");modalBackdrop.setAttribute("aria-hidden","true");}
modalClose.addEventListener("click",closeMessage);
modalBackdrop.addEventListener("click",e=>{if(e.target===modalBackdrop)closeMessage();});

// ── Setup modal ───────────────────────────────────────────
function openSetupModal(){
  setupPlayers.innerHTML=[0,1,2,3].map(i=>`
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
  [0,1,2,3].forEach(i=>{
    document.getElementById(`ptype${i}`).addEventListener("change",e=>{
      document.getElementById(`ptypelabel${i}`).textContent=e.target.checked?"Máquina":"Humano";
    });
  });
  setupModal.classList.add("is-open");setupModal.setAttribute("aria-hidden","false");
}
function closeSetupModal(){setupModal.classList.remove("is-open");setupModal.setAttribute("aria-hidden","true");}
setupClose.addEventListener("click",closeSetupModal);
setupModal.addEventListener("click",e=>{if(e.target===setupModal)closeSetupModal();});
setupConfirm.addEventListener("click",()=>{
  const cfgs=[0,1,2,3].map(i=>({
    name:document.getElementById(`pname${i}`).value.trim()||`Jogador ${i+1}`,
    isMachine:document.getElementById(`ptype${i}`).checked,
  }));
  closeSetupModal();startBattle(cfgs);
});
menuButtons.forEach(b=>{
  b.addEventListener("click",()=>{
    if(b.dataset.menuAction==="combat"){openSetupModal();return;}
    showMessage("Funcionalidade em desenvolvimento","Este caminho ainda está sendo escrito nos anais de Valeth.");
  });
});

// ── Card View Modal ───────────────────────────────────────
function openCardView(card,actionBtns=[],subtitle=""){
  cardViewImg.src=card.file; cardViewImg.alt=card.name;
  cardViewName.textContent=card.name;
  cardViewCat.textContent=`${ROLE_ICONS[card.role]} ${ROLE_LABELS[card.role]} · ${card.type}`;
  const stats=[];
  if(card.strength) stats.push(`<span>⚔ Força <strong>${card.strength}</strong></span>`);
  if(card.magic)    stats.push(`<span>✨ Magia <strong>${card.magic}</strong></span>`);
  if(card.damage)   stats.push(`<span>💥 Dano <strong>${card.damage}</strong></span>`);
  if(card.defense)  stats.push(`<span>🛡 Defesa <strong>${card.defense}</strong></span>`);
  if(card.health)   stats.push(`<span>❤ Vida <strong>${card.health}</strong></span>`);
  if(card.reward)   stats.push(`<span>🪙 Recomp. <strong>${card.reward}</strong></span>`);
  cardViewStats.innerHTML=stats.join("");
  cardViewDesc.textContent=subtitle;
  cardViewBtns.innerHTML="";
  actionBtns.forEach(({label,cls,fn})=>{
    const b=document.createElement("button");
    b.className=`card-action-btn ${cls}`;b.textContent=label;
    b.onclick=()=>{closeCardView();fn();};
    cardViewBtns.appendChild(b);
  });
  cardViewModal.classList.add("is-open");cardViewModal.setAttribute("aria-hidden","false");
}
function closeCardView(){cardViewModal.classList.remove("is-open");cardViewModal.setAttribute("aria-hidden","true");}
cardViewClose.addEventListener("click",closeCardView);
cardViewModal.addEventListener("click",e=>{if(e.target===cardViewModal)closeCardView();});

// ── Card pile screen ──────────────────────────────────────
function openCardPileScreen(title,cards){
  cardsScreenTitle.textContent=title;
  cardsScreenGrid.innerHTML=cards.length
    ?cards.map((c,i)=>`
      <button class="pile-card" data-idx="${i}" title="${c.name}">
        <img src="${c.file}" alt="${c.name}">
        <span>${ROLE_ICONS[c.role]} ${c.name}</span>
      </button>`).join("")
    :`<p class="pile-empty">Nenhuma carta aqui ainda.</p>`;
  cardsScreenGrid.querySelectorAll(".pile-card").forEach(btn=>{
    btn.addEventListener("click",()=>openCardView(cards[Number(btn.dataset.idx)]));
  });
  showScreen("cards");
}
backToBattle.addEventListener("click",()=>showScreen("battle"));

// ── Room / WebSocket ──────────────────────────────────────
function createRoomId(){return Math.random().toString(36).slice(2,8).toUpperCase();}
function getRoomFromUrl(){
  const p=new URLSearchParams(location.search);
  const room=p.get("room"),humans=Number(p.get("humans"));
  if(!room||!humans)return null;
  return {room,humans:clamp(humans,1,4),isGuest:true};
}
function setupRoomPanel(){
  if(!battleState.roomId){roomPanel.hidden=true;socketStatus.textContent="Solo";return;}
  const params=new URLSearchParams({room:battleState.roomId,humans:String(battleState.humans)});
  roomPanel.hidden=false;roomRole.textContent="Host";
  roomLinkText.textContent="Link da sala:";
  roomLinkInput.value=`${location.origin}${location.pathname}?${params}`;
  socketStatus.textContent="Online: conectando...";
}
function connectRoomSocket(){
  if(roomSocket)roomSocket.close();roomSocket=null;
  if(!battleState.roomId)return;
  const proto=location.protocol==="https:"?"wss:":"ws:";
  try{roomSocket=new WebSocket(`${proto}//${location.host}/ws?room=${battleState.roomId}`);}catch{return;}
  roomSocket.addEventListener("open",()=>{socketStatus.textContent="Sala conectada";});
  roomSocket.addEventListener("message",e=>{const m=JSON.parse(e.data);if(m.type==="state"&&m.payload?.state){battleState=m.payload.state;renderBattle(false);}});
  roomSocket.addEventListener("close",()=>{socketStatus.textContent="Desconectado";});
}
function sendRoomMessage(type,payload={}){
  if(!roomSocket||roomSocket.readyState!==WebSocket.OPEN)return;
  roomSocket.send(JSON.stringify({type,payload}));
}

// ── Monte Valeth deck ─────────────────────────────────────
function buildValethDeck(usedHeroNames){
  return shuffle([
    ...catalog.heroes.filter(c=>!usedHeroNames.includes(c.name)),
    ...catalog.animals,...catalog.weapons,...catalog.magic,
    ...catalog.combats,...catalog.defenses,
  ]);
}
function renderDecks(){
  const dc=battleState?.valethDeck?.length||0,cc=battleState?.cemetery?.length||0;
  valethCountEl.textContent=dc;cemeteryCountEl.textContent=cc;
  valethDeckEl.classList.toggle("is-empty",dc===0);
  if(cemeteryPreviewEl){
    const top3=(battleState?.cemetery||[]).slice(-3).reverse();
    cemeteryPreviewEl.innerHTML=top3.map(c=>`<span class="cem-thumb" title="${c.name}">${ROLE_ICONS[c.role]}</span>`).join("");
  }
}
function discardCard(card){if(!card)return;battleState.cemetery.push(card);renderDecks();}

// ── Draw from Monte Valeth ────────────────────────────────
// Called for HUMAN: shows card modal with choices.
// Called for MACHINE: auto-resolves immediately.
function drawFromValeth(player,isMachine){
  if(!battleState.valethDeck?.length){logEvent("O Monte Valeth está vazio!");renderBattle();return false;}
  if(battleState.waitingForCard)return false;

  // Draw a RANDOM card (not shift — truly random)
  const idx=Math.floor(Math.random()*battleState.valethDeck.length);
  const card=battleState.valethDeck.splice(idx,1)[0];
  logEvent(`${player.name} tirou "${card.name}" (${ROLE_LABELS[card.role]}) do Monte Valeth.`);
  renderDecks();

  if(isMachine){
    autoResolveCard(card,player);
    return true;
  }

  // Human: show card action modal
  battleState.waitingForCard=true;
  renderBattle();
  showValethCardChoice(card,player);
  return true;
}

// ── Card resolution for HUMAN ─────────────────────────────
function showValethCardChoice(card,player){
  const done=()=>{
    battleState.waitingForCard=false;
    battleState.turnPhase="attack"; // card drawn and resolved → now must attack
    renderDecks();renderBattle();
  };
  const onDiscard=()=>{discardCard(card);logEvent(`${player.name} descartou "${card.name}" ao Cemitério.`);done();};

  // ── HERÓI: duelo imediato
  if(card.role==="hero"){
    openCardView(card,[
      {label:`⚔️ Batalhar contra este Herói (Poder ${card.magic+card.strength})`,cls:"confirm",fn:()=>resolveHeroDuel(card,player,done)},
      {label:"🗑 Descartar",cls:"discard",fn:onDiscard},
    ],`Poder do Herói: ${card.strength+card.magic} | Seu Ataque Total: ${calcTotalAttack(player)}`);
    return;
  }
  if(card.role==="weapon"){
    const curr=player.weapon?`Arma atual: "${player.weapon.name}" (Dano ${player.weapon.damage})`:"Nenhuma arma equipada.";
    openCardView(card,[
      {label:`⚔️ Trocar por esta Arma (Dano ${card.damage})`,cls:"confirm",fn:()=>{
        if(player.weapon)discardCard(player.weapon);
        player.weapon=card;
        logEvent(`⚔️ ${player.name} equipou "${card.name}" (Dano ${card.damage}).`);
        done();
      }},
      {label:"🗑 Descartar ao Cemitério",cls:"discard",fn:onDiscard},
    ],curr);
    return;
  }
  if(card.role==="magic"){
    const effDesc=getMagicDesc(card);
    openCardView(card,[
      {label:`✨ Aplicar efeito: ${effDesc}`,cls:"confirm",fn:()=>{
        const result=applyMagicEffect(card,player);
        logEvent(`✨ ${player.name} usou "${card.name}" → ${result}!`);
        discardCard(card);done();
      }},
      {label:"🗑 Descartar sem aplicar",cls:"discard",fn:onDiscard},
    ],`Efeito: ${effDesc}`);
    return;
  }
  if(card.role==="defense"){
    // Auto-equip, just show confirmation
    const old=player.armor;
    if(old)discardCard(old);
    player.armor=card;
    logEvent(`🛡 ${player.name} equipou "${card.name}" — Ataque Total +${card.defense}.`);
    openCardView(card,[
      {label:"✅ Continuar",cls:"confirm",fn:done},
    ],`Defesa equipada! +${card.defense} ao Ataque Total. (${old?`"${old.name}" descartado`:""} )`);
    return;
  }
  if(card.role==="combat"){
    openCardView(card,[
      {label:`💀 Enfrentar o Desafio (Poder ${card.strength+card.magic})`,cls:"confirm",fn:()=>resolveHeroDuel(card,player,done)},
      {label:"🗑 Recuar (descartar)",cls:"discard",fn:onDiscard},
    ],`Poder do desafio: ${card.strength+card.magic} | Seu Ataque Total: ${calcTotalAttack(player)}`);
    return;
  }
  if(card.role==="animal"){
    const curr=player.animal?`Companheiro atual: "${player.animal.name}"`:"Nenhum companheiro.";
    openCardView(card,[
      {label:"🐾 Adotar como Companheiro",cls:"confirm",fn:()=>{
        if(player.animal)discardCard(player.animal);
        player.animal=card;
        logEvent(`🐾 ${player.name} adotou "${card.name}" como companheiro.`);
        done();
      }},
      {label:"🗑 Descartar",cls:"discard",fn:onDiscard},
    ],curr);
    return;
  }
  // Fallback
  openCardView(card,[{label:"🗑 Descartar",cls:"discard",fn:onDiscard}],"Carta não reconhecida.");
}

// ── Duel resolution (herói or combate cards) ──────────────
function resolveHeroDuel(card,player,done){
  const pAtk=calcTotalAttack(player);
  const cAtk=card.strength+card.magic;
  if(pAtk>=cAtk){
    player.gold+=card.reward;
    player.xp+=1;  // 1 XP por vitória em duelo
    logEvent(`⚔️ DUELO — ${player.name} [${pAtk}] vs "${card.name}" [${cAtk}] → 🏆 VITÓRIA! +${card.reward} 🪙 +1 XP`);
  } else {
    const dmg=Math.max(5,card.damage-Math.floor(pAtk/4));
    player.health=Math.max(0,player.health-dmg);
    logEvent(`⚔️ DUELO — ${player.name} [${pAtk}] vs "${card.name}" [${cAtk}] → 💀 DERROTA! −${dmg} ❤`);
    if(player.health===0){logEvent(`💀 ${player.name} caiu em batalha!`);resolveWinner();}
  }
  discardCard(card);
  done();
}

// ── Auto-resolve card for MACHINE ────────────────────────
function autoResolveCard(card,player){
  const done=()=>{renderDecks();renderBattle();};
  switch(card.role){
    case "weapon":
      // Machine always upgrades if new weapon is stronger
      if(!player.weapon||card.damage>player.weapon.damage){
        if(player.weapon)discardCard(player.weapon);
        player.weapon=card;
        logEvent(`${player.name} trocou arma por "${card.name}" (Dano ${card.damage}).`);
      } else {discardCard(card);logEvent(`${player.name} descartou "${card.name}" (arma fraca).`);}
      break;
    case "animal":
      if(player.animal)discardCard(player.animal);
      player.animal=card;
      logEvent(`${player.name} adotou "${card.name}" como companheiro.`);
      break;
    case "magic":
      {const result=applyMagicEffect(card,player);logEvent(`✨ ${player.name} usou "${card.name}" → ${result}!`);discardCard(card);}
      break;
    case "defense":
      if(!player.armor||card.defense>player.armor.defense){
        if(player.armor)discardCard(player.armor);
        player.armor=card;
        logEvent(`🛡 ${player.name} equipou defesa "${card.name}" (+${card.defense}).`);
      } else {discardCard(card);}
      break;
    case "hero":
    case "combat":
      resolveHeroDuel(card,player,done);
      return;
    default:
      discardCard(card);
  }
  done();
}

// ── Battle creation ───────────────────────────────────────
function createBattle(playerConfigs){
  const shuffledHeroes=shuffle(catalog.heroes);
  const players=playerConfigs.map((cfg,i)=>({
    id:`p${i+1}`,name:cfg.name,
    isHuman:!cfg.isMachine,isHost:i===0,
    health:100,soul:10,gold:0,xp:0,
    hero:shuffledHeroes[i],
    animal:pick(catalog.animals),
    weapon:null,magicItem:null,armor:null,
  }));
  const usedHeroNames=players.map(p=>p.hero.name);
  const humans=players.filter(p=>p.isHuman).length;
  return {
    roomId:humans>1?createRoomId():null,humans,players,
    log:[`Partida iniciada: ${players.map(p=>`${p.name} (${p.isHuman?"Humano":"Máquina"})`).join(" · ")}.`],
    turn:1,finished:false,
    valethDeck:buildValethDeck(usedHeroNames),
    cemetery:[],
    // Turn state: DRAW first, then ATTACK, then next player
    // Phases: "draw" | "attack"
    turnPhase:"draw",
    waitingForCard:false,
    initiativeOrder:null,currentTurnIndex:0,
  };
}

// ── Initiative system ─────────────────────────────────────
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
  initiativeRolls={};initiativePlayers=players;
  initiativeStart.disabled=true;initiativeStart.textContent="Aguardando rolagens...";
  initiativeOrder.hidden=true;initiativeOrderList.innerHTML="";
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
    setTimeout(()=>{const r=d20Roll();initiativeRolls[p.id]=r;applyRollVisual(p.id,r);checkAllRolled();},600+i*450);
  });
}
function rollInitiative(pid){
  if(initiativeRolls[pid]!==undefined)return;
  const el=document.getElementById(`d20-${pid}`),btn=document.getElementById(`rollbtn-${pid}`);
  if(!el)return;
  el.classList.add("is-rolling");if(btn)btn.disabled=true;
  const r=d20Roll();
  setTimeout(()=>{el.classList.remove("is-rolling");initiativeRolls[pid]=r;applyRollVisual(pid,r);checkAllRolled();},580);
}
window.rollInitiative=rollInitiative;
function applyRollVisual(pid,roll){
  const el=document.getElementById(`d20-${pid}`),re=document.getElementById(`d20r-${pid}`),he=document.getElementById(`d20h-${pid}`);
  if(!el||!re)return;
  el.classList.add("is-rolled");if(roll===20)el.classList.add("nat20");
  re.textContent=roll;if(he)he.style.visibility="hidden";
}
function checkAllRolled(){
  const ps=initiativePlayers;
  if(!ps.length||!ps.every(p=>initiativeRolls[p.id]!==undefined))return;
  // Sort descending; ties re-rolled (random) — initiative determines TURN ORDER for entire game
  const sorted=[...ps].sort((a,b)=>{const d=initiativeRolls[b.id]-initiativeRolls[a.id];return d!==0?d:Math.random()-.5;});
  battleState.initiativeOrder=sorted.map(p=>p.id);
  initiativeOrderList.innerHTML=sorted.map((p,i)=>{
    const s=initiativeRolls[p.id];
    return `<li class="${i===0?"is-first":""}">${i+1}. ${p.name} — <span class="order-score">${s}</span>${s===20?" 🌟":s===1?" 💀":""}</li>`;
  }).join("");
  initiativeOrder.hidden=false;initiativeStart.disabled=false;initiativeStart.textContent="⚔️ Iniciar Batalha";
}
initiativeStart.addEventListener("click",()=>{
  if(initiativeStart.disabled)return;
  initiativePanel.hidden=true;
  const names=battleState.initiativeOrder.map((id,i)=>{
    const p=battleState.players.find(pl=>pl.id===id);
    return `${i+1}º ${p.name}(${initiativeRolls[id]})`;
  });
  logEvent(`🎲 Iniciativa: ${names.join(" → ")}`);
  battleState.currentTurnIndex=0;advanceTurnToNextAlive();
  const first=currentTurnPlayer();
  if(first)logEvent(`🗡 Vez de ${first.name} — tire uma carta do Monte Valeth.`);
  battleState.turnPhase="draw";
  renderBattle();startAi();
});

// ── Turn management ───────────────────────────────────────
// STRICT initiative order. Turn phases: "draw" then "attack" then next player.
function currentTurnPlayer(){
  if(!battleState?.initiativeOrder)return null;
  const order=battleState.initiativeOrder;
  for(let i=0;i<order.length;i++){
    const p=battleState.players.find(p=>p.id===order[(battleState.currentTurnIndex+i)%order.length]);
    if(p?.health>0)return p;
  }
  return null;
}
function advanceTurnToNextAlive(){
  if(!battleState?.initiativeOrder)return;
  const order=battleState.initiativeOrder;
  for(let i=0;i<order.length;i++){
    const idx=(battleState.currentTurnIndex+i)%order.length;
    const p=battleState.players.find(p=>p.id===order[idx]);
    if(p?.health>0){battleState.currentTurnIndex=idx;return;}
  }
}
function endTurn(){
  // Advance to next alive player in initiative order
  battleState.currentTurnIndex=(battleState.currentTurnIndex+1)%battleState.initiativeOrder.length;
  advanceTurnToNextAlive();
  battleState.turnPhase="draw";
  battleState.waitingForCard=false;
  const next=currentTurnPlayer();
  if(next)logEvent(`🗡 Vez de ${next.name} — ${next.isHuman?"tire uma carta do Monte Valeth.":"(Máquina)"}`);
}

// ── Render ────────────────────────────────────────────────
function renderBattle(broadcast=true){
  battleGrid.innerHTML=battleState.players.map(renderPlayer).join("");

  // Render log with highlight classes, newest first
  combatLog.innerHTML=battleState.log.slice(-14).reverse().map(l=>{
    let cls="log-entry";
    if(/DUELO|VITÓRIA|DERROTA/.test(l))     cls+=" log-duel";
    if(/VITÓRIA|venceu|🏆/.test(l))         cls+=" log-victory";
    if(/DERROTA|caiu|derrotado|💀/.test(l)) cls+=" log-defeat";
    if(/✨/.test(l))                         cls+=" log-magic";
    if(/🛡/.test(l))                         cls+=" log-shield";
    if(/🎲|Iniciativa/.test(l))              cls+=" log-initiative";
    if(/🗡 Vez/.test(l))                     cls+=" log-turn";
    return `<p class="${cls}">${l}</p>`;
  }).join("");

  renderDecks();
  BF.sync(); // sync battlefield markers with current state
  if(!battleState.initiativeOrder||battleState.finished){
    humanAttack.disabled=true;humanAttack.textContent="Atacar";
  } else if(cur?.isHuman){
    if(battleState.turnPhase==="draw"||battleState.waitingForCard){
      humanAttack.disabled=true;
      humanAttack.textContent=battleState.waitingForCard?`${cur.name}: resolva a carta…`:`${cur.name}: tire uma carta ↑`;
    } else {
      humanAttack.disabled=false;humanAttack.textContent=`⚔️ Atacar (${cur.name})`;
    }
  } else {
    humanAttack.disabled=true;humanAttack.textContent=cur?`Vez de ${cur.name}…`:"Atacar";
  }
  if(broadcast)sendRoomMessage("state",{state:battleState});
}

function renderPlayer(player){
  const defeated=player.health<=0,cur=currentTurnPlayer();
  const active=cur?.id===player.id&&!battleState.finished;
  const totalAtk=calcTotalAttack(player);
  const h=player.hero||{magic:0,strength:0},a=player.animal||{magic:0,strength:0};
  const initScore=initiativeRolls[player.id];
  // Show phase badge
  const phaseBadge=active&&!battleState.finished
    ?battleState.turnPhase==="draw"
      ?`<span class="phase-badge phase-draw">🃏 Compre</span>`
      :`<span class="phase-badge phase-attack">⚔️ Ataque</span>`
    :"";

  return `<article class="player-board ${defeated?"is-defeated":""} ${active?"is-active-turn":""}">
    <header class="player-header">
      <div>
        <strong>${player.name}</strong>
        <span>${initScore!=null?`D20:${initScore} · `:""}${player.isHuman?"Humano":"Máquina"}</span>
      </div>
      <div class="player-badges">
        ${active?`<span class="turn-badge">🗡 Vez</span>`:""}
        ${phaseBadge}
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
      ${renderSlot("Herói","blue",player.hero,["Força","Magia"],player)}
      ${renderSlot("Animal","green",player.animal,["Força","Magia"],player)}
      ${renderSlot("Arma","red",player.weapon,["Dano"],player)}
      ${renderSlot("Mágica","purple",player.magicItem,["Magia"],player)}
      ${renderSlot("Defesa","gray",player.armor,["Defesa"],player)}
    </div>
  </article>`;
}

function renderSlot(title,color,card,fields,player){
  if(!card)return `<div class="card-slot ${color}"><div class="empty-card"><strong>${title}</strong><span>Vazio</span></div></div>`;
  const vals={Força:card.strength,Magia:card.magic,Dano:card.damage,Defesa:card.defense};
  return `<div class="card-slot ${color} clickable-card" data-card-role="${card.role}">
    <img src="${card.file}" alt="${card.name}">
    <div class="card-info"><strong>${title}</strong><em>${card.name}</em>${fields.map(f=>`<span>${f}: ${vals[f]??0}</span>`).join("")}</div>
  </div>`;
}

// Delegate card slot clicks
battleGrid.addEventListener("click",e=>{
  const slot=e.target.closest(".clickable-card");if(!slot)return;
  const board=slot.closest(".player-board");
  const pIdx=Array.from(battleGrid.children).indexOf(board);if(pIdx<0)return;
  const player=battleState.players[pIdx];
  const roleMap={hero:player.hero,animal:player.animal,weapon:player.weapon,magic:player.magicItem,defense:player.armor};
  const card=roleMap[slot.dataset.cardRole];
  if(card)openCardView(card,[],"Visualização da carta (sem ação).");
});

// Deck clicks
valethDeckEl.addEventListener("click",()=>{
  if(!battleState||!battleState.initiativeOrder||battleState.finished)return;
  const cur=currentTurnPlayer();
  if(!cur?.isHuman){logEvent("Apenas o jogador da vez pode comprar do Monte Valeth.");renderBattle();return;}
  if(battleState.turnPhase!=="draw"){logEvent(`${cur.name}: já comprou neste turno. Agora ataque!`);renderBattle();return;}
  drawFromValeth(cur,false);
});
valethDeckEl.addEventListener("contextmenu",e=>{e.preventDefault();if(battleState)openCardPileScreen("Monte Valeth",battleState.valethDeck||[]);});
valethDeckEl.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" ")valethDeckEl.click();});
cemeteryEl.addEventListener("click",()=>{if(battleState)openCardPileScreen("Cemitério",battleState.cemetery||[]);});
cemeteryEl.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" ")cemeteryEl.click();});

// ── Combat logic ──────────────────────────────────────────
function alivePlayers(){return battleState.players.filter(p=>p.health>0);}

// Balanced target: machine attacks the strongest alive opponent (not weakest)
// This prevents compounding the last-player advantage
function targetForAttack(me){
  const enemies=alivePlayers().filter(p=>p.id!==me.id);
  if(!enemies.length)return null;
  // Machines attack the player with most health (balanced threat)
  // Humans (button) attack the weakest (strategic)
  return me.isHuman
    ?enemies.sort((a,b)=>a.health-b.health)[0]
    :enemies.sort((a,b)=>b.health-a.health)[0];
}

function performAttack(attacker){
  if(!attacker||attacker.health<=0||battleState.finished)return;
  const target=targetForAttack(attacker);if(!target)return;
  const atk=calcTotalAttack(attacker);
  const defBonus=target.armor?.defense||0;
  const dmg=Math.max(2,atk-Math.floor(defBonus/2));
  target.health=Math.max(0,target.health-dmg);
  attacker.gold+=target.health===0?10:2;
  attacker.xp  +=target.health===0?5:1;
  logEvent(`⚔️ ${attacker.name} atacou ${target.name} — ${dmg} dano (Ataque ${atk} − Def ${Math.floor(defBonus/2)}).`);

  // Battlefield animation
  const aIdx=battleState.players.findIndex(p=>p.id===attacker.id);
  BF.triggerAttack(attacker.id, target.id, dmg, ["#4a90e2","#e24a4a","#4ae26a","#b44ae2"][aIdx]||"#fff");

  if(target.health===0){
    logEvent(`💀 ${target.name} foi derrotado!`);
    setTimeout(()=>BF.triggerDeath(target.id), 400);
  }
  resolveWinner();
}

function resolveWinner(){
  const alive=alivePlayers();
  if(alive.length===1){
    battleState.finished=true;
    logEvent(`🏆 ${alive[0].name} venceu a batalha de Valeth!`);
    stopAi();
  }
}

// ── Machine turn (strict initiative) ─────────────────────
// The AI interval fires frequently but only acts when it's this machine's turn
// and the game is in the right phase.
function machineStep(){
  if(!battleState||battleState.finished||!battleState.initiativeOrder)return;
  if(battleState.waitingForCard)return;
  const cur=currentTurnPlayer();
  if(!cur||cur.isHuman)return;

  if(battleState.turnPhase==="draw"){
    // Draw from Valeth (always — balanced with humans who must also draw)
    const drew=drawFromValeth(cur,true);
    if(!drew&&!battleState.valethDeck?.length){
      // No cards left: skip draw phase
      battleState.turnPhase="attack";
    } else {
      battleState.turnPhase="attack";
    }
    renderBattle();
  } else {
    // Attack phase
    performAttack(cur);
    if(!battleState.finished){endTurn();}
    renderBattle();
  }
}

function startAi(){aiTimer=window.setInterval(machineStep,2200);}
function stopAi() {if(aiTimer)clearInterval(aiTimer);aiTimer=null;}

// ── Human turn actions ────────────────────────────────────
// Monte Valeth click handles the draw phase (above).
// Attack button handles the attack phase.
function humanAttackAction(){
  if(!battleState?.initiativeOrder)return;
  const cur=currentTurnPlayer();if(!cur)return;
  if(!cur.isHuman){logEvent(`Não é a sua vez — aguarde ${cur.name}.`);renderBattle();return;}
  if(battleState.waitingForCard){logEvent("Resolva a carta antes de atacar.");renderBattle();return;}
  if(battleState.turnPhase==="draw"){logEvent(`${cur.name}: tire uma carta do Monte Valeth primeiro!`);renderBattle();return;}
  // Attack phase
  performAttack(cur);
  if(!battleState.finished){endTurn();}
  renderBattle();
}

// ═══════════════════════════════════════════════════════
//  BATTLEFIELD VISUALIZATION ENGINE
// ═══════════════════════════════════════════════════════

const BF = (() => {
  // Player color themes: ring, glow, trail
  const PLAYER_COLORS = [
    { ring:"#4a90e2", glow:"rgba(74,144,226,.55)", trail:"rgba(74,144,226,.4)",  label:"Azul"   },
    { ring:"#e24a4a", glow:"rgba(226,74,74,.55)",  trail:"rgba(226,74,74,.4)",   label:"Vermelho"},
    { ring:"#4ae26a", glow:"rgba(74,226,106,.55)", trail:"rgba(74,226,106,.4)",  label:"Verde"  },
    { ring:"#b44ae2", glow:"rgba(180,74,226,.55)", trail:"rgba(180,74,226,.4)",  label:"Roxo"   },
  ];

  // Slot keys that can generate markers
  const SLOT_KEYS = ["hero","animal","weapon","magicItem","armor"];
  const SLOT_LABELS = {hero:"Herói",animal:"Animal",weapon:"Arma",magicItem:"Mágica",armor:"Defesa"};

  let canvas, ctx, W, H, raf;
  let markers  = [];   // { id, playerId, playerIdx, slotKey, card, x, y, tx, ty, homeX, homeY, alpha, scale, state, particles, shakeT }
  let effects  = [];   // { type, x, y, color, t, dur, value? }
  let shakeX=0, shakeY=0, shakeMag=0;

  // ── Layout helpers ────────────────────────────────────
  function playerHome(playerIdx, slotIdx, total) {
    // Players arranged in 4 quadrants; slots spread around the player center
    const CX=W/2, CY=H/2, R=Math.min(W,H)*0.31;
    const angles=[225,315,135,45]; // degrees for p0..p3
    const deg=angles[playerIdx]*(Math.PI/180);
    const px=CX+Math.cos(deg)*R;
    const py=CY+Math.sin(deg)*R;

    // Slots orbit the player center
    const slotR=Math.min(W,H)*0.08;
    const slotAngle=(slotIdx/total)*Math.PI*2 - Math.PI/2;
    return {
      x: px+Math.cos(slotAngle)*slotR,
      y: py+Math.sin(slotAngle)*slotR,
    };
  }

  // ── Build / sync markers from battleState ──────────────
  function sync() {
    if(!battleState || !canvas) return;
    const next = [];

    battleState.players.forEach((player, pIdx) => {
      const occupied = SLOT_KEYS.filter(k => player[k]);
      occupied.forEach((slotKey, sIdx) => {
        const card = player[slotKey];
        const id   = `${player.id}-${slotKey}`;
        const home = playerHome(pIdx, sIdx, occupied.length);

        const existing = markers.find(m => m.id === id);
        if(existing) {
          existing.homeX = home.x;
          existing.homeY = home.y;
          existing.card  = card;
          existing.playerIdx = pIdx;
          next.push(existing);
        } else {
          next.push({
            id, playerId:player.id, playerIdx:pIdx, slotKey,
            card, alpha:0, scale:0.1,
            x:home.x, y:home.y, homeX:home.x, homeY:home.y,
            tx:home.x, ty:home.y,
            state:"idle",  // idle | attacking | dying
            particles:[], shakeT:0,
            imgEl:null,
          });
        }
      });

      // Markers for dead player: fade out
      if(player.health <= 0) {
        markers.filter(m=>m.playerId===player.id).forEach(m=>{
          if(m.state!=="dying"){ m.state="dying"; m.shakeT=0; }
        });
      }
    });

    // Markers no longer in next (slot emptied) → mark dying
    markers.forEach(m=>{
      if(!next.find(n=>n.id===m.id) && m.state!=="dying"){
        m.state="dying"; next.push(m);
      }
    });

    markers = next;
  }

  // ── Preload card image ────────────────────────────────
  const imgCache = {};
  function getImg(src) {
    if(imgCache[src]) return imgCache[src];
    const img = new Image();
    img.src   = src;
    imgCache[src] = img;
    return img;
  }

  // ── Trigger attack animation ──────────────────────────
  function triggerAttack(attackerId, targetId, dmg, color) {
    const atk = markers.find(m=>m.playerId===attackerId && m.slotKey==="hero");
    const tgt = markers.find(m=>m.playerId===targetId   && m.slotKey==="hero");
    if(!atk || !tgt) return;

    atk.state = "attacking";
    atk.tx    = tgt.homeX;
    atk.ty    = tgt.homeY;
    atk.attackTarget = { x:tgt.homeX, y:tgt.homeY };

    // After dash time → return home + spawn effects
    setTimeout(()=>{
      // Impact pulse on target
      spawnEffect("pulse",  tgt.homeX, tgt.homeY, PLAYER_COLORS[tgt.playerIdx]?.ring||"#fff");
      spawnEffect("damage", tgt.homeX, tgt.homeY - 18, PLAYER_COLORS[atk.playerIdx]?.ring||"#fff", dmg);
      // Shake
      shakeMag = Math.min(12, 4 + dmg * 0.1);
      tgt.shakeT = 18;

      setTimeout(()=>{
        atk.state="idle";
        atk.tx=atk.homeX; atk.ty=atk.homeY;
      }, 220);
    }, 340);

    // Particle trail
    spawnTrail(atk, tgt, PLAYER_COLORS[atk.playerIdx]?.trail||"rgba(255,255,255,.4)");
  }

  function triggerDeath(playerId) {
    markers.filter(m=>m.playerId===playerId).forEach(m=>{
      m.state="dying";
      spawnEffect("smoke", m.homeX, m.homeY, "#aaa");
    });
  }

  // ── Effects ───────────────────────────────────────────
  function spawnEffect(type,x,y,color,value){
    effects.push({type,x,y,color,t:0,dur:type==="pulse"?28:type==="smoke"?55:type==="damage"?60:30,value});
  }
  function spawnTrail(from,to,color){
    const steps=10;
    for(let i=0;i<steps;i++){
      const f=i/steps;
      setTimeout(()=>{
        spawnEffect("particle",
          from.x+(to.homeX-from.x)*f + (Math.random()-.5)*8,
          from.y+(to.homeY-from.y)*f + (Math.random()-.5)*8,
          color);
      },i*30);
    }
  }

  // ── Draw one frame ────────────────────────────────────
  function draw() {
    if(!ctx) return;
    ctx.clearRect(0,0,W,H);

    // Screen shake
    if(shakeMag>0.5){
      shakeX=(Math.random()-.5)*shakeMag;
      shakeY=(Math.random()-.5)*shakeMag;
      shakeMag*=0.78;
    } else { shakeX=0;shakeY=0;shakeMag=0; }
    ctx.save(); ctx.translate(shakeX,shakeY);

    // Draw faint arena ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(W/2,H/2,Math.min(W,H)*0.42,0,Math.PI*2);
    ctx.strokeStyle="rgba(214,162,74,.12)";
    ctx.lineWidth=1.5;
    ctx.stroke();
    ctx.restore();

    // Draw player territory labels
    if(battleState) {
      battleState.players.forEach((p,pIdx)=>{
        if(p.health<=0) return;
        const angles=[225,315,135,45];
        const deg=angles[pIdx]*(Math.PI/180);
        const R=Math.min(W,H)*0.42;
        const lx=W/2+Math.cos(deg)*R*0.88;
        const ly=H/2+Math.sin(deg)*R*0.88;
        const col=PLAYER_COLORS[pIdx];
        ctx.save();
        ctx.globalAlpha=0.5;
        ctx.fillStyle=col.ring;
        ctx.font=`bold ${Math.max(8,W*0.035)}px sans-serif`;
        ctx.textAlign="center";ctx.textBaseline="middle";
        ctx.fillText(p.name,lx,ly);
        ctx.restore();
      });
    }

    // Draw connector lines between markers of same player
    const byPlayer={};
    markers.forEach(m=>{ if(m.alpha>.1){ (byPlayer[m.playerId]=byPlayer[m.playerId]||[]).push(m); } });
    Object.entries(byPlayer).forEach(([pid,ms])=>{
      if(ms.length<2) return;
      const col=PLAYER_COLORS[ms[0].playerIdx];
      ctx.save();
      ctx.strokeStyle=col.ring;
      ctx.globalAlpha=0.12;
      ctx.lineWidth=1;
      ctx.setLineDash([3,5]);
      for(let i=1;i<ms.length;i++){
        ctx.beginPath();
        ctx.moveTo(ms[0].x,ms[0].y);
        ctx.lineTo(ms[i].x,ms[i].y);
        ctx.stroke();
      }
      ctx.restore();
    });

    // Update & draw effects first (behind markers)
    effects=effects.filter(e=>e.t<e.dur);
    effects.forEach(e=>{
      const p=e.t/e.dur; // 0→1
      e.t++;
      ctx.save();
      if(e.type==="pulse"){
        const r=8+p*28;
        ctx.beginPath();ctx.arc(e.x,e.y,r,0,Math.PI*2);
        ctx.strokeStyle=e.color;
        ctx.globalAlpha=(1-p)*0.9;
        ctx.lineWidth=2+p*3;
        ctx.stroke();
      } else if(e.type==="smoke"){
        for(let s=0;s<3;s++){
          const r=4+p*22+s*8;
          ctx.beginPath();ctx.arc(e.x+(s-1)*6,e.y-p*20,r,0,Math.PI*2);
          ctx.fillStyle=e.color;
          ctx.globalAlpha=(1-p)*0.18;
          ctx.fill();
        }
      } else if(e.type==="particle"){
        const r=3*(1-p);
        ctx.beginPath();ctx.arc(e.x,e.y-p*12,r,0,Math.PI*2);
        ctx.fillStyle=e.color;
        ctx.globalAlpha=(1-p)*0.9;
        ctx.fill();
      } else if(e.type==="damage"){
        ctx.fillStyle=e.color;
        ctx.globalAlpha=p<0.7?1:1-(p-.7)/.3;
        ctx.font=`bold ${Math.max(11,W*0.055)}px sans-serif`;
        ctx.textAlign="center";ctx.textBaseline="middle";
        ctx.fillText(`-${e.value}`,e.x,e.y-p*22);
      }
      ctx.restore();
    });

    // Update & draw markers
    markers.forEach(m=>{
      // Animate alpha & scale
      if(m.state==="dying"){
        m.alpha  = Math.max(0, m.alpha  - 0.04);
        m.scale  = Math.max(0, m.scale  - 0.03);
      } else {
        m.alpha  = Math.min(1, m.alpha  + 0.06);
        m.scale  = Math.min(1, m.scale  + 0.05);
      }

      // Lerp toward target
      m.x += (m.tx - m.x) * 0.18;
      m.y += (m.ty - m.y) * 0.18;

      if(m.alpha < 0.01 && m.state==="dying") return; // fully gone

      const col  = PLAYER_COLORS[m.playerIdx];
      const R    = Math.max(14, Math.min(W,H) * (m.slotKey==="hero"?0.078:0.055));
      const isHero = m.slotKey==="hero";

      ctx.save();
      ctx.globalAlpha = m.alpha;
      ctx.translate(m.x, m.y);
      ctx.scale(m.scale, m.scale);

      // Glow
      if(isHero){
        const grd=ctx.createRadialGradient(0,0,R*.5,0,0,R*2);
        grd.addColorStop(0,col.glow);
        grd.addColorStop(1,"transparent");
        ctx.beginPath();ctx.arc(0,0,R*2,0,Math.PI*2);
        ctx.fillStyle=grd;ctx.fill();
      }

      // Portrait clip
      ctx.save();
      ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);ctx.clip();
      const img=getImg(m.card.file);
      if(img.complete && img.naturalWidth){
        ctx.drawImage(img,-R,-R,R*2,R*2);
      } else {
        ctx.fillStyle="#222";ctx.fill();
      }
      ctx.restore();

      // Ring
      ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);
      ctx.strokeStyle=col.ring;
      ctx.lineWidth=isHero?3:2;
      ctx.stroke();

      // Inner white ring
      ctx.beginPath();ctx.arc(0,0,R-2.5,0,Math.PI*2);
      ctx.strokeStyle="rgba(255,255,255,.18)";
      ctx.lineWidth=1;ctx.stroke();

      // Slot label below
      ctx.fillStyle=col.ring;
      ctx.globalAlpha=m.alpha*0.85;
      ctx.font=`${Math.max(7,R*.38)}px sans-serif`;
      ctx.textAlign="center";ctx.textBaseline="top";
      ctx.fillText(SLOT_LABELS[m.slotKey],0,R+2);

      ctx.restore();
    });

    // Remove fully-dead markers
    markers=markers.filter(m=>!(m.state==="dying"&&m.alpha<0.01));

    ctx.restore(); // shake
  }

  // ── Resize handler ─────────────────────────────────────
  function resize(){
    if(!canvas)return;
    const rect=canvas.getBoundingClientRect();
    W=canvas.width =rect.width  *devicePixelRatio;
    H=canvas.height=rect.height *devicePixelRatio;
    ctx.scale(devicePixelRatio,devicePixelRatio);
    W=rect.width; H=rect.height; // logical pixels
    sync();
  }

  // ── RAF loop ──────────────────────────────────────────
  function loop(){raf=requestAnimationFrame(loop);draw();}

  // ── Public API ─────────────────────────────────────────
  function init(){
    canvas=document.getElementById("bfCanvas");
    if(!canvas)return;
    ctx=canvas.getContext("2d");
    const ro=new ResizeObserver(()=>resize());
    ro.observe(canvas);
    resize();
    loop();
  }

  return {
    init,
    sync,
    triggerAttack,
    triggerDeath,
  };
})();

// ── Start battlefield after DOM ready ────────────────────
document.addEventListener("DOMContentLoaded",()=>BF.init(), {once:true});
// Also init immediately if DOM already loaded
if(document.readyState!=="loading") BF.init();

// ── Start battle ──────────────────────────────────────────
function startBattle(playerConfigs){
  stopAi();
  battleState=createBattle(playerConfigs);
  battleTitle.textContent="Campo de Batalha de Valeth";
  setupRoomPanel();connectRoomSocket();
  showScreen("battle");
  renderBattle();
  openInitiativePanel(battleState.players);
}

// ── Event listeners ───────────────────────────────────────
backToMenu.addEventListener("click",()=>{stopAi();if(roomSocket)roomSocket.close();showScreen("menu");});
humanAttack.addEventListener("click",humanAttackAction);
copyRoomLink.addEventListener("click",async()=>{
  if(!roomLinkInput.value)return;
  await navigator.clipboard.writeText(roomLinkInput.value);
  showMessage("Link copiado","Envie o link da sala para os convidados.");
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeMessage();closeCardView();closeSetupModal();}});

// Legacy URL room support
const incomingRoom=getRoomFromUrl();
if(incomingRoom){
  const cfgs=[0,1,2,3].map(i=>({
    name:i<incomingRoom.humans?`Jogador ${i+1}`:`Máquina ${i+1}`,
    isMachine:i>=incomingRoom.humans,
  }));
  startBattle(cfgs);
}
