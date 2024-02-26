import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  CircularProgress,
  Container,
  Fab,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NextLinkComposed } from "~/components/NextLinkComposed";
import PostCard from "~/components/PostCard";
import AvatarMenu from "~/components/layout/Header/AvatarMenu";
import { type LayoutProps } from "~/components/layout/Layout";
import { api } from "~/utils/api";
import SearchInputDialog from "../../components/SearchInputDialog";

export default function SearchPage() {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const query =
    typeof router.query.query === "undefined" ? "" : String(router.query.query);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [searchText, setSearchText] = useState<string>(query);

  const searchQuery = api.search.useQuery(
    { query },
    { enabled: query.length > 0 },
  );

  useEffect(() => {
    if (router.isReady) {
      if (query) {
        setSearchText(query);
      } else {
        void router.replace("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, query]);

  return (
    <main>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            LinkComponent={Link}
            href="/"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            component="div"
            variant="h6"
            fontWeight={500}
            sx={{ flex: 1, ml: 2 }}
          >
            {query}
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDialogVisible(true)}
          >
            <SearchIcon />
          </IconButton>
          {status === "loading" ? (
            <CircularProgress></CircularProgress>
          ) : (
            session && (
              <div className="flex items-center gap-5">
                <AvatarMenu user={session.user} />
              </div>
            )
          )}
        </Toolbar>
      </AppBar>
      <SearchInputDialog
        open={dialogVisible}
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        onSubmit={() =>
          void router.push({
            pathname: "/search",
            query: {
              query: searchText,
            },
          })
        }
        onClose={() => setDialogVisible(false)}
      />
      <Container className="relative" maxWidth="sm" sx={{ px: 0 }}>
        <Box py={2}>
          {router.isReady && (
            <Typography
              component="h2"
              variant="h5"
              fontWeight={700}
              gutterBottom
            >
              Resultados de {`"${query}"`}
            </Typography>
          )}
          {searchQuery.data?.length ? (
            <Grid container columns={2} spacing={2} px={1} py={2}>
              {searchQuery.data.map((post) => (
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
          ) : (
            <Box
              minHeight={200}
              mx="auto"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              {searchQuery.isLoading ? (
                <CircularProgress />
              ) : (
                <>
                  <Typography textAlign="center" variant="subtitle1">
                    Sin resultados
                  </Typography>
                </>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </main>
  );
}

SearchPage.layoutProps = {
  showHeader: false,
  containerProps: {
    disableGutters: true,
    maxWidth: false,
  },
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
      <AddIcon sx={{ mr: 1 }} />
      <span>Publicar</span>
    </Fab>
  ),
} satisfies LayoutProps;
