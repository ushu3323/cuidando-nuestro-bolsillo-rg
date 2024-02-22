import {
  Container,
  Slide,
  useScrollTrigger,
  type ContainerProps,
} from "@mui/material";
import type { PropsWithChildren } from "react";
import React from "react";
import Header from "./Header/Header";

export interface LayoutProps {
  containerProps?: ContainerProps;
  /** @default true */
  showHeader?: boolean;
  fab?: () => React.JSX.Element;
}

export default function Layout({
  children,
  containerProps,
  showHeader = true,
  fab,
}: PropsWithChildren<LayoutProps>) {
  const trigger = useScrollTrigger();

  return (
    <>
      {showHeader && <Header />}
      <Container className="relative" maxWidth="sm" {...containerProps}>
        {children}
      </Container>
      {fab && (
        <Slide appear={false} direction="up" in={!trigger}>
          {fab()}
        </Slide>
      )}
    </>
  );
}
