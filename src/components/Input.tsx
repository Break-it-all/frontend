import React, { useRef, useEffect } from "react";
interface InputProps {
  label: string;
}
const Input = ({ label }: InputProps) => {
  return (
    <div>
      <span className="text-sm">{label}</span>
      <div className="border border-black">
        <input type="text" />
      </div>
    </div>
  );
};

export default Input;
