import { socket } from "@/lib/socket";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useRef } from "react";

export function useSocket() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && user && !isConnectedRef.current) {
      // Connect to socket
      socket.connect();

      socket.on("connect", () => {
        isConnectedRef.current = true;
        // Register user with their ID
        socket.emit("register-user", user._id);
      });

      socket.on("disconnect", () => {
        isConnectedRef.current = false;
      });

      // Cleanup function
      return () => {
        if (user) {
          socket.emit("deregister-user", user._id);
        }
        socket.off("connect");
        socket.off("disconnect");
        socket.disconnect();
        isConnectedRef.current = false;
      };
    }
  }, [isAuthenticated, user, dispatch]);

  return {
    socket,
  };
}