import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  CircularProgress,
  Container,
  IconButton,
  Snackbar,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { type TRPCClientError } from "@trpc/client";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { useSession } from "next-auth/react";
import router from "next/router";
import { useMemo, useState } from "react";
import ProtectPage from "~/components/ProtectPage";
import AvatarMenu from "~/components/layout/Header/AvatarMenu";
import { type LayoutProps } from "~/components/layout/Layout";
import { api, type RouterOutputs } from "~/utils/api";
import { type AppRouter } from "../../server/api/root";

function CustomAppBar() {
  const { data: session, status } = useSession();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => void router.back()}
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" flexGrow={1}>
          Mis Publicaciones
        </Typography>
        {status === "loading" ? (
          <CircularProgress />
        ) : (
          session && (
            <div className="flex items-center gap-5">
              <AvatarMenu user={session.user} />
            </div>
          )
        )}
      </Toolbar>
    </AppBar>
  );
}

export default function MyPostsPage() {
  const {
    data: posts,
    isLoading: isLoadingPosts,
    isFetching: isFetchingPosts,
  } = api.post.getOwnPosts.useQuery();
  const { mutateAsync: deletePost, isLoading: isDeletingPost } =
    api.post.deleteOwnPost.useMutation();
  const apiUtils = api.useContext();

  const [snackbar, setSnackbar] = useState({
    message: "",
    open: false,
    persistent: false,
  });

  type Post = RouterOutputs["post"]["getOwnPosts"][number];

  const showSnackbar = (message: string, opts = { persistent: false }) =>
    setSnackbar({ message, open: true, persistent: opts.persistent || false });

  const openDeleteConfirmModal = async (row: MRT_Row<Post>) => {
    if (
      window.confirm(
        "Esta seguro de que desea eliminar la publicación?\n" +
          `Producto: "${row.original.product.name}"\n` +
          `En: "${row.original.commerce.name} - ${row.original.commerce.address}"`,
      )
    ) {
      showSnackbar("Eliminando publicación...", { persistent: true });
      await deletePost({ id: row.original.id })
        .then(async () => {
          showSnackbar("Publicación eliminada correctamente");
          await apiUtils.post.getOwnPosts.invalidate();
        })
        .catch((error: TRPCClientError<AppRouter>) => {
          showSnackbar(error.message);
        });
    }
  };

  const columns = useMemo<MRT_ColumnDef<Post>[]>(
    () => [
      {
        accessorKey: "image",
        header: "Imagen",
        maxSize: 100,
        Cell: ({ row }) => (
          <Box display="flex" justifyContent="center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={row.original.image}
              alt={row.original.product.name}
              height={50}
            />
          </Box>
        ),
      },
      {
        accessorKey: "product.name",
        header: "Nombre",
      },
      {
        accessorFn: ({ commerce }) => `${commerce.name} - ${commerce.address}`,
        header: "Comercio",
      },
      {
        accessorFn: (data) =>
          data.price.toNumber().toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          }),
        header: "Precio",
      },
      {
        accessorKey: "publishDate",
        Cell: ({ row }) => row.original.publishDate.toLocaleString(),
        header: "Fecha Publicación",
      },
    ],
    [],
  );
  const table = useMaterialReactTable({
    columns,
    data: posts ?? [],
    getRowId: (row) => row.id,
    enableFullScreenToggle: false,
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Tooltip title="Borrar">
          <IconButton
            color="error"
            onClick={() => void openDeleteConfirmModal(row)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    displayColumnDefOptions: {
      "mrt-row-actions": {
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
    },
    state: {
      isLoading: isLoadingPosts,
      showProgressBars: isFetchingPosts,
      isSaving: isDeletingPost,
    },
    localization: {
      ...MRT_Localization_ES,
      noRecordsToDisplay: "No hay publicaciones para mostrar",
    },
  });

  return (
    <ProtectPage>
      <main className="flex h-screen min-h-screen w-full flex-col">
        <CustomAppBar />
        <Container
          className="flex-grow"
          maxWidth="sm"
          sx={{ my: 2 }}
          disableGutters
        >
          <MaterialReactTable table={table} />
        </Container>
        <Snackbar
          open={snackbar.open}
          onClose={() =>
            setSnackbar(({ message }) => ({
              message,
              open: false,
              persistent: false,
            }))
          }
          message={snackbar.message}
          autoHideDuration={snackbar.persistent ? null : 5000}
        />
      </main>
    </ProtectPage>
  );
}

MyPostsPage.layoutProps = {
  showHeader: false,
  containerProps: {
    disableGutters: true,
    maxWidth: false,
  },
} satisfies LayoutProps;
