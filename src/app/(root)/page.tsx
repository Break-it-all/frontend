"use client";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { changeBpm } from "@/redux/features";
import { useRef } from "react";
import MonacoEditorComponent from "@/components/MonacoEditorComponent";

export default function Home() {
  return (
    <main>
      <MonacoEditorComponent />
    </main>
  );
}
