"use client";

import React from "react";

interface FileUploadProps {
  setfile: (fileUrl: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ setfile }) => {
  const handleUpload = () => {
    const ele = document.createElement("input");
    ele.setAttribute("type", "file");
    ele.setAttribute("accept", "application/pdf");

    ele.addEventListener("change", async () => {
      try {
        if (ele.files && ele.files.length > 0) {
          const file = ele.files.item(0);
          if (!file) return;

          const formData = new FormData();
          formData.append("pdf", file);

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/upload/pdf`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          const data = await response.json();

          // You should return the uploaded PDF file's address from backend
          // Assume data.fileUrl = "/uploads/filename.pdf"
const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}${data.fileUrl}`;
          console.log(fileUrl);
          const fileUrlString = `${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`;
          setfile(fileUrlString); // 👈 Pass the file URL back to parent
        }
      } catch (err) {
        console.error("File upload error:", err);
      }
    });

    ele.click();
  };

  return (
    <div
      className="bg-white shadow-2xl w-[350px] h-[250px] cursor-pointer flex flex-col justify-evenly items-center text-blue-400 px-4 py-2 rounded "
      onClick={handleUpload}
    >
      <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-upload w-8 h-8 text-purple-600"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" x2="12" y1="3" y2="15"></line>
        </svg>
      </div>
      <div>
         <h2 className="text-xl font-light text-gray-600 mb-2">
        Upload PDF to start chatting
      </h2>
      <p className="text-gray-400">Click or drag and drop your file here</p>
      </div>
     
    </div>
  );
};

export default FileUpload;
