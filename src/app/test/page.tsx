"use client";
import { RootState } from "@/redux/store";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const Test = () => {
  const dispatch = useDispatch();
  const bpmFromRedux = useSelector((state: RootState) => state.bpm.bpm);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/test");
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <h1>test</h1>
      <span>{bpmFromRedux}</span>
    </>
  );
};

export default Test;
