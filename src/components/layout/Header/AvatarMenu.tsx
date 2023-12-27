import { Logout as LogoutIcon } from "@mui/icons-material";
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
import { useRef, useState, type ReactNode } from "react";

interface MenuOption {
  label: string;
  icon: ReactNode;
  command: () => void;
}

export default function AvatarMenu({ user }: { user: Session["user"] }) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const options: MenuOption[] = [
    {
      label: "Cerrar sesion",
      icon: <LogoutIcon />,
      command: () => void signOut(),
    },
  ];

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

  /* return (
    <>
      <Menu ref={menuRef} model={menuItems} popup />
      <Button
        onClick={(event) => menuRef.current?.toggle(event)}
        style={{ height: "100%", padding: 0 }}
        size="small"
        text
      >
        <div className="pe-5 text-black">{user.name}</div>
        <Avatar
          image={user.image ?? undefined}
          label={user.name?.charAt(0)}
          className="me-3"
          size="large"
          shape="circle"
        />
        <i className="pi pi-angle-down"></i>
      </Button>
    </>
  ); */
}
