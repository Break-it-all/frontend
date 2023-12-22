import React, { useEffect } from "react";
import { useAxios } from "../../api/useAxios";

export default function EmailAuth() {
  const param = new URLSearchParams(window.location.search);
  const axios = useAxios();

  useEffect(() => {
    handleVerify();
  }, [param]);

  const handleVerify = () => {
    const response = axios.get(
      `/api/email-auth/verify?emailToken=${param.get("emailToken")}`,
      {
        headers: {},
      }
    );
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="h-full max-w-2xl flex justify-center items-center flex-col px-20 p-20 m-auto">
        <div className="bg-white h-full w-full flex flex-col justify-center p-16 shadow-lg text-center">
          <h5 className="font-bold text-3xl py-2">인증이 완료되었습니다.</h5>
          <p>기존 페이지로 돌아가 인증을 확인해주세요.</p>
        </div>
      </div>
    </div>
  );
}
