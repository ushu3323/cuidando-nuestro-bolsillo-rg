import {
  ArtTrack,
  Category,
  Fastfood,
  People,
  Storefront,
} from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import StadisticCounterCard from "~/components/admin/StadisticCounterCard";
import { LayoutProps } from "~/components/layout/Layout";

export default function AdminDashboardPage() {
  return (
    <main>
      <Box py={2}>
        <Typography component="h1" variant="h4" gutterBottom>
          Administración
        </Typography>
        <Grid container columns={2} spacing={4} py={2}>
          <Grid item xs={2} md={1}>
            <StadisticCounterCard
              label="Usuarios"
              icon={<People sx={{ fontSize: "calc(2.5rem + 2vw)" }} />}
              value={20302}
            />
          </Grid>
          <Grid item xs={2} md={1}>
            <StadisticCounterCard
              label="Publicaciones"
              icon={<ArtTrack sx={{ fontSize: "calc(2.5rem + 2vw)" }} />}
              value={13}
            />
          </Grid>
          <Grid item xs={2} md={1}>
            <StadisticCounterCard
              label="Comercios"
              icon={<Storefront sx={{ fontSize: "calc(2.5rem + 2vw)" }} />}
              value={242}
            />
          </Grid>
          <Grid item xs={2} md={1}>
            <StadisticCounterCard
              label="Productos"
              icon={<Fastfood sx={{ fontSize: "calc(2.5rem + 2vw)" }} />}
              value={123}
            />
          </Grid>
          <Grid item xs={2} md={1}>
            <StadisticCounterCard
              label="Categorias"
              icon={<Category sx={{ fontSize: "calc(2.5rem + 2vw)" }} />}
              value={123}
            />
          </Grid>
        </Grid>
      </Box>
    </main>
  );
}

AdminDashboardPage.layoutProps = {
  containerProps: {
    maxWidth: "md",
  },
} satisfies LayoutProps;
