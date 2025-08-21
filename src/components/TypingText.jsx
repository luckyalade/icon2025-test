import React, { useEffect, useState } from "react";

const TypingText = ({
  text = "",
  speed = 30,
  onComplete = () => {},
  className = "",
  showCursor = true,
}) => {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);

  // Reset when text changes
  useEffect(() => {
    setDisplayed("");
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const t = setTimeout(() => {
        setDisplayed((prev) => prev + text[index]);
        setIndex((i) => i + 1);
      }, speed);
      return () => clearTimeout(t);
    } else {
      onComplete();
    }
  }, [index, text, speed, onComplete]);

  return (
    <p className={className} style={{ whiteSpace: "pre-wrap" }}>
      {displayed}
      {showCursor && index < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </p>
  );
};

export default TypingText;
