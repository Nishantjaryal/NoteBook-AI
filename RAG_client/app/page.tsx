"use client"
import { useState } from "react";
import ChatComponent from "./components/chat-component";
import FileUpload from "./components/file-upload";
import PdfViewer from "./components/PDFviever";

export default function Home() {
  const [fileurl, setFileUrl] = useState("")
 
  return (
    <div className="w-full h-screen flex justify-center items-center">
      {!fileurl ? (
        <FileUpload setfile={setFileUrl} />
      ) : (
        <div className="h-screen w-screen flex bg-white">
          <div className=" overflow-y-auto w-[50vw] flex flex-wrap justify-center items-center p-4">
            <ChatComponent />
          </div>
          <div className=" w-[50vw] border-l-4 hide-scrollbar border-[#e5e7eb] flex justify-center items-center">
            <PdfViewer fileUrl={fileurl} />
          </div>
        </div>
      )}
    </div>
  );
}
