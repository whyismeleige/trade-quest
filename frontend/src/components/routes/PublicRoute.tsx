"use client";
import { useMounted } from "@/hooks/useMounted";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function PublicRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const mounted = useMounted();

  useEffect(() => {
    if (mounted && isAuthenticated && user) {
      router.replace(`/dashboard`);
    }
  }, [mounted, isAuthenticated, router, user]);

  // Don't render anything while checking auth or redirecting
  if (!mounted || loading ) {
    return null;
  }

  return children;
}