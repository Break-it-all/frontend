import Card from "../components/Card";
import CreateContainerModal from "../components/CreateContainerModal";
import Input from "../components/Input";
import CardSelectInput from "../components/CardSelectInput";
import { useAxios } from "../api/useAxios";
import { useState, useEffect } from "react";

interface Container {
  containerId: number;
  name: string;
  mode: string;
  language: string;
  description: string;
  createdAt: string;
}

const Main = () => {
  console.log("Main 컴포넌트 렌더링");
  const [myContainers, setMyContainers] = useState<Container[]>([]);
  const [sharedContainers, setSharedContainers] = useState<Container[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [containerName, setContainerName] = useState("");
  const [containerDescription, setContainerDescription] = useState("");
  const [containerLanguage, setContainerLanguage] = useState("");
  const [containerMode, setContainerMode] = useState("pair");
  const axiosInstance = useAxios();

  const handleDeleteSuccess = (deletedContainerId: number) => {
    setMyContainers((currentContainers) =>
      currentContainers.filter(
        (container) => container.containerId !== deletedContainerId
      )
    );
    setSharedContainers((currentContainers) =>
      currentContainers.filter(
        (container) => container.containerId !== deletedContainerId
      )
    );
  };

  const handleEdit = (updatedContainer: { id: number; title: string }) => {
    setMyContainers((currentContainers) =>
      currentContainers.map((container) =>
        container.containerId === updatedContainer.id
          ? { ...container, name: updatedContainer.title }
          : container
      )
    );

    setSharedContainers((currentSharedContainers) =>
      currentSharedContainers.map((container) =>
        container.containerId === updatedContainer.id
          ? { ...container, name: updatedContainer.title }
          : container
      )
    );
  };

  const createContainer = () => {
    console.log("createContainer 함수 실행");
    const postData = {
      name: containerName,
      mode: containerMode,
      language: containerLanguage,
      description: containerDescription,
    };

    axiosInstance
      .post("/api/container", postData)
      .then((response) => {
        console.log("Container created:", response.data);
        axiosInstance.get("/api/container/my").then((response) => {
          setMyContainers(response.data.data);
        });
        setIsModalOpen(false);
        setContainerName("");
        setContainerDescription("");
        setContainerLanguage("java");
        setContainerMode("pair");
      })
      .catch((error) => console.error("Error creating container:", error));
  };

  useEffect(() => {
    axiosInstance
      .get("/api/container/my")
      .then((response) => {
        setMyContainers(response.data.data);
      })
      .catch((error) => console.error("Error fetching my containers:", error));

    axiosInstance
      .get("/api/container/shared")
      .then((response) => {
        setSharedContainers(response.data.data);
      })
      .catch((error) =>
        console.error("Error fetching shared containers:", error)
      );
  }, []);

  return (
    <div className="bg-my-color min-h-screen ">
      <div className="h-full w-full flex justify-center items-center flex-col px-20 p-10 ">
        <div className="flex justify-between w-full items-center py-5">
          <span className="font-bold text-xl">내 컨테이너 </span>
          <button
            onClick={() => setIsModalOpen(true)}
            type="button"
            className="flex justify-center items-center h-9 w-36 px-3 py-1 text-m font-bold text-blue-700 bg-blue-50 border border-blue-500 rounded-md transition duration-150 ease-in-out hover:bg-blue-200 focus:outline-none focus:ring focus:border-blue-300"
          >
            컨테이너 생성
          </button>
        </div>
        <div className="flex flex-wrap gap-4 w-full justify-start">
          {myContainers &&
            myContainers.map((container) => (
              <Card
                id={container.containerId}
                title={container.name}
                stack={container.mode}
                language={container.language}
                description={container.description}
                createdAt={container.createdAt}
                onDeleteSuccess={handleDeleteSuccess}
                onEdit={handleEdit}
              />
            ))}
        </div>
        <div className="flex justify-between w-full items-center py-5 mt-5">
          <span className="font-bold text-xl">공유된 컨테이너 </span>
        </div>
        <div className="flex flex-wrap gap-4 w-full justify-start">
          {sharedContainers &&
            sharedContainers.map((container) => (
              <Card
                id={container.containerId}
                title={container.name}
                stack={container.mode}
                language={container.language}
                description={container.language}
                createdAt={container.createdAt}
                onDeleteSuccess={handleDeleteSuccess}
                onEdit={handleEdit}
              />
            ))}
        </div>
      </div>

      <CreateContainerModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Input
          label="컨테이너 이름"
          value={containerName}
          onChange={(e) => setContainerName(e.target.value)}
        />
        <Input
          label="컨테이너 설명"
          value={containerDescription}
          onChange={(e) => setContainerDescription(e.target.value)}
        />
        <CardSelectInput
          label="사용언어"
          value={containerLanguage}
          onChange={(e) => setContainerLanguage(e.target.value)}
          options={[
            { value: "java", label: "Java" },
            { value: "python", label: "Python" },
            { value: "cpp", label: "C++" },
            { value: "js", label: "JavaScript" },
          ]}
        />
        <CardSelectInput
          label="모드선택"
          value={containerMode}
          onChange={(e) => setContainerMode(e.target.value)}
          options={[
            { value: "pair", label: "Pair Programming" },
            { value: "multi", label: "Multi-User" },
          ]}
        />
        <button
          onClick={createContainer}
          type="button"
          className="w-full h-8 px-3 py-1 text-sm font-medium leading-5 text-white bg-blue-500 rounded-md transition duration-150 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          컨테이너 생성
        </button>
      </CreateContainerModal>
    </div>
  );
};
export default Main;
