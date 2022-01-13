import "./Keyboard.css";

const keyRows = [
  [
    { value: "q", display: "Q" },
    { value: "w", display: "W" },
    { value: "e", display: "E" },
    { value: "r", display: "R" },
    { value: "t", display: "T" },
    { value: "y", display: "Y" },
    { value: "u", display: "U" },
    { value: "i", display: "I" },
    { value: "o", display: "O" },
    { value: "p", display: "P" },
  ],
  [
    { value: "a", display: "A" },
    { value: "s", display: "S" },
    { value: "d", display: "D" },
    { value: "f", display: "F" },
    { value: "g", display: "G" },
    { value: "h", display: "H" },
    { value: "j", display: "J" },
    { value: "k", display: "K" },
    { value: "l", display: "L" },
  ],
  [
    { value: "Enter", display: "ENTER" },
    { value: "z", display: "Z" },
    { value: "x", display: "X" },
    { value: "c", display: "C" },
    { value: "v", display: "V" },
    { value: "b", display: "B" },
    { value: "n", display: "N" },
    { value: "m", display: "M" },
    { value: "Backspace", display: "⌫" },
  ],
];

const Keyboard = (props) => {
  const { handleClick = () => {}, guessedLetters = {} } = props;
  const toButtonClass = (value) => {
    const matchType = guessedLetters[value] || "unguessed";
    return `Keyboard-key Keyboard-key-${matchType}`;
  };

  return (
    <div className="Keyboard">
      {keyRows.map((row, i) => (
        <div key={i} className={`Keyboard-row Keyboard-row-${i}`}>
          {row.map((letter) => (
            <div
              key={letter.value}
              onClick={() => handleClick(letter.value)}
              className={toButtonClass(letter.value)}
            >
              <p>{letter.display}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
