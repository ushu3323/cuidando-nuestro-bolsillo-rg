import { CircularProgress } from "@mui/material";
import { type ReactNode } from "react";

export default function LoadingPage({ children }: { children?: ReactNode }) {
  return (
    <div className="fixed left-0 top-0 flex h-full w-full flex-col items-center justify-center">
      <CircularProgress />
      {children}
    </div>
  );
}
