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
    >
      Import Excel Data
      <Input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        sx={{ display: "none" }}
      />
    </Button>
  );
};

export default ImportEx;
