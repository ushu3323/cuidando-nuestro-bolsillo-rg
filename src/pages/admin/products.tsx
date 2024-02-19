import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  IconButton,
  Link,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { TRPCClientError } from "@trpc/client";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
} from "material-react-table";
import { useMemo, useState } from "react";
import { type AppRouter } from "~/server/api/root";
import { api, type RouterOutputs } from "~/utils/api";
import { NextLinkComposed } from "../../components/NextLinkComposed";

type Data = RouterOutputs["product"]["getAll"][number];

export default function AdminProductsPage() {
  const products = api.product.getAll.useQuery();
  const categories = api.product.category.getAll.useQuery();

  const createProduct = api.product.create.useMutation();
  const updateProduct = api.product.update.useMutation();
  const deleteProduct = api.product.delete.useMutation();

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
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    async ({ table, values }) => {
      try {
        await createProduct.mutateAsync({
          name: values.name as string,
          categoryId: values["category.id"] as string,
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
          name: values.name as string,
          categoryId: values["category.id"] as string,
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

  const openDeleteConfirmModal = async (row: MRT_Row<Data>) => {
    if (
      window.confirm(
        `Esta seguro de que desea eliminar el producto "${row.original.name}"?`,
      )
    ) {
      await deleteProduct
        .mutateAsync({ id: row.original.id })
        .then(async () => {
          setSnackbarMessage("Producto eliminado correctamente");
          setSnackbarOpen(true);
          await apiUtils.product.getAll.invalidate();
        })
        .catch((error: TRPCClientError<AppRouter>) => {
          setSnackbarMessage(error.message);
          setSnackbarOpen(true);
        });
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
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => void openDeleteConfirmModal(row)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
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
        autoHideDuration={8000}
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
