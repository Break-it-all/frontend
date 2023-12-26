import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAxios } from "../api/useAxios";
import ConfirmationModal from "./ConfirmationModal";
import UpdateContainerModal from "./UpdateContainerModal";

interface CardProps {
  id: number;
  title: string;
  stack: string;
  language: string;
  description: string;
  createdAt: string;
  onDeleteSuccess: (id: number) => void;
  onEdit: (container: {
    id: number;
    title: string;
    stack: string;
    language: string;
    description: string;
    createdAt: string;
  }) => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const dateFormatter = new Intl.DateTimeFormat("ko-KR", dateOptions);
  let formattedDate = dateFormatter
    .format(date)
    .replace(/\./g, "")
    .replace(/ /g, ".");
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };
  const timeFormatter = new Intl.DateTimeFormat("ko-KR", timeOptions);
  let formattedTime = timeFormatter.format(date);
  return `${formattedDate} ${formattedTime}`.trim();
};

const Card: React.FC<CardProps> = ({
  id,
  title,
  stack,
  language,
  description,
  createdAt,
  onDeleteSuccess,
  onEdit,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedContainer, setSelectedContainer] = useState<{
    id: number;
    title: string;
    stack: string;
    language: string;
    description: string;
    createdAt: string;
  } | null>(null);

  const getDisplayMode = (modeCode: string) => {
    const modeMap: { [key: string]: string } = {
      MULTI_EDIT: "멀티 프로그래밍",
      PAIR_PROGRAMMING: "페어 프로그래밍",
    };
    return modeMap[modeCode] || modeCode;
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/api/container/${id}`);
      if (response.status === 200) {
        onDeleteSuccess(id);
        setIsConfirmModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to delete container:", error);
      alert("There was a problem deleting the container.");
    }
  };

  const openConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const getLanguageIcon = (language: string) => {
    return `/assets/${language.toLowerCase()}.svg`;
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col w-64 h-56 p-3 m-1 border border-gray-300 shadow-md relative bg-white rounded-lg">
      <div className="flex justify-between items-center ">
        <span className="font-bold text-gray-700 mb-2">{title}</span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            type="button"
            className="rounded-full  text-gray-600 p-1 w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-gray-300 focus:outline-none"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <svg
              fill="currentColor"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13.5996 8.00001C13.5996 7.28201 13.0176 6.70001 12.2996 6.70001C11.5816 6.70001 10.9996 7.28201 10.9996 8.00001C10.9996 8.71801 11.5816 9.30001 12.2996 9.30001C13.0176 9.30001 13.5996 8.71801 13.5996 8.00001ZM4.99963 8.00001C4.99963 7.28201 4.41763 6.70001 3.70063 6.70001C2.98263 6.70001 2.40063 7.28201 2.40063 8.00001C2.40063 8.71801 2.98263 9.30001 3.70063 9.30001C4.41763 9.30001 4.99963 8.71801 4.99963 8.00001ZM7.99963 9.30001C7.28263 9.30001 6.70063 8.71801 6.70063 8.00001C6.70063 7.28201 7.28263 6.70001 7.99963 6.70001C8.71764 6.70001 9.29963 7.28201 9.29963 8.00001C9.29963 8.71801 8.71764 9.30001 7.99963 9.30001Z"
              ></path>
            </svg>
          </button>
          {showDropdown && (
            <div className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow  absolute right-0 mt-1 w-28">
              <ul className="py-2 text-sm text-gray-700">
                <li>
                  <button
                    className="block w-full px-2 py-2 hover:bg-gray-100 text-left"
                    onClick={() => {
                      setSelectedContainer({
                        id,
                        title,
                        language,
                        stack,
                        description,
                        createdAt,
                      });
                      setIsUpdateModalOpen(true);
                    }}
                  >
                    컨테이너 수정
                  </button>
                </li>
                <li>
                  <button
                    className="block w-full px-2 py-2 hover:bg-gray-100 text-left"
                    onClick={openConfirmModal}
                  >
                    컨테이너 삭제
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center mb-4">
        <span
          className={`font-bold text-xs tracking-tighter rounded-full px-2 py-1 bg-gray-200 text-gray-500`}
        >
          {getDisplayMode(stack)}
        </span>
        <img
          src={getLanguageIcon(language)}
          alt={language}
          className="w-6 h-6 mr-1 ml-2"
        />
      </div>
      <div className="text-gray-700 text-sm h-10 mb-5 line-clamp-2 overflow-hidden">
        {description}
      </div>
      <span className="text-sm text-gray-400 mb-3">
        {formatDate(createdAt)}
      </span>
      <button
        onClick={() => navigate(`/container/${id}`)}
        type="button"
        className="w-full h-8 px-3 py-1 text-sm font-medium leading-5 text-white bg-blue-500 rounded-md transition duration-150 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
      >
        컨테이너 실행
      </button>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleDelete}
        message={`${title}' 컨테이너를 삭제하시겠습니까?`}
      />

      {selectedContainer && (
        <UpdateContainerModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onNameUpdate={(newName) => {
            setSelectedContainer({
              ...selectedContainer,
              title: newName,
            });
            onEdit({
              id: selectedContainer.id,
              title: newName,
              language: selectedContainer.language,
              stack: selectedContainer.stack,
              description: selectedContainer.description,
              createdAt: selectedContainer.createdAt,
            });
          }}
          containerId={selectedContainer.id}
        />
      )}
    </div>
  );
};

export default Card;
