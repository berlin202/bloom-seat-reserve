import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { ADMIN_EMAILS, auth, db } from "@/lib/firebase";
import { useReservations, type Reservation } from "@/lib/useReservations";
import { useReservationsLock, setReservationsLocked } from "@/lib/useReservationsLock";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Passion & Nerve Dinner" },
      { name: "description", content: "Reservation management for the Passion & Nerve Dinner." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

function isAdmin(user: User | null) {
  const email = user?.email?.toLowerCase();
  return !!email && ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email);
}

function Admin() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
    return () => unsub();
  }, []);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pwd);
      if (!isAdmin(cred.user)) {
        await signOut(auth);
        setErr("This account is not an admin.");
      }
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-[color:var(--bg)] text-[color:var(--cream)]/60">
        Loading…
      </div>
    );
  }

  if (!user || !isAdmin(user)) {
    return (
      <div className="grid min-h-screen place-items-center bg-[color:var(--bg)] p-4 text-[color:var(--cream)]">
        <form
          onSubmit={handleSignIn}
          className="w-full max-w-sm rounded-2xl border border-[color:var(--gold)]/30 bg-[color:var(--surface)] p-6 shadow-2xl"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--gold)]">Admin</p>
          <h1 className="mt-1 font-display text-2xl">Sign in</h1>
          <label className="mt-4 block text-xs uppercase tracking-wider text-[color:var(--cream)]/60">
            Email
          </label>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErr(null);
            }}
            className="mt-1 w-full rounded-md border border-[color:var(--gold)]/30 bg-black/30 px-3 py-2 outline-none focus:border-[color:var(--gold)]"
          />
          <label className="mt-3 block text-xs uppercase tracking-wider text-[color:var(--cream)]/60">
            Password
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
              setErr(null);
            }}
            className="mt-1 w-full rounded-md border border-[color:var(--gold)]/30 bg-black/30 px-3 py-2 outline-none focus:border-[color:var(--gold)]"
          />
          {err && <p className="mt-2 text-sm text-red-300">{err}</p>}
          <button
            type="submit"
            disabled={busy}
            className="mt-4 w-full rounded-md bg-[color:var(--gold)] px-4 py-2 text-sm font-semibold text-black hover:brightness-110 disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
          {user && !isAdmin(user) && (
            <button
              type="button"
              onClick={() => signOut(auth)}
              className="mt-2 w-full rounded-md border border-[color:var(--gold)]/30 px-4 py-2 text-xs text-[color:var(--cream)]/80"
            >
              Sign out {user.email}
            </button>
          )}
          <Link
            to="/"
            className="mt-4 block text-center text-xs text-[color:var(--cream)]/60 hover:text-[color:var(--gold)]"
          >
            ← Back to seating map
          </Link>
        </form>
      </div>
    );
  }

  return <AdminTable user={user} />;
}


function AdminTable({ user }: { user: User }) {
  const { reservations, loading } = useReservations();

  const sorted = useMemo(
    () =>
      [...reservations].sort((a, b) => {
        if (a.tableLabel === b.tableLabel) return a.seatNumber - b.seatNumber;
        return a.tableLabel.localeCompare(b.tableLabel);
      }),
    [reservations],
  );

  function formatTime(ts?: { seconds: number; nanoseconds: number }) {
    if (!ts) return "—";
    const d = new Date(ts.seconds * 1000);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  function exportCsv() {
    const headers = ["#", "Name", "Table", "Seat", "Reserved at", "Mobile"];
    const rows = sorted.map((r) => [
      r.reservationNumber ?? "",
      r.name,
      r.tableLabel,
      String(r.seatNumber),
      formatTime(r.createdAt),
      r.mobile ?? r.email ?? "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `passion-nerve-reservations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--cream)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <header className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--gold)]">Admin view</p>
            <h1 className="mt-1 font-display text-3xl">Reservations</h1>
            <p className="text-sm text-[color:var(--cream)]/60">
              {reservations.length} total{loading ? " · loading…" : ""}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <span className="hidden sm:inline text-xs text-[color:var(--cream)]/60">
              {user.email}
            </span>
            <Link
              to="/"
              className="rounded-md border border-[color:var(--gold)]/30 px-3 py-2 text-sm hover:bg-white/5"
            >
              ← Map
            </Link>
            <button
              onClick={exportCsv}
              className="rounded-md bg-[color:var(--gold)] px-3 py-2 text-sm font-semibold text-black hover:brightness-110"
            >
              Export CSV
            </button>
            <button
              onClick={() => signOut(auth)}
              className="rounded-md border border-[color:var(--gold)]/30 px-3 py-2 text-sm hover:bg-white/5"
            >
              Sign out
            </button>
          </div>

        </header>

        <div className="overflow-x-auto rounded-xl border border-[color:var(--gold)]/20 bg-black/30">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/40 text-xs uppercase tracking-wider text-[color:var(--gold)]">
              <tr>
                <Th>#</Th>
                <Th>Name</Th>
                <Th>Mobile</Th>
                <Th>Table</Th>
                <Th>Seat</Th>
                <Th>Reserved at</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <Row key={r.seatId} r={r} formatTime={formatTime} />
              ))}
              {!loading && sorted.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[color:var(--cream)]/50">
                    No reservations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-medium">{children}</th>;
}

function Row({
  r,
  formatTime,
}: {
  r: Reservation;
  formatTime: (ts?: { seconds: number; nanoseconds: number }) => string;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(r.name);
  const [mobile, setMobile] = useState(r.mobile ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setErr(null);
    try {
      await updateDoc(doc(db, "reservations", r.seatId), {
        name: name.trim(),
        mobile: mobile.trim(),
      });
      setEditing(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm(`Delete reservation for Table ${r.tableLabel} · Seat ${r.seatNumber}?`)) return;
    setBusy(true);
    setErr(null);
    try {
      await deleteDoc(doc(db, "reservations", r.seatId));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to delete");
      setBusy(false);
    }
  }

  return (
    <tr className="border-t border-white/5 align-top">
      <td className="px-4 py-3 font-mono text-[color:var(--gold)]">
        {r.reservationNumber ?? "—"}
      </td>
      <td className="px-4 py-3">
        {editing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-[color:var(--gold)]/30 bg-black/40 px-2 py-1 text-sm"
          />
        ) : (
          r.name
        )}
      </td>
      <td className="px-4 py-3 text-[color:var(--cream)]/80">
        {editing ? (
          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full rounded border border-[color:var(--gold)]/30 bg-black/40 px-2 py-1 text-sm"
          />
        ) : (
          r.mobile ?? "—"
        )}
      </td>
      <td className="px-4 py-3">{r.tableLabel}</td>
      <td className="px-4 py-3">{r.seatNumber}</td>
      <td className="px-4 py-3 text-[color:var(--cream)]/80">{formatTime(r.createdAt)}</td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={save}
                  disabled={busy}
                  className="rounded bg-[color:var(--gold)] px-2 py-1 text-xs font-semibold text-black disabled:opacity-50"
                >
                  {busy ? "…" : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setName(r.name);
                    setMobile(r.mobile ?? "");
                    setErr(null);
                  }}
                  className="rounded border border-[color:var(--gold)]/30 px-2 py-1 text-xs"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="rounded border border-[color:var(--gold)]/40 px-2 py-1 text-xs text-[color:var(--gold)] hover:bg-[color:var(--gold)]/10"
                >
                  Edit
                </button>
                <button
                  onClick={remove}
                  disabled={busy}
                  className="rounded border border-red-500/40 px-2 py-1 text-xs text-red-300 hover:bg-red-950/40 disabled:opacity-50"
                >
                  Delete
                </button>
              </>
            )}
          </div>
          {err && <p className="text-xs text-red-300">{err}</p>}
        </div>
      </td>
    </tr>
  );
}

