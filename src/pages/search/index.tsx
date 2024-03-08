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
  Divider,
  Fab,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { NextLinkComposed } from "~/components/NextLinkComposed";
import AvatarMenu from "~/components/layout/Header/AvatarMenu";
import { type LayoutProps } from "~/components/layout/Layout";
import { api, type RouterOutputs } from "~/utils/api";
import PostCard from "../../components/PostCard";
import ProtectPage from "../../components/ProtectPage";
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

  type ResultGroup = {
    date: Date;
    results: RouterOutputs["search"];
  };

  const resultGroups = useMemo<{
    today: ResultGroup | null;
    old: ResultGroup[];
  }>(() => {
    const now = new Date();
    const nowWithoutTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    let todayGroup: ResultGroup | null = null;
    const restGroups: ResultGroup[] = [];
    const results = searchQuery.data;

    if (results) {
      for (const result of results) {
        const dateWithoutTime = new Date(
          result.publishDate.getFullYear(),
          result.publishDate.getMonth(),
          result.publishDate.getDate(),
        );

        const isTodayResult =
          dateWithoutTime.getTime() === nowWithoutTime.getTime();
        if (isTodayResult) {
          if (!todayGroup) {
            todayGroup = {
              date: dateWithoutTime,
              results: [result],
            };
          } else {
            todayGroup.results.push(result);
          }
          continue;
        }

        const group = restGroups.find(
          (group) => group.date.getTime() === dateWithoutTime.getTime(),
        );
        if (group) {
          group.results.push(result);
        } else {
          restGroups.push({ date: dateWithoutTime, results: [result] });
        }
      }
    }

    return {
      today: todayGroup,
      old: restGroups.sort((a, b) =>
        a.date.getTime() < b.date.getTime() ? 1 : -1,
      ),
    };
  }, [searchQuery.data]);

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

  const SearchAppBar = () => (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton edge="start" color="inherit" LinkComponent={Link} href="/">
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
  );

  return (
    <ProtectPage>
      <main>
        <SearchAppBar />
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
        <Container maxWidth="sm" disableGutters>
          <Box pt={2}>
            {resultGroups.today ?? resultGroups.old.length ? (
              <>
                {resultGroups.today && (
                  <Grid container columns={2} spacing={2} px={1} py={2} mb={4}>
                    {/* Today posts */}
                    <>
                      <Grid item xs={2} mt={2} mb={2}>
                        <Divider
                          textAlign="center"
                          sx={{
                            fontWeight: "bold",
                            textTransform: "capitalize",
                            bgcolor: blue[100],
                            mx: -1,
                          }}
                        >
                          {resultGroups.today.date.toLocaleDateString("es-AR")}
                        </Divider>
                      </Grid>
                      {resultGroups.today.results.map((post) => (
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
                    </>
                  </Grid>
                )}
                <Grid container columns={2} spacing={2} px={1} pb={8}>
                  {/* Old posts */}
                  {resultGroups.old.length && (
                    <>
                      <Grid item xs={2} p={0}>
                        <Typography variant="h6" textAlign="center">
                          Publicaciones Antiguas
                        </Typography>
                      </Grid>
                      {resultGroups.old.map((group) => (
                        <Fragment key={group.date.getTime()}>
                          <Grid item xs={2} mt={2} mb={2}>
                            <Divider
                              textAlign="center"
                              sx={{
                                fontWeight: "bold",
                                textTransform: "capitalize",
                                bgcolor: blue[100],
                                mx: -1,
                              }}
                            >
                              {group.date.toLocaleDateString("es-AR")}
                            </Divider>
                          </Grid>
                          {group.results.map((post) => (
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
                        </Fragment>
                      ))}
                    </>
                  )}
                </Grid>
              </>
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
                    <Typography
                      textAlign="center"
                      variant="h6"
                      fontWeight="normal"
                    >
                      Sin resultados
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </Box>
        </Container>
      </main>
    </ProtectPage>
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
