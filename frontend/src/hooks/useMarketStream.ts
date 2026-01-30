// frontend/src/hooks/useMarketStream.ts
import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useAppDispatch } from "@/store/hooks";
import { LivePriceUpdate } from "@/types/stock.types";
import { updateLivePrices } from "@/store/slices/stocks.slice";

export function useMarketStream() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit("subscribe-market");

    // Type the incoming data
    const handleMarketUpdate = (data: LivePriceUpdate[]) => {
      dispatch(updateLivePrices(data));
    };

    socket.on("market-update", handleMarketUpdate);

    return () => {
      socket.emit("unsubscribe-market");
      socket.off("market-update", handleMarketUpdate);
    };
  }, [dispatch]);
}
