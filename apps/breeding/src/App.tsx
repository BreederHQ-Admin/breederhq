// apps/breeding/src/App.tsx
import { useEffect, useState } from "react";

type Breeding = {
  id: string;
  femaleId?: string | null;
  maleId?: string | null;
  status?: string | null;
  plannedOvulationDate?: string | null;
  plannedWhelpDate?: string | null;
};

export default function App() {
  const [data, setData] = useState<Breeding[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const r = await fetch("/api/breeding?limit=5&fields=id,femaleId,maleId,status,plannedOvulationDate,plannedWhelpDate");
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json = await r.json();
      setData(Array.isArray(json?.data) ? json.data : []);
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main
      style={{
        padding: 24,
        maxWidth: 800,
        margin: "0 auto",
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
      }}
    >
      <h1 style={{ marginBottom: 16 }}>BreederHQ Breeding</h1>
      <p style={{ marginBottom: 16 }}>
        Fetches from <code>/api/breeding</code> via the Vercel proxy.
      </p>

      <button
        onClick={load}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #ddd",
          cursor: "pointer",
          marginBottom: 16,
        }}
      >
        {loading ? "Loading…" : "Reload"}
      </button>

      {error && (
        <div style={{ color: "crimson", marginBottom: 16 }}>
          Error: {error}
        </div>
      )}

      <ul style={{ listStyle: "none", paddingLeft: 0, display: "grid", gap: 8 }}>
        {data.map((b) => (
          <li
            key={b.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 8,
              padding: 12,
              background: "#fff",
            }}
          >
            <div><strong>ID:</strong> {b.id}</div>
            <div><strong>Female:</strong> {b.femaleId ?? "—"}</div>
            <div><strong>Male:</strong> {b.maleId ?? "—"}</div>
            <div><strong>Status:</strong> {b.status ?? "—"}</div>
            <div><strong>Ovulation:</strong> {b.plannedOvulationDate ?? "—"}</div>
            <div><strong>Whelp:</strong> {b.plannedWhelpDate ?? "—"}</div>
          </li>
        ))}
        {!loading && !error && data.length === 0 && (
          <li style={{ color: "#666" }}>No records returned.</li>
        )}
      </ul>
    </main>
  );
}
