// Table layout for the Passion & Nerve Dinner venue.
// Coordinates are percentages of the map container (0–100).
// Stage is in the center of the room. Tables orbit it on all sides
// with their long axes pointing toward (or perpendicular to) the stage.

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

// Horizontal long-axis (rx > ry)
const HRX = 3.6;
const HRY = 2.6;
// Vertical long-axis (ry > rx)
const VRX = 2.6;
const VRY = 3.6;

export const TABLES: TableDef[] = [
  // ── West column (left of stage): long axis vertical, seats face east → stage
  { id: "S", label: "S", seats: 10, x: 7, y: 16, rx: VRX, ry: VRY },
  { id: "C", label: "C", seats: 10, x: 7, y: 34, rx: VRX, ry: VRY },
  { id: "B", label: "B", seats: 10, x: 7, y: 52, rx: VRX, ry: VRY },
  { id: "D", label: "D", seats: 10, x: 7, y: 70, rx: VRX, ry: VRY },

  // ── South-west: tilted, long axis pointing NW, seats facing NE → stage
  { id: "F", label: "F", seats: 10, x: 20, y: 72, rx: HRX, ry: HRY, rotation: -45 },
  { id: "E", label: "E", seats: 10, x: 14, y: 85, rx: HRX, ry: HRY, rotation: -45 },

  // ── South of stage: horizontal long axis, seats facing north → stage
  { id: "A", label: "A", seats: 10, x: 33, y: 75, rx: HRX, ry: HRY },
  { id: "DOCTORS", label: "Doctors", seats: 10, x: 48, y: 77, rx: 5, ry: HRY, restricted: true },
  { id: "Q", label: "Q", seats: 10, x: 63, y: 75, rx: HRX, ry: HRY },

  // ── Far south row (behind A / Doctors / Q): horizontal, seats facing north
  { id: "G", label: "G", seats: 10, x: 19, y: 91, rx: HRX, ry: HRY },
  { id: "H", label: "H", seats: 10, x: 32, y: 93, rx: HRX, ry: HRY },
  { id: "I", label: "I", seats: 10, x: 46, y: 94, rx: HRX, ry: HRY },
  { id: "J", label: "J", seats: 10, x: 60, y: 93, rx: HRX, ry: HRY },
  { id: "K", label: "K", seats: 10, x: 74, y: 91, rx: HRX, ry: HRY },

  // ── South-east: tilted, long axis pointing NE, seats facing NW → stage
  { id: "P", label: "P", seats: 10, x: 78, y: 72, rx: HRX, ry: HRY, rotation: 45 },
  { id: "L", label: "L", seats: 10, x: 86, y: 85, rx: HRX, ry: HRY, rotation: 45 },

  // ── East column (right of stage): vertical long axis, seats facing west → stage
  { id: "R", label: "R", seats: 10, x: 72, y: 12, rx: VRX, ry: VRY },
  { id: "N", label: "N", seats: 10, x: 83, y: 15, rx: VRX, ry: VRY },
  { id: "M", label: "M", seats: 10, x: 83, y: 33, rx: VRX, ry: VRY },
  { id: "O", label: "O", seats: 10, x: 83, y: 51, rx: VRX, ry: VRY },
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
