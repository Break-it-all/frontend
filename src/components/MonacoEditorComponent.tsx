import React, { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
function MonacoEditorComponent({ roomId }: any) {
  const editorRef = useRef<any>("");
  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
    const doc = new Y.Doc();

    const provider = new WebrtcProvider(roomId, doc);
    const type = doc.getText("monaco"); // doc {"monaco":"what our IDE is showing"}

    const binding = new MonacoBinding(
      type,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );
    console.log(provider.awareness);
  }

  function showValue() {
    alert(editorRef.current.getValue());
  }
  return (
    <>
      <button onClick={showValue}>Show value</button>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
        }}
        onMount={handleEditorDidMount}
      />
    </>
  );
}

export default MonacoEditorComponent;
