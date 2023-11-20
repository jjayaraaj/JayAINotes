"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Props = {
  children: React.ReactNode;
};

// Create a client
const queryClient = new QueryClient();

export default function Provider({ children }: Props) {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
