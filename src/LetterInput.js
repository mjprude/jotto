import "./LetterInput.css";

function LetterInput(props) {
  const { children, matchType = "" } = props;
  return <div className={`LetterInput ${matchType}`}>{children}</div>;
}

export default LetterInput;
