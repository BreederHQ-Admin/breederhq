import React from "react";
import { createApiClient } from "@bhq/api";

export function AppContacts() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const healthPath = import.meta.env.VITE_API_HEALTH_PATH || "/healthz";

  const [rawStatus, setRawStatus] = React.useState<string>("-");
  const [clientStatus, setClientStatus] = React.useState<string>("-");
  const [lastError, setLastError] = React.useState<string>("");

  async function testApiHealth() {
    const url = baseUrl.replace(/\/+$/, "") + healthPath;
    console.log("TEST HEALTH →", url);
    setLastError("");
    setRawStatus("calling");
    try {
      const res = await fetch(url, { cache: "no-store" });
      const text = await res.text();
      console.log("HEALTH RESPONSE", res.status, res.statusText, text);
      setRawStatus(`${res.status} ${res.statusText} :: ${text}`);
    } catch (e: any) {
      console.error("HEALTH ERROR", e);
      setRawStatus("error");
      setLastError(e?.message ?? String(e));
    }
  }

  async function testApiClient() {
    const url = baseUrl.replace(/\/+$/, "") + healthPath;
    console.log("TEST CLIENT →", url);
    setLastError("");
    setClientStatus("calling");
    try {
      const api = createApiClient({ baseUrl });
      const data = await api.get<string>(healthPath);
      console.log("CLIENT RESPONSE", data);
      setClientStatus("ok :: " + JSON.stringify(data));
    } catch (e: any) {
      console.error("CLIENT ERROR", e);
      setClientStatus("error");
      setLastError(e?.message ?? String(e));
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>BreederHQ Contacts</h1>
      <p>Mode: {import.meta.env.MODE}</p>
      <p>API Base URL: <code>{baseUrl || "(empty)"}</code></p>
      <p>Health Path: <code>{healthPath}</code></p>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button onClick={testApiHealth}>Test RAW health</button>
        <button onClick={testApiClient}>Test CLIENT health</button>
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

export default AppContacts;
