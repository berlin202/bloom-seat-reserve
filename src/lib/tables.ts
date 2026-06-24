// Table layout for the Passion & Nerve Dinner venue.
// Coordinates are percentages of the map container (0-100).
// Each table is an oval; seats are arranged in a flower-petal ring around it.
// 20 tables total · 10 seats each · 200 seats (190 reservable, Doctors table restricted).

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

const R = 4;
const RY = 3;

export const TABLES: TableDef[] = [
  // Top row (near stage)
  { id: "C", label: "C", seats: 10, x: 15, y: 18, rx: R, ry: RY },
  { id: "B", label: "B", seats: 10, x: 27, y: 18, rx: R, ry: RY },
  { id: "N", label: "N", seats: 10, x: 73, y: 18, rx: R, ry: RY },

  // Upper-middle row
  { id: "D", label: "D", seats: 10, x: 9, y: 38, rx: R, ry: RY },
  { id: "F", label: "F", seats: 10, x: 22, y: 38, rx: R, ry: RY },
  { id: "A", label: "A", seats: 10, x: 36, y: 38, rx: R, ry: RY },
  { id: "DOCTORS", label: "Doctors", seats: 10, x: 50, y: 38, rx: R + 1, ry: RY, restricted: true },
  { id: "Q", label: "Q", seats: 10, x: 64, y: 38, rx: R, ry: RY },
  { id: "O", label: "O", seats: 10, x: 78, y: 38, rx: R, ry: RY },
  { id: "M", label: "M", seats: 10, x: 91, y: 38, rx: R, ry: RY },

  // Lower-middle row
  { id: "E", label: "E", seats: 10, x: 10, y: 58, rx: R, ry: RY },
  { id: "R", label: "R", seats: 10, x: 25, y: 58, rx: R, ry: RY },
  { id: "P", label: "P", seats: 10, x: 75, y: 58, rx: R, ry: RY },
  { id: "S", label: "S", seats: 10, x: 90, y: 58, rx: R, ry: RY },

  // Bottom row
  { id: "G", label: "G", seats: 10, x: 16, y: 80, rx: R, ry: RY },
  { id: "H", label: "H", seats: 10, x: 29, y: 80, rx: R, ry: RY },
  { id: "I", label: "I", seats: 10, x: 42, y: 80, rx: R, ry: RY },
  { id: "J", label: "J", seats: 10, x: 55, y: 80, rx: R, ry: RY },
  { id: "K", label: "K", seats: 10, x: 68, y: 80, rx: R, ry: RY },
  { id: "L", label: "L", seats: 10, x: 81, y: 80, rx: R, ry: RY },
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
