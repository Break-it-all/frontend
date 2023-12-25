import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface CreateContainerModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CreateContainerModal = ({
  open,
  onClose,
  children,
}: CreateContainerModalProps) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);

    if (open) {
      const handleBackdropClick = (event: MouseEvent) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      };

      window.addEventListener("click", handleBackdropClick);

      return () => {
        window.removeEventListener("click", handleBackdropClick);
      };
    }
  }, [open, onClose]);

  if (!isBrowser) {
    return null;
  }

  const modalContent = open ? (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div
        className="flex flex-col items-center w-96 bg-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-4 overflow-y-auto max-h-full rounded-lg pb-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          BITA
        </h1>
        {children}
      </div>
    </>
  ) : null;

  return modalContent ? ReactDOM.createPortal(modalContent, document.getElementById("modal-root") as HTMLElement) : null;
};

export default CreateContainerModal;
