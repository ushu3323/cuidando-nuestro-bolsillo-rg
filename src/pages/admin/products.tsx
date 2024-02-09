import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { RouterOutputs, api } from "~/utils/api";
import { NextLinkComposed } from "../../components/NextLinkComposed";

type Data = RouterOutputs["product"]["getAll"][number];

export default function AdminProductsPage() {
  const products = api.product.getAll.useQuery();

  const columns: readonly GridColDef<Data>[] = [
    { field: "name", headerName: "Nombre", flex: 1 },
    {
      field: "category",
      headerName: "Categoria",
      flex: 2,
      valueFormatter: (params) => params.value.name,
    },
  ];

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
          <DataGrid
            autoHeight
            rowSelection={false}
            columns={columns}
            rows={products.data || []}
            loading={products.isLoading}
          />
        </Box>
      </Box>
    </main>
  );
}
