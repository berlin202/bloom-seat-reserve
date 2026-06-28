import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const LOCK_REF = () => doc(db, "settings", "reservations");

export function useReservationsLock() {
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      LOCK_REF(),
      (snap) => {
        setLocked(Boolean(snap.data()?.locked));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, []);

  return { locked, loading };
}

export async function setReservationsLocked(locked: boolean) {
  await setDoc(LOCK_REF(), { locked, updatedAt: Date.now() }, { merge: true });
}
