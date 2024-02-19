import { Add as AddIcon } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Snackbar,
  Typography,
} from "@mui/material";
import { TRPCClientError } from "@trpc/client";
import {
  MRT_TableOptions,
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo, useState } from "react";
import { RouterOutputs, api } from "~/utils/api";
import { NextLinkComposed } from "../../components/NextLinkComposed";

type Data = RouterOutputs["product"]["getAll"][number];

export default function AdminProductsPage() {
  const products = api.product.getAll.useQuery();
  const categories = api.product.category.getAll.useQuery();
  const createProduct = api.product.create.useMutation();
  const updateProduct = api.product.update.useMutation();

  const [snackbarMsg, setSnackbarMessage] = useState<string>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const apiUtils = api.useContext();
  const columns = useMemo<MRT_ColumnDef<Data>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
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
      try {
        await createProduct.mutateAsync({
          name: values.name,
          categoryId: values["category.id"],
        });
        table.setCreatingRow(null);
        await apiUtils.product.getAll.invalidate();
        table.setPageIndex(table.getPageCount() - 1);
      } catch (error) {
        if (error instanceof TRPCClientError) {
          setSnackbarMessage(error.message);
          setSnackbarOpen(true);
        }
        throw error;
      }
    };

  const handleUpdateProduct: MRT_TableOptions<Data>["onEditingRowSave"] =
    async ({ table, values, row }) => {
      try {
        await updateProduct.mutateAsync({
          id: row.id,
          name: values.name,
          categoryId: values["category.id"],
        });
        table.setEditingRow(null);
        await apiUtils.product.getAll.invalidate();
      } catch (error) {
        if (error instanceof TRPCClientError) {
          setSnackbarMessage(error.message);
          setSnackbarOpen(true);
        }
        throw error;
      }
    };

  const table = useMaterialReactTable({
    columns,
    data: products.data || [],
    getRowId: (row) => row.id,
    initialState: {
      columnVisibility: {
        id: false,
      },
      sorting: [{ id: "id", desc: true }],
    },
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
    enableEditing: true,
    onEditingRowSave: handleUpdateProduct,
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
      isSaving: createProduct.isLoading || updateProduct.isLoading,
      showProgressBars: products.isFetching,
    },
  });

  return (
    <main>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      />
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
