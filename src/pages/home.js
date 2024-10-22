import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Home = ({ isPending, data }) => {
  const [tableData, setTableData] = useState(data ?? []);
  const navigate = useNavigate();

  useEffect(() => {
    const postData = async () => {
      try {
        const response = await axios.post('http://localhost:3000/collablist');
        const updatedData = response.data.data; // Assuming your API response has a data field
        console.log(updatedData); // Log the fetched data for debugging
        setTableData(updatedData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };
    postData();
  }, []);

  const handleRowClick = (row) => {
    navigate(`/details`, { state: { data: row.original } });
  };
  const renderSpecialties = (specialties) => {
    // Check if specialties exist and are an array
    if (!Array.isArray(specialties) || specialties.length === 0) {
      return "No specialties"; // Fallback if not an array or empty
    }
  
    // Directly map over specialties and create a string representation
    return specialties
      .map((specialty) => {
        const badges = specialty.badge.join(", ");
        return `${specialty.name}`;
      })
      .join(", ");
  };
  const columns = useMemo(
    () => [
      { accessorKey: "nom", header: "Nom" },
      { accessorKey: "prenom", header: "Prénom" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "num", header: "Numéro" },
      {
        accessorKey: "specialites",
        header: "Spécialités",
        // Use a custom render function instead of cell
        accessorFn: (row) => renderSpecialties(row.specialites),
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
    data: tableData,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => handleRowClick(row),
      style: { cursor: "pointer" },
    }),
  });
  
  return (
    <Stack spacing={2}>
      <MaterialReactTable table={table} />
    </Stack>
  );
  };
  
  export default Home;
  