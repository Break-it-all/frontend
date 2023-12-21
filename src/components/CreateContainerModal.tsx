import React, { ReactNode } from "react";
import ReactDOM from "react-dom";

interface CreateContainerModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const CreateContainerModal = ({
  open,
  onClose,
  children,
}: CreateContainerModalProps) => {
  if (!open) return null;
  return ReactDOM.createPortal(
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0  bg-black opacity-50 z-[100]" />
      <div className="flex flex-col justify-center items-center w-96 bg-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100]">
        <button onClick={onClose}>모달 닫기</button>
        {children}
      </div>
    </>,
    document.getElementById("global-modal") as HTMLElement
  );
};

export default CreateContainerModal;
