import React from "react";
import { createApiClient } from "@bhq/api";

export function App() {
  const [status, setStatus] = React.useState("ready");
  async function testCall() {
    try {
      setStatus("calling");
      const api = createApiClient({ baseUrl: import.meta.env.VITE_API_BASE_URL || "" });
      await api.get("/health");
      setStatus("ok");
    } catch (e) {
      setStatus("error");
    }
  }
  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>BreederHQ Contacts</h1>
      <p>ENV: {import.meta.env.MODE}</p>
      <button onClick={testCall}>Test API /health</button>
      <p>Status: {status}</p>
    </div>
  );
}
