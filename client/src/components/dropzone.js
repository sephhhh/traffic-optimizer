import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import DocumentImg from '../components/document.svg';
import DownArrow from '../components/down-arrow.svg';

const Dropzone = ({className}) => {
  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    
    if (acceptedFiles?.length) {
      setFiles(previousFiles => [
        ...previousFiles,
        ...acceptedFiles.map(file => 
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )
      ])
    } 

    if (rejectedFiles?.length) {
      setRejected(previousFiles => [
        ...previousFiles,
        ...rejectedFiles])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {
    '.csv': []
  } }); 

  const removeFile = (name) => {
    setFiles(files => files.filter(file => file.name !== name));
  }

  return (
    <div className='custom-file-box'>
      <form className='custom-file-label'>
        <div className='box' {...getRootProps({
          className: className
        })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <div class='custom-file-input-label'>
              <img src={DocumentImg} alt='document' id='documentSvg'/>
              <p className='custom-file-input-text'>Drop your files here or</p>
              <button type='button' id='uploadBtn'>
                Upload
                <img src={DownArrow} id='downArrow'/>
                </button>
            </div>
          )}
        </div>
      </form>
      <div style={{width: "93%"}}>
        <ul className='acceptedFiles'>
        {files.map(file => {
          return (
          <li key={file.name}>
            {file.name}
            <button type='button' onClick={() => removeFile(file.name)}>X</button>
          </li>
          )
        })}
      </ul>
      </div>
    <ul className='mt-6 flex flex-col'>
            {rejected.length > 0 && (
      <div>
        <p>Last rejected file: {rejected[rejected.length - 1].file.name}</p>
      </div>
    )}
    </ul>
  </div>
  )
}

export default Dropzone;