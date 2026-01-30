"use client";

import { useMounted } from "@/hooks/useMounted";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfile } from "@/store/slices/auth.slice";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );
  const mounted = useMounted();

  useEffect(() => {
    if (mounted && isAuthenticated && !user && !loading) {
      dispatch(fetchProfile());
    }
  }, [loading, dispatch, user, mounted, isAuthenticated]);

  useEffect(() => {
    if (mounted && !loading && !user && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, router, mounted, user, loading]);

  if (!mounted) {
    return null; // Next.js loading.tsx will handle the loading UI
  }

  return children;
}
