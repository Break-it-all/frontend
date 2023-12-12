import { ButtonProps } from "@/types";
import React, { useRef, useEffect } from "react";

const Button = ({ text }: ButtonProps) => {
  return <button className="bg-my-blue text-white p-2">{text}</button>;
};

export default Button;
