// src/bootstrapFetch.ts
const API_URL = import.meta.env.VITE_API_URL;
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || "";

// Only run this in development and only if both are present
if (import.meta.env.DEV && API_URL && ADMIN_TOKEN) {
  const rawFetch = window.fetch.bind(window);

  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();

    // Only attach to calls that target your API root
    if (url.startsWith(API_URL)) {
      const headers = new Headers(init?.headers);
      headers.set("Authorization", `Bearer ${ADMIN_TOKEN}`);
      return rawFetch(input, { ...init, headers, credentials: "include" });
    }

    return rawFetch(input, init);
  };
}
