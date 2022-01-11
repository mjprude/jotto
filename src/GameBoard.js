import { useMemo, useCallback, useEffect, useState } from "react";
import "./GameBoard.css";
import LetterInput from "./LetterInput";
import completeWordList from "./complete-word-list";
import solutionWordList from "./solution-word-list";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const ANSWER = "shape";
const MATCH_TYPES = {
  inPosition: "in-position",
  inWord: "in-word",
  incorrect: "incorrect",
};

const toPositionMap = (word) => {
  return [...word].reduce((positionMap, letter, i) => {
    const positions = positionMap[letter] || [];
    positionMap[letter] = [...positions, i];
    return positionMap;
  }, {});
};

const toWord = (row) => row.map(({ value }) => value).join("");

const makeGuess = (guess, answer) => {
  const answerMap = toPositionMap(answer);
  const guessMap = toPositionMap(guess);

  return [...guess].map((letter, i) => {
    const answerPositions = answerMap[letter];
    if (!answerPositions) {
      return { value: letter, matchType: MATCH_TYPES.incorrect };
    }
    if (answerPositions.includes(i)) {
      return { value: letter, matchType: MATCH_TYPES.inPosition };
    }
    const priorGuesses = guessMap[letter].filter((position) => position <= i);
    if (answerPositions.length >= priorGuesses.length) {
      return { value: letter, matchType: MATCH_TYPES.inWord };
    }
    return { value: letter, matchType: MATCH_TYPES.incorrect };
  });
};

function GameBoard() {
  const [gameOver, setGameOver] = useState(false);
  const [turn, setTurn] = useState(0);
  const [activeColumn, setActiveColumn] = useState(0);
  const startTime = useMemo(() => Date.now(), [gameOver]);
  const emptyBoard = [...Array(MAX_GUESSES)].map(() =>
    [...Array(WORD_LENGTH)].map(() => ({ value: "" }))
  );
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
      if (gameOver) {
        return;
      }
      if (key === "Backspace") {
        const newGameState = [...gameState];
        const cursorAtEnd =
          activeColumn === WORD_LENGTH - 1 &&
          gameState[turn][activeColumn].value;
        const columnToDelete = cursorAtEnd ? activeColumn : activeColumn - 1;
        newGameState[turn][columnToDelete].value = "";
        setGameState(newGameState);
        if (!cursorAtEnd) {
          setActiveColumn(Math.max(activeColumn - 1, 0));
        }
      }
      if (key === "Enter") {
        // submit stuff
        const guess = toWord(gameState[turn]);
        const [isValid, errorMessage] = validateGuess(guess);
        if (!isValid) {
          console.error(errorMessage);
          // display!
          return;
        }
        const newGameState = [...gameState];
        const answer = solutionWordList[startTime % solutionWordList.length];
        const result = makeGuess(guess, answer);
        newGameState[turn] = result;
        setGameState(newGameState);
        if (
          result.every(({ matchType }) => matchType === MATCH_TYPES.inPosition)
        ) {
          setGameOver(true);
          setTimeout(() => alert("YOU WIN!", answer), 500);
          return;
        }
        if (turn === MAX_GUESSES - 1) {
          setGameOver(true);
          setTimeout(() => alert("YOU LOSE!", answer), 500);
          return;
        }
        setActiveColumn(0);
        setTurn(turn + 1);
      }
      if ("abcdefghijklmnopqrstuvwxyz".includes(key.toLowerCase())) {
        const newGameState = [...gameState];
        newGameState[turn][activeColumn].value = key.toLowerCase();
        setActiveColumn(Math.min(activeColumn + 1, WORD_LENGTH - 1));
        setGameState(newGameState);
      }
    },
    [gameOver, gameState, activeColumn, turn]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  return (
    <div className="GameBoard">
      {gameState.map((row, i) => (
        <div className="GameBoard-row" key={i}>
          {row.map(({ value, matchType }, j) => (
            <LetterInput matchType={matchType} key={`R${i}C${j}`}>
              {value}
            </LetterInput>
          ))}
        </div>
      ))}
    </div>
  );
}

export default GameBoard;
