import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";

const queryClient = new QueryClient();

export const renderWithQueryProvider = (ui: ReactElement) => {
    return (
        <QueryClientProvider client={queryClient}>
           {ui}
        </QueryClientProvider>
    )
}