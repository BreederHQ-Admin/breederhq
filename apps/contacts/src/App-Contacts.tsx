import React from "react";
import { createApiClient } from "@bhq/api";

export function App() {
  const [status, setStatus] = React.useState("ready");
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

  async function testCall() {
    try {
      setStatus("calling");
      const api = createApiClient({ baseUrl });
      await api.get("/health");
      setStatus("ok");
    } catch (e) {
      console.error("API health check failed", e);
      setStatus("error");
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>BreederHQ Contacts</h1>
      <p>Mode: {import.meta.env.MODE}</p>
      <p>API Base URL: {baseUrl}</p>
      <button onClick={testCall}>Test API /health</button>
      <p>Status: {status}</p>
    </div>
  );
}
