"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "../components/Main";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true,
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 5,
            retry: 3,
        },
    },
});
export default function Home() {
    return (
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    );
}
