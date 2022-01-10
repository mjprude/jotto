import { useCallback, useEffect, useState } from "react";
import "./GameBoard.css";
import LetterInput from "./LetterInput";
import completeWordList from "./complete-word-list";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

function GameBoard() {
  const [turn, setTurn] = useState(0);
  const [activeColumn, setActiveColumn] = useState(0);
  const emptyBoard = [...Array(MAX_GUESSES)].map(() => [...Array(WORD_LENGTH)]);
  const [gameState, setGameState] = useState(emptyBoard);
  const validateGuess = (guess) => {
    if (guess.length !== WORD_LENGTH) {
      return [false, "Not enough letters"];
    }
    if (!completeWordList.includes(guess)) {
      return [false, "Not in word list"];
    }
    return [true, ""];
  };

  const handleKeydown = useCallback(
    ({ key }) => {
      if (key === "Backspace") {
        const newGameState = [...gameState];
        const cursorAtEnd =
          activeColumn === WORD_LENGTH - 1 && gameState[turn][activeColumn];
        const columnToDelete = cursorAtEnd ? activeColumn : activeColumn - 1;
        newGameState[turn][columnToDelete] = "";
        setGameState(newGameState);
        if (!cursorAtEnd) {
          setActiveColumn(Math.max(activeColumn - 1, 0));
        }
      }
      if (key === "Enter") {
        // submit stuff
        const guess = gameState[turn].join("");
        const [isValid, errorMessage] = validateGuess(guess);
        if (isValid) {
          // check for success/end
          // show results!
          setActiveColumn(0);
          setTurn(turn + 1);
        } else {
          console.error(errorMessage);
          // display!
        }
      }
      if ("abcdefghijklmnopqrstuvwxyz".includes(key.toLowerCase())) {
        const newGameState = [...gameState];
        newGameState[turn][activeColumn] = key.toLowerCase();
        setActiveColumn(Math.min(activeColumn + 1, WORD_LENGTH - 1));
        setGameState(newGameState);
      }
    },
    [gameState, activeColumn, turn]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  return (
    <div className="GameBoard">
      {gameState.map((row, i) => (
        <div className="GameBoard-row" key={i}>
          {row.map((letter, j) => (
            <LetterInput key={`R${i}C${j}`}>{letter}</LetterInput>
          ))}
        </div>
      ))}
    </div>
  );
}

export default GameBoard;
