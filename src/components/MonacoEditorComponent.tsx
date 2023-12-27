import React, { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import axios from "axios";
import { editor } from "monaco-editor";

function MonacoEditorComponent({ roomId, code, onCodeChange, userRole }: any) {
  const editorRef = useRef<any>("");

  const handleEditorChange = (newValue: string | undefined) => {
    if (typeof newValue === "string") {
      onCodeChange(newValue);
    }
  };
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      const currentCode = model.getValue();

      if (currentCode !== code) {
        const currentPosition = editorRef.current.getPosition();
        const lineCount = model.getLineCount();

        // Calculate the new scroll position to maintain cursor visibility
        const scrollPosition = {
          scrollLeft: editorRef.current.getScrollLeft(),
          scrollTop: editorRef.current.getScrollTop(),
        };

        // Compute the edits to transform current code into new code
        const edits = [
          {
            range: model.getFullModelRange(),
            text: code,
            forceMoveMarkers: true,
          },
        ];

        // Apply the edits to the model
        model.applyEdits(edits);

        // Restore the cursor position and scroll position
        editorRef.current.setPosition(currentPosition);
        editorRef.current.setScrollLeft(scrollPosition.scrollLeft);
        editorRef.current.setScrollTop(scrollPosition.scrollTop);
      }
    }
  }, [code]);

  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: any
  ) {
    // !editor && editorRef.current.setValue(code);
    editorRef.current = editor;

    const doc = new Y.Doc();
    const provider = new WebsocketProvider(
      "wss://demos.yjs.dev/ws",
      roomId,
      doc
    );
    const type = doc.getText("monaco");
    const binding = new MonacoBinding(
      type,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );
  }

  return (
    <>
      <div className="flex-1 w-full h-full">
        <Editor
          height="70vh"
          defaultLanguage="javascript"
          defaultValue={code}
          theme="vs-dark"
          //@ts-ignore
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            readOnly: userRole === "navigator", // Set readOnly based on the user's role
          }}
          onMount={handleEditorDidMount}
        />
      </div>
    </>
  );
}

export default MonacoEditorComponent;
