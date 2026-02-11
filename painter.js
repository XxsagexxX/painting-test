const instruction = document.getElementById('paint-instruction');
const catMood = document.getElementById('cat-mood');
const dropzone = document.getElementById('cat-dropzone');
const easel = document.getElementById('easel');
const canvas = document.getElementById('paint-canvas');
const ctx = canvas.getContext('2d');
const oopsModal = document.getElementById('oops-modal');
const yesBtn = document.getElementById('oops-yes');
const yesBtn2 = document.getElementById('oops-yes-2');

const steps = {
  pencil: document.getElementById('step-pencil'),
  purple: document.getElementById('step-purple'),
  wash1: document.getElementById('step-wash-1'),
  green: document.getElementById('step-green'),
  wash2: document.getElementById('step-wash-2'),
  outline: document.getElementById('step-outline')
};

const state = {
  phase: 0,
  activeTool: null
};

const phaseRule = [
  { button: steps.pencil, tool: 'pencil' },
  { button: steps.purple, tool: 'brush-purple' },
  { button: steps.wash1, tool: 'wash' },
  { button: steps.green, tool: 'brush-green' },
  { button: steps.wash2, tool: 'wash' },
  { button: steps.outline, tool: 'outline' }
];

localStorage.removeItem('painter_complete');
drawBase();

phaseRule.forEach(({ button, tool }) => {
  button.addEventListener('click', () => {
    if (button.disabled) return;
    spawnDraggableTool(tool);
  });
});

function spawnDraggableTool(toolName) {
  document.querySelectorAll('.drag-tool').forEach((el) => el.remove());

  const tool = document.createElement('img');
  tool.className = 'drag-tool';
  tool.alt = toolName;
  tool.src = `${toolName}.svg`;
  const dropRect = dropzone.getBoundingClientRect();
  const startX = Math.max(20, dropRect.left - 110);
  const startY = Math.max(20, dropRect.top + (dropRect.height * 0.32));
  tool.style.left = `${startX}px`;
  tool.style.top = `${startY}px`;
  document.body.appendChild(tool);

  state.activeTool = toolName;
  catMood.textContent = 'drag the tool onto kitty!';

  makeDraggable(tool, () => {
    if (isIntersecting(tool, dropzone)) {
      applyStep(toolName);
      tool.remove();
      state.activeTool = null;
    }
  });
}

function makeDraggable(el, onDrop) {
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;

  const start = (clientX, clientY) => {
    dragging = true;
    const rect = el.getBoundingClientRect();
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
    el.classList.add('dragging');
  };

  const move = (clientX, clientY) => {
    if (!dragging) return;
    el.style.left = `${clientX - offsetX}px`;
    el.style.top = `${clientY - offsetY}px`;
  };

  const end = () => {
    if (!dragging) return;
    dragging = false;
    el.classList.remove('dragging');
    onDrop();
  };

  el.addEventListener('mousedown', (e) => start(e.clientX, e.clientY));
  window.addEventListener('mousemove', (e) => move(e.clientX, e.clientY));
  window.addEventListener('mouseup', end);

  el.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    start(t.clientX, t.clientY);
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    if (!t) return;
    move(t.clientX, t.clientY);
  }, { passive: true });
  window.addEventListener('touchend', end);
}

function isIntersecting(a, b) {
  const ra = a.getBoundingClientRect();
  const rb = b.getBoundingClientRect();
  return !(ra.right < rb.left || ra.left > rb.right || ra.bottom < rb.top || ra.top > rb.bottom);
}

function applyStep(toolName) {
  const expected = phaseRule[state.phase].tool;
  if (toolName !== expected) {
    catMood.textContent = 'wrong step! kitty says do it in order 😾';
    return;
  }

  switch (state.phase) {
    case 0:
      drawSketch();
      instruction.textContent = 'Step 2: click Dip Brush in Purple, then drag brush to kitty.';
      catMood.textContent = 'nice sketch!';
      break;
    case 1:
      paintPetals();
      instruction.textContent = 'Step 3: wash brush and drag clean water to kitty.';
      catMood.textContent = 'purple petals complete ✨';
      break;
    case 2:
      sparkleWash();
      instruction.textContent = 'Step 4: dip brush in green and drag it to kitty.';
      catMood.textContent = 'brush cleaned!';
      break;
    case 3:
      paintStemLeaves();
      instruction.textContent = 'Step 5: wash brush again.';
      catMood.textContent = 'stem + leaves done 🌱';
      break;
    case 4:
      sparkleWash();
      instruction.textContent = 'Step 6: finish outline (drag outline pen to kitty).';
      catMood.textContent = 'ready for final outline...';
      break;
    case 5:
      drawOutline();
      sneezeAndRuin();
      return;
    default:
      return;
  }

  phaseRule[state.phase].button.disabled = true;
  state.phase += 1;
  if (phaseRule[state.phase]) phaseRule[state.phase].button.disabled = false;
}

function sneezeAndRuin() {
  phaseRule[state.phase].button.disabled = true;
  easel.classList.add('shake');
  catMood.textContent = 'achoo!!';
  instruction.textContent = 'oh no the mouse bump made kitty ruin the painting...';

  setTimeout(() => {
    ruinPainting();
    easel.classList.remove('shake');
    catMood.textContent = 'angy kitty mode >:(';
    oopsModal.showModal();
  }, 850);
}

function proceedToCrossword() {
  localStorage.setItem('painter_complete', 'yes');
  window.location.href = 'crossword.html';
}

yesBtn.addEventListener('click', proceedToCrossword);
yesBtn2.addEventListener('click', proceedToCrossword);

function drawBase() {
  const w = canvas.width;
  const h = canvas.height;
  ctx.fillStyle = '#fbf7ee';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#f8efd7';
  ctx.fillRect(0, 0, w, 34);
}

function drawSketch() {
  const cx = canvas.width / 2;
  const cy = canvas.height * 0.28;
  const petalRadius = 22;
  const guide = [
    [cx, cy - 28],
    [cx + 27, cy - 8],
    [cx + 17, cy + 24],
    [cx - 17, cy + 24],
    [cx - 27, cy - 8]
  ];

  ctx.strokeStyle = '#948f92';
  ctx.lineWidth = 2;
  guide.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, petalRadius, 0, Math.PI * 2);
    ctx.stroke();
  });

  const stemTop = cy + 36;
  const stemBottom = cy + 124;
  ctx.beginPath();
  ctx.moveTo(cx, stemTop);
  ctx.lineTo(cx, stemBottom);
  ctx.stroke();

  // upward-pointing leaf guides
  ctx.beginPath();
  ctx.moveTo(cx - 4, cy + 96);
  ctx.lineTo(cx - 34, cy + 70);
  ctx.moveTo(cx + 4, cy + 92);
  ctx.lineTo(cx + 36, cy + 64);
  ctx.stroke();
}

function paintPetals() {
  const cx = canvas.width / 2;
  const cy = canvas.height * 0.28;
  const petals = [
    [cx, cy - 28],
    [cx + 27, cy - 8],
    [cx + 17, cy + 24],
    [cx - 17, cy + 24],
    [cx - 27, cy - 8]
  ];

  ctx.fillStyle = '#e393d8';
  petals.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#f28446';
  ctx.beginPath();
  ctx.arc(cx, cy, 9, 0, Math.PI * 2);
  ctx.fill();
}

function paintStemLeaves() {
  const cx = canvas.width / 2;
  const cy = canvas.height * 0.28;

  // small stem
  ctx.strokeStyle = '#66a64d';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cx, cy + 38);
  ctx.lineTo(cx, cy + 126);
  ctx.stroke();

  // leaves pointing upward
  ctx.fillStyle = '#8bc86c';
  ctx.beginPath(); ctx.ellipse(cx - 24, cy + 88, 16, 8, -0.85, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 24, cy + 82, 16, 8, 0.85, 0, Math.PI * 2); ctx.fill();
}

function drawOutline() {
  const cx = canvas.width / 2;
  const cy = canvas.height * 0.28;
  const petals = [
    [cx, cy - 28],
    [cx + 27, cy - 8],
    [cx + 17, cy + 24],
    [cx - 17, cy + 24],
    [cx - 27, cy - 8]
  ];

  ctx.strokeStyle = '#6a4e53';
  ctx.lineWidth = 2;
  petals.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.stroke();
  });
}

function sparkleWash() {
  ctx.fillStyle = 'rgba(167, 220, 255, 0.25)';
  ctx.fillRect(14, 40, 98, 30);
}

function ruinPainting() {
  const w = canvas.width;
  const h = canvas.height;
  ctx.fillStyle = 'rgba(90, 80, 120, 0.38)';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#4e3c65';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(20, 28);
  ctx.lineTo(w - 24, h - 18);
  ctx.moveTo(w - 24, 34);
  ctx.lineTo(40, h - 12);
  ctx.stroke();
}
