import { TABLES, type TableDef, seatId } from "@/lib/tables";

type Props = {
  reservedSeatIds: Set<string>;
  selectedSeatId: string | null;
  onSelectSeat: (seatId: string, table: TableDef, seatNumber: number) => void;
};

export function SeatingMap({ reservedSeatIds, selectedSeatId, onSelectSeat }: Props) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[color:var(--gold)]/30 bg-[color:var(--map-bg)] shadow-[0_0_60px_-20px_rgba(212,175,55,0.25)]">
      {/* aspect ratio box to keep map proportional */}
      <div className="relative w-full" style={{ paddingBottom: "75%" }}>
        <svg
          viewBox="0 0 1000 750"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="poolGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.6" />
            </radialGradient>
            <linearGradient id="stageGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Stage — centered in the room */}
          <g>
            <rect
              x="390"
              y="300"
              width="220"
              height="140"
              rx="10"
              fill="url(#stageGrad)"
              stroke="#d4af37"
              strokeOpacity="0.6"
              strokeWidth={1.5}
            />
            <text
              x="500"
              y="378"
              textAnchor="middle"
              fill="#d4af37"
              fontSize="26"
              fontFamily="var(--font-display)"
              letterSpacing="8"
            >
              STAGE
            </text>
          </g>

          {/* Pool — top right */}
          <g>
            <ellipse
              cx="950"
              cy="200"
              rx="40"
              ry="70"
              fill="url(#poolGrad)"
              stroke="#60a5fa"
              strokeOpacity="0.5"
            />
            <text
              x="950"
              y="205"
              textAnchor="middle"
              fill="#dbeafe"
              fontSize="13"
              letterSpacing="2"
            >
              POOL
            </text>
          </g>

          {/* Food Station — directly below the pool */}
          <g>
            <rect
              x="900"
              y="295"
              width="100"
              height="80"
              rx="6"
              fill="#1f1410"
              stroke="#d4af37"
              strokeOpacity="0.5"
            />
            <text x="950" y="328" textAnchor="middle" fill="#d4af37" fontSize="16">
              🍽
            </text>
            <text x="950" y="355" textAnchor="middle" fill="#e7d9b8" fontSize="11" letterSpacing="1">
              FOOD STATION
            </text>
          </g>

          {/* Entrance */}
          <g>
            <rect
              x="450"
              y="715"
              width="100"
              height="28"
              rx="4"
              fill="none"
              stroke="#d4af37"
              strokeDasharray="6 4"
              strokeOpacity="0.7"
            />
            <text x="500" y="734" textAnchor="middle" fill="#e7d9b8" fontSize="12" letterSpacing="2">
              ENTRANCE
            </text>
          </g>

          {/* Tables */}
          {TABLES.map((table) => (
            <TableNode
              key={table.id}
              table={table}
              reservedSeatIds={reservedSeatIds}
              selectedSeatId={selectedSeatId}
              onSelectSeat={onSelectSeat}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

function TableNode({
  table,
  reservedSeatIds,
  selectedSeatId,
  onSelectSeat,
}: {
  table: TableDef;
  reservedSeatIds: Set<string>;
  selectedSeatId: string | null;
  onSelectSeat: (seatId: string, table: TableDef, seatNumber: number) => void;
}) {
  const cx = (table.x / 100) * 1000;
  const cy = (table.y / 100) * 750;
  const rx = (table.rx / 100) * 1000;
  const ry = (table.ry / 100) * 750;

  const tableFill = table.restricted ? "#3a3530" : "#2a201a";
  const tableStroke = table.restricted ? "#6b6258" : "#d4af37";

  // Seat ring radii
  const seatOffset = 13;
  const ringRx = rx + seatOffset;
  const ringRy = ry + seatOffset;
  const seatR = 9;

  return (
    <g>
      {/* Table oval */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill={tableFill}
        stroke={tableStroke}
        strokeOpacity={table.restricted ? 0.5 : 0.7}
        strokeWidth={1.5}
      />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fill={table.restricted ? "#9a9080" : "#e7d9b8"}
        fontSize={table.restricted ? 9 : 13}
        fontFamily="var(--font-display)"
        letterSpacing="1"
      >
        {table.label}
      </text>

      {/* Seats around the table */}
      {Array.from({ length: table.seats }, (_, i) => {
        const angle = (i / table.seats) * Math.PI * 2 - Math.PI / 2;
        const sx = cx + Math.cos(angle) * ringRx;
        const sy = cy + Math.sin(angle) * ringRy;
        const id = seatId(table.id, i + 1);
        const reserved = reservedSeatIds.has(id);
        const selected = selectedSeatId === id;
        const restricted = !!table.restricted;

        let fill = "#22c55e"; // available green
        if (restricted) fill = "#6b6258";
        else if (reserved) fill = "#dc2626";
        if (selected) fill = "#eab308";

        const clickable = !reserved && !restricted;

        return (
          <g key={id}>
            <circle
              cx={sx}
              cy={sy}
              r={seatR}
              fill={fill}
              stroke="#0a0706"
              strokeWidth={1.5}
              className={clickable ? "cursor-pointer transition-opacity hover:opacity-80" : "cursor-not-allowed"}
              onClick={() => {
                if (clickable) onSelectSeat(id, table, i + 1);
              }}
            >
              <title>
                {restricted
                  ? `${table.label} · Seat ${i + 1} — Restricted`
                  : reserved
                    ? `Table ${table.label} · Seat ${i + 1} — Reserved`
                    : `Table ${table.label} · Seat ${i + 1} — Available`}
              </title>
            </circle>
            <text
              x={sx}
              y={sy + 3}
              textAnchor="middle"
              fontSize={8}
              fill="#0a0706"
              fontWeight={700}
              pointerEvents="none"
            >
              {i + 1}
            </text>
          </g>
        );
      })}
    </g>
  );
}
