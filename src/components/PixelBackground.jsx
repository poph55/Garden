const PIXEL_SIZE = 3
const BROWN = '#A08850'

const DAISY = [
  [0,0,1,0,0],
  [0,1,1,1,0],
  [1,1,1,1,1],
  [0,1,1,1,0],
  [0,0,1,0,0],
  [0,0,1,0,0],
  [0,0,1,0,0],
]

const SUNFLOWER = [
  [0,0,0,1,0,0,0],
  [0,1,0,1,0,1,0],
  [0,0,1,1,1,0,0],
  [1,1,1,1,1,1,1],
  [0,0,1,1,1,0,0],
  [0,1,0,1,0,1,0],
  [0,0,0,1,0,0,0],
  [0,0,0,1,0,0,0],
]

const TULIP = [
  [0,0,1,0,0],
  [0,1,1,1,0],
  [1,1,1,1,1],
  [1,1,1,1,1],
  [0,1,1,1,0],
  [0,0,1,0,0],
  [0,0,1,0,0],
  [0,1,0,1,0],
]

const SPROUT = [
  [0,0,1,0,0],
  [0,1,0,1,0],
  [1,0,1,0,1],
  [0,0,1,0,0],
  [0,0,1,0,0],
  [0,1,1,1,0],
]

const SMALL_PLANT = [
  [0,0,1,0,0],
  [0,1,1,0,0],
  [1,1,1,0,0],
  [0,0,1,1,0],
  [0,0,1,1,1],
  [0,0,1,0,0],
  [1,1,1,1,1],
]

const PLANTS = [
  // row 1 — y ~15–80
  { art: SUNFLOWER,   x:   28, y:  22, scale: 0.90, opacity: 0.55 },
  { art: DAISY,       x:  178, y:  48, scale: 0.80, opacity: 0.50 },
  { art: SPROUT,      x:  332, y:  18, scale: 0.75, opacity: 0.48 },
  { art: TULIP,       x:  485, y:  62, scale: 0.85, opacity: 0.52 },
  { art: SMALL_PLANT, x:  642, y:  32, scale: 0.80, opacity: 0.50 },
  { art: DAISY,       x:  800, y:  52, scale: 0.75, opacity: 0.48 },
  { art: SUNFLOWER,   x:  958, y:  22, scale: 0.80, opacity: 0.52 },
  { art: SPROUT,      x: 1115, y:  48, scale: 0.85, opacity: 0.50 },
  { art: TULIP,       x: 1272, y:  28, scale: 0.80, opacity: 0.48 },
  { art: DAISY,       x: 1402, y:  58, scale: 0.75, opacity: 0.52 },

  // row 2 — y ~140–205
  { art: DAISY,       x:   75, y: 148, scale: 0.85, opacity: 0.55 },
  { art: SMALL_PLANT, x:  235, y: 172, scale: 0.90, opacity: 0.52 },
  { art: SUNFLOWER,   x:  395, y: 142, scale: 0.80, opacity: 0.50 },
  { art: TULIP,       x:  550, y: 168, scale: 0.85, opacity: 0.52 },
  { art: SPROUT,      x:  705, y: 185, scale: 0.90, opacity: 0.55 },
  { art: DAISY,       x:  870, y: 148, scale: 0.80, opacity: 0.50 },
  { art: TULIP,       x: 1028, y: 172, scale: 0.85, opacity: 0.52 },
  { art: SMALL_PLANT, x: 1185, y: 158, scale: 0.80, opacity: 0.50 },
  { art: SUNFLOWER,   x: 1348, y: 182, scale: 0.85, opacity: 0.52 },

  // row 3 — y ~265–335
  { art: TULIP,       x:   22, y: 272, scale: 0.90, opacity: 0.55 },
  { art: SPROUT,      x:  180, y: 295, scale: 0.85, opacity: 0.52 },
  { art: DAISY,       x:  338, y: 265, scale: 0.80, opacity: 0.50 },
  { art: SMALL_PLANT, x:  495, y: 288, scale: 0.85, opacity: 0.52 },
  { art: SUNFLOWER,   x:  652, y: 308, scale: 0.80, opacity: 0.55 },
  { art: TULIP,       x:  815, y: 272, scale: 0.85, opacity: 0.50 },
  { art: SPROUT,      x:  975, y: 298, scale: 0.90, opacity: 0.52 },
  { art: DAISY,       x: 1132, y: 278, scale: 0.80, opacity: 0.50 },
  { art: SMALL_PLANT, x: 1290, y: 305, scale: 0.85, opacity: 0.52 },
  { art: SUNFLOWER,   x: 1395, y: 268, scale: 0.80, opacity: 0.50 },

  // row 4 — y ~395–460
  { art: DAISY,       x:   58, y: 402, scale: 0.85, opacity: 0.55 },
  { art: SUNFLOWER,   x:  215, y: 425, scale: 0.80, opacity: 0.52 },
  { art: TULIP,       x:  372, y: 395, scale: 0.85, opacity: 0.50 },
  { art: SPROUT,      x:  528, y: 418, scale: 0.90, opacity: 0.52 },
  { art: SMALL_PLANT, x:  685, y: 438, scale: 0.80, opacity: 0.55 },
  { art: DAISY,       x:  848, y: 402, scale: 0.85, opacity: 0.50 },
  { art: SUNFLOWER,   x: 1005, y: 428, scale: 0.80, opacity: 0.52 },
  { art: TULIP,       x: 1162, y: 408, scale: 0.85, opacity: 0.50 },
  { art: SPROUT,      x: 1320, y: 432, scale: 0.90, opacity: 0.52 },
  { art: DAISY,       x: 1418, y: 398, scale: 0.80, opacity: 0.50 },

  // row 5 — y ~525–595
  { art: SMALL_PLANT, x:   30, y: 532, scale: 0.85, opacity: 0.55 },
  { art: DAISY,       x:  188, y: 558, scale: 0.80, opacity: 0.52 },
  { art: SUNFLOWER,   x:  345, y: 528, scale: 0.85, opacity: 0.50 },
  { art: TULIP,       x:  500, y: 552, scale: 0.80, opacity: 0.52 },
  { art: SPROUT,      x:  658, y: 572, scale: 0.85, opacity: 0.55 },
  { art: SMALL_PLANT, x:  820, y: 535, scale: 0.80, opacity: 0.50 },
  { art: DAISY,       x:  978, y: 558, scale: 0.85, opacity: 0.52 },
  { art: SUNFLOWER,   x: 1135, y: 542, scale: 0.80, opacity: 0.50 },
  { art: TULIP,       x: 1292, y: 565, scale: 0.85, opacity: 0.52 },
  { art: SPROUT,      x: 1408, y: 528, scale: 0.80, opacity: 0.50 },

  // row 6 — y ~658–722
  { art: TULIP,       x:   65, y: 665, scale: 0.85, opacity: 0.55 },
  { art: SPROUT,      x:  222, y: 688, scale: 0.90, opacity: 0.52 },
  { art: DAISY,       x:  378, y: 658, scale: 0.80, opacity: 0.50 },
  { art: SUNFLOWER,   x:  535, y: 682, scale: 0.85, opacity: 0.52 },
  { art: SMALL_PLANT, x:  692, y: 702, scale: 0.80, opacity: 0.55 },
  { art: TULIP,       x:  855, y: 665, scale: 0.85, opacity: 0.50 },
  { art: DAISY,       x: 1012, y: 692, scale: 0.80, opacity: 0.52 },
  { art: SMALL_PLANT, x: 1168, y: 672, scale: 0.85, opacity: 0.50 },
  { art: SUNFLOWER,   x: 1325, y: 698, scale: 0.80, opacity: 0.52 },

  // row 7 — y ~798–858
  { art: DAISY,       x:   25, y: 802, scale: 0.85, opacity: 0.55 },
  { art: SUNFLOWER,   x:  182, y: 822, scale: 0.80, opacity: 0.52 },
  { art: SPROUT,      x:  338, y: 795, scale: 0.85, opacity: 0.50 },
  { art: TULIP,       x:  495, y: 818, scale: 0.80, opacity: 0.52 },
  { art: SMALL_PLANT, x:  652, y: 838, scale: 0.85, opacity: 0.55 },
  { art: DAISY,       x:  815, y: 802, scale: 0.80, opacity: 0.50 },
  { art: SUNFLOWER,   x:  972, y: 825, scale: 0.85, opacity: 0.52 },
  { art: TULIP,       x: 1128, y: 808, scale: 0.80, opacity: 0.50 },
  { art: SPROUT,      x: 1285, y: 832, scale: 0.85, opacity: 0.52 },
  { art: SMALL_PLANT, x: 1398, y: 795, scale: 0.80, opacity: 0.50 },
]

function PixelArt({ grid, x, y, scale = 1, opacity = 1 }) {
  const ps = PIXEL_SIZE * scale
  return (
    <g transform={`translate(${x},${y})`} opacity={opacity}>
      {grid.flatMap((row, ry) =>
        row.map((on, rx) =>
          on ? (
            <rect
              key={`${rx}-${ry}`}
              x={rx * ps}
              y={ry * ps}
              width={ps}
              height={ps}
              fill={BROWN}
            />
          ) : null
        )
      )}
    </g>
  )
}

export default function PixelBackground() {
  return (
    <svg
      aria-hidden="true"
      className="pixel-bg"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      {PLANTS.map((p, i) => (
        <PixelArt
          key={i}
          grid={p.art}
          x={p.x}
          y={p.y}
          scale={p.scale}
          opacity={p.opacity}
        />
      ))}
    </svg>
  )
}
