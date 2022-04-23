import React, { useCallback, useState, useRef } from 'react'
import ReactDOM from "react-dom";

import Editor from "@monaco-editor/react";
import DownloadButton from './DownloadButton';


export default function FileInfo({colorChanges}) {
    const editorRef = useRef(null);
    const [editedColorChanges, setChanges] = useState(colorChanges);

    const handleEditorDidMount = (editor, monaco) => {
        console.log("editor set")
        editorRef.current = editor; 
    }

    const setColorChanges = () => {
        setChanges(editorRef.current.getValue());
    }


    return (
        <div className='h-full flex flex-col space-y-4'>
            <Editor
            height="100%"
            defaultLanguage="text"
            defaultValue={colorChanges.join('\n')}
            theme="vs-dark"
            onMount={handleEditorDidMount}
            onChange={setColorChanges}
            />
            <DownloadButton colorChanges={editedColorChanges}></DownloadButton>
        </div>
    )
}