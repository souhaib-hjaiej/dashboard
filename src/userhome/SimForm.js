import React from "react";
import { useForm, Controller } from "react-hook-form";
import { 
  TextField, 
  Button, 
  Stack, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Checkbox, 
  ListItemText 
} from "@mui/material";
import { ajouterpus } from '../service/pus';

const SimForm = ({ onSubmit, defaultValues = {} }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      numero: '',
      typeUsage: '',
      type: '', // Include the type field here
      typeSIM: '', // Include the typeSIM field here
      quota: '',
      ...defaultValues, // Use default values if available
    },
  });

  const submitHandler = async (data) => {
    console.log(data);
    try {
      await ajouterpus("http://localhost:3000/pus/add", data);
      reset();
      console.log('PUS added successfully');
    } catch (error) {
      console.error("Error submitting form:", error);
    }
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
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                renderValue={(selected) => selected}
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
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>type operateur</InputLabel>
              <Select
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                renderValue={(selected) => selected}
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
        <Controller
          name="typeSIM"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Type SIM</InputLabel>
              <Select
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                renderValue={(selected) => selected}
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
                <MenuItem value="PRESTATEURE DE SERVICE">PRESTATEURE DE SERVICE</MenuItem>
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
