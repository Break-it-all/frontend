"use client";
import { RootState } from "@/redux/store";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import MonacoEditorComponent from "@/components/MonacoEditorComponent";

const Test = ({ params }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const containerId = pathname.slice(11);
  console.log(containerId);
  return (
    <>
      <MonacoEditorComponent roomId={containerId} />
    </>
  );
};

export default Test;
