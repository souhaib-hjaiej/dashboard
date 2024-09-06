import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { TextField, Button, Stack, Modal, Box, useTheme } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import ImportEx from "./ImportEx";
import { tokens } from "../theme";

import SimForm from "./SimForm";

// Panel for editing sim details
const SimPanel = (props) => {
  const { row } = props;
  const { _id, ...sim } = props.sim;
  const { control } = useForm({
    defaultValues: sim,
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
      {_.keys(sim).map((item) => (
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
const Sim = ({ isPending, data }) => {
  const [tableData, setTableData] = useState(data ?? []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openSimModal, setOpenSimModal] = useState(false); // État pour gérer l'ouverture du modal
  const handleOpenSimModal = () => setOpenSimModal(true);
  const handleCloseSimModal = () => setOpenSimModal(false);

  const onSubmitSim = (newSim) => {
    setTableData([...tableData, newSim]); // Ajouter la nouvelle SIM aux données du tableau
    handleCloseSimModal(); // Fermer la modale après la soumission
  };

  // Columns definition for the table
  const columns = useMemo(
    () => [
      { accessorKey: "numero", header: "Numero" },
      { accessorKey: "typeUsage", header: "TypeUsage" },
      { accessorKey: "type", header: "Type" },
      { accessorKey: "quota", header: "Quota" },
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
      const sim = _.omit(row.original, ["__v"]);
      return <SimPanel sim={sim} row={row} />;
    },
  });

  return (
    <Stack spacing={2}>
      {/* Ajouter un bouton pour ouvrir la modale du formulaire de SIM */}
      <Button onClick={handleOpenSimModal} variant="contained" color="primary">
        Ajouter SIM
      </Button>

      <ImportEx onDataImport={setTableData} />
      <MaterialReactTable table={table} />

      {/* Fenêtre modale pour ajouter une SIM */}
      <Modal open={openSimModal} onClose={handleCloseSimModal}>
        <Box sx={modalStyle}>
          <h2>Ajouter une nouvelle SIM</h2>
          <SimForm onSubmit={onSubmitSim} />
        </Box>
      </Modal>
    </Stack>
  );
};

export default Sim;
