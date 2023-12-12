"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@/components/Card";
import Button from "@/components/Button";

const Page = () => {
  const data = [
    {
      id: 1,
      title: "hello1",
      stack: "javascript",
      descrition: "이 부분은 설명이 되겠습니다12321312312",
      createdAt: "2023-12-11",
    },
    {
      id: 2,
      title: "hello2",
      stack: "java",
      descrition:
        "이 부분은 설명이 되겠습니다.abscdsdfsdfsfr1111111111111111111111111111111",
      createdAt: "2023-12-11",
    },
    {
      id: 3,
      title: "hello3",
      stack: "python",
      descrition: "이 부분은 설명이 되겠습니다.ㄱㄴㄱㄷㅇㅇㄹㄷㄴㄷㄹㅁddddd",
      createdAt: "2023-12-11",
    },
  ];

  // const [data, setData] = useState([]);

  // useEffect(() => {
  //   // Fetch data from your API or server using Axios
  //   axios
  //     .get("your-api-endpoint-here")
  //     .then((response) => {
  //       // Assuming your API response contains an array of data
  //       setData(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []);

  return (
    <div className="bg-my-color min-h-screen ">
      <div className="h-12 bg-white flex px-24 justify-between items-center sticky w-full left-0 top-0 z-[89] shadow-lg ">
        <div>logo</div>
        <div>user</div>
      </div>
      <div className="h-full w-full flex justify-center items-center flex-col px-20 p-10 ">
        <div className="flex justify-between w-full items-center py-5">
          <span>내 컨테이너 </span>
          <Button text="컨테이너 생성" />
        </div>
        <div className="flex flex-wrap gap-4 w-full justify-start">
          {data.map((v) => (
            <Card
              id={v.id}
              title={v.title}
              stack={v.stack}
              descrition={v.descrition}
              createdAt={v.createdAt}
            />
          ))}
        </div>
        <div className="flex justify-between w-full items-center py-5">
          <span>공유된 컨테이너 </span>
        </div>
        <div className="flex flex-wrap gap-4 w-full justify-start">
          {data.map((v) => (
            <Card
              id={v.id}
              title={v.title}
              stack={v.stack}
              descrition={v.descrition}
              createdAt={v.createdAt}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Page;
