import { useMemo, useCallback, useEffect, useState } from "react";
import "./Game.css";
import LetterInput from "./LetterInput";
import Keyboard from "./Keyboard";
import completeWordList from "./complete-word-list";
import solutionWordList from "./solution-word-list";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
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

function Game() {
  const [gameOver, setGameOver] = useState(false);
  const [turn, setTurn] = useState(0);
  const [activeColumn, setActiveColumn] = useState(0);

  const emptyBoard = [...Array(MAX_GUESSES)].map(() =>
    [...Array(WORD_LENGTH)].map(() => ({ value: "" }))
  );
  const [gameState, setGameState] = useState(emptyBoard);
  const startTime = useMemo(() => Date.now(), [gameOver]);

  const validateGuess = (guess) => {
    if (guess.length !== WORD_LENGTH) {
      return [false, "Not enough letters"];
    }
    if (!completeWordList.includes(guess)) {
      return [false, "Not in word list"];
    }
    return [true, ""];
  };

  const guessedLetters = () => {
    const { inPosition, inWord, incorrect } = MATCH_TYPES;
    return gameState.flat().reduce((obj, { value, matchType }) => {
      if (!value) {
        return obj;
      }
      const existingMatch = obj[value];
      if (existingMatch === inPosition || matchType === inPosition) {
        return { ...obj, [value]: inPosition };
      }
      if (existingMatch === inWord || matchType === inWord) {
        return { ...obj, [value]: inWord };
      }
      return { ...obj, [value]: incorrect };
    }, {});
  };

  const currentSolution = useMemo(
    () => window.btoa(solutionWordList[startTime % solutionWordList.length]), // Todo: improve this encryption a little;
    [startTime]
  );

  const handleKeydown = useCallback(
    ({ key }) => {
      if (gameOver) {
        return;
      }
      if (key === "Backspace") {
        const newGameState = [...gameState];
        const letterUnderCursor = gameState[turn][activeColumn].value;
        const columnToDelete = letterUnderCursor
          ? activeColumn
          : Math.max(activeColumn - 1, 0);
        newGameState[turn][columnToDelete].value = "";
        setGameState(newGameState);
        if (!letterUnderCursor) {
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
        const answer = window.atob(currentSolution);
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
      if (key === "ArrowRight") {
        setActiveColumn(Math.min(activeColumn + 1, WORD_LENGTH - 1));
      }
      if (key === "ArrowLeft") {
        setActiveColumn(Math.max(activeColumn - 1, 0));
      }
    },
    [gameState, activeColumn, turn, currentSolution, gameOver]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  const handleOnScreenKeyPress = (key) => {
    handleKeydown({ key });
  };

  return (
    <div className="Game">
      <div className="Game-board">
        {gameState.map((row, i) => (
          <div className="Game-board-row" key={i}>
            {row.map(({ value, matchType }, j) => (
              <LetterInput
                matchType={matchType}
                selected={turn === i && activeColumn === j}
                key={`R${i}C${j}`}
              >
                {value}
              </LetterInput>
            ))}
          </div>
        ))}
      </div>
      <Keyboard
        guessedLetters={guessedLetters()}
        handleClick={handleOnScreenKeyPress}
      />
    </div>
  );
}

export default Game;
