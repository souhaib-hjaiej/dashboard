import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  List,
  ListItem,
  Typography,
} from "@mui/material";

const UserForm = ({ onSubmit, defaultValues = {}, pusData = [] }) => {
  console.log('UserForm component rendered');
  console.log('Props received:', { defaultValues, pusData });

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      matricule: defaultValues.matricule || '',
      nom: defaultValues.nom || '',
      prenom: defaultValues.prenom || '',
      role: defaultValues.role || [],
      societe: defaultValues.societe || [],
      site: defaultValues.site || [],
      number: defaultValues.number || '', // Ensure it's not undefined
    },
  });

  const [filteredNumbers, setFilteredNumbers] = React.useState([]);

  const watchNumber = watch("number");

  const handleNumberSearch = (inputValue) => {
    if (inputValue && pusData.length > 0) {
      const filtered = pusData.filter((pus) => pus.number.includes(inputValue));
      setFilteredNumbers(filtered);
    } else {
      setFilteredNumbers([]);
    }
  };

  React.useEffect(() => {
    handleNumberSearch(watchNumber);
  }, [watchNumber, pusData]);

  const submitHandler = (data) => {
    console.log("Form Data:", data); // Log the form data on submit
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
          name="number"
          control={control}
          defaultValue="" // Ensure a default value is provided
          render={({ field }) => (
            <TextField
              {...field}
              label="Search Number"
              fullWidth
              onChange={(e) => {
                field.onChange(e);
                handleNumberSearch(e.target.value);
              }}
            />
          )}
        />

        {watchNumber && filteredNumbers.length === 0 ? (
          <Typography variant="body2" color="error">
            No matching PUS number found.
          </Typography>
        ) : null}

        {filteredNumbers.length > 0 && (
          <List>
            {filteredNumbers.map((pus) => (
              <ListItem key={pus.id}>
                {pus.number} - {pus.type}
              </ListItem>
            ))}
          </List>
        )}

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
