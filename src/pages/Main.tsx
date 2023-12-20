import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Main = () => {
  const dispatch = useDispatch();
  const bpmFromRedux = useSelector((state: RootState) => state.bpm.bpm);
  const [data, setData] = useState(null);
  return (
    <div>
      <div>
        <div className="bg-black">test</div>
        <span>{bpmFromRedux}</span>
      </div>
    </div>
  );
};
export default Main;
