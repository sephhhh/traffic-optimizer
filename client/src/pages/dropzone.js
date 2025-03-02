import React, {useCallback, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {useDropzone} from 'react-dropzone';
import DocumentImg from '../icons/document.svg';
import DownArrow from '../icons/down-arrow.svg';
import Csv from '../icons/csv.svg';
import Back from '../icons/back.svg';
import Papa from 'papaparse';
import loadingGif from '../icons/loading.gif';
import axios from "axios";

const LoadingGif = () => {
  return (
    <div className='absolute top-1/2 left-1/2 visible'>
      <img src={loadingGif} alt='Loading...' />
    </div>
  )
}

const Dropzone = ({className}) => {
  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const backBtnAction = () => {
    navigate('/');
  }

  const handleFormInput = () => {
    navigate('/inputForm');
  }

  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const runPythonScript = async () => {
    try {
      setLoading(true);
      setIsVisible(!isVisible);
      const response = await axios.get('http://localhost:8000/run-script');
      setOutput(response.data.output);
      console.log(response);
    } catch (error) {
      setLoading(false);
      setIsVisible(!isVisible);
      console.error('Error running the Python script:', error);
    }
    setLoading(false);
    setIsVisible(!isVisible);
    navigate('/suggestions', { state: { csvData: output } });
  };
  
  const processCSVData = async (acceptedFiles) => {
    let parsedFiles = [];
    for (let i = 0; i < acceptedFiles.length; i++) {
      try {
        const result = await new Promise((resolve, reject) => {
          Papa.parse(acceptedFiles[i], {
            complete: (result) => {
              console.log('Parsed CSV result:', result);
              resolve(result);
            },
            error: (error) => {
              console.error('Error parsing CSV:', error);
              reject(error);
            },
            header: true,
            skipEmptyLines: true,
          });
        });

        parsedFiles.push(result);
      } catch (error) {
        setLoading(false);
        setIsVisible(!isVisible);
        console.error('CSV parsing failed:', error);
      }
    }

    setLoading(false);
    setIsVisible(!isVisible);
    navigate('/suggestions', { state: { csvData: parsedFiles } });
  };
  
  

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
      <div className='header'>
        <button className='backBtn' onClick={backBtnAction}> <img src={Back} id='backImg'/></button>
        <div className='headerText'>Import your CSV Files</div>
        {output && <p>{output}</p>}
        <button id='processBtn' onClick={runPythonScript}>Process</button>
      </div>
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

      <div className='noCsvDiv'>
        <button id='noCsvDivBtn' onClick={handleFormInput}>Don't have a CSV file?</button>
      </div>

      <div style={{width: "93%"}}>
        <div className='acceptedFiles'>
        {files.map(file => {
          return (
          <div className='file' key={file.name}>
            <img src={Csv} alt='csv-icon' className='csvIcon'/>
            <div className='fileAttributes'>
              <span className='fileName'>{file.name}</span>
              <button type='button' className='deleteFileBtn' onClick={() => removeFile(file.name)}>X</button>
            </div>
          </div>
          )
        })}
      </div>
    </div>
    <ul style={{display: "none"}}>
            {rejected.length > 0 && (
      <div>
        <p>Last rejected file: {rejected[rejected.length - 1].file.name}</p>
      </div>
    )}
    </ul>
    {loading && <LoadingGif />}
    
  </div>
  )
}

export default Dropzone;