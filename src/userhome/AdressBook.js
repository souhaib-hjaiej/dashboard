import React, { useMemo, useState, useEffect } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';


import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Typography, 
  Button, 
  Stack, 
  TextField, 
  useTheme, 
  Dialog, 
  IconButton, 
  DialogTitle, 
  DialogContent, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import ImportEx from "./ImportEx";
import { tokens } from "../theme";
import { fetchData, updateEmployee, deleteEmployees } from "../service/employee";
import UserForm from "./CreateUser";
import AffectationSim from "./simAfectation";
import axios from 'axios';


// Panel for editing employee details
const EmployeFormPanel = ({ employe }) => {
  const { _id, ...employeeData } = employe;
  const { control, handleSubmit, reset } = useForm({
    defaultValues: employeeData,
  });

  const submitHandler = async (data) => {
    try {
      await updateEmployee('http://localhost:3000', _id, data);
      console.log("Updated data:", data);
      reset();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const siteOptions = [
    { value: "BOUARGOUB", label: "BOUARGOUB" },
    { value: "GT", label: "GT" },
    { value: "SAHLIN", label: "SAHLIN" },
    { value: "SFAX", label: "SFAX" },
    { value: "SUD", label: "SUD" }
  ];
  
  const societeOptions = [
    { value: "AZIZA", label: "AZIZA" },
    { value: "TRANSPORT", label: "TRANSPORT" },
    { value: "LOGISTIQUE", label: "LOGISTIQUE" },
    { value: "UNIVERS TRANSPORT", label: "UNIVERS TRANSPORT" },
    { value: "UNIVERS LOGISTIQUE", label: "UNIVERS LOGISTIQUE" }
  ];
  return (
    <Stack
    component="form"
    direction={"row"}
    flexWrap={"wrap"}
    columnGap={3}
    rowGap={3}
    onSubmit={handleSubmit(submitHandler)}
  >
    {_.keys(employeeData)
      .filter((item) => item !== 'pus') // Exclude the 'pus' field
      .map((item) => {
        if (item === 'site') {
          return (
            <Controller
              key={item}
              control={control}
              name={item}
              render={({ field }) => (
                <FormControl sx={{ flexBasis: "25%", bgcolor: "white" }} fullWidth>
                  <InputLabel id="site-label">Site</InputLabel>
                  <Select
                    {...field}
                    labelId="site-label"
                    label="Site"
                    value={field.value || ""}
                    onChange={(event) => field.onChange(event.target.value)}
                  >
                    {siteOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          );
        }

        if (item === 'societe') {
          return (
            <Controller
              key={item}
              control={control}
              name={item}
              render={({ field }) => (
                <FormControl sx={{ flexBasis: "25%", bgcolor: "white" }} fullWidth>
                  <InputLabel id="societe-label">Société</InputLabel>
                  <Select
                    {...field}
                    labelId="societe-label"
                    label="Société"
                    value={field.value || ""}
                    onChange={(event) => field.onChange(event.target.value)}
                  >
                    {societeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          );
        }

        return (
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
        );
      })}
    <Button type="submit" disableElevation variant="contained" size="large">
      Update Details
    </Button>
  </Stack>
);
};

// Main component displaying the table
const AdressBook = ({ isPending: propIsPending, data }) => {
  const [tableData, setTableData] = useState(data ?? []);
  const [showAddForm, setShowAddForm] = useState(false); 
  const [refreshKey, setRefreshKey] = useState(0); 
  const [selectedPus, setSelectedPus] = useState([]); 
  const [openPusDialog, setOpenPusDialog] = useState(false); 
  const [openEmptyDialog, setOpenEmptyDialog] = useState(false); 
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isPending, setIsPending] = useState(false); 
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [pussearch, setPussearch] = useState([]);




  const baseUrl = 'http://localhost:3000';
  const endpoint = 'employe/alluser';


  const fetchFilteredPusData = async () => {
    try {
        const response = await axios.get("http://localhost:3000/pus/fitrer");
        setPussearch(response.data);
        return  response.data; 
    } catch (error) {
        console.error("Error fetching filtered PUS data:", error);
        throw error; // Rethrow error to handle it in the calling function
    }
};


console.log(pussearch);

  const loadData = async () => {
    setIsPending(true);  
    try {
      const fetchedData = await fetchData(baseUrl, endpoint);
      console.log(fetchedData);
      setTableData(fetchedData); 
    } catch (error) {
      console.error("Error loading data:", error); 
    } finally {
      setIsPending(false);  
    }
  };

  useEffect(() => {
    fetchFilteredPusData();
    loadData();  
  }, [refreshKey]);  

  const handlePusClick = (pusData,userId) => {
    console.log("PUS Data Clicked:", pusData); // Debugging statement
    setSelectedPus(pusData);
    setSelectedUserId(userId);
    setOpenPusDialog(true);
  };

  const columns = useMemo(
    () => [
      { accessorKey: "matricule", header: "Matricule" },
      { accessorKey: "nom", header: "Nom" },
      { accessorKey: "prenom", header: "Prenom" },
      { accessorKey: "societe", header: "Société" },
      { accessorKey: "site", header: "Site" },
      {
        accessorKey: "numero",
        header: "numero",
        Cell: ({ row }) => (
          <Typography>
            {/* Access the 'numero' inside the first 'pus' object, or show 'No Number' if not available */}
            {row.original.pus && row.original.pus.length > 0 && row.original.pus[0].number
              ? row.original.pus[0].number
              : "No Number"}
            {" "}
            <IconButton
              color="primary"
              onClick={() => {
                console.log("Row Data:", row);  // Log the row data to the console
                handlePusClick(row.original.pus, row.original.id);
              }}
              aria-label="view pus"
            >
              <VisibilityIcon />
            </IconButton>
          </Typography>
        ),
      }
      
    ],
    []
  );
  
  const table = useMaterialReactTable({
    state: {
      isLoading: isPending,  // Use the local isPending state
      showProgressBars: isPending,
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 5 },
    },
    columns,
    data: tableData, // Use the updated tableData
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
      return <EmployeFormPanel employe={employe} />;
    },
  });

  const handleAddSubmit = (data) => {
    
    console.log("New Employee and SIM Data:", data);
    setTableData((prevData) => [...prevData, data]); // Update table data state
    setShowAddForm(false); // Hide form after submission
    setRefreshKey((prevKey) => prevKey + 1); // Increment refresh key to trigger useEffect
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmployees(baseUrl, id); 
      setRefreshKey((prevKey) => prevKey + 1); 
    } catch (err) {
      console.error('Error deleting employee:', err);
    }
  };

  const handleDeletePUS = async (pusId, userId) => {
    try {
    
      await axios.delete('http://localhost:3000/pusaffectation/delete', {
        data: {id_pus: pusId, id_empl: userId },  
      });
      console.log('PUS deleted successfully');
      setOpenPusDialog(false); 
      setRefreshKey(prevKey => prevKey + 1); 
    } catch (error) {
      console.error('Error deleting PUS:', error);
    }
  };

  return (
    
    <Stack spacing={2}>
      <ImportEx onDataImport={setTableData} />
      <Button 
      variant="contained"
      color="primary"
      onClick={() => setShowAddForm(!showAddForm)}
      sx={{
        width: '50%', // Set width to 50% of the parent container
        maxWidth: '200px', // Optional: Set a maximum width
        padding: '8px 16px', // Adjust padding as needed
        borderRadius: '8px', // Rounded corners
        boxShadow: 3, // Add shadow for a more elevated look
        textTransform: 'none', // Preserve original text case
        '&:hover': {
          backgroundColor: 'primary.dark', // Darker color on hover
          boxShadow: 6, // Enhance shadow on hover
        },
      }}
    >
      {showAddForm ? "Cancel" : "Add Employee and SIM"}
    </Button>
      {showAddForm && (
        <UserForm 
        onSubmit={handleAddSubmit}  
        pusData={pussearch}
         />
      )}
     <div style={{ transform: 'scale(0.93)', transformOrigin: 'top left', overflow: 'auto' }}>
      {/* Apply zoom directly to the container */}
      <MaterialReactTable table={table} />
    </div>
      
      
      {/* Dialog for displaying PUS details */}
      <Dialog open={openPusDialog} onClose={() => setOpenPusDialog(false)} maxWidth="md" fullWidth>
  <DialogTitle>
    Détails PUS
    <IconButton
      edge="end"
      color="inherit"
      onClick={() => setOpenPusDialog(false)}
      aria-label="close"
      sx={{ position: 'absolute', top: 8, right: 8 }}
    >
      <CloseIcon />
    </IconButton>
    <Button
      variant="contained"
      onClick={() => setOpenEmptyDialog(true)} // Open empty dialog
      sx={{
        position: 'absolute',
        top: 8,
        right: 60,
        backgroundColor: '#4caf50',
        '&:hover': {
          backgroundColor: '#388e3c',
        },
      }}
    >
      Ajouter
    </Button>
  </DialogTitle>
  <DialogContent>
    {selectedPus.length > 0 ? (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>PUS ID</TableCell>
            <TableCell>Number</TableCell>
            <TableCell>Type operateur</TableCell>
            <TableCell>Usage Type</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Quota</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedPus.map((pus) => (
            <TableRow key={pus.pus_id}>
              <TableCell>{pus.pus_id}</TableCell>
              <TableCell>{pus.number}</TableCell>
              <TableCell>{pus.type}</TableCell>
              <TableCell>{pus.usage_type}</TableCell>
              <TableCell>{pus.societe}</TableCell>
              <TableCell>{pus.quota}</TableCell>
              <TableCell>
                <IconButton
                  color="error"
                  onClick={() => handleDeletePUS(pus.pus_id, selectedUserId)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ) : (
      <Typography>No PUS data available</Typography>
    )}
  </DialogContent>
</Dialog>

      {/* Empty dialog triggered by ajouter button */}
     

      <Dialog open={openEmptyDialog} onClose={() => setOpenEmptyDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>ajouter un pus</DialogTitle>
        <DialogContent>
        <AffectationSim onSubmit={handleAddSubmit}  idempl={selectedUserId}  />
        </DialogContent>
      </Dialog>

    </Stack>
  );
};

export default AdressBook;
