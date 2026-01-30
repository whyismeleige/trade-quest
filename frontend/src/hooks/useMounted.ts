import { useEffect, useState } from "react";

export function useMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    return () => setIsMounted(false);
  }, []);  return isMounted;
}