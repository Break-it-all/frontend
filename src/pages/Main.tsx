import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import axios from 'axios';
import Button from "../components/Button";
import Card from "../components/Card";
import CreateContainerModal from "../components/CreateContainerModal";
import Input from "../components/Input";
import SelectInput from "../components/SelectInput";
import { useState, useEffect } from "react";
const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QG5hdmVyLmNvbSIsImlhdCI6MTcwMzIyMjY4NywiZXhwIjoxNzAzMjI5ODg3fQ.AEk_lrOCN1Y8XjUYCUPwxOVZgQbhV6ObMJgXlg3ewTE';

interface Container {
  containerId: number;
  name: string;
  mode: string;
  language: string;
  description?: string;
  createdAt: string;
}

const formatDate = (createdAt: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false
  };

  return new Date(createdAt)
    .toLocaleString('ko-KR', options)
    .replace(/\./g, '-')
    .replace(/\s/g, '')
    .replace(/:/g, '');
}

const Main = () => {
  const [myContainers, setMyContainers] = useState<Container[]>([]);
  const [sharedContainers, setSharedContainers] = useState<Container[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [containerName, setContainerName] = useState('');
  const [containerDescription, setContainerDescription] = useState('');
  const [containerLanguage, setContainerLanguage] = useState('');
  const [containerMode, setContainerMode] = useState('pair');

  const createContainer = () => {
    const postData = {
      name: containerName,
      mode: containerMode,
      language: containerLanguage,
      description: containerDescription
    };

    axios.post('http://localhost:8080/api/container', postData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // 토큰 사용
      }
    })
      .then(response => {
        console.log('Container created:', response.data);
        // 모달 닫기 및 상태 초기화
        setIsModalOpen(false);
        setContainerName('');
        setContainerDescription('');
        setContainerLanguage('java');
        setContainerMode('pair');
      })
      .catch(error => console.error('Error creating container:', error));
  };



  useEffect(() => {
    // 내가 만든 컨테이너 조회
    axios.get('http://localhost:8080/api/container/my', {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        const formattedData = response.data.data.map((container: Container) => ({
          ...container,
          createdAt: formatDate(container.createdAt)
        }));
        setMyContainers(formattedData);
      })
      .catch(error => console.error('Error fetching my containers:', error));

    // 공유된 컨테이너 조회
    axios.get('http://localhost:8080/api/container/shared', {
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        const formattedData = response.data.data.map((container: Container) => ({
          ...container,
          createdAt: formatDate(container.createdAt)
        }));
        setSharedContainers(formattedData);
      })
      .catch(error => console.error('Error fetching shared containers:', error));
  }, []);

  return (
    <div className="bg-my-color min-h-screen ">
      <div className="h-12 bg-white flex px-24 justify-between items-center sticky w-full left-0 top-0 z-[89] shadow-lg ">
        <div>logo</div>
        <div>user</div>
      </div>
      <div className="h-full w-full flex justify-center items-center flex-col px-20 p-10 ">
        <div className="flex justify-between w-full items-center py-5">
          <span>내 컨테이너 </span>
          <Button onClick={() => setIsModalOpen(true)} text="컨테이너 생성" />
        </div>
        <div className="flex flex-wrap gap-4 w-full justify-start">

          {myContainers.map((container) => (
            <Card
              key={container.containerId}
              id={container.containerId}
              title={container.name}
              stack={container.mode}
              descrition={container.language}

              createdAt={container.createdAt}
            />
          ))}
        </div>
        <div className="flex justify-between w-full items-center py-5">
          <span>공유된 컨테이너 </span>
        </div>
        <div className="flex flex-wrap gap-4 w-full justify-start">
          {sharedContainers.map((container) => (
            <Card
              key={container.containerId}
              id={container.containerId}
              title={container.name}
              stack={container.mode}
              descrition={container.language}
              createdAt={container.createdAt}
            />
          ))}
        </div>
      </div>


      <CreateContainerModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Input label="컨테이너 이름" value={containerName} onChange={e => setContainerName(e.target.value)} />
        <Input label="컨테이너 설명" value={containerDescription} onChange={e => setContainerDescription(e.target.value)} />
        <SelectInput
          label="사용언어"
          value={containerLanguage}
          onChange={e => setContainerLanguage(e.target.value)}
          options={[
            { value: 'java', label: 'Java' },
            { value: 'python', label: 'Python' },
            { value: 'cpp', label: 'C++' },
            { value: 'js', label: 'JavaScript' }
          ]}
        />
        <SelectInput
          label="모드선택"
          value={containerMode}
          onChange={e => setContainerMode(e.target.value)}
          options={[
            { value: 'pair', label: 'Pair Programming' },
            { value: 'multi', label: 'Multi-User' }
          ]}
        />
        <Button onClick={createContainer} text="컨테이너 생성" />
      </CreateContainerModal>
    </div>
  );
};
export default Main;