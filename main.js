const board = document.querySelector(".board");
const statusElement = document.querySelector("#game-status");
const resetButton = document.querySelector("#reset-game");
const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let currentPlayer = "X";
let cells = Array(9).fill(null);
let gameOver = false;

function setStatus(message, tone = "info") {
  if (!statusElement) return;
  statusElement.textContent = message;
  statusElement.dataset.tone = tone;
}

function checkWinner() {
  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { player: cells[a], combo };
    }
  }
  return null;
}

function renderCell(index) {
  const cell = board?.querySelector(`[data-index="${index}"]`);
  if (!cell) return;
  const value = cells[index];
  cell.textContent = value || "";
  cell.classList.toggle("player-x", value === "X");
  cell.classList.toggle("player-o", value === "O");
  cell.disabled = Boolean(value) || gameOver;
  cell.setAttribute("aria-label", value ? `Cell ${index + 1}: ${value}` : `Cell ${index + 1}: empty`);
}

function renderBoard() {
  cells.forEach((_, index) => renderCell(index));
}

function finishGame(winner) {
  gameOver = true;
  if (winner) {
    winner.combo.forEach((index) => board?.querySelector(`[data-index="${index}"]`)?.classList.add("winning-cell"));
    setStatus(`Player ${winner.player} wins! Press Reset game to play again.`, "success");
  } else {
    setStatus("It is a draw. Press Reset game to play again.", "info");
  }
  renderBoard();
}

function handleClick(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);
  if (gameOver || cells[index]) return;
  cells[index] = currentPlayer;
  renderCell(index);
  const winner = checkWinner();
  if (winner || cells.every(Boolean)) {
    finishGame(winner);
    return;
  }
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  setStatus(`Player ${currentPlayer}'s turn.`);
}

function resetGame() {
  cells = Array(9).fill(null);
  currentPlayer = "X";
  gameOver = false;
  board?.querySelectorAll(".cell").forEach((cell) => cell.classList.remove("winning-cell"));
  renderBoard();
  setStatus("Player X's turn.", "success");
}

if (board) {
  cells.forEach((_, index) => {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cell";
    cell.dataset.index = String(index);
    cell.setAttribute("aria-label", `Cell ${index + 1}: empty`);
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  });
}

resetButton?.addEventListener("click", resetGame);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") resetGame();
});
resetGame();
