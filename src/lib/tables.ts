// Table layout for the Passion & Nerve Dinner venue.
// Coordinates are percentages of the 1000×750 map viewBox.
// Stage sits at the top of the room (rectangle) and every table surrounds
// it on three sides. Pool + food station live in the top-right corner.

export type TableDef = {
  id: string;
  label: string;
  seats: number;
  x: number;
  y: number;
  rx: number;
  ry: number;
  rotation?: number; // degrees, rotates the whole table (ellipse + seats) around its center
  restricted?: boolean;
};

// All tables are clearly OVAL (long-axis ≈ 2× short-axis).
const HRX = 4.4; // horizontal long-axis
const HRY = 2.2;
const VRX = 2.2; // vertical long-axis
const VRY = 4.4;

export const TABLES: TableDef[] = [
  // ── LEFT side ──────────────────────────────────────────────────────────
  // Column closest to the stage: B (near stage) with S above it
  { id: "S", label: "S", seats: 10, x: 28, y: 36 },
  { id: "B", label: "B", seats: 10, x: 28, y: 52 },
  // Middle column: C vertical directly above F (tilted)
  { id: "C", label: "C", seats: 10, x: 17, y: 50 },
  { id: "F", label: "F", seats: 10, x: 17, y: 68, rotation: -45 },
  // Outer column: D vertical directly above E (tilted)
  { id: "D", label: "D", seats: 10, x: 7, y: 64 },
  { id: "E", label: "E", seats: 10, x: 7, y: 82, rotation: -45 },

  // ── CENTER (south of stage) ───────────────────────────────────────────
  // Doctors' table in the middle, A and Q flanking, all horizontal
  { id: "A", label: "A", seats: 10, x: 38, y: 50 },
  { id: "DOCTORS", label: "Doctors", seats: 10, x: 50, y: 50, restricted: true },
  { id: "Q", label: "Q", seats: 10, x: 62, y: 50 },
  // Five horizontal tables behind them
  { id: "G", label: "G", seats: 10, x: 26, y: 70 },
  { id: "H", label: "H", seats: 10, x: 38, y: 70 },
  { id: "I", label: "I", seats: 10, x: 50, y: 70 },
  { id: "J", label: "J", seats: 10, x: 62, y: 70 },
  { id: "K", label: "K", seats: 10, x: 74, y: 70 },

  // ── RIGHT side ────────────────────────────────────────────────────────
  // Inner column (closer to stage): N top, O mid, P tilted bottom
  { id: "N", label: "N", seats: 10, x: 72, y: 36 },
  { id: "O", label: "O", seats: 10, x: 72, y: 52 },
  { id: "P", label: "P", seats: 10, x: 72, y: 68, rotation: 45 },
  // Outer column (in front of pool/food): R top, M mid, L tilted bottom
  { id: "R", label: "R", seats: 10, x: 83, y: 50 },
  { id: "M", label: "M", seats: 10, x: 83, y: 64 },
  { id: "L", label: "L", seats: 10, x: 83, y: 82, rotation: 45 },
].map((t) => {
  // apply default ovality based on orientation
  const isHorizontal =
    t.rotation === undefined &&
    ["A", "DOCTORS", "Q", "G", "H", "I", "J", "K"].includes(t.id);
  const isTilted = t.rotation !== undefined;
  return {
    ...t,
    rx: isTilted ? HRX : isHorizontal ? HRX : VRX,
    ry: isTilted ? HRY : isHorizontal ? HRY : VRY,
  } as TableDef;
});

export const TOTAL_SEATS = TABLES.reduce((acc, t) => acc + t.seats, 0);
export const RESERVABLE_SEATS = TABLES.filter((t) => !t.restricted).reduce(
  (acc, t) => acc + t.seats,
  0,
);

export function seatId(tableId: string, n: number) {
  return `${tableId}-${n}`;
}

export function tableById(id: string) {
  return TABLES.find((t) => t.id === id);
}
