import "./Snackbar.css";
import { useState, useEffect } from "react";

const FLASH_DURATION = 2500;
const Snackbar = (props) => {
  const { message, flash = true } = props;
  const [className, setClassName] = useState("Snackbar");
  const [displayText, setDisplayText] = useState("");

  let timer;
  useEffect(() => {
    clearTimeout(timer);
    const newClassName = message ? "Snackbar Snackbar-visible" : "Snackbar";
    setClassName(newClassName);
    setDisplayText(message);
    if (flash) {
      timer = setTimeout(() => {
        setDisplayText("");
        setClassName("Snackbar");
      }, FLASH_DURATION);
    }
    return () => clearTimeout(timer);
  }, [message, flash]);

  return <div className={className}>{displayText}</div>;
};

export default Snackbar;
