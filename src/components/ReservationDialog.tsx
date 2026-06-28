import { useState, type FormEvent } from "react";
import { doc, runTransaction, serverTimestamp, collection, getCountFromServer, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { TableDef } from "@/lib/tables";

type Props = {
  seatId: string;
  table: TableDef;
  seatNumber: number;
  onClose: () => void;
  onConfirmed: (info: { name: string; mobile: string }) => void;
};

export function ReservationDialog({ seatId, table, seatNumber, onClose, onConfirmed }: Props) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedMobile = mobile.trim();
    if (!trimmedName || trimmedName.length > 100) {
      setError("Please enter a valid name.");
      return;
    }
    const digits = trimmedMobile.replace(/[^\d]/g, "");
    if (digits.length < 7 || digits.length > 20) {
      setError("Please enter a valid mobile number.");
      return;
    }

    setSubmitting(true);
    try {
      const ref = doc(db, "reservations", seatId);
      const countSnap = await getCountFromServer(collection(db, "reservations"));
      const nextNumber = (countSnap.data().count ?? 0) + 1;
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (snap.exists()) throw new Error("This seat was just reserved by someone else.");
        tx.set(ref, {
          seatId,
          tableId: table.id,
          tableLabel: table.label,
          seatNumber,
          name: trimmedName,
          mobile: trimmedMobile,
          reservationNumber: nextNumber,
          createdAt: serverTimestamp(),
        });
      });
      onConfirmed({ name: trimmedName, mobile: trimmedMobile });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reserve seat. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[color:var(--gold)]/40 bg-[color:var(--surface)] p-6 shadow-2xl">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--gold)]">Reserve seat</p>
          <h2 className="mt-1 font-display text-2xl text-[color:var(--cream)]">
            Table {table.label} · Seat {seatNumber}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full name">
            <input
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-[color:var(--gold)]/30 bg-black/30 px-3 py-2 text-[color:var(--cream)] outline-none focus:border-[color:var(--gold)]"
            />
          </Field>
          <Field label="Mobile number">
            <input
              type="tel"
              required
              inputMode="tel"
              maxLength={30}
              placeholder="+1 555 123 4567"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full rounded-md border border-[color:var(--gold)]/30 bg-black/30 px-3 py-2 text-[color:var(--cream)] outline-none focus:border-[color:var(--gold)]"
            />
          </Field>
          {error && (
            <p className="rounded-md border border-red-500/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-[color:var(--gold)]/30 px-4 py-2 text-sm text-[color:var(--cream)] transition hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-md bg-[color:var(--gold)] px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
            >
              {submitting ? "Reserving…" : "Confirm Reservation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-[color:var(--cream)]/70">
        {label}
      </span>
      {children}
    </label>
  );
}
