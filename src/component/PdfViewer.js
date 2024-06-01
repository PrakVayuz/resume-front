import React from 'react';

const PdfViewer = ({ pdfUrl }) => {
  return (
    <div className="w-24 h-40 flex items-center justify-center">
      <iframe
        src={pdfUrl}
        title="PDF Viewer"
        className="w-full h-full"
        style={{ border: 'none' }}
      />
    </div>
  );
};

export default PdfViewer;
