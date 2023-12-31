import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface CardSelectInputProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
}

const CardSelectInput: React.FC<CardSelectInputProps> = ({
  label,
  value,
  onChange,
  options
}) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>
      <div className="inline-block relative w-full">
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CardSelectInput;
