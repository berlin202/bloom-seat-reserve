import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useReservations, type Reservation } from "@/lib/useReservations";

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

const ADMIN_PASSWORD = "admin123";

function Admin() {
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState(false);

  if (!unlocked) {
    return (
      <div className="grid min-h-screen place-items-center bg-[color:var(--bg)] p-4 text-[color:var(--cream)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pwd === ADMIN_PASSWORD) setUnlocked(true);
            else setErr(true);
          }}
          className="w-full max-w-sm rounded-2xl border border-[color:var(--gold)]/30 bg-[color:var(--surface)] p-6 shadow-2xl"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--gold)]">Admin</p>
          <h1 className="mt-1 font-display text-2xl">Enter password</h1>
          <input
            type="password"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
              setErr(false);
            }}
            className="mt-4 w-full rounded-md border border-[color:var(--gold)]/30 bg-black/30 px-3 py-2 outline-none focus:border-[color:var(--gold)]"
          />
          {err && <p className="mt-2 text-sm text-red-300">Incorrect password.</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-[color:var(--gold)] px-4 py-2 text-sm font-semibold text-black hover:brightness-110"
          >
            Unlock
          </button>
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

  return <AdminTable />;
}

function AdminTable() {
  const { reservations, loading } = useReservations();

  const sorted = useMemo(
    () =>
      [...reservations].sort((a, b) => {
        if (a.tableLabel === b.tableLabel) return a.seatNumber - b.seatNumber;
        return a.tableLabel.localeCompare(b.tableLabel);
      }),
    [reservations],
  );

  function exportCsv() {
    const headers = ["Name", "Email", "Table", "Seat"];
    const rows = sorted.map((r) => [r.name, r.email, r.tableLabel, String(r.seatNumber)]);
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
          <div className="flex shrink-0 gap-2">
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
          </div>
        </header>

        <div className="overflow-x-auto rounded-xl border border-[color:var(--gold)]/20 bg-black/30">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/40 text-xs uppercase tracking-wider text-[color:var(--gold)]">
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Table</Th>
                <Th>Seat</Th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <Row key={r.seatId} r={r} />
              ))}
              {!loading && sorted.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[color:var(--cream)]/50">
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

function Row({ r }: { r: Reservation }) {
  return (
    <tr className="border-t border-white/5">
      <td className="px-4 py-3">{r.name}</td>
      <td className="px-4 py-3 text-[color:var(--cream)]/80">{r.email}</td>
      <td className="px-4 py-3">{r.tableLabel}</td>
      <td className="px-4 py-3">{r.seatNumber}</td>
    </tr>
  );
}
