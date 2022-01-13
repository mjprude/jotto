import "./LetterInput.css";

function LetterInput(props) {
  const { children, matchType, selected, onClick } = props;
  const toClassName = () =>
    ["LetterInput", matchType, selected && "selected", children && "filled"]
      .filter((x) => !!x)
      .join(" ");
  return (
    <div className={toClassName()} onClick={onClick}>
      <p>{children}</p>
    </div>
  );
}

export default LetterInput;
