import React, { useEffect } from "react";

const Modal = ({ text, setError }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setError(null);
      return () => {
        clearTimeout(timeout);
      };
    }, 2000);
  });

  return (
    <div>
      <h4>{text}</h4>
    </div>
  );
};

export default Modal;
