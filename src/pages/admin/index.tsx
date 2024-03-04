import {
  ArtTrack,
  Category,
  Fastfood,
  People,
  Storefront,
} from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import { type GetServerSideProps } from "next";
import StadisticCounterCard from "~/components/admin/StadisticCounterCard";
import { type LayoutProps } from "~/components/layout/Layout";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";
import ProtectPage from "../../components/Protected";

export default function AdminDashboardPage() {
  const { data: usersCount } = api.user.getCount.useQuery();
  const { data: postsCount } = api.post.getCount.useQuery();
  const { data: commercesCount } = api.commerce.getCount.useQuery();
  const { data: productsCount } = api.product.getCount.useQuery();
  const { data: productsCategoryCount } =
    api.product.category.getCount.useQuery();
  return (
    <ProtectPage>
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
                value={usersCount}
              />
            </Grid>
            <Grid item xs={2} md={1}>
              <StadisticCounterCard
                label="Publicaciones"
                icon={<ArtTrack sx={{ fontSize: "calc(2.5rem + 2vw)" }} />}
                value={postsCount}
              />
            </Grid>
            <Grid item xs={2} md={1}>
              <StadisticCounterCard
                label="Comercios"
                icon={<Storefront sx={{ fontSize: "calc(2.5rem + 2vw)" }} />}
                value={commercesCount}
              />
            </Grid>
            <Grid item xs={2} md={1}>
              <StadisticCounterCard
                label="Productos"
                icon={<Fastfood sx={{ fontSize: "calc(2.5rem + 2vw)" }} />}
                value={productsCount}
                href="/admin/products"
              />
            </Grid>
            <Grid item xs={2} md={1}>
              <StadisticCounterCard
                label="Categorias"
                icon={<Category sx={{ fontSize: "calc(2.5rem + 2vw)" }} />}
                value={productsCategoryCount}
              />
            </Grid>
          </Grid>
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

AdminDashboardPage.layoutProps = {
  containerProps: {
    maxWidth: "md",
  },
} satisfies LayoutProps;
