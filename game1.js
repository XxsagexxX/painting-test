const canvas = document.getElementById('plushie-canvas');
const ctx = canvas.getContext('2d');
const timeEl = document.getElementById('time-el');
const dodgedEl = document.getElementById('dodged-el');
const dialogEl = document.getElementById('gift-dialog');
const buriedModal = document.getElementById('buried-modal');
const toPainterA = document.getElementById('go-painter-yes');
const toPainterB = document.getElementById('go-painter-yes2');

const plushies = [];
const plushieIcons = ['🧸', '🐰', '🧸', '🧸', '🐻'];

let catX = canvas.width / 2;
let running = false;
let startTime = 0;
let spawnTimer = 0;
let dodged = 0;
let hits = 0;
let ended = false;
let endedAt = 0;
let modalShown = false;
const pilePlushies = [];

function showDialog(text, ms = 2200) {
  dialogEl.textContent = text;
  dialogEl.classList.remove('hidden');
  setTimeout(() => dialogEl.classList.add('hidden'), ms);
}

function setupIntro() {
  showDialog('elloh heres some gifts for you as pawmised', 2600);
  setTimeout(() => {
    showDialog('i know how much u like gettin plushies so sage got lots, unless u can escape from them hihih :3', 4200);
  }, 2900);

  setTimeout(() => {
    running = true;
    startTime = performance.now();
    requestAnimationFrame(loop);
  }, 7000);
}

function drawBackground() {
  ctx.fillStyle = '#d8c9f4';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#b7c5d6';
  ctx.fillRect(0, 0, canvas.width, 120);

  ctx.fillStyle = '#6f6a72';
  ctx.fillRect(0, canvas.height - 90, canvas.width, 90);
}

function drawPixelCat(x, y) {
  const s = 9;
  const blocks = [
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
    [0, 3], [4, 3],
    [0, 4], [4, 4],
    [1, 5], [2, 5], [3, 5],
    [1, 6], [3, 6],
    [1, 7], [2, 7], [3, 7],
    [1, 8], [3, 8],
    [1, 9], [2, 9], [3, 9],
    [0, 1], [4, 1],
    [5, 8], [6, 8], [6, 7], [6, 6]
  ];

  ctx.fillStyle = '#f89b3b';
  for (const [bx, by] of blocks) {
    ctx.fillRect(Math.round(x + bx * s), Math.round(y + by * s), s, s);
  }

  ctx.fillStyle = '#231f27';
  ctx.fillRect(Math.round(x + 1 * s), Math.round(y + 3 * s), s, s);
  ctx.fillRect(Math.round(x + 3 * s), Math.round(y + 3 * s), s, s);

  ctx.fillStyle = '#fff4cc';
  ctx.fillRect(Math.round(x + 2 * s), Math.round(y + 4 * s), s, s);
}

function spawnPlushies(dt, elapsedSec) {
  spawnTimer += dt;
  const interval = Math.max(220, 760 - elapsedSec * 28);

  while (spawnTimer >= interval) {
    spawnTimer -= interval;
    plushies.push({
      x: 30 + Math.random() * (canvas.width - 60),
      y: -30,
      size: 30 + Math.random() * 10,
      speed: 1.5 + Math.random() * 1.7 + elapsedSec * 0.06,
      icon: plushieIcons[Math.floor(Math.random() * plushieIcons.length)]
    });

    if (elapsedSec > 16 && Math.random() > 0.4) {
      plushies.push({
        x: 30 + Math.random() * (canvas.width - 60),
        y: -30,
        size: 32 + Math.random() * 12,
        speed: 2 + Math.random() * 2.2 + elapsedSec * 0.07,
        icon: plushieIcons[Math.floor(Math.random() * plushieIcons.length)]
      });
    }
  }
}

function drawPlushies() {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (const p of plushies) {
    p.y += p.speed;
    ctx.font = `${p.size}px sans-serif`;
    ctx.fillText(p.icon, p.x, p.y);
  }
}

function checkCollisions() {
  const catW = 62;
  const catH = 92;
  const catY = canvas.height - 168;
  const catLeft = catX - catW / 2;
  const catRight = catX + catW / 2;
  const catTop = catY;
  const catBottom = catY + catH;

  for (let i = plushies.length - 1; i >= 0; i--) {
    const p = plushies[i];
    const hit = p.x + 12 > catLeft && p.x - 12 < catRight && p.y + 12 > catTop && p.y - 12 < catBottom;
    if (hit) {
      plushies.splice(i, 1);
      hits++;
      addPilePiece(p.x, catBottom - 8, p.icon, p.size);
      if (Math.random() > 0.4) addPilePiece(p.x + (Math.random()*30-15), catBottom - 6, plushieIcons[Math.floor(Math.random() * plushieIcons.length)], p.size * 0.9);
      continue;
    }

    if (p.y > canvas.height + 40) {
      plushies.splice(i, 1);
      dodged++;
    }
  }

  dodgedEl.textContent = dodged;
}

function addPilePiece(x, yBase, icon, size = 28) {
  pilePlushies.push({
    x: Math.max(24, Math.min(canvas.width - 24, x)),
    y: yBase - Math.random() * 70,
    icon,
    size: Math.max(22, size)
  });
}

function seedFinalPile() {
  const cx = catX;
  for (let i = 0; i < 38; i++) {
    addPilePiece(cx + (Math.random() * 140 - 70), canvas.height - 40, plushieIcons[Math.floor(Math.random() * plushieIcons.length)], 26 + Math.random() * 20);
  }
}

function drawBuriedScene() {
  const catY = canvas.height - 188;
  drawPixelCat(catX - 28, catY);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const p of pilePlushies) {
    ctx.font = `${p.size}px sans-serif`;
    ctx.fillText(p.icon, p.x, p.y);
  }
}

let prev = 0;
function loop(now) {
  if (!running) return;
  const dt = prev ? now - prev : 16;
  prev = now;
  const elapsedSec = (now - startTime) / 1000;

  drawBackground();

  if (!ended) {
    spawnPlushies(dt, elapsedSec);
    drawPlushies();

    const catY = canvas.height - 188;
    drawPixelCat(catX - 28, catY);
    checkCollisions();

    timeEl.textContent = Math.floor(elapsedSec);

    if (hits >= 6 || elapsedSec >= 26) {
      ended = true;
      endedAt = now;
      seedFinalPile();
    }
  }

  if (ended) {
    drawBackground();
    drawBuriedScene();
    if (!modalShown && now - endedAt > 2400) {
      modalShown = true;
      buriedModal.showModal();
      return;
    }
  }

  requestAnimationFrame(loop);
}

function setCatFromClientX(clientX) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  catX = Math.max(35, Math.min(canvas.width - 35, x));
}

canvas.addEventListener('pointerdown', (e) => {
  setCatFromClientX(e.clientX);
});

canvas.addEventListener('pointermove', (e) => {
  setCatFromClientX(e.clientX);
});

canvas.addEventListener('touchstart', (e) => {
  const t = e.touches[0];
  if (!t) return;
  setCatFromClientX(t.clientX);
  e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
  const t = e.touches[0];
  if (!t) return;
  setCatFromClientX(t.clientX);
  e.preventDefault();
}, { passive: false });

function goPainter() {
  window.location.href = 'painter.html';
}
toPainterA.addEventListener('click', goPainter);
toPainterB.addEventListener('click', goPainter);

setupIntro();
