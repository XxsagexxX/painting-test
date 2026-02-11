const size = { rows: 7, cols: 12 };
const words = [
  { answer: 'FLOWIES', clue: '______ for sage', row: 0, col: 0, dir: 'across' },
  { answer: 'SPOON', clue: 'acoustic utensil', row: 0, col: 6, dir: 'across' },
  { answer: 'CHEETO', clue: 'fluffffffi granpa', row: 1, col: 5, dir: 'across' },
  { answer: 'KITLER', clue: 'best kitty from da neko cafe', row: 2, col: 1, dir: 'across' },
  { answer: 'MEOWDI', clue: 'sages biggest competition', row: 3, col: 1, dir: 'across' },
  { answer: 'NOMS', clue: 'big bite aaAA', row: 3, col: 7, dir: 'across' },
  { answer: 'CAR', clue: 'meow', row: 4, col: 9, dir: 'across' },

  { answer: 'SHRIMPY', clue: 'MASSIVE', row: 0, col: 6, dir: 'down' },
  { answer: 'NODS', clue: 'yes', row: 0, col: 10, dir: 'down' },
  { answer: 'SAGE', clue: 'wise kittykat :3', row: 3, col: 10, dir: 'down' },
  { answer: 'ANGY', clue: 'sage when he gandavs her >:/', row: 2, col: 7, dir: 'down' },
  { answer: 'MYAH', clue: 'kisses (sage version)', row: 3, col: 1, dir: 'down' }
];

const crosswordStage = document.getElementById('crossword-stage');
const painterStage = document.getElementById('painter-stage');
const modal = document.getElementById('win-modal');
const closeBtn = document.getElementById('close-modal');

initPainterGame();
initCrossword();

function initPainterGame() {
  const instruction = document.getElementById('paint-instruction');
  const mood = document.getElementById('cat-mood');
  const easel = document.getElementById('easel');
  const canvas = document.getElementById('paint-canvas');
  const ctx = canvas.getContext('2d');

  const pencilBtn = document.getElementById('tool-pencil');
  const purpleBtn = document.getElementById('tool-purple');
  const greenBtn = document.getElementById('tool-green');
  const washBtn = document.getElementById('tool-wash');
  const outlineBtn = document.getElementById('tool-outline');
  const oopsModal = document.getElementById('oops-modal');
  const oopsYes = document.getElementById('oops-yes');
  const oopsYes2 = document.getElementById('oops-yes-2');

  const state = {
    phase: 0,
    brushDirty: false,
    usedPurple: false,
    usedGreen: false
  };

  drawBlankCanvas(ctx);

  pencilBtn.addEventListener('click', () => {
    if (state.phase !== 0) return;
    drawSketch(ctx);
    state.phase = 1;
    purpleBtn.disabled = false;
    instruction.textContent = 'Step 2: Dip the paintbrush in purple and give it to kitty.';
    mood.textContent = 'Sketch complete. tiny genius brain activated ✏️';
  });

  purpleBtn.addEventListener('click', () => {
    if (state.phase !== 1 || state.brushDirty) return;
    paintPetals(ctx);
    state.phase = 2;
    state.brushDirty = true;
    state.usedPurple = true;
    washBtn.disabled = false;
    purpleBtn.disabled = true;
    instruction.textContent = 'Step 3: Wash the brush before changing colors.';
    mood.textContent = 'Purple petals done. brush now messy 🫧';
  });

  washBtn.addEventListener('click', () => {
    if (!state.brushDirty) return;
    state.brushDirty = false;

    if (state.phase === 2) {
      greenBtn.disabled = false;
      instruction.textContent = 'Step 4: Dip in green for stem + leaves.';
      mood.textContent = 'Brush squeaky clean. ready for green 🌱';
      return;
    }

    if (state.phase === 4) {
      outlineBtn.disabled = false;
      instruction.textContent = 'Step 6: Click finish outline and help kitty complete the flower.';
      mood.textContent = 'All clean again. final outline time ✨';
    }
  });

  greenBtn.addEventListener('click', () => {
    if (state.phase !== 2 || state.brushDirty) return;
    paintStemAndLeaves(ctx);
    state.phase = 4;
    state.brushDirty = true;
    state.usedGreen = true;
    greenBtn.disabled = true;
    instruction.textContent = 'Step 5: Wash the brush one last time.';
    mood.textContent = 'Green stem + leaves done. wash one more time 🫧';
  });

  outlineBtn.addEventListener('click', () => {
    if (state.phase !== 4 || state.brushDirty || !state.usedPurple || !state.usedGreen) return;

    drawFlowerOutline(ctx);
    easel.classList.add('shake');
    mood.textContent = 'achoo!! the sneeze shook the painting 😿';
    instruction.textContent = 'oh no... painting ruined.';

    setTimeout(() => {
      ruinPainting(ctx);
      oopsModal.showModal();
      easel.classList.remove('shake');
      mood.textContent = 'angy artist cat mode activated >:('; 
    }, 700);
  });

  function startCrosswordStage() {
    oopsModal.close();
    painterStage.classList.add('hidden');
    crosswordStage.classList.remove('hidden');
    crosswordStage.scrollIntoView({ behavior: 'smooth' });
  }

  oopsYes.addEventListener('click', startCrosswordStage);
  oopsYes2.addEventListener('click', startCrosswordStage);
}

function drawBlankCanvas(ctx) {
  ctx.fillStyle = '#fffefb';
  ctx.fillRect(0, 0, 420, 320);

  ctx.fillStyle = '#f9f1ff';
  ctx.fillRect(0, 240, 420, 80);

  ctx.fillStyle = '#4f3c61';
  ctx.font = '16px Trebuchet MS';
  ctx.fillText('Artist Cat Canvas', 14, 24);
}

function drawSketch(ctx) {
  ctx.strokeStyle = '#8f8a95';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(210, 132, 22, 0, Math.PI * 2);
  ctx.moveTo(210, 110); ctx.lineTo(210, 70);
  ctx.moveTo(210, 154); ctx.lineTo(210, 225);
  ctx.moveTo(210, 190); ctx.lineTo(176, 205);
  ctx.moveTo(210, 188); ctx.lineTo(243, 205);
  ctx.stroke();
}

function paintPetals(ctx) {
  ctx.fillStyle = '#ac75f0';
  [[190,120],[230,120],[210,98],[210,142]].forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.beginPath();
  ctx.arc(210, 120, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd6eb';
  ctx.fill();
}

function paintStemAndLeaves(ctx) {
  ctx.strokeStyle = '#56a35d';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(210, 154);
  ctx.lineTo(210, 230);
  ctx.stroke();

  ctx.fillStyle = '#75bb7a';
  ctx.beginPath(); ctx.ellipse(182, 200, 18, 9, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(238, 200, 18, 9, 0.5, 0, Math.PI * 2); ctx.fill();
}

function drawFlowerOutline(ctx) {
  ctx.strokeStyle = '#53385e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(190,120,16,0,Math.PI*2);
  ctx.arc(230,120,16,0,Math.PI*2);
  ctx.arc(210,98,16,0,Math.PI*2);
  ctx.arc(210,142,16,0,Math.PI*2);
  ctx.stroke();
}

function ruinPainting(ctx) {
  ctx.fillStyle = 'rgba(90, 80, 120, 0.35)';
  ctx.fillRect(0, 0, 420, 320);

  ctx.strokeStyle = '#4e3c65';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(35, 45);
  ctx.lineTo(380, 280);
  ctx.moveTo(370, 52);
  ctx.lineTo(65, 284);
  ctx.stroke();

  ctx.fillStyle = '#3f2d50';
  ctx.font = 'bold 24px Trebuchet MS';
  ctx.fillText('RUINED', 148, 170);
}

function initCrossword() {
  const grid = Array.from({ length: size.rows }, () => Array(size.cols).fill(null));

  for (const word of words) {
    for (let i = 0; i < word.answer.length; i++) {
      const r = word.row + (word.dir === 'down' ? i : 0);
      const c = word.col + (word.dir === 'across' ? i : 0);
      if (!grid[r][c]) {
        grid[r][c] = { letter: word.answer[i] };
      }
    }
  }

  let clueNumber = 1;
  for (let r = 0; r < size.rows; r++) {
    for (let c = 0; c < size.cols; c++) {
      if (!grid[r][c]) continue;

      const startsAcross = words.some((w) => w.dir === 'across' && w.row === r && w.col === c);
      const startsDown = words.some((w) => w.dir === 'down' && w.row === r && w.col === c);

      if (startsAcross || startsDown) {
        grid[r][c].number = clueNumber;
        words
          .filter((w) => w.row === r && w.col === c)
          .forEach((w) => {
            w.number = clueNumber;
          });
        clueNumber++;
      }
    }
  }

  const crosswordEl = document.getElementById('crossword');
  const acrossList = document.getElementById('across-clues');
  const downList = document.getElementById('down-clues');
  const inputMap = new Map();

  function getNextCellCoords(row, col) {
    for (let r = row; r < size.rows; r++) {
      const startCol = r === row ? col + 1 : 0;
      for (let c = startCol; c < size.cols; c++) {
        if (grid[r][c]) {
          return { row: r, col: c };
        }
      }
    }

    return null;
  }

  for (let r = 0; r < size.rows; r++) {
    for (let c = 0; c < size.cols; c++) {
      const cellData = grid[r][c];

      if (!cellData) {
        const block = document.createElement('div');
        block.className = 'cell block';
        crosswordEl.appendChild(block);
        continue;
      }

      const input = document.createElement('input');
      input.className = 'cell';
      input.maxLength = 1;
      input.dataset.row = r;
      input.dataset.col = c;
      input.setAttribute('aria-label', `row ${r + 1}, column ${c + 1}`);

      if (cellData.number) {
        const num = document.createElement('span');
        num.className = 'cell-num';
        num.textContent = cellData.number;

        const wrap = document.createElement('div');
        wrap.className = 'cell-wrap';
        wrap.append(input, num);
        crosswordEl.appendChild(wrap);
      } else {
        crosswordEl.appendChild(input);
      }

      input.addEventListener('input', () => {
        input.value = input.value.toUpperCase().replace(/[^A-Z]/g, '');

        if (input.value === cellData.letter) {
          const next = getNextCellCoords(r, c);
          if (next) {
            inputMap.get(`${next.row},${next.col}`)?.focus();
          }
        }

        validateGrid();
      });

      inputMap.set(`${r},${c}`, input);
    }
  }

  for (const w of words.filter((x) => x.dir === 'across')) {
    const li = document.createElement('li');
    li.textContent = `${w.number}. ${w.clue}`;
    acrossList.appendChild(li);
  }

  for (const w of words.filter((x) => x.dir === 'down')) {
    const li = document.createElement('li');
    li.textContent = `${w.number}. ${w.clue}`;
    downList.appendChild(li);
  }

  function validateGrid() {
    let allCorrect = true;

    for (let r = 0; r < size.rows; r++) {
      for (let c = 0; c < size.cols; c++) {
        const data = grid[r][c];
        if (!data) continue;

        const input = inputMap.get(`${r},${c}`);
        const isCorrect = input.value === data.letter;
        input.classList.toggle('correct', isCorrect && input.value.length === 1);

        if (!isCorrect) allCorrect = false;
      }
    }

    if (allCorrect) {
      modal.showModal();
    }
  }
}

closeBtn.addEventListener('click', () => modal.close());
