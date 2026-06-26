// Table layout for the Passion & Nerve Dinner venue.
// Coordinates are percentages of the 1000×750 map viewBox.
// Stage is a large rectangle at the top of the room. Every table surrounds it
// on three sides. Pool + food station live in the top-right corner.

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

// All tables are clearly OVAL — long axis ≈ 2.5× short axis.
const HRX = 5.0; // horizontal long axis (% of width)
const HRY = 1.8;
const VRX = 1.8; // vertical long axis
const VRY = 5.0;

const H = { rx: HRX, ry: HRY }; // horizontal
const V = { rx: VRX, ry: VRY }; // vertical (and used for tilted; rotation handles the angle)

// Layout mirrors the official Cvent floor plan + 2 extras (S above B, R above N).
// 20 tables total: A–S + Doctors.
const HRX_BACK = 4.2; // tighter horizontal radius for the dense back row
export const TABLES: TableDef[] = [
  // ── LEFT side ────────────────────────────────────────────────────────
  { id: "S", label: "S", seats: 10, x: 28, y: 28, ...V }, // NEW — above B
  { id: "D", label: "D", seats: 10, x: 8, y: 42, ...V },
  { id: "C", label: "C", seats: 10, x: 18, y: 38, ...V },
  { id: "B", label: "B", seats: 10, x: 28, y: 44, ...V },
  { id: "F", label: "F", seats: 10, x: 20, y: 62, ...H },
  { id: "E", label: "E", seats: 10, x: 9, y: 68, ...H },

  // ── CENTER (south of stage) ──────────────────────────────────────────
  { id: "A", label: "A", seats: 10, x: 38, y: 62, ...H },
  { id: "DOCTORS", label: "Doctors", seats: 10, x: 50, y: 62, ...H, restricted: true },
  { id: "Q", label: "Q", seats: 10, x: 62, y: 62, ...H },


  // ── BACK ROW (five horizontals; tighter rx to prevent seat overlap) ──
  { id: "G", label: "G", seats: 10, x: 26, y: 84, rx: HRX_BACK, ry: HRY },
  { id: "H", label: "H", seats: 10, x: 38, y: 84, rx: HRX_BACK, ry: HRY },
  { id: "I", label: "I", seats: 10, x: 50, y: 84, rx: HRX_BACK, ry: HRY },
  { id: "J", label: "J", seats: 10, x: 62, y: 84, rx: HRX_BACK, ry: HRY },
  { id: "K", label: "K", seats: 10, x: 74, y: 84, rx: HRX_BACK, ry: HRY },

  // ── RIGHT side ───────────────────────────────────────────────────────
  { id: "R", label: "R", seats: 10, x: 72, y: 28, ...V }, // NEW — above N
  { id: "O", label: "O", seats: 10, x: 72, y: 42, ...V },
  { id: "N", label: "N", seats: 10, x: 82, y: 38, ...V },
  { id: "M", label: "M", seats: 10, x: 88, y: 46, ...V },
  { id: "P", label: "P", seats: 10, x: 76, y: 62, ...H },
  { id: "L", label: "L", seats: 10, x: 86, y: 68, ...H },
];

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
