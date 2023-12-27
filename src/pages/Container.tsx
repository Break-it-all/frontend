import { useParams } from "react-router";
import MonacoEditorComponent from "../components/MonacoEditorComponent";
import { useEffect, useState } from "react";
import { Resizable } from "re-resizable";
import { useAxios } from "../api/useAxios";
import { useAppDispatch } from "../redux/hooks";
import { store } from "../redux/store";
import { cls } from "../libs/utils";
import VoiceChat from "../components/VoiceChat";
interface ContainerDetail {
  containerId: number;
  containerUser: [];
  folders: folder[];
  language: string;
  mode: string;
  name: string;
}
interface folder {
  files: file[];
  folderId: number;
  name: string;
  subFolders: folder;
}
interface file {
  fileId: number;
  name: string;
  url: string;
}
const Container = () => {
  const { id } = useParams<string>();
  const [containerData, setContainerData] = useState<ContainerDetail>();
  const [code, setCode] = useState("");
  const user = store.getState().user;
  const [selectedFolder, setSelectedFolder] = useState<folder | null>(null);
  const [selectedFile, setSelectedFile] = useState<file | null>(null);
  const [compileResult, setCompileResult] = useState("결과는 여기!");
  console.log(containerData);
  const axios = useAxios();

  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isFolder, setIsFolder] = useState(false);
  console.log(user.id);
  console.log(containerData?.containerUser);
  const getRoleByUserId = (userId: number) => {
    const user: any = containerData?.containerUser.find(
      (user: any) => user.userId === userId
    );
    return user ? user.role : null;
  };

  const driverUserList = containerData?.containerUser
    .filter((user: any) => user.role === "driver")
    .map((user: any) => user.name);

  console.log(driverUserList);
  const userRole = getRoleByUserId(user.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/container/${id}`);
        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = response.data.data;
        console.log(data);
        setContainerData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleOnCodeOpen = (file: file) => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/file/${file.fileId}`);
        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = response.data; // 파일 데이터로 대체할 수 있습니다.
        const code = data.data.content;

        setSelectedFile(file);
        setCode(code);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  };

  const handleOnSubmit = () => {
    //코드 컴파일
    const fetchData = async () => {
      try {
        const requestBody = {
          code: code,
          language: containerData?.language,
        };
        const response = await axios.post(`/api/file/compile`, requestBody);
        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = response.data; // 파일 데이터로 대체할 수 있습니다.
        data.data.output
          ? setCompileResult(data.data.output)
          : setCompileResult(data.data.error);
        // 여기에서 파일 데이터를 처리하십시오.
      } catch (error) {
        console.error("Error:", error);
      }
    };
    // 저장
    const saveData = async () => {
      try {
        const requestBody = {
          content: code,
        };
        const response = await axios.put(
          `/api/file/${selectedFile?.fileId}`,
          requestBody
        );
        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = response.data; // 파일 데이터로 대체할 수 있습니다.

        // 여기에서 파일 데이터를 처리하십시오.
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
    saveData();
  };
  const handleOnMakeFolder = () => {
    setIsFolder(true); // 폴더를 만들기 위해 폴더 여부를 true로 설정
    setModalOpen(true); // 모달 열기
  };
  const handleOnMakeFile = (folder: folder) => {
    setIsFolder(false); // 파일을 만들기 위해 폴더 여부를 false로 설정
    setSelectedFolder(folder); // 선택한 폴더 설정
    setModalOpen(true); // 모달 열기
  };
  const handleModalSubmit = async () => {
    // 모달에서 입력받은 값과 파일/폴더 여부를 사용하여 처리
    if (isFolder) {
      // 폴더 생성 처리
      const requestBody = {
        name: inputValue,
      };
      axios
        .post(
          `/api/container/${containerData?.containerId}/folder`,
          requestBody
        )
        .then((response) => {
          if (response.status === 200) {
            const newFolderData = response.data; // 서버에서 반환된 새 폴더 정보
            // UI 상태 업데이트: 새 폴더 정보를 기존 폴더 데이터에 추가
            setContainerData((prevContainerData) => {
              if (prevContainerData) {
                return {
                  ...prevContainerData,
                  folders: [...prevContainerData.folders, newFolderData],
                };
              }
              return prevContainerData;
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      const requestBody = {
        name: inputValue,
      };
      const response = await axios.post(
        `/api/folder/${selectedFolder?.folderId}/file`,
        requestBody
      );
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const newFolderData = response.data; // 서버에서 반환된 새 폴더 정보

      // UI 상태 업데이트: 새 폴더 정보를 기존 폴더 데이터에 추가
      setContainerData((prevContainerData) => {
        if (prevContainerData) {
          return {
            ...prevContainerData,
            folders: [...prevContainerData.folders, newFolderData],
          };
        }
        return prevContainerData;
      });
      // 여기에서 파일 데이터를 처리하십시오.
    }
    setModalOpen(false); // 모달 닫기
    setInputValue(""); // 입력값 초기화
  };

  const handleOnSwitchRole = () => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `/api/container/switch-role/${containerData?.containerId}`
        );

        if (response.status === 200) {
          // Fetch the updated container data after switching the role
          const updatedResponse = await axios.get(`/api/container/${id}`);

          if (updatedResponse.status === 200) {
            const updatedData = updatedResponse.data.data;
            setContainerData(updatedData);
          }
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
    console.log(userRole);
  };
  return (
    <div className="bg-my-color min-h-screen ">
      <div className="w-full min-h-screen  flex">
        <div className="flex-1 min-h-full bg-my-black p-2 text-slate-300 overflow-hidden">
          <div className="flex justify-between">
            <span>{containerData?.name}</span>
            <div className="flex">
              <img
                src={"/assets/folder-plus.svg"}
                alt={"folder"}
                onClick={handleOnMakeFolder}
                className="w-4 aspect-square mr-1 ml-2 cursor-pointer "
              />
              <img
                src={"/assets/file-plus.svg"}
                alt={"file"}
                className="w-4 aspect-square mr-1 ml-2 cursor-pointer"
              />
            </div>
          </div>
          <div className="flex flex-col justify-between h-full pb-5">
            <div>
              {containerData?.folders &&
                containerData?.folders.map((folder) => (
                  <div key={folder.folderId}>
                    <div className="flex justify-between ">
                      {folder.name}
                      <img
                        src={"/assets/file-plus.svg"}
                        alt={"file"}
                        onClick={() => handleOnMakeFile(folder)}
                        className="w-4 aspect-square mr-1 ml-2 cursor-pointer"
                      />
                    </div>
                    <div className="pl-4">
                      {folder.files &&
                        folder.files.map((file, index) => (
                          <div
                            className={cls(
                              "cursor-pointer",
                              selectedFile === file
                                ? "opacity-80 bg-slate-700"
                                : ""
                            )}
                            onClick={() => handleOnCodeOpen(file)}
                            key={file.fileId}
                          >
                            {file.name}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
            <div>
              <VoiceChat id={containerData?.containerId} name={user.name} />
            </div>
          </div>
        </div>
        <Resizable
          defaultSize={{ width: "70%", height: "100%" }}
          minWidth={"70%"}
          maxWidth={"90%"}
          enable={{
            top: false,
            right: false,
            bottom: false,
            left: true,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          handleStyles={{
            left: {
              width: "2px",
              height: "100%",
              left: "0px",
              backgroundColor: "#4B5563",
            },
          }}
        >
          <div className="pl-[0.5] min-h-screen flex flex-col">
            <div className="h-full">
              <div className="w-full flex justify-end">
                <button
                  onClick={handleOnSubmit}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                >
                  실행
                </button>
              </div>
              <div className="flex justify-between">
                <div className="bg-my-black w-28 text-white flex justify-between px-2">
                  <span>파일 이름</span> <span className="text-center">x</span>
                </div>
                <div className="flex gap-2 items-center">
                  {driverUserList?.map((user) => (
                    <div>{user}</div>
                  ))}
                  작성중
                  <img
                    src={"/assets/arrow-left-right.svg"}
                    alt={"교체"}
                    className="w-4 h-4 mr-1 ml-2 cursor-pointer"
                    onClick={handleOnSwitchRole}
                  />
                </div>
              </div>
              <MonacoEditorComponent
                roomId={id}
                code={code}
                onCodeChange={setCode}
                userRole={userRole}
              />
            </div>
            {/* <Resizable
              defaultSize={{ width: "100%", height: "300px" }}
              minHeight={"20%"}
              maxHeight={"90%"}
              enable={{
                top: true,
                right: false,
                bottom: true,
                left: false,
                topRight: false,
                bottomRight: false,
                bottomLeft: false,
                topLeft: false,
              }}
              handleStyles={{
                bottom: {
                  width: "100%",
                  height: "5px",
                  backgroundColor: "#d1d5db",
                },
              }}
            > */}
            <div className="flex-1 overflow-y-auto bg-my-black text-gray-50 border-t-2 border-gray-600 pl-2">
              {compileResult}
            </div>
            {/* </Resizable> */}
          </div>
        </Resizable>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-xl font-semibold">
              {isFolder ? "폴더 생성" : "파일 생성"}
            </h2>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isFolder ? "폴더 이름" : "파일 이름"}
            />
            <button onClick={handleModalSubmit}>확인</button>
            <button onClick={() => setModalOpen(false)}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Container;
