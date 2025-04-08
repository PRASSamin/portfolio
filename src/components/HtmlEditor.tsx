import { Editor, EditorProps } from "@monaco-editor/react";
import { emmetHTML } from "emmet-monaco-es";
import React from "react";

const HtmlEditor: React.FC<EditorProps> = ({ ...props }) => {
  return (
    <div className="overflow-hidden rounded-md h-full border">
      <Editor
        height="100%"
        defaultLanguage="html"
        theme="vs-dark"
        onMount={(editor, monaco) => {
          emmetHTML(monaco);
        }}
        options={{
          fontSize: 14,
          minimap: { enabled: true },
          tabSize: 2,
          formatOnType: true,
          formatOnPaste: true,
          autoIndent: "advanced",
          "semanticHighlighting.enabled": true,
          acceptSuggestionOnCommitCharacter: true,
          codeLens: true,
          bracketPairColorization: {
            enabled: true,
          },
          wordWrap: "on",
        }}
        {...props}
      />
    </div>
  );
};

export default HtmlEditor;
