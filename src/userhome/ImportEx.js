// ImportEx.jsx
import React from "react";
import { Button, Input } from "@mui/material";
import * as XLSX from "xlsx";

const ImportEx = ({ onDataImport }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);
        onDataImport(json); // Pass the data to the parent component
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <Button
    variant="contained"
    component="label"
    sx={{
      width: '50%', // Set width to 50% of the parent container
      maxWidth: '200px', // Optional: Set a maximum width
      padding: '8px 16px', // Adjust padding as needed
      borderRadius: '8px', // Rounded corners
      boxShadow: 3, // Add shadow for a more elevated look
      textTransform: 'none', // Preserve original text case
      '&:hover': {
        backgroundColor: 'primary.dark', // Darker color on hover
        boxShadow: 6, // Enhance shadow on hover
      },
      display: 'flex', // Ensures the content is centered
      alignItems: 'center', // Aligns items vertically
      justifyContent: 'center', // Centers content horizontally
    }}
  >
    Import Excel Data
    <Input
      type="file"
      accept=".xlsx, .xls"
      onChange={handleFileUpload}
      sx={{ display: 'none' }} // Hides the file input
    />
  </Button>
  );
};

export default ImportEx;
