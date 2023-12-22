import React, { useRef, useEffect } from "react";
interface InputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ label, value, onChange }: InputProps) => {
  return (
    <div className="w-full">
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="border border-black w-full"
      />
    </div>
  );
};

export default Input;
