const gameSection = document.getElementById('words-display');
const generateBtn = document.getElementById('generate-btn');


const wordLength = 4;
const wordsAttempts = wordLength + 1;

// Crear la fila
const row = document.createElement('div');
row.classList.add('display-row');

for (let j = 0; j < wordsAttempts; j++) {
      const row = document.createElement('div');
      row.classList.add('display-row');

      // Crear los contenedores de letras según el input
      for (let i = 0; i < wordLength; i++) {
        const letterContainer = document.createElement('div');
        letterContainer.classList.add('letter-container');
        row.appendChild(letterContainer);
      }

      // Agregar la fila al section
      gameSection.appendChild(row);
    }