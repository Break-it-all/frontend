import { useParams } from "react-router";
import MonacoEditorComponent from "../components/MonacoEditorComponent";

const Container = () => {
  const { id } = useParams<string>();

  return (
    <div className="bg-my-color min-h-screen ">
      <MonacoEditorComponent roomId={id} />
    </div>
  );
};
export default Container;
