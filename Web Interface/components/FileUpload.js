import React, { useCallback, useState, setState } from 'react'
import { useDropzone } from 'react-dropzone'
import { saveAs } from 'file-saver';

let gcode = '';
let fileInfo = <div></div>;


export default function FileUpload({ getGcodeData, colorChanges }) {
    const [currFile, setFile] = useState({});

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();

            setFile(currFile = file);

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                gcode = reader.result;
                getGcodeData(gcode);
            }
            reader.readAsText(file);
        })
        
      }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        keepLocal: true,
        maxFiles: 1
    });
    
    if(Object.keys(currFile).length > 0) {
        fileInfo = (<div  className='mt-4'>
            <div className='font-bold'>
                Uploaded File:
            </div>
            <div className='ml-4'>
                {currFile.name} - {(currFile.size/1000000).toFixed(2)} MB
            </div>
        </div>)
    };

    const download = (event) => {
        event.preventDefault();
        const blob = new Blob([colorChanges.join('\n')]);
        saveAs(blob, `inking.txt`);
    }
    
    console.log(colorChanges)
    let totalFilamentUsed = colorChanges.length > 0 ? Number.parseFloat(colorChanges[colorChanges.length-2].split('E')[1].split(' ')[0]).toFixed(2) : 0;

  return (
    <div>
        <div className='flex h-32 p-2 border-2 border-slate-600 rounded-lg hover:border-slate-500  hover:text-slate-500 overflow-hidden'
            {...getRootProps()}>
            <div className='w-3/4 m-auto'>
                <input className='m-auto' {...getInputProps()} />
                <div className='m-auto flex space-x-4'>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 font-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    </div>
                    {
                        isDragActive ?
                        <p>Drop GCODE file here</p> :
                        <p>Upload GCODE file, or click to select</p>
                    }
                </div>
            </div>
        </div>
        <div className='h-full space-y-10'>
            {fileInfo}
            <div>
                Filament used: {totalFilamentUsed} mm
            </div>
            <div className='grid col content-between'>
                <button 
                    className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg'
                    onClick={download}>
                    Download Inking File
                </button>
            </div>
        </div>
    </div>
  )
}
