import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Stack, FormControl, InputLabel, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import axios from 'axios';

// Function to check if PUS exists
const checkPUS = async (pusNumber, type) => {
  // If the type is not "professionnelle", return true immediately
  if (type !== 'professionnelle') {
    return true;
  }

  try {
    const response = await axios.post('http://localhost:3000/pus/check', { pusNumbers: [pusNumber] });
    const missingPus = response.data.missingPus;
    return missingPus.length === 0; // Returns true if PUS exists, false otherwise
  } catch (error) {
    console.error("Error checking PUS:", error);
    return false;
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
    const pusExists = await checkPUS(data.numero, data.type);
  
    if (pusExists) {
      try {
        await axios.post("http://localhost:3000/pusaffectation/add", formData);
        reset();
      } catch (error) {
        console.error("Error submitting form with axios:", error);
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
          <Typography>
            The PUS is not found. Would you like to add it?
          </Typography>
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
