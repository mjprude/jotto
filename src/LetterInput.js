import "./LetterInput.css";

function LetterInput(props) {
  const { children, matchType, selected } = props;
  const toClassName = () =>
    ["LetterInput", matchType, selected && "selected", children && "filled"]
      .filter((x) => !!x)
      .join(" ");
  return <div className={toClassName()}>{children}</div>;
}

export default LetterInput;
