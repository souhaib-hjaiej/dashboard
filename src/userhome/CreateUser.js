import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { TextField, Button, Stack, Modal, Box, useTheme } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import { tokens } from "../theme";
import UserForm from "./UserForm"; // Import du formulaire UserForm

// Panel for editing user details
const UtilisateurFormPanel = (props) => {
  const { row } = props;
  const { _id, ...utilisateur } = props.utilisateur;
  const { control } = useForm({
    defaultValues: utilisateur,
  });

  return (
    <Stack
      component="form"
      method="PUT"
      direction={"row"}
      flexWrap={"wrap"}
      columnGap={3}
      rowGap={3}
    >
      {_.keys(utilisateur).map((item) => (
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
      ))}
      <Button type="submit" disableElevation variant="contained" size="large">
        Update Details
      </Button>
    </Stack>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

// Main component displaying the table
const CreateUser = ({ isPending, data }) => {
  const [tableData, setTableData] = useState(data ?? []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openUserModal, setOpenUserModal] = useState(false); // État pour gérer l'ouverture du modal
  const handleOpenUserModal = () => setOpenUserModal(true);
  const handleCloseUserModal = () => setOpenUserModal(false);

  const onSubmitUser = (newUser) => {
    setTableData([...tableData, newUser]); // Ajouter le nouvel utilisateur aux données du tableau
    handleCloseUserModal(); // Fermer la modale après la soumission
  };

  // Columns definition for the table
  const columns = useMemo(
    () => [
      { accessorKey: "mtricule", header: "Matricule" },
      { accessorKey: "nom", header: "Nom" },
      { accessorKey: "prenom", header: "Prenom" },
      { accessorKey: "role", header: "Role" },
      { accessorKey: "societe", header: "Société" },
      { accessorKey: "site", header: "Site" },
    ],
    []
  );

  const table = useMaterialReactTable({
    state: {
      isLoading: isPending,
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
    renderToolbarAlertBannerContent: ({ table, selectedAlert }) => {
      return (
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
                .rows.map((item) => item.original._id);
              console.log("Selected IDs:", selectedIds);
              table.toggleAllPageRowsSelected(false);
            }}
          >
            Delete selected
          </Button>
        </Stack>
      );
    },
    renderDetailPanel: ({ row }) => {
      const utilisateur = _.omit(row.original, ["__v"]);
      return <UtilisateurFormPanel utilisateur={utilisateur} row={row} />;
    },
  });

  return (
    <Stack spacing={2}>
      {/* Ajouter un bouton pour ouvrir la modale du formulaire d'utilisateur */}
      <Button onClick={handleOpenUserModal} variant="contained" color="primary">
        Ajouter Utilisateur
      </Button>

      <MaterialReactTable table={table} />

      {/* Fenêtre modale pour ajouter un utilisateur */}
      <Modal open={openUserModal} onClose={handleCloseUserModal}>
        <Box sx={modalStyle}>
          <h2>Ajouter un nouvel utilisateur</h2>
          <UserForm onSubmit={onSubmitUser} />
        </Box>
      </Modal>
    </Stack>
  );
};

export default CreateUser;
