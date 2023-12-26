import React, { useRef, useEffect } from "react";
interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {}

const Button = ({ className, children, ...props }: ButtonProps) => {
  return (
    <button className={"bg-my-blue text-white p-2 " + className} {...props}>
      {children}
    </button>
  );
};

export default Button;
