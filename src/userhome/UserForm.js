import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Stack, Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText } from "@mui/material";

const UserForm = ({ onSubmit, defaultValues = {} }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      matricule: '',
      nom: '',
      prenom: '',
      role: [],
      societe: [],
      site: [],
      ...defaultValues, // Allow overriding default values
    },
  });

  const submitHandler = (data) => {
    onSubmit(data);
    reset(); // Reset form after submit
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Stack spacing={2}>
        <Controller
          name="matricule"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Matricule" fullWidth />
          )}
        />
        <Controller
          name="nom"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Nom" fullWidth />
          )}
        />
        <Controller
          name="prenom"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Prénom" fullWidth />
          )}
        />
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Rôle</InputLabel>
              <Select
                multiple
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="admin">
                  <Checkbox checked={field.value.includes("admin")} />
                  <ListItemText primary="Admin" />
                </MenuItem>
                <MenuItem value="user">
                  <Checkbox checked={field.value.includes("user")} />
                  <ListItemText primary="User" />
                </MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="societe"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Société</InputLabel>
              <Select
                multiple
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="logistique">
                  <Checkbox checked={field.value.includes("logistique")} />
                  <ListItemText primary="Logistique" />
                </MenuItem>
                <MenuItem value="transport">
                  <Checkbox checked={field.value.includes("transport")} />
                  <ListItemText primary="Transport" />
                </MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="site"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Site</InputLabel>
              <Select
                multiple
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="sahloul">
                  <Checkbox checked={field.value.includes("sahloul")} />
                  <ListItemText primary="Sahloul" />
                </MenuItem>
                <MenuItem value="bouargoub">
                  <Checkbox checked={field.value.includes("bouargoub")} />
                  <ListItemText primary="Bouargoub" />
                </MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Button type="submit" variant="contained" color="primary">
          Créer
        </Button>
      </Stack>
    </form>
  );
};

export default UserForm;
