import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';

// Define the form fields in a single object for easy expansion
const initialFormState = {
  timeOfDay: "0",
  intersectionName: "0",
  intersectionID: "0", 
  trafficInput: "0",
  trafficOutput: "0",

  nwTime: "0",
  enTime: "0", 
  seTime: "0", 
  wsTime: "0",
  nsTime: "0",
  snTime: "0", 
  weTime: "0", 
  ewTime: "0",

  greenLightTime: "0",
  redLightTime: "0", 
  roadDirection: "0", 
  roadID: "0", 
  maxCapacity: "0", 
  turnLeftPercentage: "0", 
  turnRightPercentage: "0", 
  goStraightPercentage: "0", 
};

// Function to handle form field changes
const handleChange = (e, setFormData) => {
  // extracts name and value from e.target
  // same as const name = e.target.name
  const { name, value } = e.target;
  //keeps time, adds name
  //(prev) is paramenter
  // => () is the return
  // ...prev, [name]:value
  //keeps any previous name-value, adds new name-value
  //time: "2", name "xyz" 
  setFormData((prev) => ({ ...prev, [name]: value }));
};

// Function to handle form submission
const handleSubmit = (e, formData, setSubmittedData, resetForm) => {
  //stops page from reloading when submitting lets react handle it
  e.preventDefault();
  // similar to setFormData((prev) => ({ ...prev, [name]: value }));
  // ...prev --> {time: "2", name: "xyz"} 
  // ...formData --> {time: "3", name: "abc"}
  // submittedData = [
  //    {time: "2", name: "xyz"}
  //    {time: "3", name: "abc"}
  // ]
  setSubmittedData((prev) => [...prev, { ...formData }]);
  // clears current input fields
  // replaces with default values
  resetForm();
};

// clears current input fields 
// reverts to default values created in initialFormState
const resetForm = (setFormData) => {
  setFormData({ ...initialFormState });
};

// Function to reset all submitted data
const resetData = (setSubmittedData) => {
  setSubmittedData([]);
};

// Function to reset only the last added entry
const resetLastEntry = (setSubmittedData) => {
  //prev.slice() --> creates a new array and sticks it back into submittedData
  //(0, -1) --> so you essentially remove the last entry
  setSubmittedData((prev) => prev.slice(0, -1));
};

// Function to format and download CSV
const downloadCSV = (submittedData, headers) => { //headers basically the input fields
  //makes sure submittedData isn't empty
  if (submittedData.length === 0) return alert("No data to download!");

  const csvRows = [
    // add row for input fields 
    headers.join(","),
    //... --> puts data into it's own line
    //.map() --> creates new array based on it's parameter
    //(row) => Object.values(row).join(",") --> funtion that loops array and creates csv format
    ...submittedData.map((row) => Object.values(row).join(",")),
  ];

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "traffic_data.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Reusable Form Component
const TrafficForm = ({ formData, setFormData, setSubmittedData, formRef }) => {
  return (
    <form 
      className="flex flex-col gap-4 p-4 bg-white shadow-md rounded-lg"
      //allows button to submit form
      ref = {formRef} 
      onSubmit={(e) => handleSubmit(e, formData, setSubmittedData, () => resetForm(setFormData))}>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 bg-white">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col bg-white">
            <label className="font-medium mb-1 bg-white">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </label>
            <input
              key={key}
              name={key}
              value={formData[key]}
              onChange={(e) => handleChange(e, setFormData)}
              placeholder={key.replace(/([A-Z])/g, " $1").trim()}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
      
    </form>
  );
};

// Reusable Table Component
const SubmittedTable = ({ submittedData, headers }) => {
  return submittedData.length > 0 ? (
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} className="bg-white">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody className = "border border-black">
        {submittedData.map((data, index) => (
          <tr key={index} className = "border border-black">
            {Object.values(data).map((value, i) => (
              <td key={i} className = "border border-black">{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p className = "bg-white">No data submitted yet.</p>
  );
};

// Main Component
function InputForm() {
  const [formData, setFormData] = useState({ ...initialFormState });
  const [submittedData, setSubmittedData] = useState([]);
  const headers = Object.keys(initialFormState).map((key) => key.replace(/([A-Z])/g, " $1").trim());
  //reference to form
  const formRef = useRef(null);

  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/');
  };
    
  return (
    <div className="flex flex-col justify-left gap-6 p-6 min-h-screen bg-white">
      <div className="bg-white">
        <button onClick={handleBack}> Go Home </button>
      </div>
      <div>
        <h1 className="text-lg font-semibold text-black bg-white">Create your csv file</h1>
      </div>
      <div className="flex flex-row">
        {/* Form Section */}
        <div>
          <TrafficForm
            formData={formData}
            setFormData={setFormData}
            setSubmittedData={setSubmittedData}
            formRef={formRef}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-4 pl-8 bg-white">
          <button
            onClick={() => formRef.current.requestSubmit()} //Manually triggers form submission
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </button>
          <button
            onClick={() => resetLastEntry(setSubmittedData)}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
          >
            Reset Last Entry
          </button>
          <button
            onClick={() => resetData(setSubmittedData)}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Reset All
          </button>
          <button
            onClick={() => downloadCSV(submittedData, headers)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Download CSV
          </button>
        </div>
      </div>

      {/* Submitted Data Table */}
      <div>
        <h3 className="text-lg font-semibold text-black bg-white">Current CSV Data Table:</h3>
        <SubmittedTable submittedData={submittedData} headers={headers} />
      </div>
      
    </div>
  );
}

export default InputForm;