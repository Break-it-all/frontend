import React, { useState } from "react";
import { useAxios } from "../api/useAxios";

interface UpdateContainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNameUpdate: (newName: string) => void;
  containerId: number;
}

const UpdateContainerModal: React.FC<UpdateContainerModalProps> = ({ isOpen, onClose, onNameUpdate, containerId }) => {
  const [newName, setNewName] = useState("");
  const axiosInstance = useAxios();
  const handleUpdate = async () => {
    try {
      const response = await axiosInstance.put(`/api/container/${containerId}`, {
        name: newName,
      });
      if (response.status === 200) {
        onNameUpdate(newName);
        onClose();
      }
    } catch (error) {
      console.error('Failed to update container name:', error);
      alert('There was a problem updating the container name.');
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">컨테이너 수정</h3>
        <label htmlFor="newName" className="block text-sm font-medium text-gray-900">
          새로운 이름
        </label>
        <input
          type="text"
          id="newName"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 mb-4"
          placeholder="새로운 이름을 입력하세요."
        />
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 hover:bg-blue-700 text-white px-5 py-2.5 text-center font-medium rounded-lg focus:ring-4 focus:outline-none focus:ring-gray-300"
          >
            수정
          </button>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-white border border-gray-600 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default UpdateContainerModal;
