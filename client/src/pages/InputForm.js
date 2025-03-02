import React, { useState } from "react";

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
const TrafficForm = ({ formData, setFormData, setSubmittedData }) => {
  return (
    <form onSubmit={(e) => handleSubmit(e, formData, setSubmittedData, () => resetForm(setFormData))}>
      {Object.keys(formData).map((key) => (
        <input
          key={key}
          name={key}
          value={formData[key]}
          onChange={(e) => handleChange(e, setFormData)}
          placeholder={key.replace(/([A-Z])/g, " $1").trim()}
        />
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

// Reusable Table Component
const SubmittedTable = ({ submittedData, headers }) => {
  return submittedData.length > 0 ? (
    <table border="1" style={{ marginTop: "10px", width: "100%", textAlign: "left" }}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {submittedData.map((data, index) => (
          <tr key={index}>
            {Object.values(data).map((value, i) => (
              <td key={i}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No data submitted yet.</p>
  );
};

// Main Component
function InputForm() {
  const [formData, setFormData] = useState({ ...initialFormState });
  const [submittedData, setSubmittedData] = useState([]);
  const headers = Object.keys(initialFormState).map((key) => key.replace(/([A-Z])/g, " $1").trim());

  return (
    <div>
    <div>
      
      <TrafficForm formData={formData} setFormData={setFormData} setSubmittedData={setSubmittedData} />
      
    </div>
      {/* Action Buttons */}
      <div>
        <div>
          <button onClick={() => downloadCSV(submittedData, headers)}>Download CSV</button>
          <button onClick={() => resetData(setSubmittedData)} style={{ marginLeft: "10px", background: "red", color: "white" }}>
            Reset All
          </button>
          <button onClick={() => resetLastEntry(setSubmittedData)} style={{ marginLeft: "10px", background: "orange", color: "white" }}>
            Reset Last Entry
          </button>
        </div>
      </div>
      {/* Submitted Data Table */}
      <div>
        <h3>Current CSV Data Table:</h3>
        <SubmittedTable submittedData={submittedData} headers={headers} />
      </div>

    </div>
  );
}

export default InputForm;