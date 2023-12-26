import { useParams } from "react-router";
import MonacoEditorComponent from "../components/MonacoEditorComponent";
import { useEffect, useState } from "react";
import { Resizable } from "re-resizable";
import axios from "axios";
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

  const token = "";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get(`/api/container/${id}`, {
          headers,
        });
        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = response.data.data;
        setContainerData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleOnCodeOpen = (file: file) => {
    console.log(file);
    setCode(file.url);
  };
  const handleOnSubmit = () => {
    //코드 컴파일
    console.log("Executing code:", code);
  };
  return (
    <div className="bg-my-color min-h-screen ">
      <div className="w-full h-screen flex">
        <div className="flex-1 bg-slate-600">
          <span>{containerData?.name}</span>
          {containerData?.folders.map((folder) => (
            <div key={folder.folderId}>
              {folder.name}
              <div className="pl-4">
                {folder.files.map((file, index) => (
                  <div
                    className="cursor-pointer"
                    onClick={() => handleOnCodeOpen(file)}
                    key={index}
                  >
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Resizable
          defaultSize={{ width: "90%", height: "100%" }}
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
              width: "1px",
              height: "100%",
              left: "0px",
              backgroundColor: "#d1d5db",
            },
          }}
        >
          <div>
            <div>
              <button onClick={handleOnSubmit}>실행</button>음성
            </div>
            <div>폴더</div>
            <MonacoEditorComponent
              roomId={id}
              code={code}
              onCodeChange={setCode}
            />
            <div className="">h</div>
          </div>
        </Resizable>
      </div>
    </div>
  );
};
export default Container;
