import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SeatingMap } from "@/components/SeatingMap";
import { ReservationDialog } from "@/components/ReservationDialog";
import { ConfirmationToast } from "@/components/ConfirmationToast";
import { RESERVABLE_SEATS } from "@/lib/tables";
import { useReservations, type Reservation } from "@/lib/useReservations";
import type { TableDef } from "@/lib/tables";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Passion & Nerve Dinner — Reserve Your Seat" },
      {
        name: "description",
        content:
          "Reserve your seat for the Passion & Nerve Dinner on June 29, 2026. Interactive seating map with live availability.",
      },
      { property: "og:title", content: "Passion & Nerve Dinner — Reserve Your Seat" },
      {
        property: "og:description",
        content: "An evening of passion and nerve. Pick your seat, June 29, 2026 · 6:00 PM.",
      },
    ],
  }),
  component: Index,
});

type Pending = { seatId: string; table: TableDef; seatNumber: number } | null;

function Index() {
  const { reservations, loading, error } = useReservations();
  const [pending, setPending] = useState<Pending>(null);
  const [viewing, setViewing] = useState<Reservation | null>(null);
  const [confirmation, setConfirmation] = useState<
    | { name: string; tableLabel: string; seatNumber: number }
    | null
  >(null);

  const reservedSet = useMemo(
    () => new Set(reservations.map((r) => r.seatId)),
    [reservations],
  );
  const reservationsBySeat = useMemo(
    () => new Map(reservations.map((r) => [r.seatId, r] as const)),
    [reservations],
  );

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--cream)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gold)]">
              June 29, 2026 · 6:00 PM
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-5xl text-[color:var(--cream)]">
              Passion &amp; Nerve Dinner
            </h1>
            <p className="mt-2 max-w-xl text-sm text-[color:var(--cream)]/70">
              Choose your seat from the floor plan below. Reservations are saved live —
              if a seat turns red while you decide, simply pick another.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <div className="text-right">
              <p className="font-display text-3xl text-[color:var(--gold)]">
                {reservations.length}
                <span className="text-[color:var(--cream)]/50"> / {RESERVABLE_SEATS}</span>
              </p>
              <p className="text-xs uppercase tracking-wider text-[color:var(--cream)]/60">
                seats reserved
              </p>
            </div>
            <Link
              to="/admin"
              aria-label="Admin sign in"
              title="Admin"
              className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--gold)]/40 text-[color:var(--gold)] transition hover:bg-[color:var(--gold)]/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </Link>
          </div>
        </header>

        <Legend />

        {error && (
          <p className="mt-4 rounded-md border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            Live updates unavailable: {error}
          </p>
        )}

        <div className="mt-6">
          <SeatingMap
            reservedSeatIds={reservedSet}
            reservationsBySeat={reservationsBySeat}
            selectedSeatId={pending?.seatId ?? null}
            onSelectSeat={(seatId, table, seatNumber) =>
              setPending({ seatId, table, seatNumber })
            }
            onShowReserved={(r) => setViewing(r)}
          />
        </div>

        {loading && (
          <p className="mt-4 text-center text-xs text-[color:var(--cream)]/50">
            Loading live availability…
          </p>
        )}

        <p className="mt-6 text-center text-xs text-[color:var(--cream)]/40">
          Tip: hover any seat for details. Tap a green seat to reserve, or a red one to see who has it.
        </p>
      </div>

      {viewing && <ReservedInfo reservation={viewing} onClose={() => setViewing(null)} />}

      {pending && (
        <ReservationDialog
          seatId={pending.seatId}
          table={pending.table}
          seatNumber={pending.seatNumber}
          onClose={() => setPending(null)}
          onConfirmed={({ name }) => {
            setConfirmation({
              name,
              tableLabel: pending.table.label,
              seatNumber: pending.seatNumber,
            });
            setPending(null);
          }}
        />
      )}

      {confirmation && (
        <ConfirmationToast
          name={confirmation.name || "Guest"}
          tableLabel={confirmation.tableLabel}
          seatNumber={confirmation.seatNumber}
          onClose={() => setConfirmation(null)}
        />
      )}
    </div>
  );
}

function Legend() {
  const items: { color: string; label: string }[] = [
    { color: "#22c55e", label: "Available" },
    { color: "#eab308", label: "Selected" },
    { color: "#dc2626", label: "Reserved" },
    { color: "#6b6258", label: "Restricted" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-[color:var(--gold)]/20 bg-black/30 px-4 py-3 text-xs">
      <span className="uppercase tracking-wider text-[color:var(--gold)]">Guide</span>
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-full border border-black/40"
            style={{ background: it.color }}
          />
          <span className="text-[color:var(--cream)]/80">{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function ReservedInfo({ reservation, onClose }: { reservation: Reservation; onClose: () => void }) {
  const when = reservation.createdAt
    ? new Date(reservation.createdAt.seconds * 1000).toLocaleString()
    : "—";
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-[color:var(--gold)]/40 bg-[color:var(--bg)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--gold)]">
          Reserved seat
        </p>
        <h3 className="mt-2 font-display text-2xl text-[color:var(--cream)]">
          Table {reservation.tableLabel} · Seat {reservation.seatNumber}
        </h3>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[color:var(--cream)]/60">Name</dt>
            <dd className="text-[color:var(--cream)] text-right">{reservation.name}</dd>
          </div>
          {reservation.reservationNumber != null && (
            <div className="flex justify-between gap-4">
              <dt className="text-[color:var(--cream)]/60">Reservation #</dt>
              <dd className="text-[color:var(--cream)] text-right">{reservation.reservationNumber}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt className="text-[color:var(--cream)]/60">Reserved at</dt>
            <dd className="text-[color:var(--cream)] text-right">{when}</dd>
          </div>
        </dl>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-md border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/10 px-4 py-2 text-sm uppercase tracking-wider text-[color:var(--gold)] transition hover:bg-[color:var(--gold)]/20"
        >
          Close
        </button>
      </div>
    </div>
  );
}
