import React, { useMemo, useState, useEffect } from "react";
import Visibility from "@mui/icons-material/Visibility";
 
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  TextField,
  Button,
  Stack,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  MenuItem,
  useTheme,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import ImportpusEX from "./importPusEx";
import { tokens } from "../theme";
import { fetchPusData, updatePus, deletepus } from "../service/pus";
import SimForm from "./SimForm";




// Panel for editing SIM details
const SimPanel = ({ row, sim, onUpdate }) => {
  const { id } = row.original;
  const { control, handleSubmit } = useForm({
    defaultValues: sim,
  });
  const fieldsToExclude = ["users", "usage_type"];

  const onSubmit = async (updatedSim) => {
    try {
      await updatePus(id, updatedSim);
      onUpdate(); // Callback to refresh data
    } catch (error) {
      console.error('Failed to update PUS:', error);
    }
  };

  return (
    <Stack
    component="form"
    direction={"row"}
    flexWrap={"wrap"}
    columnGap={3}
    rowGap={3}
    onSubmit={handleSubmit(onSubmit)}
  >
    {_.keys(sim)
      .filter((item) => !fieldsToExclude.includes(item)) // Exclude specific fields
      .map((item) => {
        if (item === "societe") {
          return (
            <FormControl key={item} sx={{ flexBasis: "23%", bgcolor: "background.default" }}>
              <InputLabel>{`Select ${_.upperFirst(item)}`}</InputLabel>
              <Controller
                name={item}
                control={control}
                render={({ field }) => (
                  <Select {...field} label={`Select ${_.upperFirst(item)}`}>
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
                )}
              />
            </FormControl>
          );
        } else if (item === "type") {
          return (
            <FormControl key={item} sx={{ flexBasis: "23%", bgcolor: "background.default" }}>
              <InputLabel>Type Operateur</InputLabel>
              <Controller
                name={item}
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Type Operateur">
                    <MenuItem value="Ooredoo">Ooredoo</MenuItem>
                    <MenuItem value="Telecom">Telecom</MenuItem>
                    <MenuItem value="Orange">Orange</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          );
        } else if (item === "usage_type") {
          return (
            <FormControl key={item} sx={{ flexBasis: "23%", bgcolor: "background.default" }}>
              <InputLabel>Type Usage</InputLabel>
              <Controller
                name={item}
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Type Usage">
                    <MenuItem value="Personne">Personne</MenuItem>
                    <MenuItem value="Professionnel">Professionnel</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          );
        } else {
          // Handle all other cases except for "users"
          return (
            <Controller
              key={item}
              name={item}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ flexBasis: "23%", bgcolor: "background.default" }}
                  placeholder={`Enter Your ${_.upperFirst(item)}`}
                />
              )}
            />
          );
        }
      })}
    <Button type="submit" disableElevation variant="contained" size="large">
      Update Details
    </Button>
  </Stack>
  );
};

// Styles for modal
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

// Main component displaying the table
const Sim = ({ isPending, data }) => {
  const [tableData, setTableData] = useState(data ?? []);
  const [historyData, setHistoryData] = useState([]);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openSimModal, setOpenSimModal] = useState(false);

  const handleOpenSimModal = () => setOpenSimModal(true);
  const handleCloseSimModal = () => setOpenSimModal(false);

  const onSubmitSim = async (newSim) => {
    

    const updatedPusData = await fetchPusData();
    setTableData(updatedPusData); 
    handleCloseSimModal(); // Close the modal after submission
  };

  useEffect(() => {
    const getPusData = async () => {
      try {
        const pusData = await fetchPusData(); // Call the function from service
        setTableData(pusData);
console.log(pusData);
      } catch (error) {
        console.error("Failed to load PUS data", error);
      }
    };
    getPusData();
  }, []);
  const handleCloseHistoryModal = () => setOpenHistoryModal(false);

  const handleOpenHistoryModal = (data) => {
    setHistoryData(data.users || []); // Extract the users array
    setOpenHistoryModal(true); // Open the modal
  };

  const columns = useMemo(
    () => [
      { accessorKey: "number", header: "Numero" },
      { accessorKey: "usage_type", header: "Type usage" },
      { accessorKey: "type", header: "Type operateur" },
      { accessorKey: "societe", header: "Type Societe" },
      { accessorKey: "quota", header: "Quota" },
      {
        header: "History",
        accessorKey: "history",
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleOpenHistoryModal(row.original)}
          >
            <Visibility />
          </IconButton>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    state: {
      isLoading: isPending,
      showProgressBars: isPending,
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 40 },
    },
    columns,
    data: tableData, // Use updated tableData
    enableRowSelection: true,
    muiDetailPanelProps: {
      sx: {
        bgcolor: colors.primary[400],
      },
    },
    renderToolbarAlertBannerContent: ({ table, selectedAlert }) => (
      <Stack
        sx={{ p: 2 }}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"flex-start"}
        spacing={2}
      >
        {selectedAlert}
        <Button
          disableElevation
          size="small"
          color="error"
          variant="contained"
          onClick={() => {
            const selectedIds = table
              .getSelectedRowModel()
              .rows.map((item) => item.original.pus_id
            );
            console.log("Selected IDs:", selectedIds);
            table.toggleAllPageRowsSelected(false);
            handleDelete(selectedIds);
          }}
        >
          Delete selected
        </Button>
      </Stack>
    ),
    renderDetailPanel: ({ row }) => {
      const sim = _.omit(row.original, ["__v"]);
      return (
        <SimPanel sim={sim} row={row} onUpdate={() => fetchPusData().then(setTableData)} />
      );
    },
  });

  

  const handleDelete = async (id) => {
    try {
      await deletepus(id); // Call delete service
  
      // Refetch the data from the server after deletion
      const updatedPusData = await fetchPusData(); 
      setTableData(updatedPusData); // Update the table with the refreshed data
    } catch (err) {
      console.error("Error deleting SIM:", err);
    }
  };

  return (
    <Stack spacing={2}>
      <Button
        onClick={handleOpenSimModal}
        variant="contained"
        color="primary"
        sx={{
          width: "50%",
          maxWidth: "200px",
          padding: "8px 16px",
          borderRadius: "8px",
          boxShadow: 3,
          textTransform: "none",
          "&:hover": {
            backgroundColor: "primary.dark",
            boxShadow: 6,
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Ajouter SIM
      </Button>

      <ImportpusEX onDataImport={setTableData} />
      
      <MaterialReactTable table={table} />
    

      <Modal open={openSimModal} onClose={handleCloseSimModal}>
        <Box sx={modalStyle}>
          <h2>Ajouter une nouvelle SIM</h2>
          <SimForm onSubmit={onSubmitSim} />
        </Box>
      </Modal>


      <Modal open={openHistoryModal} onClose={handleCloseHistoryModal}>
     <Box sx={modalStyle}>
    <h2>Historique des utilisateurs du PUS</h2>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell>Prénom</TableCell>
            <TableCell>CIN</TableCell>
            <TableCell>Matricule</TableCell>
            <TableCell>active</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {historyData.map((user) => (
            <TableRow key={user.employee_id}>
              <TableCell>{user.nom}</TableCell>
              <TableCell>{user.prenom}</TableCell>
              <TableCell>{user.cin}</TableCell>
              <TableCell>{user.matricule}</TableCell>
              <TableCell>{user.active}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
</Modal>

    </Stack>
    
  );
};

export default Sim;
