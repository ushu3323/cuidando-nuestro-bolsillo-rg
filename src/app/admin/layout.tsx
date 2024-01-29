import { Container } from "@mui/material";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";
import { authOptions } from "~/server/auth";
import Header from "./Header";

export default async function AdminLayout({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!session || session.user.role !== "ADMIN") {
    return notFound();
  }

  return (
    <>
      <Header />
      <Container className="relative" maxWidth="md">
        {children}
      </Container>
    </>
  );
}
