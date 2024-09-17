import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Stack, FormControl, InputLabel, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from 'axios';

// Function to check if PUS exists
const checkPUS = async (pusDataToCheck) => {
  const pusNumbers = pusDataToCheck.map(pus => ({
    number: pus.number,
    type: pus.usage_type
  }));

  try {
    const response = await axios.post('http://localhost:3000/pus/check', { pusNumbers });
    console.log('Response from PUS check:', response);

    // Extract the missingPus array from the response data
    const missingPus = response.data.missingPus || [];
    console.log('Missing PUS Numbers:', missingPus);

    return missingPus; // Return the array of missing PUS numbers
  } catch (error) {
    console.error("Error checking PUS:", error);
    return null; // Return null in case of an error
  }
};

// Main component
const AffectationSim = ({ idempl }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      numero: '',
      typeUsage: '',
      type: '',
      typeSIM: '', 
      quota: '',
    },
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [pusToAdd, setPusToAdd] = useState(null);
  const [error, setError] = useState('');

  // Function to handle dialog close
  const handleDialogClose = async () => {
    setOpenDialog(false);
    if (pusToAdd) {
      await addPUS(pusToAdd);
    }
  };

  // Function to add PUS and affectation
  const addPUS = async (pus) => {
    try {
      await axios.post("http://localhost:3000/pusaffectation/add", pus);
      reset();
    } catch (error) {
      console.error("Error adding PUS:", error);
    }
  };

  const submitHandler = async (data) => {
    const formData = {
      number: data.numero,
      usage_type: data.typeUsage,
      type: data.type,
      typeSIM: data.typeSIM,
      quota: data.quota,
      idempl
    };

    // Check PUS based on type
    const pusExists = await checkPUS([{ number: data.numero, usage_type: data.typeUsage }]);

    if (pusExists.length > 0) {
      try {
        // Send data to the server
        await axios.post("http://localhost:3000/pusaffectation/add", formData);
        reset(); // Reset form after successful submission
        setError(''); // Clear any previous errors
      } catch (error) {
        if (error.response && error.response.status === 400) {
          // Handle the case where the PUS is already assigned
          if (error.response.data.message.includes("already assigned")) {
            setError("PUS is already assigned"); // Set the error message if assigned
          } else {
            // Handle other 400 errors (e.g., validation errors)
            console.error("Validation error:", error.response.data.message || error.response.data.errors);
          }
        } else {
          // Handle other server or network errors
          console.error("Unexpected error:", error.message);
        }
      }
    } else {
      // Open the dialog if PUS does not exist
      setPusToAdd(formData);
      setOpenDialog(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Stack spacing={2}>
          {/* Numero Field */}
          <Controller
            name="numero"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Numero" fullWidth />
            )}
          />

          {/* Type d'Usage Field */}
          <Controller
            name="typeUsage"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Type d'Usage</InputLabel>
                <Select
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <MenuItem value="personnelle">Personnelle</MenuItem>
                  <MenuItem value="professionnelle">Professionnelle</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          {/* Type Field */}
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Type opérateur</InputLabel>
                <Select
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <MenuItem value="Ooredoo">Ooredoo</MenuItem>
                  <MenuItem value="Telecom">Telecom</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          {/* Type SIM Field */}
          <Controller
            name="typeSIM"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Type SIM</InputLabel>
                <Select
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <MenuItem value="AFI">AFI</MenuItem>
                  <MenuItem value="AFX">AFX</MenuItem>
                  <MenuItem value="BOX">BOX</MenuItem>
                  <MenuItem value="CLE">CLE</MenuItem>
                  <MenuItem value="AZIZA">AZIZA</MenuItem>
                  <MenuItem value="ALARME">ALARME</MenuItem>
                  <MenuItem value="ASTREINTE">ASTREINTE</MenuItem>
                  <MenuItem value="TRANSPORT">TRANSPORT</MenuItem>
                  <MenuItem value="LOGISTIQUE">LOGISTIQUE</MenuItem>
                  <MenuItem value="DAHLIA ICE">DAHLIA ICE</MenuItem>
                  <MenuItem value="UNIVERS TRANSPORT">UNIVERS TRANSPORT</MenuItem>
                  <MenuItem value="UNIVERS LOGISTIQUE">UNIVERS LOGISTIQUE</MenuItem>
                  <MenuItem value="PRESTATEUR DE SERVICE">PRESTATEUR DE SERVICE</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          {/* Quota Field */}
          <Controller
            name="quota"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Quota" fullWidth />
            )}
          />

          {/* Submit Button */}
          <Button type="submit" variant="contained" color="primary">
            Créer SIM
          </Button>
        </Stack>
      </form>

      {/* Dialog for PUS Not Found */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>PUS Not Found</DialogTitle>
        <DialogContent>
          The PUS is not found. Would you like to add it?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogClose} color="primary">
            Add PUS
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AffectationSim;
