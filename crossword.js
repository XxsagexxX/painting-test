if (localStorage.getItem('painter_complete') !== 'yes') {
  window.location.href = 'painter.html';
}

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

const modal = document.getElementById('win-modal');
const closeBtn = document.getElementById('close-modal');

const grid = Array.from({ length: size.rows }, () => Array(size.cols).fill(null));
for (const word of words) {
  for (let i = 0; i < word.answer.length; i++) {
    const r = word.row + (word.dir === 'down' ? i : 0);
    const c = word.col + (word.dir === 'across' ? i : 0);
    if (!grid[r][c]) grid[r][c] = { letter: word.answer[i] };
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
      words.filter((w) => w.row === r && w.col === c).forEach((w) => {
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
      if (grid[r][c]) return { row: r, col: c };
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
        if (next) inputMap.get(`${next.row},${next.col}`)?.focus();
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
  if (allCorrect) modal.showModal();
}

closeBtn.addEventListener('click', () => modal.close());
