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
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { NextLinkComposed } from "~/components/NextLinkComposed";
import AvatarMenu from "~/components/layout/Header/AvatarMenu";
import { type LayoutProps } from "~/components/layout/Layout";
import { api, type RouterOutputs } from "~/utils/api";
import PostCard from "../../components/PostCard";
import SearchInputDialog from "../../components/SearchInputDialog";

const rtf = new Intl.RelativeTimeFormat("es", {
  style: "long",
  numeric: "auto",
});

function formatTime(date: Date): string {
  const now = new Date();
  const elapsed = date.getTime() - now.getTime();
  const daysElapsed = Math.ceil(elapsed / (24 * 60 * 60 * 1000));
  console.log(daysElapsed)
  if (daysElapsed > -3) {
    return rtf.format(daysElapsed, "days");
  } else if (daysElapsed > -6){
    return date.toLocaleDateString(undefined, {weekday: "long", day: "2-digit"})
  } else {
    return date.toLocaleDateString();
  }
}

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

  const resultGroups = useMemo<ResultGroup[]>(() => {
    const groups: ResultGroup[] = [];
    const results = searchQuery.data;
    if (results) {
      for (const result of results) {
        const dateWithoutTime = new Date(
          result.publishDate.getFullYear(),
          result.publishDate.getMonth(),
          result.publishDate.getDate(),
        );
        console.log({dateWithoutTime})
        const group = groups.find(
          (group) => group.date.getTime() === dateWithoutTime.getTime(),
        );
        if (group) {
          group.results.push(result);
        } else {
          groups.push({ date: dateWithoutTime, results: [result] });
        }
      }
    }

    return groups.sort((a, b) =>
      a.date.getTime() < b.date.getTime() ? 1 : -1,
    );
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
          {resultGroups.length ? (
            <Grid container columns={2} spacing={2} px={1} py={2} mt={6} mb={4}>
              {resultGroups.map((group, index) => (
                <Fragment key={group.date.getTime()}>
                  <Grid item xs={2}>
                    <Typography
                      variant="h6"
                      align="center"
                      textTransform="capitalize"
                    >
                      {formatTime(group.date)}
                    </Typography>
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
                  {index < resultGroups.length-1 && (
                    <Grid item xs={2}>
                      <Divider variant="middle" />
                    </Grid>
                  )}
                </Fragment>
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
