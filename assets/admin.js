const STORAGE_KEY = "ocircle_games";
const LOGO_KEY = "ocircle_company_logo";
const DEFAULT_GAMES_URL = "data/games.json";
let games = [];
let editingId = null;

const $ = s => document.querySelector(s);

function loadLogo(){ const logo=localStorage.getItem(LOGO_KEY)||"assets/icon-placeholder.svg"; $("#company-logo-input").value=localStorage.getItem(LOGO_KEY)||""; $("#logo-preview").src=logo; }
function saveLogo(){ const v=$("#company-logo-input").value.trim(); if(v) localStorage.setItem(LOGO_KEY,v); else localStorage.removeItem(LOGO_KEY); loadLogo(); }
function removeLogo(){ localStorage.removeItem(LOGO_KEY); loadLogo(); }

async function loadGames() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try { games = JSON.parse(saved); return; } catch (_) {}
  }
  try {
    const r = await fetch(DEFAULT_GAMES_URL, { cache: "no-store" });
    games = r.ok ? await r.json() : [];
  } catch (_) { games = []; }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games, null, 2));
}

function uid() {
  return "game_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function addLinkRow(link = {label:"Play Store", url:"", style:""}) {
  const row = document.createElement("div");
  row.className = "link-row";
  row.innerHTML = `
    <input class="link-label" value="${esc(link.label)}" placeholder="Button name (e.g. Steam)">
    <input class="link-url" value="${esc(link.url)}" placeholder="https://...">
    <select class="link-style">
      <option value="" ${!link.style ? "selected":""}>Default</option>
      <option value="accent" ${link.style==="accent" ? "selected":""}>Accent</option>
      <option value="outline" ${link.style==="outline" ? "selected":""}>Outline</option>
    </select>
    <button class="remove-link" type="button" aria-label="Remove link">×</button>
  `;
  row.querySelector(".remove-link").onclick = () => row.remove();
  $("#links-list").appendChild(row);
}

function esc(v="") {
  return String(v).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
}

function resetForm() {
  editingId = null;
  $("#game-id").value = "";
  $("#game-name").value = "";
  $("#game-description").value = "";
  $("#game-icon").value = "";
  $("#links-list").innerHTML = "";
  addLinkRow({label:"Play Store"});
  addLinkRow({label:"Privacy Policy"});
  $("#form-title").textContent = "Add a game";
  $("#cancel-edit").classList.add("hidden");
  document.querySelector(".submit-button").textContent = "Save Game";
}

function collectLinks() {
  return [...document.querySelectorAll(".link-row")].map(row => ({
    label: row.querySelector(".link-label").value.trim(),
    url: row.querySelector(".link-url").value.trim(),
    style: row.querySelector(".link-style").value
  })).filter(x => x.label && x.url);
}

function renderSaved() {
  const wrap = $("#saved-games");
  if (!games.length) {
    wrap.innerHTML = `<div class="empty-state"><h3>No saved games</h3><p>Add a game above.</p></div>`;
    return;
  }
  wrap.innerHTML = games.map(game => `
    <div class="saved-game">
      <img src="${esc(game.icon || "assets/icon-placeholder.svg")}" onerror="this.src='assets/icon-placeholder.svg'" alt="">
      <div><strong>${esc(game.name)}</strong><span>${(game.links || []).length} link(s)</span></div>
      <div class="saved-actions">
        <button class="secondary-button edit-game" data-id="${esc(game.id)}">Edit</button>
        <button class="danger-button delete-game" data-id="${esc(game.id)}">Delete</button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".edit-game").forEach(b => b.onclick = () => editGame(b.dataset.id));
  document.querySelectorAll(".delete-game").forEach(b => b.onclick = () => deleteGame(b.dataset.id));
}

function editGame(id) {
  const game = games.find(g => g.id === id);
  if (!game) return;
  editingId = id;
  $("#game-name").value = game.name || "";
  $("#game-description").value = game.description || "";
  $("#game-icon").value = game.icon || "";
  $("#links-list").innerHTML = "";
  (game.links || []).forEach(addLinkRow);
  if (!(game.links || []).length) addLinkRow();
  $("#form-title").textContent = "Edit game";
  $("#cancel-edit").classList.remove("hidden");
  document.querySelector(".submit-button").textContent = "Update Game";
  window.scrollTo({top:0, behavior:"smooth"});
}

function deleteGame(id) {
  const game = games.find(g => g.id === id);
  if (!game || !confirm(`Delete "${game.name}"?`)) return;
  games = games.filter(g => g.id !== id);
  persist(); renderSaved();
}

function downloadJson() {
  const blob = new Blob([JSON.stringify(games, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "games.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

$("#save-logo").onclick=saveLogo; $("#remove-logo").onclick=removeLogo; $("#company-logo-input").addEventListener("input",()=>$("#logo-preview").src=$("#company-logo-input").value.trim()||"assets/icon-placeholder.svg");

$("#game-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#game-name").value.trim();
  if (!name) return;

  const game = {
    id: editingId || uid(),
    name,
    description: $("#game-description").value.trim(),
    icon: $("#game-icon").value.trim(),
    links: collectLinks()
  };

  if (editingId) games = games.map(g => g.id === editingId ? game : g);
  else games.push(game);

  persist();
  renderSaved();
  resetForm();
});

$("#add-link").onclick = () => addLinkRow();
$("#cancel-edit").onclick = resetForm;
$("#export-btn").onclick = downloadJson;
$("#reset-btn").onclick = () => {
  if (!confirm("Clear all locally saved dashboard data?")) return;
  localStorage.removeItem(STORAGE_KEY);
  loadGames().then(() => { renderSaved(); resetForm(); });
};

(async () => {
  await loadGames();
  loadLogo();
  renderSaved();
  resetForm();
})();