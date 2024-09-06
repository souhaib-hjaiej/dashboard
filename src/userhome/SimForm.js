import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Stack, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";

const SimForm = ({ onSubmit, defaultValues = {} }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      numero: '',
      typeUsage: [],
      type: [],
      quota: '',
      ...defaultValues, // Utiliser les valeurs par défaut si disponibles
    },
  });

  const submitHandler = (data) => {
    onSubmit(data);
    reset(); // Réinitialiser le formulaire après la soumission
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Stack spacing={2}>
        <Controller
          name="numero"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Numero" fullWidth />
          )}
        />
        <Controller
          name="typeUsage"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Type d'Usage</InputLabel>
              <Select
                multiple
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="personnelle">
                  <Checkbox checked={field.value.includes("personnelle")} />
                  <ListItemText primary="Personnelle" />
                </MenuItem>
                <MenuItem value="professionnelle">
                  <Checkbox checked={field.value.includes("professionnelle")} />
                  <ListItemText primary="Professionnelle" />
                </MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                multiple
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="Ooredoo">
                  <Checkbox checked={field.value.includes("Ooredoo")} />
                  <ListItemText primary="Ooredoo" />
                </MenuItem>
                <MenuItem value="Telecom">
                  <Checkbox checked={field.value.includes("Telecom")} />
                  <ListItemText primary="Telecom" />
                </MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="quota"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Quota" fullWidth />
          )}
        />
        <Button type="submit" variant="contained" color="primary">
          Créer SIM
        </Button>
      </Stack>
    </form>
  );
};

export default SimForm;
