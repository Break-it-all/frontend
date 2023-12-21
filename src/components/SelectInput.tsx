import React, { useRef, useEffect } from "react";
interface SelectInputProps {
  label: string;
}
const SelectInput = ({ label }: SelectInputProps) => {
  return (
    <div className="w-full">
      <span className="text-sm">{label}</span>
      <div className="border border-black w-full">
        <select />
      </div>
    </div>
  );
};

export default SelectInput;
