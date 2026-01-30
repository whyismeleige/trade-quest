// frontend/src/hooks/useLeagueSocket.ts (CREATE THIS FILE)
import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useAppDispatch } from "@/store/hooks";
import { handleLeagueSocketUpdate } from "@/store/slices/leagues.slice";

export function useLeagueSocket() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on("league_update", (data) => {
      dispatch(handleLeagueSocketUpdate(data));
      // Show toast for user's own updates
      // You can check if userId matches current user
    });

    return () => {
      socket.off("league_update");
    };
  }, [dispatch]);
}