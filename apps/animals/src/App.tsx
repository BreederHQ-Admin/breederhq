// apps/animals/src/App.tsx
import { useEffect, useState } from "react";

type Animal = {
  id: string;
  name?: string | null;
  species?: string | null;
  sex?: string | null;
  birthDate?: string | null;
};

export default function App() {
  const [data, setData] = useState<Animal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const r = await fetch("/api/animals?limit=5&fields=id,name,species,sex,birthDate");
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
      <h1 style={{ marginBottom: 16 }}>BreederHQ Animals</h1>
      <p style={{ marginBottom: 16 }}>
        Starter page using <code>@bhq/ui</code> and <code>@bhq/mock</code>. The button below hits the Vercel proxy at <code>/api/animals</code>.
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
        {data.map((a) => (
          <li
            key={a.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 8,
              padding: 12,
              background: "#fff",
            }}
          >
            <div><strong>ID:</strong> {a.id}</div>
            <div><strong>Name:</strong> {a.name ?? "—"}</div>
            <div><strong>Species:</strong> {a.species ?? "—"}</div>
            <div><strong>Sex:</strong> {a.sex ?? "—"}</div>
            <div><strong>Birth:</strong> {a.birthDate ?? "—"}</div>
          </li>
        ))}
        {!loading && !error && data.length === 0 && (
          <li style={{ color: "#666" }}>No animals returned.</li>
        )}
      </ul>
    </main>
  );
}
