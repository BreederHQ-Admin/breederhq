import { makeApi } from "@bhq/api";

// App owns env:
const API_URL = import.meta.env.VITE_API_URL!;
const DEV_TOKEN = import.meta.env.DEV ? (import.meta.env.VITE_ADMIN_TOKEN || "") : "";

// Create the SDK instance configured for this app
export const api = makeApi(API_URL, () => {
  if (!DEV_TOKEN) return null;
  return { Authorization: `Bearer ${DEV_TOKEN}` };
});
