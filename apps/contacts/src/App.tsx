// apps/contacts/src/App.tsx
import { useEffect, useMemo, useState } from "react";

type Contact = {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
const ENV_TOKEN = import.meta.env.VITE_ADMIN_TOKEN as string | undefined;
const LS_KEY = "bhq_admin_token";

export default function App() {
  const [token, setToken] = useState<string>(() => {
    return localStorage.getItem(LS_KEY) ?? ENV_TOKEN ?? "";
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const apiReady = useMemo(() => Boolean(BASE_URL && token.trim()), [token]);

  useEffect(() => {
    // persist token
    localStorage.setItem(LS_KEY, token);
  }, [token]);

  async function fetchContacts() {
    if (!BASE_URL) {
      setErr("VITE_API_BASE_URL not set");
      return;
    }
    if (!token.trim()) {
      setErr("Admin token required");
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${BASE_URL}/contacts`, {
        headers: { "x-admin-token": token },
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = (await res.json()) as Contact[];
      setContacts(data);
    } catch (e: any) {
      setErr(e.message ?? "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }

  async function createContact(e: React.FormEvent) {
    e.preventDefault();
    if (!BASE_URL) return setErr("VITE_API_BASE_URL not set");
    if (!token.trim()) return setErr("Admin token required");

    const body = { firstName, lastName, email, phone: phone || undefined };

    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${BASE_URL}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Create failed: ${res.status} ${text}`);
      }
      // refresh list
      await fetchContacts();
      setFirst("");
      setLast("");
      setEmail("");
      setPhone("");
    } catch (e: any) {
      setErr(e.message ?? "Failed to create contact");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>BreederHQ — Contacts (dev)</h1>

      {!BASE_URL && (
        <div style={{ padding: 12, background: "#fff3cd", border: "1px solid #ffe69c", borderRadius: 8, marginBottom: 12 }}>
          <strong>Missing env:</strong> set <code>VITE_API_BASE_URL</code> in <code>apps/contacts/.env.local</code> (e.g.{" "}
          <code>http://localhost:6001/api/v1</code>).
        </div>
      )}

      <fieldset style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 16 }}>
        <legend style={{ padding: "0 6px" }}>Admin token</legend>
        <input
          placeholder="x-admin-token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button onClick={fetchContacts} disabled={!apiReady || loading} style={btnStyle}>
            {loading ? "Loading…" : "Load contacts"}
          </button>
          <button
            onClick={() => {
              setToken("");
              localStorage.removeItem(LS_KEY);
            }}
            style={{ ...btnStyle, background: "#eee", color: "#333", borderColor: "#ddd" }}
          >
            Clear token
          </button>
        </div>
      </fieldset>

      {err && (
        <div style={{ padding: 10, background: "#fde2e1", border: "1px solid #f5b5b2", color: "#611a15", borderRadius: 8, marginBottom: 16 }}>
          {err}
        </div>
      )}

      <form onSubmit={createContact} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Add contact</h3>
        <div style={rowStyle}>
          <input value={firstName} onChange={(e) => setFirst(e.target.value)} placeholder="First name" required style={inputStyle} />
          <input value={lastName} onChange={(e) => setLast(e.target.value)} placeholder="Last name" required style={inputStyle} />
        </div>
        <div style={rowStyle}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required style={inputStyle} />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" style={inputStyle} />
        </div>
        <button type="submit" disabled={!apiReady || loading} style={btnStyle}>
          {loading ? "Saving…" : "Create"}
        </button>
      </form>

      <h3>Contacts</h3>
      <div style={{ display: "grid", gap: 8 }}>
        {contacts.length === 0 && <div style={{ color: "#666" }}>No contacts yet.</div>}
        {contacts.map((c) => (
          <div key={c.id} style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
            <div style={{ fontWeight: 600 }}>{c.firstName} {c.lastName}</div>
            <div style={{ fontSize: 14, color: "#555" }}>{c.email}{c.phone ? ` · ${c.phone}` : ""}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
              created {new Date(c.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const rowStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 };
const inputStyle: React.CSSProperties = { padding: 10, borderRadius: 8, border: "1px solid #ccc", width: "100%" };
const btnStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  background: "#1f7aec",
  color: "white",
  border: "1px solid #1a67c3",
  cursor: "pointer"
};
