import { createTRPCReact } from "@trpc/react-query";

// Stub type for serverless mode - no backend tRPC connection
type AppRouter = any;

export const trpc = createTRPCReact<AppRouter>();
