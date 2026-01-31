"use client";
import { Provider } from "react-redux";
import { store } from "../../store";
import { ReactNode } from "react";
import { ThemeProvider } from "./theme.provider";
import SocketProvider from "./socket.provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <SocketProvider>{children}</SocketProvider>
      </ThemeProvider>
    </Provider>
  );
}