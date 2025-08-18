const gameSection = document.getElementById("words-display");
const keyboard = document.getElementById("keyboard-container");
const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", resetGame);
// Eventos del teclado en pantalla
keyboard.addEventListener("click", (e) => {
  if (e.target.classList.contains("key")) {
    addLetter(e.target.textContent);
  } else if (e.target.closest(".action-key")) {
    if (e.target.closest(".action-key").innerText.includes("Enter")) {
      submitRow();
    } else {
      deleteLetter();
    }
  }
});
let lang = "es";

let randomWord = "";
let currentRow = 0;
let currentCol = 0;
let maxAttempts = 0;
let gameOver = false;

/**
 * Crea el tablero de intentos
 */
function createBoard(word) {
  let wordLength = word.length;
  maxAttempts = wordLength + 1;

  for (let j = 0; j < maxAttempts; j++) {
    const row = document.createElement("div");
    row.classList.add("display-row");

    for (let i = 0; i < wordLength; i++) {
      const letterContainer = document.createElement("div");
      letterContainer.classList.add("letter-container");
      row.appendChild(letterContainer);
    }

    gameSection.appendChild(row);
  }
}

/**
 * Carga una palabra aleatoria desde el JSON
 */
async function loadRandomWord() {
  try {
    const response = await fetch("../data/words.json");
    if (!response.ok) {
      throw new Error("Error loading JSON: " + response.status);
    }

    const data = await response.json();
    const randomWord =
      data[lang][Math.floor(Math.random() * data[lang].length)];
    return randomWord.toUpperCase(); // nos aseguramos de mayúsculas
  } catch (error) {
    console.error("Error fetching words:", error);
    return null;
  }
}

/**
 * Escribe una letra en el tablero
 */
function addLetter(letter) {
  const rows = document.querySelectorAll(".display-row");
  if (currentRow >= maxAttempts) return; // ya no hay filas disponibles

  const row = rows[currentRow];
  const cells = row.querySelectorAll(".letter-container");

  if (currentCol < cells.length) {
    cells[currentCol].textContent = letter;
    currentCol++;
  }
}

/**
 * Borra la última letra escrita
 */
function deleteLetter() {
  if (currentCol > 0) {
    currentCol--;
    const rows = document.querySelectorAll(".display-row");
    const row = rows[currentRow];
    const cells = row.querySelectorAll(".letter-container");
    cells[currentCol].textContent = "";
  }
}

/**
 * Confirma la fila actual, evalúa y pasa a la siguiente
 */
function submitRow() {
  if (gameOver) return;

  const rows = document.querySelectorAll(".display-row");
  const row = rows[currentRow];
  const cells = row.querySelectorAll(".letter-container");

  if (currentCol !== randomWord.length) {
    console.log("Not enough letters yet!");
    return;
  }

  // Construir intento
  let attempt = "";
  cells.forEach(cell => attempt += cell.textContent);

  const target = randomWord;                 // p.ej. "PAGUEN"
  const len = target.length;
  const result = Array(len).fill("absent");  // 'correct' | 'present' | 'absent'
  const leftovers = {};                      // conteo de letras sobrantes de target

  // 1) Primera pasada: correctos y conteo de sobrantes
  for (let i = 0; i < len; i++) {
    const a = attempt[i];
    const t = target[i];
    if (a === t) {
      result[i] = "correct";
    } else {
      leftovers[t] = (leftovers[t] || 0) + 1;
    }
  }

  // 2) Segunda pasada: presentes si queda stock
  for (let i = 0; i < len; i++) {
    if (result[i] === "correct") continue;
    const a = attempt[i];
    if (leftovers[a] > 0) {
      result[i] = "present";
      leftovers[a]--;
    } else {
      result[i] = "absent";
    }
  }

  // Aplicar clases y actualizar teclado
  for (let i = 0; i < len; i++) {
    cells[i].classList.remove("correct", "present", "error");
    if (result[i] === "correct") {
      cells[i].classList.add("correct");
    } else if (result[i] === "present") {
      cells[i].classList.add("present");
    } else {
      cells[i].classList.add("error");
      // ⚠️ Solo deshabilitar si la letra NO existe en la palabra objetivo
      const letter = attempt[i];
      if (!target.includes(letter)) {
        disableKey(letter);
      }
    }
  }

  // ¿Victoria?
  if (attempt === target) {
    console.log("🎉 Has acertado la palabra!");
    endGame(true);
    return;
  }

  // Siguiente fila o fin
  currentRow++;
  currentCol = 0;

  if (currentRow >= maxAttempts) {
    console.log("❌ Te quedaste sin intentos. La palabra era:", target);
    endGame(false);
  }
}


function disableKey(letter) {
  document.querySelectorAll(".key").forEach(key => {
    if (key.textContent === letter) {
      key.classList.add("disabled");
      key.disabled = true;
    }
  });
}

function endGame(won) {
  gameOver = true;

  // desactivar clicks en el teclado
  document.querySelectorAll(".key, .action-key").forEach(btn => {
    btn.disabled = true;
    btn.classList.add("disabled");
  });

  if (won) {
    console.log("✅ Felicidades, bloqueando teclado.");
  } else {
    console.log("❌ Fin del juego, bloqueando teclado.");
  }

  resetBtn.classList.remove("hidden");
}


/**
 * Inicializa el juego
 */
async function startGame() {
  randomWord = await loadRandomWord();
  if (!randomWord) return;

  console.log("Palabra aleatoria:", randomWord);

  createBoard(randomWord);
}

function resetGame() {
  gameSection.innerHTML = "";
  currentRow = 0;
  currentCol = 0;
  gameOver = false;
  randomWord = "";

  document.querySelectorAll(".key, .action-key").forEach(btn => {
    btn.disabled = false;
    btn.classList.remove("disabled");
  });

  console.log("🔄 Reiniciando el juego...");
  resetBtn.classList.add("hidden");
  keyboard.scrollIntoView({ behavior: "smooth" });
  startGame();
}


// Ejecutar
startGame();
