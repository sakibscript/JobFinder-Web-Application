// "use client";

// import React, { useState, useRef } from "react";
// import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// // ✅ Use local PDF.js worker
// GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

// export default function ResumeView() {
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleDivClick = () => {
//     if (pdfUrl) {
//       window.open(pdfUrl, "_blank");
//     } else {
//       fileInputRef.current?.click();
//     }
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];

//     if (!file || file.type !== "application/pdf") {
//       alert("Please upload a valid PDF file.");
//       return;
//     }

//     try {
//       const blobUrl = URL.createObjectURL(file);
//       setPdfUrl(blobUrl);

//       const arrayBuffer = await file.arrayBuffer();
//       const pdf = await getDocument({ data: arrayBuffer }).promise;
//       const page = await pdf.getPage(1);

//       const viewport = page.getViewport({ scale: 1.5 });
//       const canvas = document.createElement("canvas");
//       const context = canvas.getContext("2d");

//       if (!context) {
//         console.error("Canvas context could not be retrieved.");
//         return;
//       }

//       canvas.width = viewport.width;
//       canvas.height = viewport.height;

//       await page.render({ canvasContext: context, viewport }).promise;

//       const imageDataUrl = canvas.toDataURL("image/png");
//       setPreviewImage(imageDataUrl);
//     } catch (error) {
//       console.error("Failed to render PDF preview:", error);
//     }
//   };

//   return (
//     <>
//       <input
//         type="file"
//         accept=".pdf"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         className="hidden"
//       />

//       <div
//         onClick={handleDivClick}
//         className={`bg-white/40 p-4 rounded-xl shadow-md backdrop-blur-lg border border-white/20
//           cursor-pointer select-none flex justify-center items-center
//           ${!previewImage ? "opacity-70" : "hover:bg-white/60"}
//         `}
//         style={{ minHeight: "200px", maxWidth: "300px", margin: "auto" }}
//         title={pdfUrl ? "Click to open PDF" : "Click to upload resume"}
//       >
//         {previewImage ? (
//           <img
//             src={previewImage}
//             alt="Resume Preview"
//             className="max-h-48 object-contain rounded-md shadow"
//           />
//         ) : (
//           <span className="text-gray-500 italic text-center">
//             Click to upload PDF resume
//           </span>
//         )}
//       </div>
//     </>
//   );
// }

"use client";

import React, { useState, useRef } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// ✅ Use CDN version of pdf.worker
GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
// Replace 3.11.174 with your actual installed version if different

export default function ResumeView() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDivClick = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    try {
      const blobUrl = URL.createObjectURL(file);
      setPdfUrl(blobUrl);

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        console.error("Canvas context could not be retrieved.");
        return;
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      const imageDataUrl = canvas.toDataURL("image/png");
      setPreviewImage(imageDataUrl);
    } catch (error) {
      console.error("Failed to render PDF preview:", error);
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onClick={handleDivClick}
        className={`bg-white/40 p-4 rounded-xl shadow-md backdrop-blur-lg border border-white/20
          cursor-pointer select-none flex justify-center items-center
          ${!previewImage ? "opacity-70" : "hover:bg-white/60"}
        `}
        style={{ minHeight: "200px", maxWidth: "300px", margin: "auto" }}
        title={pdfUrl ? "Click to open PDF" : "Click to upload resume"}
      >
        {previewImage ? (
          <img
            src={previewImage}
            alt="Resume Preview"
            className="max-h-48 object-contain rounded-md shadow"
          />
        ) : (
          <span className="text-gray-500 italic text-center">
            Click to upload PDF resume
          </span>
        )}
      </div>
    </>
  );
}
