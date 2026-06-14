const regions = {
  "Valeth": {
    description: "Capital do reino e sede do Conselho Real, onde alianças e traições decidem o futuro do continente.",
    faction: "Conselho Real de Valeth"
  },
  "Corália": {
    description: "Cidade portuária rica, movida por comércio, navios mercantes e acordos feitos longe dos olhos da coroa.",
    faction: "Liga dos Navegantes"
  },
  "Thurvael": {
    description: "Floresta ancestral protegida por antigos juramentos élficos e trilhas que mudam ao luar.",
    faction: "Guardas de Thurvael"
  },
  "Valdruun": {
    description: "Fortaleza sombria no território dos vampiros, marcada por torres negras e pactos de sangue.",
    faction: "Corte Carmesim"
  },
  "A Forja": {
    description: "Reino montanhoso dos anões, célebre por armas sagradas, minas profundas e honra inflexível.",
    faction: "Clãs da Bigorna"
  },
  "Eriadun": {
    description: "Areias infinitas guardando ruínas, profecias soterradas e caravanas que raramente retornam intactas.",
    faction: "Senhores das Dunas"
  },
  "Vorzak": {
    description: "Bastião hostil dos orcs e ogros, onde força, fogo e conquista ditam a lei.",
    faction: "Horda de Vorzak"
  },
  "Uldor": {
    description: "Terras dos clãs livres, endurecidas por frio, pedra e guerras antigas contra invasores do norte.",
    faction: "Clãs de Uldor"
  },
  "Lua Silenciosa": {
    description: "Domínio isolado de monges e magos, conhecido por observatórios, neve eterna e segredos arcanos.",
    faction: "Ordem da Lua Silenciosa"
  },
  "Lodamar": {
    description: "Pântano de águas negras onde viajantes desaparecem entre névoa, raízes e sussurros antigos.",
    faction: "Bruxos de Lodamar"
  },
  "Cinturão de Magmar": {
    description: "Arquipélago vulcânico de ilhas perigosas, cinzas vivas e portos controlados por forças rivais.",
    faction: "Pactos de Magmar"
  }
};

const tooltip = document.getElementById("regionTooltip");
const hotspots = document.querySelectorAll(".region-hotspot");
const menuButtons = document.querySelectorAll(".menu-button");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");

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

  hotspot.addEventListener("mouseleave", () => {
    tooltip.classList.remove("is-visible");
  });

  hotspot.addEventListener("focus", (event) => {
    renderTooltip(hotspot.dataset.region);
    tooltip.classList.add("is-visible");
    positionTooltip({
      clientX: event.target.getBoundingClientRect().left,
      clientY: event.target.getBoundingClientRect().top
    });
  });

  hotspot.addEventListener("blur", () => {
    tooltip.classList.remove("is-visible");
  });
});

function openModal() {
  modalBackdrop.classList.add("is-open");
  modalBackdrop.setAttribute("aria-hidden", "false");
  modalClose.focus();
}

function closeModal() {
  modalBackdrop.classList.remove("is-open");
  modalBackdrop.setAttribute("aria-hidden", "true");
}

menuButtons.forEach((button) => {
  button.addEventListener("click", openModal);
});

modalClose.addEventListener("click", closeModal);

modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});
