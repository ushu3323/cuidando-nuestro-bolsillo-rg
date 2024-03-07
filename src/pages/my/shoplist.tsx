import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import {
  AppBar,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Fragment, useMemo } from "react";
import AvatarMenu from "~/components/layout/Header/AvatarMenu";
import { type LayoutProps } from "~/components/layout/Layout";
import useShoplist from "~/hooks/useShoplist";
import { type ShoplistItem } from "~/providers/shoplistProvider";
import { getServerAuthSessionProps } from "~/server/auth";
import ProtectPage from "../../components/Protected";

export default function MyShoplistPage() {
  const { data: session, status } = useSession({ required: true });
  const shoplist = useShoplist();
  const router = useRouter();

  const categories = useMemo<Record<string, ShoplistItem[]>>(() => {
    const obj: Record<string, ShoplistItem[]> = {};
    for (const item of shoplist.data) {
      const category = item.product.category.name;
      if (category in obj) {
        obj[category]!.push(item);
      } else {
        obj[category] = [item];
      }
    }
    return obj;
  }, [shoplist.data]);

  const total = useMemo<number>(() => {
    return shoplist.data.reduce((sum, item) => sum + item.price, 0);
  }, [shoplist.data]);

  return (
    <ProtectPage>
      <main className="flex h-screen min-h-0 flex-col">
        <AppBar position="sticky">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => void router.back()}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" flexGrow={1}>
              Mi lista de compras
            </Typography>
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
        <Container
          className="flex min-h-0 flex-grow flex-col"
          maxWidth="sm"
          disableGutters
        >
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              "& ul": { padding: 0 },
            }}
            subheader={<li />}
          >
            {Object.entries(categories).map(([category, items]) => (
              <li key={category}>
                <ul>
                  <ListSubheader
                    sx={{ backgroundColor: blue[100], fontWeight: "bold" }}
                  >
                    {category}
                  </ListSubheader>
                  {items.map((item) => (
                    <Fragment key={item.postId}>
                      <ListItem
                        secondaryAction={
                          <Checkbox
                            checked={item.done}
                            onChange={() =>
                              shoplist.setDone(item.postId, !item.done)
                            }
                            size="medium"
                          />
                        }
                        disablePadding
                      >
                        <ListItemButton
                          onClick={() =>
                            void router.push({
                              pathname: "/posts/[id]",
                              query: { id: item.postId },
                            })
                          }
                        >
                          <ListItemText
                            sx={{
                              textDecoration: item.done
                                ? "line-through"
                                : "none",
                            }}
                            primary={item.product.name}
                            secondary={`${item.commerce.name} ${item.commerce.address}`}
                          />
                          <ListItemText
                            secondary={item.price.toLocaleString("es-AR", {
                              style: "currency",
                              currency: "ARS",
                            })}
                            sx={{ textAlign: "end", mr: 2 }}
                          />
                        </ListItemButton>
                      </ListItem>
                      <Divider variant="middle" />
                    </Fragment>
                  ))}
                </ul>
              </li>
            ))}
          </List>
        </Container>
        <AppBar color="transparent" position="sticky">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6">
              {total.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </Typography>
          </Toolbar>
        </AppBar>
      </main>
    </ProtectPage>
  );
}

MyShoplistPage.layoutProps = {
  showHeader: false,
  containerProps: {
    disableGutters: true,
    maxWidth: false,
  },
} satisfies LayoutProps;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return getServerAuthSessionProps(ctx);
};
