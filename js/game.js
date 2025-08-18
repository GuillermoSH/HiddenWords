const gameSection = document.getElementById("words-display");
let lang = "es"

/**
 * Crea el tablero de intentos
 */
function createBoard(word) {
  let wordLength = word.length;
  let wordsAttempts = wordLength + 1;

  for (let j = 0; j < wordsAttempts; j++) {
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
    return randomWord;
  } catch (error) {
    console.error("Error fetching words:", error);
    return null;
  }
}

/**
 * Inicializa el juego
 */
async function startGame() {
  let randomWord = await loadRandomWord();
  if (!randomWord) return;

  console.log("Palabra aleatoria:", randomWord);

  createBoard(randomWord);
  // aquí en el futuro podrías iniciar más lógica del juego
}

// Ejecutar
startGame();