import { Container, ContainerProps } from "@mui/material";
import { type PropsWithChildren } from "react";
import Header from "./Header/Header";

interface LayoutProps {
  containerProps?: ContainerProps;
}

export default function Layout({
  children,
  containerProps,
}: PropsWithChildren<LayoutProps>) {
  return (
    <>
      <Header />
      <Container maxWidth="sm" {...containerProps}>
        {children}
      </Container>
    </>
  );
}
