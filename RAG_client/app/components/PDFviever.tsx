"use client";

interface PdfViewerProps {
  fileUrl: string; // example: "/uploads/sample.pdf"
}

const PdfViewer: React.FC<PdfViewerProps> = ({ fileUrl }) => {
  return (
    <div className="w-full h-screen flex justify-center items-center ">
      {!fileUrl ? (
        <div>
          <div className="custom-loader"></div>
        </div>
      ) : (
        <iframe
          src={fileUrl}
          className="w-full bg-white h-full border-0 "
          title="PDF Viewer"
        />
      )}

      {/* <embed src={fileUrl} type="application/pdf" width="100%" height="100%" /> */}
    </div>
  );
};

export default PdfViewer;
