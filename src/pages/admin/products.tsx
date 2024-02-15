import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo } from "react";
import { RouterOutputs, api } from "~/utils/api";
import { NextLinkComposed } from "../../components/NextLinkComposed";

type Data = RouterOutputs["product"]["getAll"][number];

export default function AdminProductsPage() {
  const products = api.product.getAll.useQuery();

  const columns = useMemo<MRT_ColumnDef<Data>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nombre",
      },
      {
        accessorKey: "category.id",
        Cell: ({ row }) => row.original.category.name,
        header: "Categoria",
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: products.data || [],
    getRowId: (row) => row.id,
    createDisplayMode: "row",
    editDisplayMode: "row",
    positionActionsColumn: "last",
    displayColumnDefOptions: {
      "mrt-row-actions": {
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
    },
    enableFullScreenToggle: false,
    state: {
      isLoading: products.isLoading,
      showProgressBars: products.isFetching,
    },
  });

  return (
    <main>
      <Box py={2}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            component={NextLinkComposed}
            to="/admin"
          >
            Admin
          </Link>
          <Typography color="text.primary">Productos</Typography>
        </Breadcrumbs>
        <Typography component="h1" variant="h4" gutterBottom>
          Productos
        </Typography>
        <Box py={2} sx={{ width: "100%" }}>
          <MaterialReactTable table={table} />
        </Box>
      </Box>
    </main>
  );
}
