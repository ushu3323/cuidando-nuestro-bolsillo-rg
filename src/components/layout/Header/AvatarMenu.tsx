"use client";
import {
  AdminPanelSettings,
  List,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo, useRef, useState, type ReactNode } from "react";

type MenuOption = {
  label: string;
  icon: ReactNode;
  command: () => void;
};

export default function AvatarMenu({ user }: { user: Session["user"] }) {
  const router = useRouter();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const options = useMemo<MenuOption[]>(() => {
    function iif<T>(condition: boolean, value: T) {
      return condition ? [value] : [];
    }

    return [
      {
        label: "Mi Lista de compras",
        icon: <List />,
        command: () => {
          void router.push("/shoplist").finally(() => setMenuOpen(false));
        },
      },
      ...iif<MenuOption>(user.role === "ADMIN", {
        label: "Administración",
        icon: <AdminPanelSettings />,
        command: () => {
          void router.push("/admin").finally(() => setMenuOpen(false));
        },
      }),
      {
        label: "Cerrar sesion",
        icon: <LogoutIcon />,
        command: () => void signOut({ callbackUrl: "/auth/login" }),
      },
    ];
  }, [user]);

  const handleMenu = () => {
    setMenuOpen(true);
  };
  const handleClose = () => setMenuOpen(false);
  return (
    <div>
      <IconButton
        ref={anchorRef}
        size="large"
        aria-label="cuenta del usuario actual"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <Avatar alt={user.name ?? undefined} src={user.image ?? undefined} />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={menuOpen}
        onClose={handleClose}
      >
        <ListItem>
          <ListItemText
            primaryTypographyProps={{ fontWeight: 700 }}
            primary={`Hola, ${user.name}`}
          />
        </ListItem>
        <Divider variant="middle" sx={{ marginBottom: 2 }} />
        {options.map((opt) => (
          <MenuItem key={opt.label} onClick={() => opt.command()}>
            <ListItemIcon>{opt.icon}</ListItemIcon>
            {opt.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
