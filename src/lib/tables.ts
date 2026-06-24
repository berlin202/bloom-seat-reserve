// Table layout for the Passion & Nerve Dinner venue.
// Coordinates are percentages of the map container (0-100).
// Each table is an oval; seats are arranged in a flower-petal ring around it.

export type TableDef = {
  id: string;
  label: string;
  seats: number;
  // Center position in % of the map width/height
  x: number;
  y: number;
  // Oval radii in % of map width/height
  rx: number;
  ry: number;
  restricted?: boolean;
};

export const TABLES: TableDef[] = [
  { id: "C", label: "C", seats: 10, x: 15, y: 18, rx: 5, ry: 4 },
  { id: "D", label: "D", seats: 10, x: 8, y: 40, rx: 5, ry: 4 },
  { id: "B", label: "B", seats: 8, x: 24, y: 35, rx: 4.5, ry: 3.5 },
  { id: "F", label: "F", seats: 10, x: 22, y: 56, rx: 5, ry: 4 },
  { id: "E", label: "E", seats: 8, x: 12, y: 76, rx: 4.5, ry: 3.5 },
  { id: "DOCTORS", label: "Doctors Only", seats: 9, x: 42, y: 22, rx: 6.5, ry: 4, restricted: true },
  { id: "A", label: "A", seats: 9, x: 42, y: 45, rx: 5, ry: 4 },
  { id: "G", label: "G", seats: 11, x: 32, y: 76, rx: 5.5, ry: 4 },
  { id: "H", label: "H", seats: 9, x: 45, y: 88, rx: 5, ry: 3.5 },
  { id: "I", label: "I", seats: 9, x: 56, y: 88, rx: 5, ry: 3.5 },
  { id: "Q", label: "Q", seats: 9, x: 58, y: 45, rx: 5, ry: 4 },
  { id: "J", label: "J", seats: 9, x: 65, y: 76, rx: 5, ry: 4 },
  { id: "K", label: "K", seats: 9, x: 76, y: 88, rx: 5, ry: 3.5 },
  { id: "N", label: "N", seats: 10, x: 70, y: 18, rx: 5, ry: 4 },
  { id: "O", label: "O", seats: 8, x: 82, y: 38, rx: 4.5, ry: 3.5 },
  { id: "P", label: "P", seats: 9, x: 75, y: 55, rx: 5, ry: 4 },
  { id: "M", label: "M", seats: 8, x: 88, y: 55, rx: 4.5, ry: 3.5 },
  { id: "L", label: "L", seats: 8, x: 84, y: 76, rx: 4.5, ry: 3.5 },
];

export const TOTAL_SEATS = TABLES.reduce((acc, t) => acc + t.seats, 0);

export function seatId(tableId: string, n: number) {
  return `${tableId}-${n}`;
}

export function tableById(id: string) {
  return TABLES.find((t) => t.id === id);
}
