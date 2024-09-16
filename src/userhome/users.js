import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Button, Stack, TextField, useTheme ,Select, MenuItem, Checkbox, ListItemText, FormControl, InputLabel  } from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import axios from "axios";
import { deleteEmployees } from "../service/employee";
import { tokens } from "../theme";
import AddEmployeSimForm from './AddEmployeSimForm';

// Panel for editing employee details
const EmployeFormPanel = ({ employe, onUpdate }) => {
  const { _id, site, societe, ...employeeData } = employe;
  const { control, handleSubmit } = useForm({
    defaultValues: { ...employeeData, site, societe },
  });

  const [siteOptions] = React.useState(["sahloul", "bouargoub", "RADES"]); // Mock site options
  const [societeOptions] = React.useState([
    "LOGISTIQUE",
    "UNIVERS TRANSPORT",
    "TRANSPORT SERVICES",
    "GLOBAL SHIPPING",
  ]); // Mock societe options

  const submitHandler = async (data) => {
    try {
      await axios.patch(`http://localhost:3000/user/update`, data); // PATCH request
      console.log("Updated data:", data); 
      if (onUpdate) onUpdate(); // Refresh data if callback is provided
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <Stack
      component="form"
      direction={"row"}
      flexWrap={"wrap"}
      columnGap={3}
      rowGap={3}
      onSubmit={handleSubmit(submitHandler)}
    >
      {_.keys(employeeData).map((item) => (
        !['site', 'societe'].includes(item) && (
          <Controller
            key={item}
            control={control}
            name={item}
            render={({ field }) => (
              <TextField
                {...field}
                sx={{ flexBasis: "23%", bgcolor: "white" }}
                placeholder={`Enter Your ${_.upperFirst(item)}`}
              />
            )}
          />
        )
      ))}

      {/* Site Single Select */}
      <Controller
        name="site"
        control={control}
        render={({ field }) => (
          <FormControl sx={{ flexBasis: "23%", bgcolor: "white" }}>
            <InputLabel>Site</InputLabel>
            <Select {...field} label="Site">
              {siteOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      {/* Societe Multi Select */}
      <Controller
        name="societe"
        control={control}
        render={({ field }) => (
          <FormControl sx={{ flexBasis: "23%", bgcolor: "white" }}>
            <InputLabel>Société</InputLabel>
            <Select
              {...field}
              multiple
              value={field.value || []}
              onChange={(e) => field.onChange(e.target.value)}
              renderValue={(selected) => selected.join(", ")}
            >
              {societeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox checked={field.value?.indexOf(option) > -1} />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Button type="submit" disableElevation variant="contained" size="large">
        Update Details
      </Button>
    </Stack>
  );
};

// Main component displaying the table
const Users = ({ isPending: propIsPending, data }) => {
  const [tableData, setTableData] = useState(data ?? []);
  const [showAddForm, setShowAddForm] = useState(false); // State to toggle form visibility
  const [refreshKey, setRefreshKey] = useState(0); // Key to force table refresh
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isPending, setIsPending] = useState(false);  // Initialize with false
  const baseUrl = 'http://localhost:3000';
  const endpoint = '/user/all';

  const loadData = async () => {
    setIsPending(true);
    try {
      const response = await axios.get(`${baseUrl}${endpoint}`);
      const fetchedData = response.data; // assuming response.data holds the actual data
      setTableData(fetchedData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  // Columns definition for the table
  const columns = useMemo(
    () => [
      { accessorKey: "matricule", header: "Matricule" },
      { accessorKey: "role", header: "Role" },
      { accessorKey: "site", header: "Site" },
      { accessorKey: "nom", header: "Nom" },
      { accessorKey: "prenom", header: "Prenom" },
      { 
        accessorKey: "societe", 
        header: "Société", 
        cell: ({ cell }) => cell.getValue().join(", ") // Display array as comma-separated
      },
    ],
    []
  );
  const handleUpdate = () => { // Line to define handleUpdate
    setRefreshKey((prevKey) => prevKey + 1); // Line to refresh the table data
  };
  
  const table = useMaterialReactTable({
    state: {
      isLoading: isPending,
      showProgressBars: isPending,
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 5 },
    },
    columns,
    data: tableData,
    enableRowSelection: true,
    muiDetailPanelProps: {
      sx: {
        bgcolor: colors.primary[400],
      },
    },
    renderToolbarAlertBannerContent: ({ table }) => (
      <Stack
        sx={{ p: 2 }}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"flex-start"}
        spacing={2}
      >
        <Button
          disableElevation
          size="small"
          color="error"
          variant="contained"
          onClick={() => {
            const selectedRows = table.getSelectedRowModel().rows;
            const selectedIds = selectedRows.map((item) => item.original.id || "ID not found");
            console.log("Selected IDs:", selectedIds);
            handleDelete(selectedIds);
            table.toggleAllPageRowsSelected(false);
          }}
        >
          Delete selected
        </Button>
      </Stack>
    ),
    renderDetailPanel: ({ row }) => {
      const employe = _.omit(row.original, ["__v"]);
      return <EmployeFormPanel employe={employe} onUpdate={handleUpdate} />;
    },
  });

  const handleAddSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        societe: Array.isArray(data.societe) ? data.societe : [data.societe]
      };

      await axios.post(`${baseUrl}/user/register`, formattedData);
      setTableData((prevData) => [...prevData, formattedData]);
      setShowAddForm(false);
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const handleDelete = async (ids) => {
    try {
      await axios.delete(`${baseUrl}/user/delete`, {
        data: { ids } // Send ids in the request body
      });
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };
  

  return (
    <Stack spacing={2}>
      <Button
        variant="contained"
        color="primary"
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
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? "Cancel" : "Add Employee"}
      </Button>
      {showAddForm && (
        <AddEmployeSimForm onSubmit={handleAddSubmit} />
      )}
       <div style={{ transform: 'scale(0.94)', transformOrigin: 'top left', overflow: 'auto' }}>
      {/* Apply zoom directly to the container */}
      <MaterialReactTable table={table} />
    </div>
    </Stack>
  );
};

export default Users;
