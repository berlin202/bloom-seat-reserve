import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Reservation = {
  seatId: string;
  tableId: string;
  tableLabel: string;
  seatNumber: number;
  name: string;
  email?: string;
  mobile?: string;

  reservationNumber?: number;
  createdAt?: { seconds: number; nanoseconds: number };
};

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "reservations"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items: Reservation[] = [];
        snap.forEach((d) => items.push(d.data() as Reservation));
        setReservations(items);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  return { reservations, loading, error };
}
