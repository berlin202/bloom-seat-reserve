// Table layout for the Passion & Nerve Dinner venue.
// Mirrors the official 20-table seating plan (tables A–S + Doctors Only).
// Coordinates are percentages of the map container (0–100).

export type TableDef = {
  id: string;
  label: string;
  seats: number;
  x: number;
  y: number;
  rx: number;
  ry: number;
  restricted?: boolean;
};

const R = 3.6;
const RY = 2.6;

export const TABLES: TableDef[] = [
  // Top flanks (beside the stage)
  { id: "S", label: "S", seats: 10, x: 20, y: 13, rx: R, ry: RY },
  { id: "R", label: "R", seats: 10, x: 80, y: 13, rx: R, ry: RY },

  // Upper ring
  { id: "D", label: "D", seats: 10, x: 8, y: 25, rx: R, ry: RY },
  { id: "C", label: "C", seats: 10, x: 19, y: 28, rx: R, ry: RY },
  { id: "B", label: "B", seats: 10, x: 31, y: 25, rx: R, ry: RY },
  { id: "N", label: "N", seats: 10, x: 69, y: 25, rx: R, ry: RY },
  { id: "M", label: "M", seats: 10, x: 82, y: 28, rx: R, ry: RY },

  // Middle row
  { id: "F", label: "F", seats: 10, x: 21, y: 46, rx: R, ry: RY },
  { id: "A", label: "A", seats: 10, x: 34, y: 50, rx: R, ry: RY },
  { id: "DOCTORS", label: "Doctors", seats: 10, x: 48, y: 50, rx: 5, ry: RY, restricted: true },
  { id: "Q", label: "Q", seats: 10, x: 62, y: 50, rx: R, ry: RY },
  { id: "O", label: "O", seats: 10, x: 71, y: 40, rx: R, ry: RY },
  { id: "P", label: "P", seats: 10, x: 76, y: 51, rx: R, ry: RY },

  // Lower flanks
  { id: "E", label: "E", seats: 10, x: 10, y: 52, rx: R, ry: RY },
  { id: "L", label: "L", seats: 10, x: 82, y: 62, rx: R, ry: RY },

  // Bottom row
  { id: "G", label: "G", seats: 10, x: 16, y: 75, rx: R, ry: RY },
  { id: "H", label: "H", seats: 10, x: 29, y: 75, rx: R, ry: RY },
  { id: "I", label: "I", seats: 10, x: 42, y: 75, rx: R, ry: RY },
  { id: "J", label: "J", seats: 10, x: 55, y: 75, rx: R, ry: RY },
  { id: "K", label: "K", seats: 10, x: 68, y: 75, rx: R, ry: RY },
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
