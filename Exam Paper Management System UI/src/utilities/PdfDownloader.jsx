import { Button } from "@mantine/core"; // Import Button component from Mantine library
import { IconDownload } from "@tabler/icons-react"; // Import IconDownload component from Tabler Icons React
import React, { useState } from "react"; // Import React and useState hook

// Define a PdfDownloader component that takes a file URL as a prop
const PdfDownloader = ({ file }) => {
  const [isDownloading, setIsDownloading] = useState(false); // State to track download status

  // Function to handle the download process
  const handleDownload = () => {
    setIsDownloading(true); // Set downloading state to true
    const cloudinaryUrl = file; // URL of the file to be downloaded

    // Fetch the file from the URL
    fetch(cloudinaryUrl, {
      method: "GET", // HTTP method
      headers: {
        "Content-Type": "application/pdf", // Set content type to PDF
      },
    })
      .then((response) => response.blob()) // Convert response to a blob
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob])); // Create a URL for the blob
        const link = document.createElement("a"); // Create an anchor element
        link.href = url; // Set the href of the anchor to the blob URL
        link.setAttribute("download", "rubrics.pdf"); // Set the download attribute to define the filename
        document.body.appendChild(link); // Append the anchor to the body
        link.click(); // Trigger a click on the anchor to start download
        link.parentNode.removeChild(link); // Remove the anchor from the DOM
        setIsDownloading(false); // Set downloading state to false
      })
      .catch((error) => {
        console.error("Error downloading PDF:", error); // Log error to console
        setIsDownloading(false); // Set downloading state to false if an error occurs
      });
  };

  // Render a button that triggers the download
  return (
    <Button color="lime" onClick={handleDownload} disabled={isDownloading}>
      {isDownloading ? (
        "Downloading..."
      ) : (
        <>
          {" "}
          <IconDownload />
        </>
      )}
    </Button>
  );
};

export default PdfDownloader; // Export the PdfDownloader component
