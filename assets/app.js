const DEFAULT_GAMES_URL = "data/games.json";
const DEFAULT_SITE_URL = "data/site.json";
const STORAGE_KEY = "ocircle_games";
const LOGO_KEY = "ocircle_company_logo";

const fallback = [];

async function getGames() {
  try {
    const response = await fetch(DEFAULT_GAMES_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load games");
    return await response.json();
  } catch (_) {
    return fallback;
  }
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function renderGames(games) {
  const grid = document.querySelector("#games-grid");
  const empty = document.querySelector("#empty-state");
  const count = document.querySelector("#game-count");
  count.textContent = `${games.length} ${games.length === 1 ? "game" : "games"}`;

  if (!games.length) {
    grid.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  grid.innerHTML = games.map(game => `
    <article class="game-card">
      <div class="icon-wrap">
        <img src="${escapeHtml(game.icon || "assets/icon-placeholder.svg")}" alt="${escapeHtml(game.name)} icon"
             onerror="this.src='assets/icon-placeholder.svg'">
      </div>
      <div class="game-info">
        <h3>${escapeHtml(game.name)}</h3>
        ${game.description ? `<p>${escapeHtml(game.description)}</p>` : ""}
        <div class="game-links">
          ${(game.links || []).map(link => `
            <a class="game-link ${escapeHtml((link.style || "").toLowerCase())}"
               href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
              ${escapeHtml(link.label)}
              <span>↗</span>
            </a>`).join("")}
        </div>
      </div>
    </article>
  `).join("");
}

(async () => {
  document.querySelector("#year").textContent = new Date().getFullYear();
  const logo = localStorage.getItem(LOGO_KEY);
  const logoEl = document.querySelector("#company-logo");
  if (logo && logoEl) logoEl.src = logo;
  renderGames(await getGames());
})();