import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Container,
  Fab,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import LoadingPage from "~/components/LoadingPage";
import { NextLinkComposed } from "~/components/NextLinkComposed";
import AvatarMenu from "~/components/layout/Header/AvatarMenu";
import { type LayoutProps } from "~/components/layout/Layout";
import { api } from "~/utils/api";

export default function PostDetailsPage() {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const formatter = new Intl.DateTimeFormat("es-AR", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const { data, isLoading, error } = api.post.getById.useQuery(
    {
      id: router.query.id as string,
    },
    {
      retry(failureCount, error) {
        switch (error.data?.code) {
          case "NOT_FOUND":
          case "BAD_REQUEST":
            return false;
          default:
            return true;
        }
      },
    },
  );

  const PostDetailsView = () => {
    if (isLoading) {
      return <LoadingPage />;
    }

    if (!data) {
      switch (error?.data?.code) {
        case "NOT_FOUND":
          return (
            <div className="flex min-h-[100dvh]">El producto no existe</div>
          );
        case "BAD_REQUEST":
          return <div className="flex min-h-[100dvh]">BAD_REQUEST</div>;
        default:
          return null;
      }
    }
    return (
      <Card>
        <CardHeader
          avatar={<Avatar src={data.author.image ?? undefined}></Avatar>}
          title={data.author.name}
          subheader={formatter.format(data.publishDate)}
        />
        <CardMedia
          component="img"
          height="300"
          image={data.image}
          aria-hidden="true"
        />
        <CardContent>
          <Box flexGrow={1}>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Categoria {data.product.category.name}
            </Typography>
            <Typography variant="h5" className="line-clamp-2">
              {data.product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {data.commerce.name}
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary">
            {data.price.toNumber().toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <main>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => router.back()}
          >
            <ArrowBackIcon />
          </IconButton>
          <div className="flex-1" />
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
      <Container className="relative" maxWidth="sm">
        <Box sx={{ my: 2 }}>
          <PostDetailsView />
        </Box>
      </Container>
    </main>
  );
}

PostDetailsPage.layoutProps = {
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
