import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Button, Stack, Modal, Box, useTheme } from "@mui/material";
import SimForm from "./SimForm"; // Importer le formulaire SimForm
import ImportEx from "./ImportEx";
import { tokens } from "../theme";

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

const Sim = ({ isPending, data }) => {
  const [tableData, setTableData] = useState(data ?? []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Fonction de soumission pour ajouter la SIM
  const onSubmit = (newSim) => {
    setTableData([...tableData, newSim]);
    handleClose(); // Fermer la modale après soumission
  };

  // Définition des colonnes
  const columns = useMemo(
    () => [
      { accessorKey: "numero", header: "Numero" },
      { accessorKey: "typeUsage", header: "Type Usage" },
      { accessorKey: "type", header: "Type" },
      { accessorKey: "quota", header: "Quota" },
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
    data: tableData, // Utiliser les données du tableau
    enableRowSelection: true,
  });

  return (
    <Stack spacing={2}>
      <Button onClick={handleOpen} variant="contained" color="primary">
        Ajouter SIM
      </Button>

      <ImportEx onDataImport={setTableData} />
      <MaterialReactTable table={table} />

      {/* Fenêtre modale pour le formulaire d'ajout de SIM */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <h2>Ajouter une nouvelle SIM</h2>
          <SimForm onSubmit={onSubmit} />
        </Box>
      </Modal>
    </Stack>
  );
};

export default Sim;
