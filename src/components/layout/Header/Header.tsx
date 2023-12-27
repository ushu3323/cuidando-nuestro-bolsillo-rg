import { AppBar, CircularProgress, Toolbar, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import AvatarMenu from "./AvatarMenu";

export default function Header() {
  const { data, status } = useSession();
  const user = data?.user;

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h5" fontWeight={700} sx={{ flexGrow: 1 }}>
          Precios RG
        </Typography>
        {status === "loading" ? (
          <CircularProgress></CircularProgress>
        ) : (
          user && (
            <div className="flex items-center gap-5">
              <AvatarMenu user={user} />
            </div>
          )
        )}
      </Toolbar>
    </AppBar>
  );
}
