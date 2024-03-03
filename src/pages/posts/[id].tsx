import {
  ArrowBack as ArrowBackIcon,
  People,
  PlaylistAdd,
  PlaylistRemove,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import LoadingPage from "~/components/LoadingPage";
import AvatarMenu from "~/components/layout/Header/AvatarMenu";
import { type LayoutProps } from "~/components/layout/Layout";
import useShoplist from "~/hooks/useShoplist";
import { api } from "~/utils/api";
import ProtectPage from "../../components/Protected";

export default function PostDetailsPage() {
  const shoplist = useShoplist();
  const { data: session, status } = useSession({ required: true });
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.up("sm"));
  const router = useRouter();

  const isInShoplist =
    shoplist.data.findIndex(
      (item) => item.postId === (router.query.id as string),
    ) !== -1;

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
      <Card elevation={matchesSM ? 2 : 0} sx={{ my: 2 }}>
        <CardHeader
          avatar={<Avatar src={data.author.image ?? undefined}></Avatar>}
          title={data.author.name}
          subheader={formatter.format(data.publishDate)}
        />
        <CardMedia
          component="img"
          height="auto"
          image={data.image}
          aria-hidden="true"
          sx={{
            objectFit: "contain",
            maxHeight: 450,
            bgcolor: "grey.300",
          }}
        />
        <CardContent>
          <Box flexGrow={1} mb={2}>
            {data.colaborations.length > 0 && (
              <Stack direction="row">
                <People
                  fontSize="small"
                  color="primary"
                  sx={{ marginRight: 1 }}
                />
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                >
                  {data.colaborations.length > 1
                    ? `${data.colaborations.length} personas subieron la misma oferta`
                    : "1 persona subio la misma oferta"}
                </Typography>
              </Stack>
            )}
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Categoria {data.product.category.name}
            </Typography>
            <Typography variant="h5" className="line-clamp-2">
              {data.product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {data.commerce.name} - {data.commerce.address}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {data.price.toNumber().toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </Typography>
          </Box>
          <Button
            color={isInShoplist ? "error" : "primary"}
            variant={isInShoplist ? "outlined" : "contained"}
            startIcon={isInShoplist ? <PlaylistRemove /> : <PlaylistAdd />}
            onClick={() => {
              if (isInShoplist) {
                shoplist.remove(router.query.id as string);
              } else {
                shoplist.add({
                  postId: data.id,
                  product: {
                    name: data.product.name,
                    category: data.product.category,
                  },
                  commerce: {
                    name: data.commerce.name,
                    address: data.commerce.address,
                  },
                  price: data.price.toNumber(),
                });
              }
            }}
            fullWidth
          >
            {isInShoplist
              ? "Quitar de lista de compras"
              : "Añadir a lista de compras"}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <ProtectPage>
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
        <Container className="relative" maxWidth="sm" sx={{ px: 0 }}>
          <Box sx={{ my: 0 }}>
            <PostDetailsView />
          </Box>
        </Container>
      </main>
    </ProtectPage>
  );
}

PostDetailsPage.layoutProps = {
  showHeader: false,
  containerProps: {
    disableGutters: true,
    maxWidth: false,
  },
} satisfies LayoutProps;
