import React, { useState } from "react";
import { Stack, Button, TextField, Typography, MenuItem, FormControl, InputLabel, Select, Checkbox, ListItemText } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const AddEmployeSimForm = () => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      matricule: "",
      password: "",
      role: "",
      site: "",
      nom: "",
      prenom: "",
      societe: [],
    },
  });

  const [errors, setErrors] = useState([]);

  const onSubmit = async (data) => {
    try {
      const baseUrl = 'http://localhost:3000';
      const endpoint = '/user/register';
      await axios.post(`${baseUrl}${endpoint}`, data);
      reset();
      setErrors([]); // Clear errors on successful submission
    } catch (error) {
      // Handle and set the error response
      const errorMessages = error.response?.data?.errors || [error.message];
      console.error("Error creating user:", errorMessages);
      setErrors(errorMessages);
    }
  };
  

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      direction="row"
      flexWrap="wrap"
      columnGap={3}
      rowGap={3}
    >
      {/* Matricule */}
      <Controller
        name="matricule"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Matricule" fullWidth />
        )}
      />

      {/* Password */}
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Password"
            type="password"
            fullWidth
          />
        )}
      />

      {/* Role */}
      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Role"
            select
            fullWidth
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
            {/* Add other roles as needed */}
          </TextField>
        )}
      />

      {/* Nom */}
      <Controller
        name="nom"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Nom" fullWidth />
        )}
      />

      {/* Prenom */}
      <Controller
        name="prenom"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Prenom" fullWidth />
        )}
      />

      {/* Société */}
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
              multiple
              value={field.value || []}
              onChange={(event) => field.onChange(event.target.value)}
              renderValue={(selected) => (
                <div>
                  {selected.map((value) => (
                    <div key={value}>{value}</div>
                  ))}
                </div>
              )}
            >
              <MenuItem value="AZIZA">
                <Checkbox checked={field.value.includes("AZIZA")} />
                <ListItemText primary="AZIZA" />
              </MenuItem>
              <MenuItem value="TRANSPORT">
                <Checkbox checked={field.value.includes("TRANSPORT")} />
                <ListItemText primary="TRANSPORT" />
              </MenuItem>
              <MenuItem value="LOGISTIQUE">
                <Checkbox checked={field.value.includes("LOGISTIQUE")} />
                <ListItemText primary="LOGISTIQUE" />
              </MenuItem>
              <MenuItem value="UNIVERS TRANSPORT">
                <Checkbox checked={field.value.includes("UNIVERS TRANSPORT")} />
                <ListItemText primary="UNIVERS TRANSPORT" />
              </MenuItem>
              <MenuItem value="UNIVERS LOGISTIQUE">
                <Checkbox checked={field.value.includes("UNIVERS LOGISTIQUE")} />
                <ListItemText primary="UNIVERS LOGISTIQUE" />
              </MenuItem>
            </Select>
          </FormControl>
        )}
      />

      {/* Site */}
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

      <Button type="submit" variant="contained" size="large">
        Register
      </Button>

      {/* Display Errors */}
      {errors.length > 0 && (
        <Stack mt={2} spacing={1}>
          {errors.map((error, index) => (
            <Typography key={index} color="error">
              {errors}
            </Typography>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default AddEmployeSimForm;
