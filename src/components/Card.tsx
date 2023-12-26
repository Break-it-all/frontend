import React, { useRef, useEffect } from "react";
import Button from "./Button";
import { useNavigate } from "react-router";
interface CardProps {
  id: number;
  title: string;
  stack: string;
  descrition: string;
  createdAt: string;
}
const Card = ({ id, title, stack, descrition, createdAt }: CardProps) => {
  let navigate = useNavigate();
  return (
    <div className="flex flex-col border border-my-border-color w-52  p-1 shadow-md space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-bold">{title}</span>
        <div>...</div>
      </div>

      <span className="text-sm font-light text-gray-400">{stack}</span>
      <div className="text-gray-400 text-sm overflow-hidden overflow-ellipsis whitespace-pre-line max-h-10">
        {descrition}
      </div>
      <span className="text-sm text-gray-300">{createdAt}</span>
      <Button onClick={() => navigate(`/container/${id}`)}>
        컨테이너 실행
      </Button>
    </div>
  );
};

export default Card;
