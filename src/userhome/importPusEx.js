import React from "react";
import { Button, Input } from "@mui/material";
import axios from 'axios';

const ImportpusEX = ({ onDataImport }) => {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        // Replace with your backend API URL
        const response = await axios.post('http://localhost:3000/api/uploadpus', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Handle server response (optional)
        console.log(response.data); // You might want to do something with the response here
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <Button
      variant="contained"
      component="label"
      sx={{
        width: '50%',
        maxWidth: '200px',
        padding: '8px 16px',
        borderRadius: '8px',
        boxShadow: 3,
        textTransform: 'none',
        '&:hover': {
          backgroundColor: 'primary.dark',
          boxShadow: 6,
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      Import Excel Data
      <Input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        sx={{ display: 'none' }}
      />
    </Button>
  );
};

export default ImportpusEX;
