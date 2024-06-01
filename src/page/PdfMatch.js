import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import MatchingWords from "../component/MatchingWord";
import logo from "../image/vayuz_logo.svg";
import PdfViewer from "../component/PdfViewer";
import { ImSpinner6 } from "react-icons/im";
import { RxCross2 } from "react-icons/rx";
import Select from "react-dropdown-select";
import "./quill.snow.css";
import ReactQuill from "react-quill";

function PdfParser() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [descriptionState, setDescriptionState] = useState("");
  const [initialRolesValue, setInitialRolesValue] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const mainDivRef = useRef(null);
  const fileInputRef = useRef(null);
  const [fileUrl, setFileUrl] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(""); // State to store search keyword
  const [searchResults, setSearchResults] = useState(null); 
  const [selectedRole, setSelectedRole] = useState(null); // State for selected role

  useEffect(() => {
    if (mainDivRef.current) {
      const height = mainDivRef.current.scrollHeight;
      mainDivRef.current.style.height = `${height}px`;
    }
  }, [parsedData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      toast.error("Please select a PDF file.");
      return;
    }
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        setFileUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleParsePdf = async () => {
    if (!selectedFile) {
      toast.error("Please select a PDF file.");
      return;
    }

    // Set loading state to true when starting the API request
    setLoading(true);

    const formData = new FormData();
    formData.append("pdfData", selectedFile);
    formData.append("jobDescription", initialRolesValue);
    formData.append("jobName","UI/UX");

    try {
      const response = await axios.post(
         "https://resume-match-system.onrender.com/api/parse-pdf",
        // "http://localhost:3000/api/parse-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Set loading state to false when the API request is successful
      setLoading(false);
      setParsedData(response.data);
    } catch (error) {
      // Set loading state to false when the API request fails
      setLoading(false);
      toast.error("An error occurred while parsing the PDF.");
      console.error(error);
    }
  };

  const openFileInput = () => {
    fileInputRef.current.click(); // Use the ref to trigger click
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/search?keyword=${searchKeyword}`);
      setSearchResults(response.data.matchedResumes);
    } catch (error) {
      console.error("Error searching resumes:", error);
      toast.error("An error occurred while searching resumes.");
    }
  };

  const options = [
    {
      id: 1,
      name: 'React Developer'
    },
    {
      id: 2,
      name: 'Full Stack Developer'
    },
    {
      id: 3,
      name: 'UI/UX'
    },
    {
      id: 4,
      name: 'PHP'
    }
  ];

  return (
    <>
      <Toaster />
      <div className="w-full  sm:fixed flex flex-col ">
        <div className="w-full p-2">
          <img className="w-32" src={logo} alt="logo" />
        </div>

        <div className="w-full sm:w-1/2 px-4">
          {/* Display search results */}
          {searchResults && (
            <div className="mt-4 sm:mt-0">
              {/* Display search results here */}
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-center mt-10">
          <div
            ref={mainDivRef}
            className="w-full h-auto sm:w-1/2 bg-white px-4 rounded-md shadow-md"
          >
            <h1 className="text-xl font-semibold mb-4">Input PDF</h1>
            {fileUrl ? (
              <div className="relative flex justify-center items-center">
                <PdfViewer pdfUrl={fileUrl} />
                <button
                  onClick={() => setFileUrl("")}
                  className="absolute -top-4 right-0 p-2 flex justify-center items-center bg-gray-200 hover:opacity-80 rounded-full"
                >
                  <RxCross2 />
                </button>
              </div>
            ) : (
              <div
                onClick={openFileInput}
                className="mb-4 p-1 bg-[#f2f2f2] text-center cursor-pointer"
              >
                <svg
                  className="mt-2 w-10 h-10 mx-auto text-gray-400 dark:text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"
                  />
                  <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                </svg>
                <span className="mt-2 block text-sm text-gray-900 dark:text-gray-700">
                  Browse your device
                </span>
                <span className="text-sm group-hover:text-blue-700 text-blue-600">
                  to upload your resume
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  Maximum file size is 5 MB
                </span>
              </div>
            )}
            <input
              className="hidden"
              ref={fileInputRef}
              type="file"
              id="pdfFile"
              onChange={handleFileChange}
              accept="application/pdf"
            />

           <h1 className="text-xl font-semibold mb-4">Input Description</h1>
               <ReactQuill
              style={{ width: "100%", height: 180 }}
              className="text-bee-black dark:text-bee-white bg-bee-paleGray dark:bg-bee-ebonyGem rounded-lg appearance-none dark:focus:!border-bee-primary focus:outline-none focus:!border-bee-primary placeholder:!text-gray-800 dark:placeholder:!text-gray-700"
              placeholder={"Description"}
              theme="snow"
              value={initialRolesValue}
              onChange={setInitialRolesValue}
            />
            <button
              className="mt-24 sm:mt-14 mb-8 bg-blue-500 hover:bg-blue-600 text-white flex justify-center items-center gap-2 px-4 py-2 rounded-md"
              onClick={handleParsePdf}
            >
              Calculate Match Score
              {loading && <ImSpinner6 className=" animate-spin " />}
            </button>

          {/* //  OR Just Select your Job & Calculate Score  */}


            {/* <Select
              options={options}
              labelField="name"
              valueField="id"
              onChange={(values) => setSelectedRole(values)}
            />
            <button
              className="mt-30 sm:mt-14 mb-8 bg-blue-500 hover:bg-blue-600 text-white flex justify-center items-center gap-2 px-4 py-2 rounded-md "
              onClick={handleParsePdf}
            >
              Calculate Match Score
              {loading && <ImSpinner6 className=" animate-spin " />}
            </button> */}
          </div>
          <div className="w-full sm:w-1/2 px-4">
            <div className="mt-4 sm:mt-0">
              <h2 className="text-lg font-semibold mb-2">Title</h2>
              <pre
                className="bg-gray-200 p-4 rounded-md overflow-auto"
                style={{ maxHeight: "200px" }}
              >
                {parsedData?.data?.title}
              </pre>
              <h2 className="text-lg font-semibold mb-2">Text</h2>
              <pre
                className="bg-gray-200 p-4 rounded-md overflow-auto"
                style={{ maxHeight: "150px" }}
              >
                {parsedData?.data?.text}
              </pre>
              <h2 className="text-lg font-semibold mb-2">Match Score</h2>
              <p className="bg-gray-200 p-4 rounded-md">
                {parsedData?.data &&
                  `${Math.round(parsedData?.matchData?.matchScore)} %`}
              </p>
              <h2 className="text-lg font-semibold mb-2">Matching Words</h2>
              <MatchingWords
                matchingWords={parsedData?.matchData?.matchingWords}
                
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PdfParser;
