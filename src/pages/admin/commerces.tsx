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
import { type GetServerSideProps } from "next";
import { useMemo, useState } from "react";
import { type AppRouter } from "~/server/api/root";
import { api, type RouterOutputs } from "~/utils/api";
import { NextLinkComposed } from "../../components/NextLinkComposed";
import ProtectPage from "../../components/ProtectPage";
import { getServerAuthSession } from "../../server/auth";

type Data = RouterOutputs["commerce"]["getAll"][number];

export default function AdminCommercesPage() {
  const commerces = api.commerce.getAll.useQuery();

  const createCommerce = api.commerce.create.useMutation();
  const updateCommerce = api.commerce.update.useMutation();
  const deleteCommerce = api.commerce.delete.useMutation();

  const [snackbarMsg, setSnackbarMessage] = useState<string>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const apiUtils = api.useContext();
  const columns = useMemo<MRT_ColumnDef<Data>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nombre",
        enableEditing: true,
      },
      {
        accessorKey: "address",
        header: "Dirección",
        enableEditing: true,
      },
    ],
    [],
  );

  const handleCreateProduct: MRT_TableOptions<Data>["onCreatingRowSave"] =
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    async ({ table, values }) => {
      try {
        await createCommerce.mutateAsync({
          name: values.name as string,
          address: values.address as string,
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
        await updateCommerce.mutateAsync({
          id: row.id,
          name: values.name as string,
          address: values.address as string,
        });
        table.setEditingRow(null);
        await apiUtils.commerce.getAll.invalidate();
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
        `Esta seguro de que desea eliminar el comercio "${row.original.name}"?`,
      )
    ) {
      await deleteCommerce
        .mutateAsync({ id: row.original.id })
        .then(async () => {
          setSnackbarMessage("Comercio eliminado correctamente");
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
    data: commerces.data ?? [],
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
      isLoading: commerces.isLoading,
      isSaving: createCommerce.isLoading || updateCommerce.isLoading,
      showProgressBars: commerces.isFetching,
    },
  });

  return (
    <ProtectPage>
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
            <Typography color="text.primary">Commercios</Typography>
          </Breadcrumbs>
          <Typography component="h1" variant="h4" gutterBottom>
            Comercios
          </Typography>
          <Box py={2} sx={{ width: "100%" }}>
            <MaterialReactTable table={table} />
          </Box>
        </Box>
      </main>
    </ProtectPage>
  );
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (!session || session.user.role !== "ADMIN") {
    return {
      notFound: true
    }
  }

  if (!session.user.TOSAccepted) {
    return {
      redirect: {
        destination: "/accept-tos",
        permanent: false,
      }
    }
  }

  return {
    props: {
      session,
    }
  }
};