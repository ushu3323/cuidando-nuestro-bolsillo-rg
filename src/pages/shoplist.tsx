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
import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment, useMemo } from "react";
import AvatarMenu from "~/components/layout/Header/AvatarMenu";
import { type LayoutProps } from "~/components/layout/Layout";
import useShoplist from "~/hooks/useShoplist";
import { type ShoplistItem } from "~/providers/shoplistProvider";
import { getServerAuthSessionProps } from "~/server/auth";

export default function ShoplistPage() {
  const { data: session, status } = useSession({ required: true });
  const shoplist = useShoplist();

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

  return (
    <main className="flex h-screen min-h-0 flex-col">
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
                <ListSubheader sx={{ backgroundColor: "grey.100" }}>
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
                      <ListItemButton>
                        <ListItemText
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
    </main>
  );
}

ShoplistPage.layoutProps = {
  showHeader: false,
  containerProps: {
    disableGutters: true,
    maxWidth: false,
  },
} satisfies LayoutProps;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return getServerAuthSessionProps(ctx);
};
