import React from "react";
import { Stack, Button, TextField, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const AddEmployeSimForm = ({ onSubmit }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      matricule: "",
      nom: "",
      prenom: "",
      cin: "",
      societe: "",
      site: "",
      numero: "",
      typeUsage: "",
      type: "",
      quota: "",
    },
  });

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      direction="row"
      flexWrap="wrap"
      columnGap={3}
      rowGap={3}
    >
      {/* Partie Employé */}
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
        render={({ field }) => <TextField {...field} label="Nom" fullWidth />}
      />
      <Controller
        name="prenom"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Prénom" fullWidth />
        )}
      />
      <Controller
        name="cin"
        control={control}
        render={({ field }) => <TextField {...field} label="CIN" fullWidth />}
      />
      <Controller
        name="societe"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Société" fullWidth />
        )}
      />
      <Controller
        name="site"
        control={control}
        render={({ field }) => <TextField {...field} label="Site" fullWidth />}
      />

      {/* Partie SIM */}
      <Controller
        name="numero"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Numéro SIM" fullWidth />
        )}
      />
      <Controller
        name="typeUsage"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Type d'Usage"
            select
            fullWidth
          >
            <MenuItem value="Personnel">Personnel</MenuItem>
            <MenuItem value="Professionnel">Professionnel</MenuItem>
          </TextField>
        )}
      />
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Type SIM" fullWidth />
        )}
      />
      <Controller
        name="quota"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Quota" fullWidth />
        )}
      />

      <Button type="submit" variant="contained" size="large">
        Ajouter
      </Button>
    </Stack>
  );
};

export default AddEmployeSimForm;
