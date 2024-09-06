import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Button, Stack,TextField, useTheme } from "@mui/material";
import { useForm , Controller } from "react-hook-form";
import _ from "lodash";
import ImportEx from "./ImportEx";
import { tokens } from "../theme";
import AddEmployeSimForm from "./AddEmployeSimForm";

// Panel for editing employee details
const EmployeFormPanel = ({ employe }) => {
  const { _id, ...employeeData } = employe;
  const { control, handleSubmit, reset } = useForm({
    defaultValues: employeeData,
  });

  const submitHandler = (data) => {
    // Handle form submission logic here
    console.log("Updated Data:", data);
    reset(); // Reset form after submission
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

// Main component displaying the table
const AdressBook = ({ isPending, data }) => {
  const [tableData, setTableData] = useState(data ?? []);
  const [showAddForm, setShowAddForm] = useState(false); // State to toggle form visibility
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Columns definition for the table
  const columns = useMemo(
    () => [
      { accessorKey: "matricule", header: "Matricule" },
      { accessorKey: "nom", header: "Nom" },
      { accessorKey: "prenom", header: "Prenom" },
      { accessorKey: "numero", header: "Numero" },
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
              .rows.map((item) => item.original._id);
            console.log("Selected IDs:", selectedIds);
            // Implement delete functionality here
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
    // Logic to add new employee and SIM
    console.log("New Employee and SIM Data:", data);
    setShowAddForm(false); // Hide form after submission
  };

  return (
    <Stack spacing={2}>
      <ImportEx onDataImport={setTableData} />
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? "Cancel" : "Add Employee and SIM"}
      </Button>
      {showAddForm && (
        <AddEmployeSimForm onSubmit={handleAddSubmit} />
      )}
      <MaterialReactTable table={table} />
    </Stack>
  );
};

export default AdressBook;
