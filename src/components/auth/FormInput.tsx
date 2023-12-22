import React from "react";

interface Props {
  value: string;
  setValue: (value: string) => void;
  type: string;
  name: string;
}

export default function FormInput({ value, setValue, type, name }: Props) {
  return (
    <div className="flex-grow flex gap-3">
      <input
        value={value}
        type={type}
        placeholder={name}
        className="w-full p-2 border-b-[1px] border-gray-300 focus:outline-none focus:bg-slate-50 transition-colors"
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
