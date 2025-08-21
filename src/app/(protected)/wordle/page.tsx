"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faDeleteLeft,
} from "@fortawesome/free-solid-svg-icons";

type LetterStatus = "correct" | "present" | "absent" | "";
type KeyStatus = "correct" | "present" | "absent" | "";

export default function WordlePage() {
  const [word, setWord] = useState<string>(""); // palabra objetivo
  const [board, setBoard] = useState<string[][]>([]); // intentos
  const [statuses, setStatuses] = useState<LetterStatus[][]>([]);
  const [keyStatuses, setKeyStatuses] = useState<Record<string, KeyStatus>>({});
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Cargar palabra aleatoria desde el JSON
  useEffect(() => {
    async function loadRandomWord() {
      try {
        const res = await fetch("/data/words.json");
        const data = await res.json();
        const random =
          data["es"][Math.floor(Math.random() * data["es"].length)];
        const target = random.toUpperCase();

        setWord(target);
        setMaxAttempts(target.length + 1);

        // inicializar tablero vacío
        const initialBoard = Array(target.length + 1)
          .fill(null)
          .map(() => Array(target.length).fill(""));
        const initialStatuses = Array(target.length + 1)
          .fill(null)
          .map(() => Array(target.length).fill(""));

        setBoard(initialBoard);
        setStatuses(initialStatuses);
      } catch (err) {
        console.error("Error cargando palabras:", err);
      }
    }

    loadRandomWord();
  }, []);

  function addLetter(letter: string) {
    if (gameOver || currentRow >= maxAttempts) return;
    if (currentCol >= word.length) return;

    const newBoard = [...board];
    newBoard[currentRow][currentCol] = letter;
    setBoard(newBoard);
    setCurrentCol(currentCol + 1);
  }

  function deleteLetter() {
    if (gameOver || currentCol === 0) return;
    const newBoard = [...board];
    newBoard[currentRow][currentCol - 1] = "";
    setBoard(newBoard);
    setCurrentCol(currentCol - 1);
  }

  function submitRow() {
    if (gameOver || currentCol !== word.length) return;

    const attempt = board[currentRow].join("");
    const result: LetterStatus[] = Array(word.length).fill("absent");
    const leftovers: Record<string, number> = {};

    // primera pasada
    for (let i = 0; i < word.length; i++) {
      if (attempt[i] === word[i]) {
        result[i] = "correct";
      } else {
        leftovers[word[i]] = (leftovers[word[i]] || 0) + 1;
      }
    }
    // segunda pasada
    for (let i = 0; i < word.length; i++) {
      if (result[i] === "correct") continue;
      const a = attempt[i];
      if (leftovers[a] > 0) {
        result[i] = "present";
        leftovers[a]--;
      }
    }

    // actualizar estado del tablero
    const newStatuses = [...statuses];
    newStatuses[currentRow] = result;
    setStatuses(newStatuses);

    // ✅ actualizar estado de teclas
    const newKeyStatuses = { ...keyStatuses };
    for (let i = 0; i < word.length; i++) {
      const letter = attempt[i];
      const res = result[i];

      // prioridad: correct > present > absent
      if (res === "correct") {
        newKeyStatuses[letter] = "correct";
      } else if (res === "present" && newKeyStatuses[letter] !== "correct") {
        newKeyStatuses[letter] = "present";
      } else if (!newKeyStatuses[letter]) {
        newKeyStatuses[letter] = "absent";
      }
    }
    setKeyStatuses(newKeyStatuses);

    // victoria
    if (attempt === word) {
      setGameOver(true);
      return;
    }

    // siguiente fila
    if (currentRow + 1 >= maxAttempts) {
      setGameOver(true);
    } else {
      setCurrentRow(currentRow + 1);
      setCurrentCol(0);
    }
  }

  function resetGame() {
    setWord("");
    setBoard([]);
    setStatuses([]);
    setKeyStatuses({});
    setCurrentRow(0);
    setCurrentCol(0);
    setGameOver(false);

    // recargar nueva palabra
    fetch("/data/words.json")
      .then((res) => res.json())
      .then((data) => {
        const random =
          data["es"][Math.floor(Math.random() * data["es"].length)];
        const target = random.toUpperCase();
        setWord(target);
        setMaxAttempts(target.length + 1);

        const initialBoard = Array(target.length + 1)
          .fill(null)
          .map(() => Array(target.length).fill(""));
        const initialStatuses = Array(target.length + 1)
          .fill(null)
          .map(() => Array(target.length).fill(""));

        setBoard(initialBoard);
        setStatuses(initialStatuses);
      });
  }

  return (
    <main className="font-poppins h-screen flex flex-col justify-between">
      {/* Navbar */}
      <nav className="navbar flex items-center justify-between px-6 py-4 bg-blue-600 text-white shadow-md">
        <div className="logo text-xl font-bold">HiddenWords</div>
        <div className="action-btns">
          <button className="help-btn text-2xl">
            <FontAwesomeIcon icon={faCircleQuestion} />
          </button>
        </div>
      </nav>

      {/* Board */}
      <section
        id="words-display"
        className="words-display flex flex-col items-center gap-2 mt-4"
      >
        {board.map((row, rIdx) => (
          <div key={rIdx} className="display-row flex gap-1">
            {row.map((letter, cIdx) => (
              <div
                key={cIdx}
                className={`letter-container w-10 h-10 flex items-center justify-center border 
                ${statuses[rIdx][cIdx] === "correct" ? "correct" : ""}
                ${statuses[rIdx][cIdx] === "present" ? "present" : ""}
                ${statuses[rIdx][cIdx] === "absent" ? "absent" : ""}
              `}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* Keyboard */}
      <section id="keyboard-container" className="keyboard-container p-4">
        <div className="keyboard flex flex-col gap-2 items-center">
          <div className="first-row flex gap-1">
            {"QWERTYUIOP".split("").map((key) => (
              <button
                key={key}
                className={`key ${
                  keyStatuses[key] === "correct"
                    ? "correct"
                    : keyStatuses[key] === "present"
                    ? "present"
                    : keyStatuses[key] === "absent"
                    ? "absent"
                    : ""
                } ${gameOver ? "disabled" : ""}
                `}
                disabled={gameOver}
                onClick={() => addLetter(key)}
              >
                {key}
              </button>
            ))}
          </div>
          <div className="second-row flex gap-1">
            {"ASDFGHJKLÑ".split("").map((key) => (
              <button
                key={key}
                className={`key ${
                  keyStatuses[key] === "correct"
                    ? "correct"
                    : keyStatuses[key] === "present"
                    ? "present"
                    : keyStatuses[key] === "absent"
                    ? "absent"
                    : ""
                } ${gameOver ? "disabled" : ""}
                `}
                disabled={gameOver}
                onClick={() => addLetter(key)}
              >
                {key}
              </button>
            ))}
          </div>
          <div className="third-row flex gap-1">
            <button className={`action-key enter-key ${gameOver ? "disabled" : ""}`} onClick={submitRow}>
              Enter
            </button>
            {"ZXCVBNM".split("").map((key) => (
              <button
                key={key}
                className={`key ${
                  keyStatuses[key] === "correct"
                    ? "correct"
                    : keyStatuses[key] === "present"
                    ? "present"
                    : keyStatuses[key] === "absent"
                    ? "absent"
                    : ""
                } ${gameOver ? "disabled" : ""}
                `}
                disabled={gameOver}
                onClick={() => addLetter(key)}
              >
                {key}
              </button>
            ))}
            <button className={`action-key delete-key ${gameOver ? "disabled" : ""}`} onClick={deleteLetter}>
              <FontAwesomeIcon icon={faDeleteLeft} />
            </button>
          </div>
        </div>
        <button
          id="reset-btn"
          className={`mt-4 px-4 py-2 bg-red-500 text-white rounded ${
            gameOver ? "block" : "hidden"
          }`}
          onClick={resetGame}
        >
          RESET
        </button>
      </section>
    </main>
  );
}
