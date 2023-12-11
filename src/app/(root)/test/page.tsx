"use client";
import { RootState } from "@/redux/store";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const Test = () => {
  const dispatch = useDispatch();
  const bpmFromRedux = useSelector((state: RootState) => state.bpm.bpm);

  return (
    <>
      <h1>test</h1>
      <span>{bpmFromRedux}</span>
    </>
  );
};

export default Test;
