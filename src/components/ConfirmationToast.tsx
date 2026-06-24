type Props = {
  name: string;
  tableLabel: string;
  seatNumber: number;
  onClose: () => void;
};

export function ConfirmationToast({ name, tableLabel, seatNumber, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[color:var(--gold)]/40 bg-[color:var(--surface)] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[color:var(--gold)]/15 text-2xl text-[color:var(--gold)]">
          ✓
        </div>
        <h2 className="font-display text-2xl text-[color:var(--cream)]">Reservation confirmed</h2>
        <p className="mt-3 text-sm text-[color:var(--cream)]/80">
          Thank you, <span className="text-[color:var(--gold)]">{name}</span>. Your seat is secured.
        </p>
        <div className="mt-5 rounded-lg border border-[color:var(--gold)]/20 bg-black/30 p-4 text-sm">
          <p className="text-[color:var(--cream)]/70">
            Table <span className="text-[color:var(--cream)]">{tableLabel}</span> · Seat{" "}
            <span className="text-[color:var(--cream)]">{seatNumber}</span>
          </p>
          <p className="mt-2 text-[color:var(--cream)]/70">
            Passion &amp; Nerve Dinner
            <br />
            June 29, 2026 · 6:00 PM
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-md bg-[color:var(--gold)] px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
        >
          Close
        </button>
      </div>
    </div>
  );
}
