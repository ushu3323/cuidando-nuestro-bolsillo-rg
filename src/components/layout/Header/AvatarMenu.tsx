import { Session } from "next-auth";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { type MenuItem } from "primereact/menuitem";
import { useRef } from "react";

export default function AvatarMenu({
  user,
  menuItems,
}: {
  user: Session["user"];
  menuItems: MenuItem[];
}) {
  const menuRef = useRef<Menu>(null);

  return (
    <>
      <Menu ref={menuRef} model={menuItems} popup />
      <Button
        onClick={(event) => menuRef.current?.toggle(event)}
        style={{ height: "100%", padding: 0 }}
        size="small"
        text
      >
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
  );
}
