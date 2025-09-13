import { useEffect, useMemo, useState } from "react";
import { contacts } from '@bhq/api'

type SortKey = "name" | "createdAt" | "updatedAt";
type SortOrder = "asc" | "desc";

function useQueryState(key: string, initial = "") {
  const [value, setValue] = useState<string>(() => {
    const u = new URL(window.location.href);
    return u.searchParams.get(key) ?? initial;
  });
  useEffect(() => {
    const u = new URL(window.location.href);
    if (value) u.searchParams.set(key, value);
    else u.searchParams.delete(key);
    window.history.replaceState({}, "", u.toString());
  }, [key, value]);
  return [value, setValue] as const;
}

function useNumberState(key: string, initial = 0) {
  const [value, setValue] = useState<number>(() => {
    const u = new URL(window.location.href);
    const raw = u.searchParams.get(key);
    return raw ? Number(raw) : initial;
  });
  useEffect(() => {
    const u = new URL(window.location.href);
    if (value) u.searchParams.set(key, String(value));
    else u.searchParams.delete(key);
    window.history.replaceState({}, "", u.toString());
  }, [key, value]);
  return [value, setValue] as const;
}

export default function AppContacts() {
  const [query, setQuery] = useQueryState("q", "");
  const [sort, setSort] = useQueryState("sort", "createdAt");
  const [order, setOrder] = useQueryState("order", "desc");
  const [limit, setLimit] = useNumberState("limit", 25);
  const [offset, setOffset] = useNumberState("offset", 0);

  const [page, setPage] = useState<{ rows: Contact[]; total: number; loading: boolean; error: string | null }>({
    rows: [],
    total: 0,
    loading: false,
    error: null,
  });
  const [active, setActive] = useState<Contact | null>(null);

  useEffect(() => {
    let alive = true;
    setPage((p) => ({ ...p, loading: true, error: null }));
    contacts
      .list({ query, sort: sort as SortKey, order: order as SortOrder, limit, offset })
      .then((res) => {
        if (!alive) return;
        setPage({ rows: res.data, total: res.total, loading: false, error: null });
      })
      .catch((e) => {
        if (!alive) return;
        setPage({ rows: [], total: 0, loading: false, error: e.message || "Failed to load" });
      });
    return () => {
      alive = false;
    };
  }, [query, sort, order, limit, offset]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(page.total / limit)), [page.total, limit]);
  const currentPage = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);

  function gotoPage(n: number) {
    const clamped = Math.max(1, Math.min(totalPages, n));
    setOffset((clamped - 1) * limit);
  }

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <section className="mx-auto max-w-7xl p-6">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Contacts</h1>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => {
                setOffset(0);
                setQuery(e.target.value);
              }}
              placeholder="Search name, email, or phone"
              className="h-10 w-72 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-800 dark:bg-neutral-900"
            />
            <select
              value={sort}
              onChange={(e) => {
                setOffset(0);
                setSort(e.target.value);
              }}
              className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <option value="name">Name</option>
              <option value="createdAt">Created</option>
              <option value="updatedAt">Updated</option>
            </select>
            <select
              value={order}
              onChange={(e) => {
                setOffset(0);
                setOrder(e.target.value);
              }}
              className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
            <select
              value={String(limit)}
              onChange={(e) => {
                setOffset(0);
                setLimit(Number(e.target.value));
              }}
              className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </header>

        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          {page.loading ? (
            <div className="p-6 text-sm text-neutral-500">Loading...</div>
          ) : page.error ? (
            <div className="p-6 text-sm text-red-500">{page.error}</div>
          ) : page.rows.length === 0 ? (
            <div className="p-6 text-sm text-neutral-500">No contacts found.</div>
          ) : (
            <ul role="list" className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {page.rows.map((c) => {
                const name = [c.firstName, c.lastName].filter(Boolean).join(" ") || "(no name)";
                return (
                  <li
                    key={c.id}
                    className="grid cursor-pointer grid-cols-[2fr_2fr_1.5fr_1fr_1fr] items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    onClick={() => setActive(c)}
                    title="View details"
                  >
                    <div className="truncate font-medium">{name}</div>
                    <div className="truncate text-sm text-neutral-500">{c.primaryEmail || "—"}</div>
                    <div className="truncate text-sm text-neutral-500">{c.primaryPhone || "—"}</div>
                    <div className="truncate text-sm">{c.organizationCount ?? 0} orgs</div>
                    <div className="truncate text-xs text-neutral-500">{new Date(c.updatedAt).toLocaleString()}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="mt-4 flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Showing {Math.min(page.rows.length, limit)} of {page.total} • Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => gotoPage(1)}
              className="rounded-md border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              « First
            </button>
            <button
              onClick={() => gotoPage(currentPage - 1)}
              className="rounded-md border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              disabled={currentPage <= 1}
            >
              ‹ Prev
            </button>
            <button
              onClick={() => gotoPage(currentPage + 1)}
              className="rounded-md border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              disabled={currentPage >= totalPages}
            >
              Next ›
            </button>
            <button
              onClick={() => gotoPage(totalPages)}
              className="rounded-md border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Last »
            </button>
          </div>
        </footer>
      </section>

      <ContactDrawer contact={active} onClose={() => setActive(null)} />
    </main>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3">
      <div className="text-sm font-medium text-neutral-500">{label}</div>
      <div className="text-sm">{value || "—"}</div>
    </div>
  );
}

function ContactDrawer({ contact, onClose }: { contact: Contact | null; onClose: () => void }) {
  const [full, setFull] = useState<Contact | null>(contact);

  useEffect(() => {
    let alive = true;
    if (!contact) return;
    contacts
      .get(contact.id)
      .then((c) => {
        if (!alive) return;
        setFull(c);
      })
      .catch(() => {
        if (!alive) return;
      });
    return () => {
      alive = false;
    };
  }, [contact?.id]);

  if (!contact) return null;

  const name = [full?.firstName, full?.lastName].filter(Boolean).join(" ") || "(no name)";

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="h-full w-full bg-black/40" onClick={onClose} />
      <aside className="h-full w-full max-w-md overflow-y-auto border-l border-neutral-200 bg-white p-5 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
        <header className="mb-4 flex items-start justify-between">
          <h2 className="text-xl font-semibold">{name}</h2>
          <button
            onClick={onClose}
            className="rounded-md border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            aria-label="Close"
          >
            Close
          </button>
        </header>

        <section className="space-y-3">
          <Row label="Email" value={full?.primaryEmail} />
          <Row label="Phone" value={full?.primaryPhone} />
          <Row label="Organizations" value={String(full?.organizationCount ?? 0)} />
          <Row label="Created" value={new Date(full!.createdAt).toLocaleString()} />
          <Row label="Updated" value={new Date(full!.updatedAt).toLocaleString()} />
        </section>

        <hr className="my-5 border-neutral-200 dark:border-neutral-800" />

        <section className="space-y-2">
          <h3 className="text-sm font-semibold">Tags</h3>
          <p className="text-sm text-neutral-500">Placeholder. Will populate after tag endpoints go live.</p>
        </section>

        <section className="mt-4 space-y-2">
          <h3 className="text-sm font-semibold">Custom Fields</h3>
          <p className="text-sm text-neutral-500">Placeholder. Will render from the custom fields schema.</p>
        </section>
      </aside>
    </div>
  );
}
