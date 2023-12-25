import React from "react";

interface CardSelectInputProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
}

const CardSelectInput = ({
  label,
  value,
  onChange,
  options,
}: CardSelectInputProps) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <div className="inline-block relative w-full">
        <select
          className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          value={value}
          onChange={onChange}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.516 7.548c0.436-0.446 1.045-0.481 1.576 0l3.908 3.747 3.908-3.747c0.531-0.481 1.141-0.446 1.576 0 0.436 0.445 0.408 1.197 0 1.615l-4.415 4.209c-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.787-0.335l-4.415-4.209c-0.408-0.418-0.436-1.17 0-1.615z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CardSelectInput;
