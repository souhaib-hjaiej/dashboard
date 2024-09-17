import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Box, TextField, Stack, IconButton, Typography, Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText ,   Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import axios from 'axios';

const UserForm = ({ onSubmit }) => {
  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    defaultValues: {
      matricule: '',
      nom: '',
      prenom: '',
      societe: '',
      site: '',
      cin: '',
      pusAssignments: [], // Default value for pusAssignments
    },
  });

  const [pusList, setPusList] = useState([]); // State to store the PUS entries
  const [error, setError] = useState(''); // State to store error message
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility
  const [pusCheckResult, setPusCheckResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');



  const checkPUS = async (pusDataToCheck) => {
    const pusNumbers = pusDataToCheck.map(pus => ({
      number: pus.number,
      type: pus.usage_type
  }));
  
    try {
      const response = await axios.post('http://localhost:3000/pus/check', { pusNumbers });
      console.log('Response from PUS check:', response);
  
      // Extract the missingPus array from the response data
      const missingPus = response.data.missingPus;
      console.log('Missing PUS Numbers:', missingPus);
  
      return missingPus; // Return the array of missing PUS numbers
    } catch (error) {
      console.error("Error checking PUS:", error);
      return null; // Return null in case of an error
    }
  };
  
  // Add PUS to the list
  const handleSavePUS = () => {
    const pusData = {
      number: getValues('pus.number'),
      type: getValues('pus.type'),
      usage_type: getValues('pus.usage_type'),
      quota: getValues('pus.quota'),
      typeSIM: getValues('pus.typeSIM'),
    };
  
    if (pusData.number && pusData.type && pusData.usage_type && pusData.quota && pusData.typeSIM) {
      setPusList([...pusList, pusData]);
      resetField();
    } else {
      console.log('Please fill out all PUS fields.');
    }
  };
  

  // Remove a PUS from the list
  const handleRemovePUS = (index) => {
    const updatedPusList = pusList.filter((_, i) => i !== index);
    setPusList(updatedPusList);
  };

  // Clear the PUS form fields
  const resetField = () => {
    setValue('pus.number', '');
    setValue('pus.type', '');
    setValue('pus.usage_type', '');
    setValue('pus.quota', '');
    setValue('pus.typeSIM', ''); // Clear typeSIM field
  };


  const handleFormSubmit = async (data) => {
  setErrorMessage(''); // Clear previous error messages

  try {
    // Extract PUS data from the form
    const formPusData = {
      number: getValues('pus.number'),
      type: getValues('pus.type'),
      usage_type: getValues('pus.usage_type'),
      quota: getValues('pus.quota'),
      typeSIM: getValues('pus.typeSIM'),
    };

    // Include PUS data from the form if all fields are filled
    let pusDataToCheck = [...pusList];
    if (formPusData.number && formPusData.type && formPusData.usage_type && formPusData.quota && formPusData.typeSIM) {
      pusDataToCheck.push(formPusData);
    }

    // Step 1: Check if the PUS exists
    const pusCheckData = await checkPUS(pusDataToCheck);

    if (pusCheckData && pusCheckData.length > 0) {
      // Step 2: If PUS data is returned, open dialog to ask the user to confirm
      setPusCheckResult(pusCheckData);
      setDialogOpen(true); // Show the dialog with the result
    } else {
      // Step 3: If no PUS is found, proceed with the submission
      await submitEmployeeData(data);
    }
  } catch (error) {
    // Handle any errors that occur during the submission
    if (error.response && error.response.data && error.response.data.errors) {
      // Extract errors from the array and join them into a single string
      const errorMessages = error.response.data.errors.join(', ');
      setErrorMessage(`Error creating user: ${errorMessages}`);
    } else {
      setErrorMessage('An unexpected error occurred.'); // Default error message
    }
  }
};

  
  
  // Handle form submission
  const handleForceSubmit = async () => {
    setErrorMessage(''); // Clear previous error messages
  
    try {
      // Close the dialog
      setDialogOpen(false);
  
      // Get current form values
      const data = getValues();
  
      // Proceed with the form submission
      await submitEmployeeData(data);
    } catch (error) {
      // Handle any errors that occur during the submission
      if (error.response && error.response.data && Array.isArray(error.response.data.errors)) {
        // Extract errors from the array and join them into a single string
        setErrorMessage(error.response.data.errors.join(', '));
      } else {
        setErrorMessage('An unexpected error occurred.'); // Default error message
      }
    }
  };
  
  const submitEmployeeData = async (data) => {
    const formData = {
      ...data,
      pusAssignments: pusList.length > 0 ? pusList : [], // Include pusAssignments even if empty
    };

    try {
      const baseUrl = 'http://localhost:3000';
      const endpoint = '/employe/add';
      const response = await axios.post(`${baseUrl}${endpoint}`, formData);
      console.log('User Created:', response.data);

      // Pass the form data to the parent component
      onSubmit(formData);

      reset();
      setPusList([]); // Clear pusList after successful submission
      setError(''); // Clear any previous error messages
    } catch (error) {
      console.error("Error creating user:", error.response ? error.response.data.errors[0] : error.message);
      setError(error.response ? error.response.data.errors[0] : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack spacing={2}>
        <Controller
          name="matricule"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Matricule" variant="outlined" fullWidth />
          )}
        />
        <Controller
          name="nom"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Nom" variant="outlined" fullWidth />
          )}
        />
        <Controller
          name="prenom"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Prenom" variant="outlined" fullWidth />
          )}
        />
        <Controller
          name="societe"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="societe-label">Société</InputLabel>
              <Select
                {...field}
                labelId="societe-label"
                label="Société"
                value={field.value || ""}
                onChange={(event) => field.onChange(event.target.value)}
              >
                <MenuItem value="AZIZA">AZIZA</MenuItem>
                <MenuItem value="TRANSPORT">TRANSPORT</MenuItem>
                <MenuItem value="LOGISTIQUE">LOGISTIQUE</MenuItem>
                <MenuItem value="UNIVERS TRANSPORT">UNIVERS TRANSPORT</MenuItem>
                <MenuItem value="UNIVERS LOGISTIQUE">UNIVERS LOGISTIQUE</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="site"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="site-label">Site</InputLabel>
              <Select
                {...field}
                labelId="site-label"
                label="Site"
                value={field.value || ""}
                onChange={(event) => field.onChange(event.target.value)}
              >
                <MenuItem value="BOUARGOUB">BOUARGOUB</MenuItem>
                <MenuItem value="GT">GT</MenuItem>
                <MenuItem value="SAHLIN">SAHLIN</MenuItem>
                <MenuItem value="SFAX">SFAX</MenuItem>
                <MenuItem value="SUD">SUD</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="cin"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="CIN" variant="outlined" fullWidth />
          )}
        />

        {/* PUS Assignment Fields */}
        <Typography variant="h6">Add PUS</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          {/* PUS Number */}
          <Controller
            name="pus.number"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="PUS Number"
                variant="outlined"
                fullWidth
              />
            )}
          />
          
          {/* Usage Type */}
          <Controller
            name="pus.usage_type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Type d'Usage</InputLabel>
                <Select
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  renderValue={(selected) => selected}
                  fullWidth
                >
                  <MenuItem value="personnelle">
                    <Checkbox checked={field.value === "personnelle"} />
                    <ListItemText primary="Personnelle" />
                  </MenuItem>
                  <MenuItem value="professionnelle">
                    <Checkbox checked={field.value === "professionnelle"} />
                    <ListItemText primary="Professionnelle" />
                  </MenuItem>
                </Select>
              </FormControl>
            )}
          />

          {/* Operator Type */}
          <Controller
            name="pus.type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Type Operateur</InputLabel>
                <Select
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  renderValue={(selected) => selected}
                  fullWidth
                >
                  <MenuItem value="Ooredoo">
                    <Checkbox checked={field.value === "Ooredoo"} />
                    <ListItemText primary="Ooredoo" />
                  </MenuItem>
                  <MenuItem value="Telecom">
                    <Checkbox checked={field.value === "Telecom"} />
                    <ListItemText primary="Telecom" />
                  </MenuItem>
                </Select>
              </FormControl>
            )}
          />

          {/* SIM Type */}
          <Controller
            name="pus.typeSIM"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Type SIM</InputLabel>
                <Select
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  renderValue={(selected) => selected}
                  fullWidth
                >
                  <MenuItem value="AFI">AFI</MenuItem>
                  <MenuItem value="AFX">AFX</MenuItem>
                  <MenuItem value="BOX">BOX</MenuItem>
                  <MenuItem value="CLE">CLE</MenuItem>
                  <MenuItem value="AZIZA">AZIZA</MenuItem>
                  <MenuItem value="ALARME">ALARME</MenuItem>
                  <MenuItem value="MOBILE">MOBILE</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          {/* Quota */}
          <Controller
            name="pus.quota"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Quota" variant="outlined" fullWidth />
            )}
          />

          <Button variant="contained" color="primary" onClick={handleSavePUS}>Add PUS</Button>
        </Stack>

        {/* Display PUS List */}
        {pusList.length > 0 && (
          <Box mt={2}>
            <Typography variant="h6">PUS List</Typography>
            {pusList.map((pus, index) => (
              <Stack key={index} direction="row" spacing={2} alignItems="center" mb={1}>
                <Typography variant="body1">{`Number: ${pus.number}, Type: ${pus.type}, Usage Type: ${pus.usage_type}, Quota: ${pus.quota}, Type SIM: ${pus.typeSIM}`}</Typography>
                <IconButton onClick={() => handleRemovePUS(index)}>
                  <RemoveCircleIcon color="error" />
                </IconButton>
              </Stack>
            ))}
          </Box>
        )}

        <Button type="submit" variant="contained" color="primary">Submit</Button>
        {errorMessage && (
  <div style={{ color: 'red', marginTop: '20px' }}>
    {errorMessage}
  </div>
)}
      </Stack>

      {error && <Typography color="error">{error}</Typography>}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>PUS Conflict</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The following PUS are already in the system:
            {pusCheckResult && pusCheckResult.map((pus, index) => (
              <Typography key={index}>{`Number: ${pus.number}`}</Typography>
            ))}
            Do you want to add the employee anyway?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleForceSubmit} color="primary">Add by Force</Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default UserForm;
