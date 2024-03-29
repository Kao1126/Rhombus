import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Upload.css";
import TableGenerator from "./Table";

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);

  // Function to handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  function getExtension(filename) {
    return filename.split(".").pop();
  }

  function getCookie(name) {
    const cookieValue = document.cookie.match(
      "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
    );
    return cookieValue ? cookieValue.pop() : "";
  }
  const csrftoken = getCookie("csrftoken"); // Function to get CSRF token from cookie

  const handleUpload = () => {
    if (selectedFile) {
      const file_type = getExtension(selectedFile["name"]);
      console.log(file_type);
      if (file_type !== "csv" && file_type !== "xlsx") {
        alert("Please select a CSV or Excel file to upload");
      } else {
        const formData = new FormData();
        formData.append("csv_file", selectedFile);

        fetch("http://127.0.0.1:8000/myapp/uploadCSV/", {
          method: "POST",
          headers: {
            "X-CSRFTOKEN": csrftoken,
          },
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to upload CSV file");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Upload successful:", data);
            // Handle successful upload if needed
            console.log(data);
            setJsonData(data);
          })
          .catch((error) => {
            console.error("Error:", error);
            // Handle error
          });
      }
    } else {
      alert("Please select a file to upload");
    }
  };

  return (
    <div class="content">
      <form class="form-container">
        <div class="mb-3">
          <label for="formFile" class="form-label">
            Please Upload the CSV or Excel File
          </label>
          <input
            class="form-control"
            type="file"
            id="formFile"
            onChange={handleFileChange}
          />
        </div>
        <button
          className="btn btn-primary btn-submit"
          type="button"
          onClick={handleUpload}
        >
          Upload
        </button>
        <TableGenerator data={jsonData} />
      </form>
    </div>
  );
}

export default FileUpload;
