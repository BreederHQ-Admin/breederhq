import React from "react";
import { createApiClient } from "@bhq/api";

export function EnvDebug() {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const [rawStatus, setRawStatus] = React.useState<string>("-");
  const [clientStatus, setClientStatus] = React.useState<string>("-");
  const [lastError, setLastError] = React.useState<string>("");

  async function testRaw() {
    setLastError("");
    setRawStatus("calling");
    try {
      const res = await fetch(base + "/healthz");
      const text = await res.text();
      setRawStatus(`${res.status} ${res.statusText} :: ${text}`);
      console.log("[RAW] Fetch", base + "/healthz", res.status, res.statusText, text);
    } catch (e: any) {
      setRawStatus("error");
      setLastError(e?.message ?? String(e));
      console.error("[RAW] Error", e);
    }
  }

  async function testClient() {
    setLastError("");
    setClientStatus("calling");
    try {
      const api = createApiClient({ baseUrl: base });
      const data = await api.get<string>("/healthz");
      setClientStatus("ok :: " + JSON.stringify(data));
      console.log("[CLIENT] OK", data);
    } catch (e: any) {
      setClientStatus("error");
      setLastError(e?.message ?? String(e));
      console.error("[CLIENT] Error", e);
    }
  }

  return (
    <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Env & Health Debug</div>
      <div>API Base URL: <code>{base || "(empty)"}</code></div>
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button onClick={testRaw}>Test RAW /health</button>
        <button onClick={testClient}>Test CLIENT /health</button>
      </div>
      <div style={{ marginTop: 8, fontSize: 14 }}>
        RAW status: <code>{rawStatus}</code><br />
        CLIENT status: <code>{clientStatus}</code>
      </div>
      {lastError && (
        <div style={{ marginTop: 8, color: "crimson", fontSize: 13 }}>
          Error: <code>{lastError}</code>
        </div>
      )}
    </div>
  );
}
