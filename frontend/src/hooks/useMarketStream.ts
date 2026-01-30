import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useAppDispatch } from "@/store/hooks";
import { updateLivePrices } from "@/store/slices/stocks.slice";


export function useMarketStream() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 1. Connect and Subscribe
    if (!socket.connected) socket.connect();
    
    // Emit event to Backend to join "market-data" room
    socket.emit("subscribe-market");
    console.log("📡 Subscribed to Market Data Stream");

    // 2. Listen for Updates
    const handleMarketUpdate = (data: any[]) => {
      // Dispatch bulk update to Redux
      dispatch(updateLivePrices(data));
    };

    socket.on("market-update", handleMarketUpdate);

    // 3. Cleanup on Unmount
    return () => {
      socket.emit("unsubscribe-market");
      socket.off("market-update", handleMarketUpdate);
      console.log("🔕 Unsubscribed from Market Stream");
    };
  }, [dispatch]);
}