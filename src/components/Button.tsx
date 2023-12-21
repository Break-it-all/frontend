import React, { useRef, useEffect } from "react";
interface ButtonProps {
  text: string;
  onClick?: () => void;
}
const Button = ({ text, onClick }: ButtonProps) => {
  return (
    <button onClick={onClick} className="bg-my-blue text-white p-2">
      {text}
    </button>
  );
};
export default Button;
