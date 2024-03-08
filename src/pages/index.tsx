import { Add } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Fab,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState, type FormEvent } from "react";
import { NextLinkComposed } from "../components/NextLinkComposed";
import PostCard from "../components/PostCard";
import ProtectPage from "../components/ProtectPage";
import { type LayoutProps } from "../components/layout/Layout";
import { api } from "../utils/api";

export default function HomePage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const dailyQuery = api.post.getDailyBestOffers.useQuery();
  const { data: usersCount, isLoading: isLoadingUsersCount } =
    api.user.getCount.useQuery();
  const { data: usersRanking, isLoading: isLoadingUsersRanking } =
    api.user.getTodayRanking.useQuery();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void router.push({
      pathname: "/search",
      query: {
        query: searchText,
      },
    });
  };

  const DailyPostsGrid = () => {
    if (!dailyQuery.data?.length) {
      return (
        <Box
          minHeight={200}
          mx="auto"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {dailyQuery.isLoading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography textAlign="center" variant="subtitle1">
                No hay ofertas el dia de hoy...
              </Typography>
              <Typography variant="subtitle2" color="InactiveCaptionText">
                Se el primero en publicar!
              </Typography>
            </>
          )}
        </Box>
      );
    }
    return (
      <Grid container columns={2} spacing={2} px={1}>
        {dailyQuery.data.map((post) => (
          <Grid key={post.id} item xs={1}>
            <PostCard
              post={{
                ...post,
                price: post.price.toNumber(),
                colaborationCount: post._count.colaborations,
              }}
              href={`/posts/${post.id}`}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  const UsersRankingTable = () => {
    return (
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Typography variant="h6" component="div" p={2} align="center">
          Ranking de colaboraciones diarias
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" padding="checkbox">
                Puesto
              </TableCell>
              <TableCell
                align="center"
                width={2}
                padding="checkbox"
              ></TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell align="center">Aportes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersRanking?.map(({ id, image, name, postsCount }, i) => (
              <TableRow key={id}>
                <TableCell align="center">{i + 1}</TableCell>
                <TableCell>
                  <Avatar
                    sx={{ width: 24, height: 24 }}
                    src={image ?? undefined}
                  />
                </TableCell>
                <TableCell>{name}</TableCell>
                <TableCell align="center">{postsCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <ProtectPage>
      <main>
        <Box p={2}>
          <Box mb={5}>
            <form onSubmit={handleSubmit}>
              <TextField
                id="search"
                label="¿Que estas buscando?"
                className="mb-5"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                disabled={searchText.length === 0}
                fullWidth
                onClick={() => void router.push(`/search?query=${searchText}`)}
              >
                Buscar
              </Button>
            </form>
          </Box>
          <Box my={2}>
            <Typography component="p" variant="h6" gutterBottom>
              Usuarios registrados: {isLoadingUsersCount ? "--" : usersCount}
            </Typography>
          </Box>
          <UsersRankingTable />
          <Typography component="h2" variant="h5" fontWeight={700} gutterBottom>
            Mejores ofertas de hoy
          </Typography>
        </Box>
        <DailyPostsGrid />
      </main>
    </ProtectPage>
  );
}

HomePage.layoutProps = {
  containerProps: { sx: { p: 0 } },
  fab: () => (
    <Fab
      color="secondary"
      variant="extended"
      sx={{ position: "fixed", bottom: 28, right: 15 }}
      component={NextLinkComposed}
      to={{
        pathname: "/posts/new",
      }}
      prefetch
    >
      <Add sx={{ mr: 1 }} />
      <span>Publicar</span>
    </Fab>
  ),
} satisfies LayoutProps;
