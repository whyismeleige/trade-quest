"use client";


import { useSocket } from "@/hooks/useSocket";
import { ReactNode } from "react";

export default function SocketProvider({ children }: { children: ReactNode }) {
  // Initialize socket connection
  useSocket();

  return <>{children}</>;
}