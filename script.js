const map = L.map('map', { zoomControl: false }).setView([20, 0], 2);
L.control.zoom({ position: 'bottomleft' }).addTo(map);

const ICO_DEL = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const ICO_PIN = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const ICO_HIST = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;

/* ══════════════════════════════════════════════════════════════════════
   SIDEBAR TOGGLE
══════════════════════════════════════════════════════════════════════ */
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const toggleIcon = document.getElementById('toggleIcon');

const ICON_MENU = '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>';
const ICON_CLOSE = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';

sidebarToggle.addEventListener('click', e => {
  e.stopPropagation();
  const isOpen = sidebar.classList.toggle('menu-open');
  sidebarToggle.classList.toggle('open', isOpen);
  toggleIcon.innerHTML = isOpen ? ICON_CLOSE : ICON_MENU;
  if (isOpen) {
    mapMenu.classList.remove('open');
    document.getElementById('menuBtn').classList.remove('open');
  }
});

document.addEventListener('click', e => {
  if (!sidebar.contains(e.target) && !mapMenu.contains(e.target)) {
    sidebar.classList.remove('menu-open');
    sidebarToggle.classList.remove('open');
    toggleIcon.innerHTML = ICON_MENU;
  }
});

/* GAMIFICATION ENGINE */
const GK = 'geogo_game_v2';
const PK = 'geogo_profile_v2';

const AVATARS = [
  { id: 'person', lbl: 'Путник', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>' },
  { id: 'compass', lbl: 'Компас', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>' },
  { id: 'map', lbl: 'Карта', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>' },
  { id: 'mountain', lbl: 'Горы', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20l6-12 4 7 3-5 5 10"/></svg>' },
  { id: 'globe', lbl: 'Глобус', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' },
  { id: 'plane', lbl: 'Самолёт', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>' },
  { id: 'car', lbl: 'Авто', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>' },
  { id: 'bike', lbl: 'Вело', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>' },
  { id: 'ship', lbl: 'Корабль', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2H2v2z"/><path d="M7 12V8h10v4M12 3v5"/><path d="M5 12l7 4 7-4"/></svg>' },
  { id: 'star', lbl: 'Звезда', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
  { id: 'fire', lbl: 'Огонь', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c0 6-6 6-6 12a6 6 0 0 0 12 0c0-3-1.5-5-3-6 0 2-1.5 3-1.5 3S12 8 12 2z"/></svg>' },
  { id: 'flag', lbl: 'Флаг', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>' },
  { id: 'camera', lbl: 'Камера', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>' },
  { id: 'trophy', lbl: 'Кубок', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 21 12 21 16 21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4H17l-2 7a5 5 0 0 1-10 0L3 4"/><path d="M17 4h2a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4M7 4H5a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4"/></svg>' },
  { id: 'rocket', lbl: 'Ракета', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>' },
  { id: 'diamond', lbl: 'Брилл.', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z"/></svg>' },
  { id: 'zap', lbl: 'Молния', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' },
  { id: 'leaf', lbl: 'Листок', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>' },
  { id: 'anchor', lbl: 'Якорь', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>' },
  { id: 'sun', lbl: 'Солнце', svg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' },
];

const AVATAR_EMOJIS = ['🌍', '🗺️', '🏔️', '🏕️', '⛵', '🚀', '🌊', '🏝️', '🌋', '🧭', '🎯', '🏆', '💎', '⚡', '🔥', '🌿', '⚓', '☀️', '🌙', '❄️', '🎪', '🎭', '🎨', '🦅', '🐉'];

const AVATAR_COLORS_PRESET = [
  { id: 'blue', c1: '#4285f4', c2: '#1a73e8' },
  { id: 'indigo', c1: '#5c6bc0', c2: '#3949ab' },
  { id: 'violet', c1: '#7c4dff', c2: '#5e35b1' },
  { id: 'pink', c1: '#e91e8c', c2: '#c2185b' },
  { id: 'red', c1: '#e53935', c2: '#b71c1c' },
  { id: 'orange', c1: '#fb8c00', c2: '#e65100' },
  { id: 'amber', c1: '#ffb300', c2: '#ff8f00' },
  { id: 'gold', c1: '#f9a825', c2: '#f57f17' },
  { id: 'green', c1: '#43a047', c2: '#2e7d32' },
  { id: 'teal', c1: '#00897b', c2: '#00695c' },
  { id: 'cyan', c1: '#00acc1', c2: '#00838f' },
  { id: 'sky', c1: '#039be5', c2: '#0277bd' },
  { id: 'slate', c1: '#546e7a', c2: '#263238' },
  { id: 'brown', c1: '#6d4c41', c2: '#3e2723' },
  { id: 'black', c1: '#37474f', c2: '#000000' },
  { id: 'silver', c1: '#90a4ae', c2: '#607d8b' },
  { id: 'crimson', c1: '#c62828', c2: '#7f0000' },
  { id: 'lime', c1: '#aed800', c2: '#689f38' },
  { id: 'mint', c1: '#00c853', c2: '#00796b' },
  { id: 'aurora', c1: '#9c27b0', c2: '#4caf50' },
];

function loadProfile() {
  try { const p = JSON.parse(localStorage.getItem(PK)); if (p) return p; } catch { }
  return { avatarId: 'person', avatarType: 'svg', customSym: '', color1: '#4285f4', color2: '#1a73e8', name: '', username: '', _uid: '' };
}
function saveProfile(p) { try { localStorage.setItem(PK, JSON.stringify(p)); } catch { } }
let PROFILE = loadProfile();

function getAvatarContent() {
  if ((PROFILE.avatarType === 'custom' || PROFILE.avatarType === 'emoji') && PROFILE.customSym)
    return '<span style="font-size:' + (PROFILE.avatarType === 'emoji' ? '24' : '26') + 'px;line-height:1">' + PROFILE.customSym + '</span>';
  return AVATARS.find(a => a.id === PROFILE.avatarId)?.svg || AVATARS[0].svg;
}
function getAvatarGradient() {
  return 'linear-gradient(135deg,' + (PROFILE.color1 || '#4285f4') + ' 0%,' + (PROFILE.color2 || '#1a73e8') + ' 100%)';
}
function applyProfileToUI() {
  const ico = document.getElementById('gpAvatarIcon');
  if (ico) ico.innerHTML = getAvatarContent();
  const hero = document.querySelector('.gp-hero');
  if (hero) hero.style.background = getAvatarGradient();
  const nameEl = document.getElementById('gpLevelName');
  if (nameEl && PROFILE.name) nameEl.textContent = PROFILE.name;
  const sub = document.getElementById('gpUsernameSub');
  if (sub) sub.textContent = PROFILE.username ? ('@' + PROFILE.username) : '';
}

/* == AVATAR PICKER == */
function openAvatarPicker() {
  buildApGrid(); buildApEmoji(); buildApColors(); initColorPicker(); syncProfileTab();
  document.getElementById('avatarPicker').classList.add('show');
  document.getElementById('avatarPickerOverlay').classList.add('show');
}
function closeAvatarPicker() {
  document.getElementById('avatarPicker').classList.remove('show');
  document.getElementById('avatarPickerOverlay').classList.remove('show');
}
document.getElementById('gpAvatarBig').addEventListener('click', openAvatarPicker);
document.getElementById('apClose').addEventListener('click', closeAvatarPicker);
document.getElementById('avatarPickerOverlay').addEventListener('click', closeAvatarPicker);

document.querySelectorAll('.ap-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ap-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.ap-tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    var tname = tab.dataset.tab;
    document.getElementById('apTab' + tname.charAt(0).toUpperCase() + tname.slice(1)).classList.add('active');
    if (tname === 'color') setTimeout(drawColorCanvas, 50);
  });
});

function buildApGrid() {
  var grid = document.getElementById('apGrid');
  grid.innerHTML = AVATARS.map(function (a) {
    var sel = PROFILE.avatarType === 'svg' && PROFILE.avatarId === a.id;
    return '<div class="ap-item' + (sel ? ' selected' : '') + '" data-ava="' + a.id + '" data-type="svg">' + a.svg + '<div class="ap-item-lbl">' + a.lbl + '</div></div>';
  }).join('');
  grid.querySelectorAll('.ap-item').forEach(function (el) {
    el.addEventListener('click', function () {
      PROFILE.avatarType = 'svg'; PROFILE.avatarId = el.dataset.ava; PROFILE.customSym = ''; saveProfile(PROFILE);
      clearAllAvaSelections(); el.classList.add('selected'); applyProfileToUI();
    });
  });
}

function buildApEmoji() {
  var grid = document.getElementById('apEmojiGrid');
  grid.innerHTML = AVATAR_EMOJIS.map(function (e) {
    var sel = PROFILE.avatarType === 'emoji' && PROFILE.customSym === e;
    return '<div class="ap-item' + (sel ? ' selected' : '') + '" data-emoji="' + e + '"><span class="ap-item-emoji">' + e + '</span></div>';
  }).join('');
  grid.querySelectorAll('.ap-item').forEach(function (el) {
    el.addEventListener('click', function () {
      PROFILE.avatarType = 'emoji'; PROFILE.customSym = el.dataset.emoji; saveProfile(PROFILE);
      clearAllAvaSelections(); el.classList.add('selected'); applyProfileToUI();
    });
  });
}

function clearAllAvaSelections() {
  document.getElementById('apGrid').querySelectorAll('.ap-item').forEach(function (x) { x.classList.remove('selected'); });
  document.getElementById('apEmojiGrid').querySelectorAll('.ap-item').forEach(function (x) { x.classList.remove('selected'); });
  var ci = document.getElementById('apCustomSymInput'); if (ci) ci.classList.remove('selected');
}

(function () {
  var inp = document.getElementById('apCustomSymInput');
  if (!inp) return;
  if (PROFILE.avatarType === 'custom' && PROFILE.customSym) inp.value = PROFILE.customSym;
  inp.addEventListener('input', function () {
    var chars = [...inp.value]; var v = chars.length > 0 ? chars[chars.length - 1] : '';
    inp.value = v;
    if (!v) return;
    PROFILE.avatarType = 'custom'; PROFILE.customSym = v; saveProfile(PROFILE);
    clearAllAvaSelections(); inp.classList.add('selected'); applyProfileToUI();
  });
})();

function buildApColors() {
  var wrap = document.getElementById('apColors');
  wrap.innerHTML = AVATAR_COLORS_PRESET.map(function (c) {
    var sel = PROFILE.color1 === c.c1 && PROFILE.color2 === c.c2;
    return '<div class="ap-color' + (sel ? ' selected' : '') + '" data-c1="' + c.c1 + '" data-c2="' + c.c2 + '" style="background:linear-gradient(135deg,' + c.c1 + ',' + c.c2 + ')" title="' + c.id + '"></div>';
  }).join('');
  wrap.querySelectorAll('.ap-color').forEach(function (el) {
    el.addEventListener('click', function () {
      PROFILE.color1 = el.dataset.c1; PROFILE.color2 = el.dataset.c2; saveProfile(PROFILE);
      wrap.querySelectorAll('.ap-color').forEach(function (x) { x.classList.remove('selected'); });
      el.classList.add('selected'); applyProfileToUI(); updateGradSwatches();
      var h1 = hexToHsv(PROFILE.color1); cpHue = h1[0]; cpSat = h1[1]; cpVal = h1[2];
      document.getElementById('apHueSlider').value = cpHue;
      drawColorCanvas();
    });
  });
}

/* == COLOR PICKER == */
var cpHue = 220, cpSat = 0.7, cpVal = 0.9, cpEditingSlot = 1;

function hsvToRgb(h, s, v) {
  var r, g, b, i = Math.floor(h / 60) % 6, f = h / 60 - Math.floor(h / 60), p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - s * (1 - f));
  if (i === 0) { r = v; g = t; b = p; } else if (i === 1) { r = q; g = v; b = p; } else if (i === 2) { r = p; g = v; b = t; } else if (i === 3) { r = p; g = q; b = v; } else if (i === 4) { r = t; g = p; b = v; } else { r = v; g = p; b = q; }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
function rgbToHex(r, g, b) { return '#' + [r, g, b].map(function (x) { return x.toString(16).padStart(2, '0'); }).join(''); }
function hexToRgb(hex) { var r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : null; }
function hexToHsv(hex) {
  var rgb = hexToRgb(hex); if (!rgb) return [0, 0, 1];
  var r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, h = 0;
  if (d) { if (max === r) h = ((g - b) / d) % 6; else if (max === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h = Math.round(h * 60); if (h < 0) h += 360; }
  return [h, max === 0 ? 0 : d / max, max];
}

function drawColorCanvas() {
  var canvas = document.getElementById('apColorCanvas'); if (!canvas) return;
  var ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
  var hslStr = 'hsl(' + cpHue + ',100%,50%)';
  var g1 = ctx.createLinearGradient(0, 0, w, 0); g1.addColorStop(0, '#fff'); g1.addColorStop(1, hslStr);
  ctx.fillStyle = g1; ctx.fillRect(0, 0, w, h);
  var g2 = ctx.createLinearGradient(0, 0, 0, h); g2.addColorStop(0, 'rgba(0,0,0,0)'); g2.addColorStop(1, '#000');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, w, h);
  var cursor = document.getElementById('apCpCursor');
  if (cursor) { cursor.style.left = (cpSat * w) + 'px'; cursor.style.top = ((1 - cpVal) * h) + 'px'; }
  updateCpPreview();
}
function updateCpPreview() {
  var rgb = hsvToRgb(cpHue, cpSat, cpVal), hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
  var pb = document.getElementById('apCpPreviewBox'), hi = document.getElementById('apHexInput1');
  if (pb) pb.style.background = hex;
  if (hi && document.activeElement !== hi) hi.value = hex;
}
function setActiveColor(hex) {
  if (cpEditingSlot === 1) PROFILE.color1 = hex; else PROFILE.color2 = hex;
  saveProfile(PROFILE); applyProfileToUI(); updateGradSwatches();
  document.getElementById('apColors').querySelectorAll('.ap-color').forEach(function (x) { x.classList.remove('selected'); });
}
function updateGradSwatches() {
  var s1 = document.getElementById('apGradSwatch1'), s2 = document.getElementById('apGradSwatch2'), pv = document.getElementById('apGradPreview');
  if (s1) s1.style.background = PROFILE.color1 || '#4285f4';
  if (s2) s2.style.background = PROFILE.color2 || '#1a73e8';
  if (pv) pv.style.background = 'linear-gradient(90deg,' + (PROFILE.color1 || '#4285f4') + ',' + (PROFILE.color2 || '#1a73e8') + ')';
}

function initColorPicker() {
  var canvas = document.getElementById('apColorCanvas'); if (!canvas || canvas._cpInit) return;
  canvas._cpInit = true;
  var hex1 = cpEditingSlot === 1 ? (PROFILE.color1 || '#4285f4') : (PROFILE.color2 || '#1a73e8');
  var hsv = hexToHsv(hex1); cpHue = hsv[0]; cpSat = hsv[1]; cpVal = hsv[2];
  document.getElementById('apHueSlider').value = cpHue;
  updateGradSwatches(); drawColorCanvas();
  var dragging = false;
  function pick(e) {
    var rect = canvas.getBoundingClientRect(), sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    var cx = e.touches ? e.touches[0].clientX : e.clientX, cy = e.touches ? e.touches[0].clientY : e.clientY;
    cpSat = Math.max(0, Math.min(1, (cx - rect.left) * sx / canvas.width));
    cpVal = Math.max(0, Math.min(1, 1 - (cy - rect.top) * sy / canvas.height));
    var rgb = hsvToRgb(cpHue, cpSat, cpVal); setActiveColor(rgbToHex(rgb[0], rgb[1], rgb[2])); drawColorCanvas();
  }
  canvas.addEventListener('mousedown', function (e) { dragging = true; pick(e); });
  canvas.addEventListener('touchstart', function (e) { dragging = true; e.preventDefault(); pick(e); }, { passive: false });
  window.addEventListener('mousemove', function (e) { if (dragging) pick(e); });
  window.addEventListener('mouseup', function () { dragging = false; });
  window.addEventListener('touchmove', function (e) { if (dragging) { e.preventDefault(); pick(e); } }, { passive: false });
  window.addEventListener('touchend', function () { dragging = false; });
  document.getElementById('apHueSlider').addEventListener('input', function () {
    cpHue = +this.value; var rgb = hsvToRgb(cpHue, cpSat, cpVal); setActiveColor(rgbToHex(rgb[0], rgb[1], rgb[2])); drawColorCanvas();
  });
  document.getElementById('apHexApply1').addEventListener('click', function () {
    var hex = document.getElementById('apHexInput1').value.trim();
    if (/^#[0-9a-f]{6}$/i.test(hex)) { var hsv2 = hexToHsv(hex); cpHue = hsv2[0]; cpSat = hsv2[1]; cpVal = hsv2[2]; document.getElementById('apHueSlider').value = cpHue; setActiveColor(hex); drawColorCanvas(); }
  });
  document.getElementById('apHexInput1').addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('apHexApply1').click(); });
  document.getElementById('apGradSwatch1').addEventListener('click', function () {
    cpEditingSlot = 1; var h = hexToHsv(PROFILE.color1 || '#4285f4'); cpHue = h[0]; cpSat = h[1]; cpVal = h[2];
    document.getElementById('apHueSlider').value = cpHue;
    document.getElementById('apGradSwatch1').classList.add('active'); document.getElementById('apGradSwatch2').classList.remove('active');
    drawColorCanvas();
  });
  document.getElementById('apGradSwatch2').addEventListener('click', function () {
    cpEditingSlot = 2; var h = hexToHsv(PROFILE.color2 || '#1a73e8'); cpHue = h[0]; cpSat = h[1]; cpVal = h[2];
    document.getElementById('apHueSlider').value = cpHue;
    document.getElementById('apGradSwatch2').classList.add('active'); document.getElementById('apGradSwatch1').classList.remove('active');
    drawColorCanvas();
  });
}

/* == PROFILE TAB == */
function syncProfileTab() {
  var ni = document.getElementById('apNicknameInput'), ui = document.getElementById('apUsernameInput');
  if (ni) ni.value = PROFILE.name || '';
  if (ui) ui.value = PROFILE.username || '';
}
function validateUsername(val) {
  if (!val) return { ok: true, msg: 'Оставьте пустым или введите username' };
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(val)) return { ok: false, msg: '3–20 символов: буквы, цифры, _' };
  var stored = JSON.parse(localStorage.getItem('geogo_usernames') || '{}');
  if (!PROFILE._uid) PROFILE._uid = Math.random().toString(36).slice(2);
  var takenBy = stored[val.toLowerCase()];
  if (takenBy && takenBy !== PROFILE._uid) return { ok: false, msg: 'Этот username уже занят' };
  return { ok: true, msg: '@' + val + ' доступен ✓' };
}
(function () {
  var ui = document.getElementById('apUsernameInput'), hint = document.getElementById('apUsernameHint');
  if (!ui) return;
  ui.addEventListener('input', function () {
    var v = ui.value.replace(/[^a-zA-Z0-9_]/g, ''); ui.value = v;
    var res = validateUsername(v);
    hint.textContent = res.msg; hint.className = 'ap-field-hint ' + (v ? (res.ok ? 'ok' : 'err') : '');
  });
})();
document.getElementById('apProfileSave').addEventListener('click', function () {
  var ni = document.getElementById('apNicknameInput'), ui = document.getElementById('apUsernameInput');
  var nick = ni.value.trim().slice(0, 20), uname = ui.value.trim();
  if (uname) {
    var res = validateUsername(uname);
    if (!res.ok) { toast(res.msg, 'err'); return; }
    var stored = JSON.parse(localStorage.getItem('geogo_usernames') || '{}');
    if (!PROFILE._uid) PROFILE._uid = Math.random().toString(36).slice(2);
    if (PROFILE.username && PROFILE.username !== uname) delete stored[PROFILE.username.toLowerCase()];
    stored[uname.toLowerCase()] = PROFILE._uid;
    localStorage.setItem('geogo_usernames', JSON.stringify(stored));
  }
  if (nick) PROFILE.name = nick;
  if (uname) PROFILE.username = uname;
  saveProfile(PROFILE); applyProfileToUI(); toast('Профиль сохранён ✓', 'ok');
});

(function () {
  var nameEl = document.getElementById('gpLevelName');
  var nameInput = document.getElementById('gpNameInput');
  var editBtn = document.getElementById('gpNameEditBtn');
  function startEdit() { nameEl.style.display = 'none'; editBtn.style.display = 'none'; nameInput.style.display = 'block'; nameInput.value = PROFILE.name || ''; nameInput.focus(); nameInput.select(); }
  function finishEdit() { var v = nameInput.value.trim().slice(0, 20); if (v) { PROFILE.name = v; saveProfile(PROFILE); } nameInput.style.display = 'none'; nameEl.style.display = ''; editBtn.style.display = ''; applyProfileToUI(); }
  editBtn.addEventListener('click', startEdit);
  nameEl.addEventListener('dblclick', startEdit);
  nameInput.addEventListener('blur', finishEdit);
  nameInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') finishEdit(); if (e.key === 'Escape') { nameInput.style.display = 'none'; nameEl.style.display = ''; editBtn.style.display = ''; } });
})();

const LEVELS = [
  { min: 0, name: 'Новичок' }, { min: 100, name: 'Путешественник' }, { min: 300, name: 'Исследователь' },
  { min: 600, name: 'Навигатор' }, { min: 1000, name: 'Картограф' }, { min: 1500, name: 'Географ' },
  { min: 2200, name: 'Первооткрыватель' }, { min: 3000, name: 'Легенда карты' }, { min: 4000, name: 'Мастер маршрутов' }, { min: 5500, name: 'Гений GeoGo' },
];
function getLevel(xp) { let lv = 1; for (let i = 0; i < LEVELS.length; i++) { if (xp >= LEVELS[i].min) lv = i + 1; } return lv; }
function getLevelName(lv) { return LEVELS[Math.min(lv - 1, LEVELS.length - 1)].name; }
function xpForLevel(lv) { return LEVELS[Math.min(lv, LEVELS.length - 1)]?.min ?? 9999; }
function xpProgress(xp) { const lv = getLevel(xp); const cur = LEVELS[lv - 1].min; const nxt = xpForLevel(lv); if (nxt === 9999) return 100; return Math.min(100, Math.round((xp - cur) / (nxt - cur) * 100)); }

const ACHIEVEMENTS = [
  { id: 'pin1', name: 'Первая метка', desc: 'Поставьте 1 метку', max: 1, key: 'pins', ico: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>', xp: 25 },
  { id: 'pin10', name: 'Коллекционер', desc: 'Поставьте 10 меток', max: 10, key: 'pins', ico: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>', xp: 50 },
  { id: 'route1', name: 'Первый маршрут', desc: 'Постройте 1 маршрут', max: 1, key: 'routes', ico: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>', xp: 30 },
  { id: 'route5', name: 'Штурман', desc: 'Постройте 5 маршрутов', max: 5, key: 'routes', ico: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>', xp: 75 },
  { id: 'wiki1', name: 'Эрудит', desc: 'Откройте 1 статью', max: 1, key: 'wiki', ico: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>', xp: 20 },
  { id: 'wiki10', name: 'Библиотекарь', desc: 'Откройте 10 статей', max: 10, key: 'wiki', ico: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>', xp: 60 },
  { id: 'random5', name: 'Авантюрист', desc: '5 случайных мест', max: 5, key: 'random', ico: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>', xp: 40 },
  { id: 'streak3', name: 'Верность', desc: '3 дня подряд', max: 3, key: 'streak', ico: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', xp: 80 },
  { id: 'search5', name: 'Поисковик', desc: '5 поисковых запросов', max: 5, key: 'searches', ico: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>', xp: 35 },
  { id: 'ruler1', name: 'Измеритель', desc: 'Используйте линейку', max: 1, key: 'ruler', ico: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="12" x2="22" y2="12"/><polyline points="6 8 2 12 6 16"/><polyline points="18 8 22 12 18 16"/></svg>', xp: 20 },
  { id: 'layer1', name: 'Аналитик', desc: 'Включите слой карты', max: 1, key: 'layers', ico: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>', xp: 15 },
];

const DAILY_CHALLENGES = [
  { id: 'd_pin', name: 'Добавить метку', desc: 'Поставьте хотя бы 1 метку', key: 'pins', goal: 1, xp: 20, ico: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' },
  { id: 'd_route', name: 'Построить маршрут', desc: 'Постройте хотя бы 1 маршрут', key: 'routes', goal: 1, xp: 25, ico: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
  { id: 'd_wiki', name: 'Прочитать статью', desc: 'Откройте статью Википедии', key: 'wiki', goal: 1, xp: 15, ico: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>' },
  { id: 'd_random', name: 'Случайное место', desc: 'Нажмите «Случайное место»', key: 'random', goal: 1, xp: 10, ico: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>' },
];

function loadGame() { try { return JSON.parse(localStorage.getItem(GK)) || newGame(); } catch { return newGame(); } }
function newGame() { return { xp: 0, pins: 0, routes: 0, wiki: 0, random: 0, searches: 0, ruler: 0, layers: 0, streak: 0, bestStreak: 0, lastActiveDate: '', unlocked: [], daily: { date: '', done: [] }, stats: { xpTotal: 0 } }; }
function saveGame(g) { try { localStorage.setItem(GK, JSON.stringify(g)); } catch { } }
let G = loadGame();

function touchStreak() {
  const today = new Date().toDateString();
  if (G.lastActiveDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (G.lastActiveDate === yesterday) { G.streak++; } else { G.streak = 1; }
  if (G.streak > G.bestStreak) G.bestStreak = G.streak;
  G.lastActiveDate = today; saveGame(G); checkAchievement('streak3', G.streak);
}

function ensureDailyReset() {
  const today = new Date().toDateString();
  if (G.daily.date !== today) { G.daily = { date: today, done: [], progress: {} }; }
}

function gainXP(amount, x, y) {
  const oldLevel = getLevel(G.xp); G.xp += amount; G.stats.xpTotal = (G.stats.xpTotal || 0) + amount; saveGame(G); updateUI(); spawnXPPop(amount, x, y);
  const newLevel = getLevel(G.xp); if (newLevel > oldLevel) showLevelUp(newLevel);
}

function spawnXPPop(amount, x, y) {
  if (!x) x = window.innerWidth / 2; if (!y) y = 80;
  const el = document.createElement('div'); el.className = 'xp-pop'; el.textContent = '+' + amount + ' XP'; el.style.left = x + 'px'; el.style.top = y + 'px'; document.body.appendChild(el); setTimeout(() => el.remove(), 1500);
}

function checkAchievement(id, val) {
  if (G.unlocked.includes(id)) return;
  const ach = ACHIEVEMENTS.find(a => a.id === id); if (!ach) return;
  if (val >= ach.max) { G.unlocked.push(id); saveGame(G); gainXP(ach.xp); showAchievementToast(ach); renderGamePanel(); }
}

function checkAllAchievements() {
  checkAchievement('pin1', G.pins); checkAchievement('pin10', G.pins);
  checkAchievement('route1', G.routes); checkAchievement('route5', G.routes);
  checkAchievement('wiki1', G.wiki); checkAchievement('wiki10', G.wiki);
  checkAchievement('random5', G.random); checkAchievement('streak3', G.streak);
  checkAchievement('search5', G.searches); checkAchievement('ruler1', G.ruler); checkAchievement('layer1', G.layers);
}

let achToastTimer;
function showAchievementToast(ach) {
  const t = document.getElementById('achToast');
  document.getElementById('achToastIco').innerHTML = ach.ico;
  document.getElementById('achToastName').textContent = ach.name;
  t.classList.add('show'); clearTimeout(achToastTimer); achToastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

let luTimer;
function showLevelUp(lv) {
  const o = document.getElementById('levelUpOverlay');
  document.getElementById('luLevel').textContent = lv;
  document.getElementById('luName').textContent = getLevelName(lv);
  const p = document.getElementById('luParticles'); p.innerHTML = '';
  for (let i = 0; i < 18; i++) { const d = document.createElement('div'); d.className = 'lu-particle'; d.style.left = Math.random() * 100 + '%'; d.style.top = Math.random() * 60 + '%'; d.style.animationDelay = Math.random() * 0.6 + 's'; d.style.background = i % 3 === 0 ? '#4285f4' : i % 3 === 1 ? '#1a73e8' : '#7ab3f8'; p.appendChild(d); }
  o.classList.add('show'); clearTimeout(luTimer); luTimer = setTimeout(() => o.classList.remove('show'), 3000);
}

function trackDaily(key, amount = 1) {
  ensureDailyReset(); if (!G.daily.progress) G.daily.progress = {};
  G.daily.progress[key] = (G.daily.progress[key] || 0) + amount;
  DAILY_CHALLENGES.forEach(ch => {
    if (ch.key !== key) return; if (G.daily.done.includes(ch.id)) return;
    const prog = G.daily.progress[key] || 0;
    if (prog >= ch.goal) { G.daily.done.push(ch.id); saveGame(G); gainXP(ch.xp); toast('Задание выполнено: ' + ch.name, 'ok'); }
  }); saveGame(G); renderChallenges();
}

function updateUI() {
  const lv = getLevel(G.xp); const name = getLevelName(lv); const pct = xpProgress(G.xp);
  document.getElementById('gpLevelName').textContent = name;
  document.getElementById('gpLevelSub').textContent = 'Уровень ' + lv;
  document.getElementById('gpLvlBig').textContent = 'Ур. ' + lv;
  const nxt = xpForLevel(lv);
  document.getElementById('gpXpLabel').textContent = G.xp + ' / ' + (nxt === 9999 ? 'MAX' : nxt) + ' XP';
  document.getElementById('gpXpFill').style.width = pct + '%';
  document.getElementById('statPins').textContent = G.pins;
  document.getElementById('statRoutes').textContent = G.routes;
  document.getElementById('statWiki').textContent = G.wiki;
  document.getElementById('statXpTotal').textContent = G.stats.xpTotal || G.xp;
  document.getElementById('streakVal').textContent = G.streak;
  document.getElementById('streakBest').textContent = 'Рекорд: ' + G.bestStreak + ' дн.';
}

function renderAchievements() {
  const grid = document.getElementById('achGrid');
  grid.innerHTML = ACHIEVEMENTS.map(a => {
    const unlocked = G.unlocked.includes(a.id); const val = Math.min(G[a.key] || 0, a.max); const pct = Math.round(val / a.max * 100);
    return `<div class="gp-ach ${unlocked ? 'unlocked' : 'locked'}"><div class="gp-ach-ico">${a.ico}</div><div class="gp-ach-name">${a.name}</div><div class="gp-ach-desc">${a.desc}</div><div class="gp-ach-prog"><div class="gp-ach-prog-fill" style="width:${pct}%"></div></div><div class="gp-ach-pct">${unlocked ? 'Выполнено' : val + ' / ' + a.max}</div></div>`;
  }).join('');
}

function renderChallenges() {
  ensureDailyReset(); const list = document.getElementById('challengesList');
  list.innerHTML = DAILY_CHALLENGES.map(ch => {
    const done = G.daily.done.includes(ch.id);
    return `<div class="gp-challenge ${done ? 'done' : ''}"><div class="gp-ch-ico">${ch.ico}</div><div class="gp-ch-info"><div class="gp-ch-name">${ch.name}</div><div class="gp-ch-sub">${ch.desc}</div></div><div class="gp-ch-xp">+${ch.xp} XP</div><div class="gp-ch-check">${done ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`}</div></div>`;
  }).join('');
}

function renderGamePanel() { updateUI(); renderAchievements(); renderChallenges(); }

document.getElementById('xpBadge').addEventListener('click', () => {
  document.getElementById('gamePanel').classList.add('open');
  document.getElementById('gameOverlay').classList.add('show');
  renderGamePanel(); applyProfileToUI();
});
document.getElementById('gpClose').addEventListener('click', () => {
  document.getElementById('gamePanel').classList.remove('open');
  document.getElementById('gameOverlay').classList.remove('show');
});
document.getElementById('gameOverlay').addEventListener('click', () => {
  document.getElementById('gamePanel').classList.remove('open');
  document.getElementById('gameOverlay').classList.remove('show');
});

touchStreak(); updateUI(); applyProfileToUI();

/* MAP LAYERS */
const menuBtn = document.getElementById('menuBtn'), mapMenu = document.getElementById('mapMenu');
menuBtn.addEventListener('click', e => { e.stopPropagation(); const o = mapMenu.classList.toggle('open'); menuBtn.classList.toggle('open', o); });
document.addEventListener('click', e => { if (!menuBtn.contains(e.target) && !mapMenu.contains(e.target)) { mapMenu.classList.remove('open'); menuBtn.classList.remove('open'); } });

const TL_BASE = {
  light: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 19 }),
  dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '© CartoDB', maxZoom: 19 }),
  sat: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '© Esri', maxZoom: 19 }),
  hyb: L.layerGroup([L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'), L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', { opacity: .85 })])
};
const TL_OV = {
  traffic: L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', { opacity: .5, attribution: '© OpenStreetMap France', maxZoom: 20, subdomains: 'abc' }),
  weather: L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=439d4b804bc8187953eb36d2a8c26a02', { opacity: .65, attribution: '© OpenWeatherMap', maxZoom: 18 }),
  bike: L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', { opacity: .85, attribution: '© CyclOSM', maxZoom: 17, subdomains: 'abc' }),
  terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { opacity: .45, attribution: '© OpenTopoMap', maxZoom: 17, subdomains: 'abc' }),
  rail: L.tileLayer('https://a.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', { opacity: .9, attribution: '© OpenRailwayMap', maxZoom: 19 }),
  hike: L.tileLayer('https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png', { opacity: .85, attribution: '© Waymarked Trails', maxZoom: 19 })
};
let curTheme = 'light'; TL_BASE.light.addTo(map);
const activeOV = new Set();
document.querySelectorAll('.mbase-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const t = btn.dataset.t; if (t === curTheme) return;
    const old = TL_BASE[curTheme];
    if (old instanceof L.LayerGroup) old.eachLayer(l => map.removeLayer(l));
    else map.removeLayer(old);
    TL_BASE[t].addTo(map);
    activeOV.forEach(id => { if (TL_OV[id] && map.hasLayer(TL_OV[id])) { map.removeLayer(TL_OV[id]); TL_OV[id].addTo(map); } });
    if (locM) locM.addTo(map);
    if (accC) accC.addTo(map);
    document.querySelectorAll('.mbase-btn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    curTheme = t;
  });
});
const OV_MAP = { 'layTraffic': 'traffic', 'layWeather': 'weather', 'layBike': 'bike', 'layTerrain': 'terrain', 'layRail': 'rail', 'layHike': 'hike' };
Object.entries(OV_MAP).forEach(([btnId, ovId]) => {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const on = btn.classList.toggle('on');
    if (on) {
      TL_OV[ovId].addTo(map);
      activeOV.add(ovId);
      toast(btn.querySelector('.mlay-name').textContent + ' включён', 'ok');
      G.layers = (G.layers || 0) + 1; saveGame(G); gainXP(5); trackDaily('layers'); checkAchievement('layer1', G.layers);
    } else {
      map.removeLayer(TL_OV[ovId]);
      activeOV.delete(ovId);
      toast(btn.querySelector('.mlay-name').textContent + ' выключен');
    }
  });
});

let toastT;
function toast(txt, cls) { const el = document.getElementById('toast'); el.textContent = txt; el.className = 'show' + (cls ? ' ' + cls : ''); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2600); }

let locM = null, accC = null;
function locate() {
  if (!navigator.geolocation) { toast('Геолокация не поддерживается', 'err'); return; }
  const btn = document.getElementById('locBtn'); btn.classList.add('active');
  navigator.geolocation.getCurrentPosition(pos => {
    btn.classList.remove('active');
    const { latitude: lat, longitude: lng, accuracy: acc } = pos.coords;
    map.setView([lat, lng], 16, { animate: true });
    if (locM) map.removeLayer(locM);
    if (accC) map.removeLayer(accC);
    accC = L.circle([lat, lng], { radius: acc, color: '#4285f4', weight: 1.5, opacity: .35, fillColor: '#4285f4', fillOpacity: .06 }).addTo(map);
    locM = L.marker([lat, lng], { icon: L.divIcon({ className: 'udot', iconSize: [16, 16], iconAnchor: [8, 8] }), zIndexOffset: 1000 }).addTo(map).bindPopup('<b>Ты здесь</b><br><small style="color:#9aa0a6">Точность: ' + Math.round(acc) + ' м</small>');
    toast('Точность: ' + Math.round(acc) + ' м', 'ok');
  }, err => {
    document.getElementById('locBtn').classList.remove('active');
    toast(err.code === 1 ? 'Нужен доступ к геолокации' : 'Ошибка геолокации', 'err');
  }, { enableHighAccuracy: true, timeout: 10000 });
}
document.getElementById('locBtn').addEventListener('click', locate);
document.getElementById('shareBtn').addEventListener('click', () => {
  const c = map.getCenter();
  const url = `${location.origin}${location.pathname}#${c.lat.toFixed(5)},${c.lng.toFixed(5)},${map.getZoom()}`;
  navigator.clipboard.writeText(url).then(() => toast('Ссылка скопирована', 'ok')).catch(() => toast('Ошибка копирования', 'err'));
});
(function () {
  const h = location.hash.slice(1).split(',');
  if (h.length === 3 && !isNaN(h[0])) map.setView([+h[0], +h[1]], +h[2]);
})();

const LAND_BOXES = [{ n: 71, s: 36, w: -10, e: 40 }, { n: 72, s: 50, w: 40, e: 180 }, { n: 38, s: 15, w: -18, e: 55 }, { n: 15, s: -35, w: -18, e: 52 }, { n: 42, s: 12, w: 26, e: 63 }, { n: 38, s: 5, w: 60, e: 100 }, { n: 55, s: 18, w: 100, e: 145 }, { n: 28, s: -10, w: 92, e: 141 }, { n: 72, s: 15, w: -168, e: -52 }, { n: 22, s: 7, w: -92, e: -77 }, { n: 13, s: -56, w: -82, e: -34 }, { n: -10, s: -44, w: 113, e: 154 }];
function randomLandPoint() {
  const areas = LAND_BOXES.map(b => (b.n - b.s) * (b.e - b.w));
  const total = areas.reduce((a, b) => a + b, 0);
  let r = Math.random() * total, box = LAND_BOXES[0];
  for (let i = 0; i < LAND_BOXES.length; i++) { r -= areas[i]; if (r <= 0) { box = LAND_BOXES[i]; break; } }
  return { lat: box.s + Math.random() * (box.n - box.s), lon: box.w + Math.random() * (box.e - box.w) };
}
document.getElementById('randomBtn').addEventListener('click', () => {
  const { lat, lon } = randomLandPoint();
  const btn = document.getElementById('randomBtn'); btn.classList.add('spinning'); setTimeout(() => btn.classList.remove('spinning'), 450);
  map.setView([lat, lon], 6, { animate: true, duration: 1.2 });
  const latStr = lat >= 0 ? lat.toFixed(2) + '° с.ш.' : Math.abs(lat).toFixed(2) + '° ю.ш.';
  const lonStr = lon >= 0 ? lon.toFixed(2) + '° в.д.' : Math.abs(lon).toFixed(2) + '° з.д.';
  toast(latStr + ', ' + lonStr, 'ok');
  G.random = (G.random || 0) + 1; saveGame(G); gainXP(8); touchStreak(); trackDaily('random'); checkAchievement('random5', G.random);
});

/* ROUTES */
const routeBtn = document.getElementById('routeBtn'), routeSheet = document.getElementById('routeSheet'), rsClose = document.getElementById('routeSheetClose'), rsStartLbl = document.getElementById('rsStartLbl'), rsEndLbl = document.getElementById('rsEndLbl'), rsStartClr = document.getElementById('rsStartClr'), rsEndClr = document.getElementById('rsEndClr'), rsResult = document.getElementById('rsResult'), rsIcon = document.getElementById('rsIcon'), rsTime = document.getElementById('rsTime'), rsSub = document.getElementById('rsSub'), rsDist = document.getElementById('rsDist'), routeChip = document.getElementById('routeChip');
let routeActive = false, routeStep = null, rStart = null, rEnd = null, rStartM = null, rEndM = null, rPolylines = {}, rMode = 'driving', rAborts = {}, rData = {};
const RICONS = { driving: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`, cycling: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>`, walking: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="1.5"/><path d="M9 8l1 4-3 3 1 1 3-2 1 4h2l1-5 2 2v4h1v-5l-3-3 1-4"/></svg>` };
const RNAMES = { driving: 'На машине', cycling: 'На велосипеде', walking: 'Пешком' };
const RICONS_SM = { driving: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`, cycling: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>`, walking: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="1.5"/><path d="M9 8l1 4-3 3 1 1 3-2 1 4h2l1-5 2 2v4h1v-5l-3-3 1-4"/></svg>` };
function fmtT(s) { const m = Math.round(s / 60); if (m < 1) return '<1м'; if (m < 60) return m + 'мин'; const h = Math.floor(m / 60), r = m % 60; return r > 0 ? `${h}ч ${r}м` : `${h}ч`; }
function fmtD(m) { if (m < 1000) return Math.round(m) + ' м'; if (m < 10000) return (m / 1000).toFixed(1) + ' км'; return Math.round(m / 1000) + ' км'; }
function liftSidebar(yes) { sidebar.classList.toggle('lifted', yes); mapMenu.classList.toggle('lifted', yes); }
function showChip(step) {
  routeChip.classList.remove('show', 'step-start', 'step-end');
  if (!step) return;
  const ps = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;vertical-align:middle"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
  const pf = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;vertical-align:middle"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`;
  routeChip.innerHTML = (step === 'start' ? ps + ' Кликните — начало маршрута' : pf + ' Кликните — конец маршрута');
  routeChip.className = `route-chip show step-${step}`;
  clearTimeout(routeChip._t);
  routeChip._t = setTimeout(() => routeChip.classList.remove('show'), 4000);
}
function openSheet() {
  routeActive = true; routeBtn.classList.add('on'); routeSheet.classList.add('show'); liftSidebar(true); document.body.classList.add('route-mode');
  if (!rStart && locM) { setPoint('start', locM.getLatLng(), 'Моё местоположение'); } else if (!rStart) { routeStep = 'start'; showChip('start'); } else if (!rEnd) { routeStep = 'end'; showChip('end'); }
}
function closeSheet() { routeActive = false; routeBtn.classList.remove('on'); routeSheet.classList.remove('show'); liftSidebar(false); document.body.classList.remove('route-mode'); clearAll(); routeStep = null; showChip(null); }
function clearAll() {
  if (rStartM) { map.removeLayer(rStartM); rStartM = null; }
  if (rEndM) { map.removeLayer(rEndM); rEndM = null; }
  Object.values(rPolylines).forEach(p => p && map.removeLayer(p)); rPolylines = {};
  rStart = rEnd = null; rData = {};
  rsStartLbl.textContent = 'Откуда...'; rsStartLbl.classList.remove('filled'); rsStartClr.classList.remove('vis');
  rsEndLbl.textContent = 'Куда...'; rsEndLbl.classList.remove('filled'); rsEndClr.classList.remove('vis');
  rsResult.classList.remove('show');
  ['driving', 'cycling', 'walking'].forEach(m => { const el = document.getElementById('tt-' + m); if (el) { el.textContent = '—'; el.classList.remove('loading'); } });
}
function setPoint(which, latlng, name) {
  const lbl = name || `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`;
  if (which === 'start') {
    rStart = latlng; rsStartLbl.textContent = lbl; rsStartLbl.classList.add('filled'); rsStartClr.classList.add('vis');
    if (rStartM) map.removeLayer(rStartM);
    rStartM = L.marker(latlng, { icon: L.divIcon({ className: 'rm-start', iconSize: [16, 16], iconAnchor: [8, 8] }), draggable: true, zIndexOffset: 700 }).addTo(map);
    rStartM.on('dragend', e => { rStart = e.target.getLatLng(); rsStartLbl.textContent = `${rStart.lat.toFixed(4)}, ${rStart.lng.toFixed(4)}`; if (rEnd) fetchAll(); });
    if (!rEnd) { routeStep = 'end'; showChip('end'); }
  } else {
    rEnd = latlng; rsEndLbl.textContent = lbl; rsEndLbl.classList.add('filled'); rsEndClr.classList.add('vis');
    if (rEndM) map.removeLayer(rEndM);
    rEndM = L.marker(latlng, { icon: L.divIcon({ className: 'rm-end', iconSize: [16, 16], iconAnchor: [8, 8] }), draggable: true, zIndexOffset: 700 }).addTo(map);
    rEndM.on('dragend', e => { rEnd = e.target.getLatLng(); rsEndLbl.textContent = `${rEnd.lat.toFixed(4)}, ${rEnd.lng.toFixed(4)}`; fetchAll(); });
    routeStep = null; showChip(null);
  }
  if (rStart && rEnd) fetchAll();
}
async function fetchAll() {
  if (!rStart || !rEnd) return;
  Object.values(rAborts).forEach(a => a && a.abort()); rAborts = {};
  Object.values(rPolylines).forEach(p => p && map.removeLayer(p)); rPolylines = {}; rData = {}; rsResult.classList.remove('show');
  ['driving', 'cycling', 'walking'].forEach(m => { const el = document.getElementById('tt-' + m); if (el) { el.textContent = '…'; el.classList.add('loading'); } });
  const URLS = {
    driving: `https://routing.openstreetmap.de/routed-car/route/v1/driving/${rStart.lng},${rStart.lat};${rEnd.lng},${rEnd.lat}?overview=full&geometries=geojson`,
    cycling: `https://routing.openstreetmap.de/routed-bike/route/v1/cycling/${rStart.lng},${rStart.lat};${rEnd.lng},${rEnd.lat}?overview=full&geometries=geojson`,
    walking: `https://routing.openstreetmap.de/routed-foot/route/v1/walking/${rStart.lng},${rStart.lat};${rEnd.lng},${rEnd.lat}?overview=full&geometries=geojson`
  };
  let routeAwarded = false;
  for (const mode of ['driving', 'cycling', 'walking']) {
    const ctrl = new AbortController(); rAborts[mode] = ctrl;
    try {
      const res = await fetch(URLS[mode], { signal: ctrl.signal });
      const data = await res.json();
      if (data.routes && data.routes.length) {
        const r = data.routes[0];
        rData[mode] = { duration: r.duration, distance: r.distance, coords: r.geometry.coordinates.map(c => [c[1], c[0]]) };
        const el = document.getElementById('tt-' + mode);
        if (el) { el.textContent = fmtT(r.duration); el.classList.remove('loading'); }
        if (!routeAwarded) {
          routeAwarded = true;
          G.routes = (G.routes || 0) + 1; saveGame(G); gainXP(15, window.innerWidth / 2, 200); touchStreak(); trackDaily('routes');
          checkAchievement('route1', G.routes); checkAchievement('route5', G.routes);
        }
      } else {
        const el = document.getElementById('tt-' + mode);
        if (el) { el.textContent = '—'; el.classList.remove('loading'); }
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        const el = document.getElementById('tt-' + mode);
        if (el) { el.textContent = '—'; el.classList.remove('loading'); }
      }
    }
    await new Promise(r => setTimeout(r, 300));
  }
  showMode(rMode);
  const bounds = L.latLngBounds([rStart, rEnd]).pad(0.2);
  map.fitBounds(bounds, { animate: true, duration: .6, paddingBottomRight: [0, 240] });
}
function showMode(mode) {
  Object.entries(rPolylines).forEach(([m, p]) => { if (p) p.setStyle({ opacity: m === mode ? .85 : 0, weight: m === mode ? 5 : 3 }); });
  const d = rData[mode];
  if (!d) {
    rsResult.dataset.mode = mode; rsResult.classList.add('show'); rsIcon.innerHTML = RICONS[mode]; rsTime.textContent = 'Нет данных'; rsSub.textContent = RNAMES[mode]; rsDist.textContent = '';
    return;
  }
  if (!rPolylines[mode]) {
    rPolylines[mode] = L.polyline(d.coords, { color: '#4285f4', weight: 5, opacity: .85, lineJoin: 'round', lineCap: 'round' }).addTo(map);
    rPolylines[mode].bringToBack();
  } else {
    rPolylines[mode].setStyle({ opacity: .85, weight: 5 });
    if (!map.hasLayer(rPolylines[mode])) rPolylines[mode].addTo(map);
  }
  rsResult.dataset.mode = mode; rsResult.classList.add('show'); rsIcon.innerHTML = RICONS[mode]; rsTime.textContent = fmtT(d.duration); rsSub.textContent = RNAMES[mode]; rsDist.textContent = fmtD(d.distance);
}
document.querySelectorAll('.rs-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.rs-tab').forEach(b => b.classList.remove('on'));
    btn.classList.add('on'); rMode = btn.dataset.mode; showMode(rMode);
  });
});
rsStartClr.addEventListener('click', e => {
  e.stopPropagation();
  if (rStartM) { map.removeLayer(rStartM); rStartM = null; }
  Object.values(rPolylines).forEach(p => p && map.removeLayer(p)); rPolylines = {};
  rStart = null; rData = {};
  rsStartLbl.textContent = 'Откуда...'; rsStartLbl.classList.remove('filled'); rsStartClr.classList.remove('vis');
  rsResult.classList.remove('show');
  ['driving', 'cycling', 'walking'].forEach(m => { const el = document.getElementById('tt-' + m); if (el) { el.textContent = '—'; el.classList.remove('loading'); } });
  routeStep = 'start'; showChip('start');
});
rsEndClr.addEventListener('click', e => {
  e.stopPropagation();
  if (rEndM) { map.removeLayer(rEndM); rEndM = null; }
  Object.values(rPolylines).forEach(p => p && map.removeLayer(p)); rPolylines = {};
  rEnd = null; rData = {};
  rsEndLbl.textContent = 'Куда...'; rsEndLbl.classList.remove('filled'); rsEndClr.classList.remove('vis');
  rsResult.classList.remove('show');
  ['driving', 'cycling', 'walking'].forEach(m => { const el = document.getElementById('tt-' + m); if (el) { el.textContent = '—'; el.classList.remove('loading'); } });
  routeStep = 'end'; showChip('end');
});
routeBtn.addEventListener('click', () => routeActive ? closeSheet() : openSheet());
rsClose.addEventListener('click', closeSheet);

/* SAVE ROUTES */
const ROUTES_KEY = 'geogo_routes';
function loadRoutes() { try { return JSON.parse(localStorage.getItem(ROUTES_KEY)) || []; } catch { return []; } }
function saveRoutes(r) { try { localStorage.setItem(ROUTES_KEY, JSON.stringify(r)); } catch { } }
const rsSaveBtn = document.getElementById('rsSaveBtn');
const saveRouteDialog = document.getElementById('saveRouteDialog');
const saveRouteOverlay = document.getElementById('saveRouteOverlay');
const saveRouteNameInput = document.getElementById('saveRouteNameInput');
const srdCancelBtn = document.getElementById('srdCancelBtn');
const srdConfirmBtn = document.getElementById('srdConfirmBtn');
const savedPanel = document.getElementById('savedPanel');
const savedOverlay = document.getElementById('savedOverlay');
const savedClose = document.getElementById('savedClose');
const spBody = document.getElementById('spBody');
const rsOpenSavedBtn = document.getElementById('rsOpenSavedBtn');
function openSaveDialog() { if (!rStart || !rEnd) { toast('Сначала постройте маршрут', 'err'); return; } let name = (rsStartLbl.textContent !== 'Откуда...' && rsEndLbl.textContent !== 'Куда...') ? rsStartLbl.textContent.split(',')[0] + ' → ' + rsEndLbl.textContent.split(',')[0] : ''; saveRouteNameInput.value = name.slice(0, 40); saveRouteDialog.classList.add('show'); saveRouteOverlay.classList.add('show'); setTimeout(() => saveRouteNameInput.focus(), 200); }
function closeSaveDialog() { saveRouteDialog.classList.remove('show'); saveRouteOverlay.classList.remove('show'); }
function confirmSaveRoute() {
  if (!rStart || !rEnd) return;
  const name = saveRouteNameInput.value.trim() || 'Маршрут';
  const routes = loadRoutes();
  const d = rData[rMode];
  routes.unshift({ id: Date.now(), name, start: { lat: rStart.lat, lng: rStart.lng, label: rsStartLbl.textContent }, end: { lat: rEnd.lat, lng: rEnd.lng, label: rsEndLbl.textContent }, mode: rMode, duration: d ? d.duration : null, distance: d ? d.distance : null, savedAt: new Date().toLocaleDateString('ru', { day: 'numeric', month: 'short' }) });
  if (routes.length > 30) routes.length = 30;
  saveRoutes(routes); closeSaveDialog(); rsSaveBtn.classList.add('saved'); setTimeout(() => rsSaveBtn.classList.remove('saved'), 2000); toast('Маршрут сохранён', 'ok');
}
rsSaveBtn.addEventListener('click', openSaveDialog);
saveRouteOverlay.addEventListener('click', closeSaveDialog);
srdCancelBtn.addEventListener('click', closeSaveDialog);
srdConfirmBtn.addEventListener('click', confirmSaveRoute);
saveRouteNameInput.addEventListener('keydown', e => { if (e.key === 'Enter') confirmSaveRoute(); if (e.key === 'Escape') closeSaveDialog(); });
function openSavedPanel() { renderSavedPanel(); savedPanel.classList.add('open'); savedOverlay.classList.add('show'); }
function closeSavedPanel() { savedPanel.classList.remove('open'); savedOverlay.classList.remove('show'); }
savedClose.addEventListener('click', closeSavedPanel);
savedOverlay.addEventListener('click', closeSavedPanel);
rsOpenSavedBtn.addEventListener('click', openSavedPanel);
function renderSavedPanel() {
  const routes = loadRoutes();
  if (!routes.length) {
    spBody.innerHTML = `<div class="sp-empty"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>Сохранённых маршрутов пока нет.<br>Постройте маршрут и нажмите «Сохранить».</div>`;
    return;
  }
  spBody.innerHTML = routes.map((r, i) => `<div class="sp-item"><div class="sp-item-header"><div class="sp-item-name">${r.name}</div><button class="sp-item-del" data-del="${i}">${ICO_DEL}</button></div><div class="sp-item-points"><div class="sp-pt"><div class="sp-pt-dot s"></div><div class="sp-pt-lbl">${r.start.label}</div></div><div class="sp-pt"><div class="sp-pt-dot e"></div><div class="sp-pt-lbl">${r.end.label}</div></div></div><div class="sp-item-meta"><span class="sp-badge mode">${RICONS_SM[r.mode] || ''} ${RNAMES[r.mode] || r.mode}</span>${r.duration ? `<span class="sp-badge">${fmtT(r.duration)}</span>` : ''}${r.distance ? `<span class="sp-badge">${fmtD(r.distance)}</span>` : ''}<span class="sp-badge">${r.savedAt}</span></div><button class="sp-item-load" data-load="${i}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>Загрузить маршрут</button></div>`).join('');
  spBody.querySelectorAll('.sp-item-del').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const rs = loadRoutes(); rs.splice(+btn.dataset.del, 1); saveRoutes(rs); renderSavedPanel();
    });
  });
  spBody.querySelectorAll('.sp-item-load').forEach(btn => {
    btn.addEventListener('click', () => {
      const r = loadRoutes()[+btn.dataset.load]; if (!r) return;
      closeSavedPanel(); if (!routeActive) openSheet(); clearAll(); rMode = r.mode;
      document.querySelectorAll('.rs-tab').forEach(t => t.classList.toggle('on', t.dataset.mode === rMode));
      setTimeout(() => {
        setPoint('start', L.latLng(r.start.lat, r.start.lng), r.start.label);
        setPoint('end', L.latLng(r.end.lat, r.end.lng), r.end.label);
      }, 150);
      toast('Маршрут загружен', 'ok');
    });
  });
}

/* RULER */
const rulerBtn = document.getElementById('rulerBtn'), rulerHint = document.getElementById('rulerHint'), rulerHintText = document.getElementById('rulerHintText'), rulerDistEl = document.getElementById('rulerDist'), rulerClearBtn = document.getElementById('rulerClearBtn');
let rulerActive = false, rulerPoints = [], rulerLines = [], rulerLabels = [], rulerPolygon = null, isClosed = false;
function fmtR(m) { return m < 1000 ? Math.round(m) + ' м' : m < 10000 ? (m / 1000).toFixed(2) + ' км' : Math.round(m / 1000) + ' км'; }
function fmtA(m2) { return m2 < 10000 ? Math.round(m2) + ' м²' : m2 < 1e6 ? (m2 / 10000).toFixed(2) + ' га' : (m2 / 1e6).toFixed(2) + ' км²'; }
function calcArea(pts) { if (pts.length < 3) return 0; const R = 6371000; let a = 0, n = pts.length; for (let i = 0; i < n; i++) { const j = (i + 1) % n, la1 = pts[i].lat * Math.PI / 180, la2 = pts[j].lat * Math.PI / 180, dl = (pts[j].lng - pts[i].lng) * Math.PI / 180; a += dl * (2 + Math.sin(la1) + Math.sin(la2)); } return Math.abs(a * R * R / 2); }
function totalP() { let d = 0; for (let i = 1; i < rulerPoints.length; i++) d += rulerPoints[i - 1].latlng.distanceTo(rulerPoints[i].latlng); if (isClosed && rulerPoints.length > 2) d += rulerPoints[rulerPoints.length - 1].latlng.distanceTo(rulerPoints[0].latlng); return d; }
const rSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7ab3f8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><rect x="2" y="7" width="20" height="10" rx="2"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="10" y1="10" x2="10" y2="14"/><line x1="14" y1="11" x2="14" y2="13"/><line x1="18" y1="10" x2="18" y2="14"/></svg>';
const aSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7ab3f8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><polygon points="12 2 22 19 2 19"/></svg>';
function updateRulerUI() {
  const n = rulerPoints.length;
  if (n === 0) { rulerHintText.style.display = ''; rulerHintText.textContent = 'Кликните на карту, чтобы начать'; rulerDistEl.style.display = 'none'; }
  else if (n === 1) { rulerHintText.style.display = ''; rulerHintText.textContent = 'Добавьте ещё точку'; rulerDistEl.style.display = 'none'; }
  else if (!isClosed) { rulerHintText.style.display = ''; rulerHintText.textContent = n >= 3 ? 'Замкнуть' : ''; rulerDistEl.style.display = ''; rulerDistEl.innerHTML = rSvg + ' ' + fmtR(totalP()); }
  else { rulerHintText.style.display = 'none'; rulerDistEl.style.display = ''; const area = calcArea(rulerPoints.map(p => p.latlng)); rulerDistEl.innerHTML = rSvg + ' ' + fmtR(totalP()) + '<span style="opacity:.35;margin:0 4px">|</span>' + aSvg + ' ' + fmtA(area); }
}
function redrawRuler() {
  rulerLines.forEach(l => map.removeLayer(l)); rulerLabels.forEach(l => map.removeLayer(l));
  if (rulerPolygon) { map.removeLayer(rulerPolygon); rulerPolygon = null; }
  rulerLines = []; rulerLabels = [];
  const pts = rulerPoints.map(p => p.latlng);
  if (isClosed && pts.length >= 3) {
    rulerPolygon = L.polygon(pts, { color: '#4285f4', weight: 2.5, opacity: .85, dashArray: '6 5', fillColor: '#4285f4', fillOpacity: .1 }).addTo(map);
  } else {
    for (let i = 1; i < rulerPoints.length; i++) {
      const a = pts[i - 1], b = pts[i];
      rulerLines.push(L.polyline([a, b], { color: '#4285f4', weight: 3, opacity: .85, dashArray: '6 5' }).addTo(map));
      const mid = L.latLng((a.lat + b.lat) / 2, (a.lng + b.lng) / 2);
      rulerLabels.push(L.marker(mid, { icon: L.divIcon({ className: 'ruler-label', html: fmtR(a.distanceTo(b)), iconSize: null, iconAnchor: [0, 24] }), interactive: false }).addTo(map));
    }
  }
  updateRulerUI();
}
function isNearFirst(ll) { if (rulerPoints.length < 3) return false; const p1 = map.latLngToContainerPoint(rulerPoints[0].latlng), p2 = map.latLngToContainerPoint(ll); return p1.distanceTo(p2) < 20; }
function addRulerPoint(ll) {
  if (isClosed) return;
  if (isNearFirst(ll)) { isClosed = true; rulerPoints[0].marker.getElement().style.boxShadow = '0 0 0 4px rgba(66,133,244,.35)'; redrawRuler(); return; }
  const idx = rulerPoints.length;
  const marker = L.marker(ll, { icon: L.divIcon({ className: 'ruler-dot', iconSize: [14, 14], iconAnchor: [7, 7] }), draggable: true, zIndexOffset: 500 }).addTo(map);
  rulerPoints.push({ latlng: ll, marker });
  marker.on('drag', e => { rulerPoints[idx].latlng = e.target.getLatLng(); redrawRuler(); });
  marker.on('dblclick', e => {
    L.DomEvent.stopPropagation(e);
    if (isClosed) return;
    map.removeLayer(marker); rulerPoints.splice(idx, 1);
    rulerPoints.forEach((p, i) => p.marker.off('drag').on('drag', ev => { rulerPoints[i].latlng = ev.target.getLatLng(); redrawRuler(); }));
    redrawRuler();
  });
  if (rulerPoints.length >= 3) { const el = rulerPoints[0].marker.getElement(); if (el) el.style.outline = '2.5px dashed rgba(66,133,244,.7)'; }
  redrawRuler();
}
function clearRuler() {
  rulerPoints.forEach(p => map.removeLayer(p.marker));
  rulerLines.forEach(l => map.removeLayer(l));
  rulerLabels.forEach(l => map.removeLayer(l));
  if (rulerPolygon) { map.removeLayer(rulerPolygon); rulerPolygon = null; }
  rulerPoints = []; rulerLines = []; rulerLabels = []; isClosed = false;
  updateRulerUI();
}
let rulerAwarded = false;
function toggleRuler() {
  rulerActive = !rulerActive; rulerBtn.classList.toggle('on', rulerActive);
  document.body.classList.toggle('ruler-mode', rulerActive);
  rulerHint.classList.toggle('show', rulerActive);
  if (!rulerActive) clearRuler();
  else { updateRulerUI(); if (!rulerAwarded) { rulerAwarded = true; G.ruler = (G.ruler || 0) + 1; saveGame(G); gainXP(10); trackDaily('ruler'); checkAchievement('ruler1', G.ruler); } }
}
rulerBtn.addEventListener('click', toggleRuler);
rulerClearBtn.addEventListener('click', e => { e.stopPropagation(); clearRuler(); });

/* PINS */
const pinBtn = document.getElementById('pinBtn'), pinDialog = document.getElementById('pinDialog'), pinDialogOverlay = document.getElementById('pinDialogOverlay'), pinLabelInput = document.getElementById('pinLabelInput'), pinConfirmBtn = document.getElementById('pinConfirmBtn'), pinCancelBtn = document.getElementById('pinCancelBtn');
let pinMode = false, pendingPin = null, pins = [];
function togglePinMode() { pinMode = !pinMode; pinBtn.classList.toggle('on', pinMode); document.body.classList.toggle('pin-mode', pinMode); if (pinMode) toast('Кликните на карту, чтобы поставить метку'); }
pinBtn.addEventListener('click', togglePinMode);
function openPinDialog(ll) { pendingPin = ll; pinLabelInput.value = ''; pinDialog.classList.add('show'); pinDialogOverlay.classList.add('show'); setTimeout(() => pinLabelInput.focus(), 200); }
function closePinDialog() { pinDialog.classList.remove('show'); pinDialogOverlay.classList.remove('show'); pendingPin = null; }
function confirmPin() {
  const label = pinLabelInput.value.trim() || 'Метка'; if (!pendingPin) return;
  addPin(pendingPin, label); closePinDialog();
  G.pins = (G.pins || 0) + 1; saveGame(G); gainXP(10, window.innerWidth / 2, 150); touchStreak(); trackDaily('pins');
  checkAchievement('pin1', G.pins); checkAchievement('pin10', G.pins);
}
pinConfirmBtn.addEventListener('click', confirmPin); pinCancelBtn.addEventListener('click', closePinDialog); pinDialogOverlay.addEventListener('click', closePinDialog);
pinLabelInput.addEventListener('keydown', e => { if (e.key === 'Enter') confirmPin(); if (e.key === 'Escape') closePinDialog(); });
function addPin(latlng, label) {
  const ih = `<div class="custom-pin"><div class="pin-head"><svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="rgba(255,255,255,0.4)"/></svg></div><div class="pin-tail"></div></div>`;
  const marker = L.marker(latlng, { icon: L.divIcon({ html: ih, className: '', iconSize: [28, 38], iconAnchor: [14, 38] }), zIndexOffset: 800 }).addTo(map);
  const ph = `<div class="pin-popup"><div class="pin-popup-name">${label}</div><button class="pin-popup-del" onclick="removePin()"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg> Удалить</button></div>`;
  marker.bindPopup(ph, { maxWidth: 200, minWidth: 140 }).openPopup();
  pins.push({ latlng, label, marker });
}
window.removePin = function () {
  const m = pins.find(p => p.marker.isPopupOpen());
  if (m) { map.removeLayer(m.marker); pins = pins.filter(p => p !== m); }
};

/* MAP CLICK */
map.on('click', async e => {
  if (rulerActive) { addRulerPoint(e.latlng); return; }
  if (routeActive && routeStep) {
    const step = routeStep; setPoint(step, e.latlng);
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json&accept-language=ru`);
      const d = await r.json();
      if (d.display_name) {
        const lbl = d.display_name.split(', ').slice(0, 2).join(', ');
        if (step === 'start') { rsStartLbl.textContent = lbl; } else { rsEndLbl.textContent = lbl; }
      }
    } catch { }
    return;
  }
  if (pinMode) { openPinDialog(e.latlng); return; }
  fetchWiki(e.latlng);
});

/* SEARCH */
const searchInput = document.getElementById('searchInput'), suggestions = document.getElementById('suggestions');
let sugTimer, sugResults = [];
const HIST_KEY = 'geogo_history', MAX_HIST = 8;
function loadHistory() { try { return JSON.parse(localStorage.getItem(HIST_KEY)) || []; } catch { return []; } }
function saveHistory(h) { try { localStorage.setItem(HIST_KEY, JSON.stringify(h)); } catch { } }
function addToHistory(item) { let h = loadHistory(); h = h.filter(x => x.name !== item.name); h.unshift(item); if (h.length > MAX_HIST) h = h.slice(0, MAX_HIST); saveHistory(h); }
function removeFromHistory(name) { saveHistory(loadHistory().filter(h => h.name !== name)); }
function goTo(lat, lon, name, sub, sv = true) {
  map.setView([+lat, +lon], 13, { animate: true }); searchInput.value = name; suggestions.classList.remove('open');
  if (sv) { addToHistory({ name, sub, lat, lon }); G.searches = (G.searches || 0) + 1; saveGame(G); gainXP(5); touchStreak(); trackDaily('searches'); checkAchievement('search5', G.searches); }
}
function buildHistRows(hist) { return hist.map((h, i) => `<div class="hist-row"><button class="hist-btn" data-hi="${i}"><span style="opacity:.45;flex-shrink:0">${ICO_HIST}</span><div style="min-width:0;flex:1;overflow:hidden"><div class="sug-name" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${h.name}</div>${h.sub ? `<div class="sug-sub" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${h.sub}</div>` : ''}</div></button><button class="sug-del" data-del="${i}">${ICO_DEL}</button></div>`).join(''); }
function bindHistEvents(container, onClearAll) {
  container.querySelectorAll('.hist-btn').forEach(b => b.addEventListener('click', () => { const h = loadHistory()[+b.dataset.hi]; if (h) goTo(h.lat, h.lon, h.name, h.sub, false); }));
  container.querySelectorAll('.sug-del').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); const h = loadHistory()[+b.dataset.del]; if (h) { removeFromHistory(h.name); onClearAll(); } }));
  const clrBtn = container.querySelector('.hist-clear-all'); if (clrBtn) clrBtn.addEventListener('click', e => { e.stopPropagation(); saveHistory([]); suggestions.classList.remove('open'); toast('История очищена'); });
}
function renderHistory() {
  const hist = loadHistory();
  if (!hist.length) { suggestions.classList.remove('open'); return; }
  suggestions.innerHTML = `<div class="sug-sep-row"><span class="sug-sep">История</span><button class="hist-clear-all">Очистить всё</button></div>` + buildHistRows(hist);
  suggestions.classList.add('open'); bindHistEvents(suggestions, renderHistory);
}
function renderSuggestions(items) {
  const hist = loadHistory();
  if (!items.length && !hist.length) { suggestions.classList.remove('open'); return; }
  let html = '';
  if (items.length) html += `<span class="sug-sep">Результаты</span>` + items.map((it, i) => { const p = it.display_name.split(', '); return `<button class="sug-item" data-i="${i}"><span style="opacity:.45;flex-shrink:0">${ICO_PIN}</span><div><div class="sug-name">${p[0]}</div><div class="sug-sub">${p.slice(1, 3).join(', ')}</div></div></button>`; }).join('');
  if (hist.length) html += `<div class="sug-sep-row"><span class="sug-sep">История</span><button class="hist-clear-all">Очистить всё</button></div>` + buildHistRows(hist);
  suggestions.innerHTML = html; suggestions.classList.add('open');
  suggestions.querySelectorAll('.sug-item[data-i]').forEach(b => b.addEventListener('click', () => { const it = sugResults[+b.dataset.i]; const p = it.display_name.split(', '); goTo(it.lat, it.lon, p[0], p.slice(1, 3).join(', ')); }));
  bindHistEvents(suggestions, () => renderSuggestions(sugResults));
}
searchInput.addEventListener('focus', () => { if (!searchInput.value.trim()) renderHistory(); });
searchInput.addEventListener('input', () => { clearTimeout(sugTimer); const q = searchInput.value.trim(); if (!q) { renderHistory(); return; } if (q.length < 2) { suggestions.classList.remove('open'); return; } sugTimer = setTimeout(() => fetchSug(q), 280); });
async function fetchSug(q) { try { const r = await fetch('https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(q) + '&format=json&limit=5&accept-language=ru'); sugResults = await r.json(); renderSuggestions(sugResults); } catch (e) { } }
document.addEventListener('click', e => { if (!searchInput.closest('#searchWrap').contains(e.target)) suggestions.classList.remove('open'); });
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') { suggestions.classList.remove('open'); if (sugResults.length) { const it = sugResults[0]; const p = it.display_name.split(', '); goTo(it.lat, it.lon, p[0], p.slice(1, 3).join(', ')); } searchInput.blur(); }
  if (e.key === 'Escape') { suggestions.classList.remove('open'); searchInput.blur(); }
});

/* WIKIPEDIA */
const wikiPanel = document.getElementById('wikiPanel'), wikiOverlay = document.getElementById('wikiOverlay'), wikiClose = document.getElementById('wikiClose'), wikiTitle = document.getElementById('wikiTitle'), wikiDist = document.getElementById('wikiDist'), wikiBody = document.getElementById('wikiBody');
let wikiMarker = null;
function openWiki() { wikiPanel.classList.add('show'); wikiOverlay.classList.add('show'); }
function closeWiki() { wikiPanel.classList.remove('show'); wikiOverlay.classList.remove('show'); if (wikiMarker) { map.removeLayer(wikiMarker); wikiMarker = null; } }
wikiClose.addEventListener('click', closeWiki); wikiOverlay.addEventListener('click', closeWiki);
function fmtWikiDist(m) { if (m < 1000) return Math.round(m) + ' м от клика'; return (m / 1000).toFixed(1) + ' км от клика'; }
async function fetchWiki(latlng) {
  wikiTitle.textContent = 'Поиск...'; wikiDist.textContent = '';
  wikiBody.innerHTML = `<div class="wiki-loading"><div class="wiki-spinner"></div>Ищем статью рядом...</div>`;
  openWiki();
  try {
    const geoRes = await fetch(`https://ru.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${latlng.lat}|${latlng.lng}&gsradius=10000&gslimit=1&format=json&origin=*`);
    const geoData = await geoRes.json(); const places = geoData?.query?.geosearch;
    if (!places || !places.length) {
      const geoResEn = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${latlng.lat}|${latlng.lng}&gsradius=10000&gslimit=1&format=json&origin=*`);
      const geoDataEn = await geoResEn.json(); const placesEn = geoDataEn?.query?.geosearch;
      if (!placesEn || !placesEn.length) { wikiBody.innerHTML = `<div class="wiki-none"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><br>Статей Википедии рядом не найдено</div>`; wikiTitle.textContent = 'Ничего не найдено'; return; }
      await showWikiArticle(placesEn[0], 'en', latlng); return;
    }
    await showWikiArticle(places[0], 'ru', latlng);
  } catch (err) { wikiBody.innerHTML = `<div class="wiki-none">Ошибка загрузки статьи</div>`; }
}
async function showWikiArticle(place, lang, clickLatlng) {
  const pageId = place.pageid, dist = L.latLng(place.lat, place.lon).distanceTo(clickLatlng), wikiBase = `https://${lang}.wikipedia.org`;
  const sumRes = await fetch(`${wikiBase}/w/api.php?action=query&pageids=${pageId}&prop=extracts|pageimages|info&exintro=1&explaintext=1&exchars=800&piprop=thumbnail&pithumbsize=600&inprop=url&format=json&origin=*`);
  const sumData = await sumRes.json(); const page = sumData.query.pages[pageId];
  wikiTitle.textContent = page.title; wikiDist.textContent = fmtWikiDist(dist);
  if (wikiMarker) map.removeLayer(wikiMarker);
  wikiMarker = L.circleMarker([place.lat, place.lon], { radius: 8, color: '#4285f4', weight: 2.5, fillColor: '#4285f4', fillOpacity: .25 }).addTo(map);
  const thumb = page.thumbnail?.source, extract = page.extract || 'Нет описания.', articleUrl = page.fullurl || `${wikiBase}/wiki/${encodeURIComponent(page.title)}`;
  wikiBody.innerHTML = (thumb ? `<img class="wiki-thumb" src="${thumb}" alt="${page.title}" loading="lazy">` : '')
    + `<div class="wiki-extract">${extract.replace(/\n/g, '<br><br>')}</div>`
    + `<button class="wiki-readmore" onclick="window.open('${articleUrl}','_blank')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>Читать на Википедии</button>`;
  G.wiki = (G.wiki || 0) + 1; saveGame(G); gainXP(8); touchStreak(); trackDaily('wiki'); checkAchievement('wiki1', G.wiki); checkAchievement('wiki10', G.wiki);
}

/* MUSIC PLAYER */
const musicBtn = document.getElementById('musicBtn');
const musicMenu = document.getElementById('musicMenu');
const musicVolume = document.getElementById('musicVolume');
let musicAudio = null, currentTrackBtn = null;
musicBtn.addEventListener('click', e => { e.stopPropagation(); musicMenu.classList.toggle('open'); });
document.addEventListener('click', e => { if (!musicBtn.contains(e.target) && !musicMenu.contains(e.target)) { musicMenu.classList.remove('open'); } });
document.querySelectorAll('.mm-track').forEach(btn => {
  btn.addEventListener('click', () => {
    const src = btn.dataset.src; const name = btn.dataset.name;
    if (currentTrackBtn === btn) {
      if (musicAudio) { musicAudio.pause(); musicAudio = null; }
      btn.classList.remove('active'); currentTrackBtn = null; musicBtn.classList.remove('playing'); musicBtn.title = 'Фоновая музыка';
      return;
    }
    if (musicAudio) { musicAudio.pause(); musicAudio = null; }
    if (currentTrackBtn) currentTrackBtn.classList.remove('active');
    musicAudio = new Audio(src); musicAudio.loop = true; musicAudio.volume = musicVolume.value / 100;
    musicAudio.play().catch(() => toast('Не удалось воспроизвести', 'err'));
    btn.classList.add('active'); currentTrackBtn = btn; musicBtn.classList.add('playing'); musicBtn.title = 'Играет: ' + name;
    toast('' + name, 'ok');
    musicAudio.addEventListener('error', () => { toast('Ошибка загрузки трека', 'err'); btn.classList.remove('active'); currentTrackBtn = null; musicBtn.classList.remove('playing'); });
  });
});
musicVolume.addEventListener('input', () => { const v = musicVolume.value; musicVolume.style.setProperty('--v', v + '%'); if (musicAudio) musicAudio.volume = v / 100; });

setTimeout(locate, 600);
