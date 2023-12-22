import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  label: string;
  options: SelectOption[];
}

const SelectInput: React.FC<SelectInputProps> = ({ label, options }) => {
  return (
    <div className="w-full">
      <label className="text-sm">{label}</label>
      <div className="border border-black w-full">
        <select>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectInput;
