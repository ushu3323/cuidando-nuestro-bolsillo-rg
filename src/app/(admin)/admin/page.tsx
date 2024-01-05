import {
  ArtTrack,
  Category,
  Fastfood,
  People,
  Storefront,
} from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import DashboardCounterCard from "./components/DashboardStatsCard";

export default function AdminDashboard() {
  return (
    <main>
      <Box py={2}>
        <Typography component="h1" variant="h4" gutterBottom>
          Administración
        </Typography>
        <Grid container columns={2} spacing={4}>
          <Grid item xs={2} md={1}>
            <DashboardCounterCard
              label="Usuarios"
              icon={<People sx={{ fontSize: "calc(2.5rem + 2vw)" }} />}
              value={20302}
            />
          </Grid>
          <Grid item xs={2} md={1}>
            <DashboardCounterCard
              label="Publicaciones"
              icon={<ArtTrack sx={{ fontSize: "calc(2.5rem + 2vw)" }} />}
              value={13}
            />
          </Grid>
          <Grid item xs={2} md={1}>
            <DashboardCounterCard
              label="Comercios"
              icon={<Storefront sx={{ fontSize: "calc(2.5rem + 2vw)" }} />}
              value={242}
            />
          </Grid>
          <Grid item xs={2} md={1}>
            <DashboardCounterCard
              label="Productos"
              icon={<Fastfood sx={{ fontSize: "calc(2.5rem + 2vw)" }} />}
              value={123}
            />
          </Grid>
          <Grid item xs={2} md={1}>
            <DashboardCounterCard
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
