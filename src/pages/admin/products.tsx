import { Add as AddIcon } from "@mui/icons-material";
import { Box, Breadcrumbs, Button, Link, Typography } from "@mui/material";
import {
  MRT_TableOptions,
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
  const categories = api.product.category.getAll.useQuery();

  const apiUtils = api.useContext();
  const columns = useMemo<MRT_ColumnDef<Data>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nombre",
        enableEditing: true,
      },
      {
        accessorKey: "category.id",
        Cell: ({ row }) => row.original.category.name,
        header: "Categoria",
        editVariant: "select",
        editSelectOptions: categories.data?.map((category) => ({
          label: category.name,
          value: category.id,
        })),
        enableEditing: true,
      },
    ],
    [categories.data],
  );

  const handleCreateProduct: MRT_TableOptions<Data>["onCreatingRowSave"] =
    async ({ table, values }) => {
      await apiUtils.client.product.create.mutate({
        name: values.name,
        categoryId: values["category.id"],
      });
      apiUtils.product.getAll.invalidate();
      table.setCreatingRow(null);
    };

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
    onCreatingRowSave: handleCreateProduct,
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="text"
        startIcon={<AddIcon />}
        onClick={() => table.setCreatingRow(true)}
      >
        Nuevo producto
      </Button>
    ),
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
