import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// ── SVG Icon Components ───────────────────────────────────────────────────────

function IconWindHeader({ size = 22, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10 L20 10 C23 10 25 8 25 6 C25 4 23 2 21 2 C19 2 18 3 18 5" />
      <path d="M4 16 L24 16 C28 16 30 18 30 20 C30 22 28 24 26 24 C24 24 23 23 23 21" />
      <path d="M4 22 L18 22 C21 22 23 24 23 26 C23 28 21 30 19 30 C17 30 16 29 16 27" />
    </svg>
  );
}

function IconSpeed({ size = 32, color = "#34d399" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle
        cx="16"
        cy="16"
        r="12"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.25"
      />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
        const a = ((deg - 90) * Math.PI) / 180;
        const major = deg % 90 === 0;
        const r1 = major ? 9.5 : 10.5;
        return (
          <line
            key={i}
            x1={16 + r1 * Math.cos(a)}
            y1={16 + r1 * Math.sin(a)}
            x2={16 + 12 * Math.cos(a)}
            y2={16 + 12 * Math.sin(a)}
            stroke={color}
            strokeWidth={major ? 1.5 : 0.8}
            opacity={major ? 0.6 : 0.25}
          />
        );
      })}
      {/* speed arc 0–75% */}
      <path
        d="M 4 16 A 12 12 0 0 1 16 4"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* needle */}
      <line
        x1="16"
        y1="16"
        x2="10"
        y2="9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="2.5" fill={color} opacity="0.8" />
    </svg>
  );
}

function IconGust({ size = 32, color = "#fb923c" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M2 10 Q8 4 16 8 Q24 12 30 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M2 16 Q8 10 16 14 Q24 18 30 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M2 22 Q8 16 16 20 Q24 24 28 20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M27 4 L30 6 L28 9"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDirection({ size = 32, color = "#c084fc" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle
        cx="16"
        cy="16"
        r="13"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.2"
      />
      <path d="M16 4 L20 20 L16 17 L12 20 Z" fill={color} fillOpacity="0.9" />
      <path d="M16 28 L12 12 L16 15 L20 12 Z" fill={color} fillOpacity="0.25" />
      <circle cx="16" cy="16" r="2.5" fill="white" opacity="0.6" />
    </svg>
  );
}

// ── Speedometer gauge ─────────────────────────────────────────────────────────

function Speedometer({
  value = 0,
  max = 100,
  color = "#34d399",
  label = "km/h",
}) {
  const fraction = Math.min(1, Math.max(0, value / max));
  const R = 65;
  const arcLen = Math.PI * R;
  const filled = fraction * arcLen;
  const angleDeg = 180 - fraction * 180;
  const angleRad = (angleDeg * Math.PI) / 180;
  const nx = 85 + 52 * Math.cos(angleRad);
  const ny = 95 - 52 * Math.sin(angleRad);

  const zones = [
    { pct: 0.33, color: "#4ade80" },
    { pct: 0.33, color: "#facc15" },
    { pct: 0.34, color: "#f87171" },
  ];

  let offset = 0;
  const zoneArcs = zones.map((z, i) => {
    const start = offset;
    offset += z.pct;
    const startAngle = ((180 - start * 180) * Math.PI) / 180;
    const endAngle = ((180 - offset * 180) * Math.PI) / 180;
    const sx = 20 + R * Math.cos(startAngle);
    const sy = 95 - R * Math.sin(startAngle);
    const ex = 20 + R * Math.cos(endAngle);
    const ey = 95 - R * Math.sin(endAngle);
    return (
      <path
        key={i}
        d={`M ${sx} ${sy} A ${R} ${R} 0 0 1 ${ex} ${ey}`}
        stroke={z.color}
        strokeWidth="10"
        fill="none"
        strokeLinecap="butt"
        opacity="0.22"
      />
    );
  });

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const a = ((180 - t * 180) * Math.PI) / 180;
    return {
      x1: 20 + (R - 7) * Math.cos(a),
      y1: 95 - (R - 7) * Math.sin(a),
      x2: 20 + (R + 7) * Math.cos(a),
      y2: 95 - (R + 7) * Math.sin(a),
      lx: 20 + (R + 14) * Math.cos(a),
      ly: 95 - (R + 14) * Math.sin(a),
      val: Math.round(t * max),
    };
  });

  return (
    <svg width="170" height="110" viewBox="0 0 170 110" overflow="visible">
      <defs>
        <linearGradient
          id={`speedGrad-${label}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#f87171" />
        </linearGradient>
      </defs>
      {zoneArcs}
      {/* Background arc */}
      <path
        d="M 20 95 A 65 65 0 0 1 150 95"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      {/* Filled arc */}
      <path
        d="M 20 95 A 65 65 0 0 1 150 95"
        stroke={`url(#speedGrad-${label})`}
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${arcLen + 20}`}
      />
      {ticks.map((t, i) => (
        <g key={i}>
          <line
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <text
            x={t.lx}
            y={t.ly}
            fontSize="7.5"
            fill="rgba(255,255,255,0.3)"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {t.val}
          </text>
        </g>
      ))}
      {/* Needle */}
      <line
        x1="85"
        y1="95"
        x2={nx}
        y2={ny}
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="85"
        cy="95"
        r="5.5"
        fill="hsl(243,18%,21%)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
      />
      <text
        x="85"
        y="80"
        fontSize="18"
        fill={color}
        textAnchor="middle"
        fontWeight="700"
      >
        {value.toFixed(1)}
      </text>
      <text
        x="85"
        y="92"
        fontSize="8.5"
        fill="rgba(255,255,255,0.35)"
        textAnchor="middle"
      >
        {label}
      </text>
    </svg>
  );
}

// ── Compass Rose ──────────────────────────────────────────────────────────────

function CompassRose({ degrees = 0, size = 120 }) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.37;
  const tipRad = ((degrees - 90) * Math.PI) / 180;
  const tailRad = tipRad + Math.PI;
  const perpRad = tipRad + Math.PI / 2;
  const sideR = size * 0.065;

  const tipX = cx + R * Math.cos(tipRad);
  const tipY = cy + R * Math.sin(tipRad);
  const tailX = cx + R * 0.48 * Math.cos(tailRad);
  const tailY = cy + R * 0.48 * Math.sin(tailRad);
  const sx1 = cx + sideR * Math.cos(perpRad);
  const sy1 = cy + sideR * Math.sin(perpRad);
  const sx2 = cx - sideR * Math.cos(perpRad);
  const sy2 = cy - sideR * Math.sin(perpRad);

  const cardinals = [
    { l: "N", d: 0, c: "#f87171" },
    { l: "E", d: 90, c: "rgba(255,255,255,0.5)" },
    { l: "S", d: 180, c: "rgba(255,255,255,0.5)" },
    { l: "W", d: 270, c: "rgba(255,255,255,0.5)" },
  ];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle
        cx={cx}
        cy={cy}
        r={size * 0.46}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1.5"
      />
      <circle
        cx={cx}
        cy={cy}
        r={R * 0.75}
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="1"
        strokeDasharray="2 5"
      />
      {[45, 135, 225, 315].map((deg) => {
        const a = ((deg - 90) * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={cx + size * 0.38 * Math.cos(a)}
            y1={cy + size * 0.38 * Math.sin(a)}
            x2={cx + size * 0.46 * Math.cos(a)}
            y2={cy + size * 0.46 * Math.sin(a)}
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="1"
          />
        );
      })}
      {cardinals.map(({ l, d, c }) => {
        const a = ((d - 90) * Math.PI) / 180;
        return (
          <text
            key={l}
            x={cx + R * 0.66 * Math.cos(a)}
            y={cy + R * 0.66 * Math.sin(a)}
            fontSize={size * 0.12}
            fill={c}
            textAnchor="middle"
            dominantBaseline="central"
            fontWeight="700"
          >
            {l}
          </text>
        );
      })}
      <polygon
        points={`${tipX},${tipY} ${sx1},${sy1} ${cx},${cy} ${sx2},${sy2}`}
        fill="#c084fc"
        opacity="0.92"
      />
      <polygon
        points={`${tailX},${tailY} ${sx1},${sy1} ${cx},${cy} ${sx2},${sy2}`}
        fill="rgba(255,255,255,0.2)"
      />
      <circle cx={cx} cy={cy} r={size * 0.045} fill="white" opacity="0.65" />
    </svg>
  );
}

// ── Beaufort scale helper ─────────────────────────────────────────────────────

function getBeaufort(kmh) {
  if (kmh < 1) return { scale: 0, desc: "Calm" };
  if (kmh < 6) return { scale: 1, desc: "Light Air" };
  if (kmh < 12) return { scale: 2, desc: "Light Breeze" };
  if (kmh < 20) return { scale: 3, desc: "Gentle Breeze" };
  if (kmh < 29) return { scale: 4, desc: "Moderate Breeze" };
  if (kmh < 39) return { scale: 5, desc: "Fresh Breeze" };
  if (kmh < 50) return { scale: 6, desc: "Strong Breeze" };
  if (kmh < 62) return { scale: 7, desc: "Near Gale" };
  if (kmh < 75) return { scale: 8, desc: "Gale" };
  if (kmh < 89) return { scale: 9, desc: "Strong Gale" };
  if (kmh < 103) return { scale: 10, desc: "Storm" };
  if (kmh < 118) return { scale: 11, desc: "Violent Storm" };
  return { scale: 12, desc: "Hurricane" };
}

function getWindCardinal(deg) {
  const dirs = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return dirs[Math.round(deg / 22.5) % 16];
}

function getGustIntensity(gusts) {
  if (gusts < 30) return { label: "Calm Gusts", color: "#4ade80" };
  if (gusts < 60) return { label: "Moderate Gusts", color: "#facc15" };
  if (gusts < 90) return { label: "Strong Gusts", color: "#fb923c" };
  return { label: "Severe Gusts", color: "#f87171" };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function WindDashboard() {
  const navigate = useNavigate();
  const weatherData = useSelector((state) => state.dashboard.data.weatherData);
  const selectedLocation = useSelector(
    (state) => state.dashboard.ui.selectedLocation,
  );

  if (!weatherData?.current) {
    return (
      <div className="wind-dashboard__empty">
        <IconWindHeader size={48} color="var(--accent)" />
        <p>No wind data available.</p>
        <button className="dash-back-btn" onClick={() => navigate("/Dashboard")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const c = weatherData.current;
  const u = weatherData.current_units || {};

  const windSpeed = c.wind_speed_10m;
  const windGusts = c.wind_gusts_10m;
  const windDir = c.wind_direction_10m;

  const beaufort = windSpeed != null ? getBeaufort(windSpeed) : null;
  const gustInfo = windGusts != null ? getGustIntensity(windGusts) : null;
  const speedUnit = u.wind_speed_10m || "km/h";
  const gustUnit = u.wind_gusts_10m || "km/h";

  return (
    <div className="wind-dashboard">
      {/* ── Header ── */}
      <div className="wind-dashboard__header">
        <div className="wind-dashboard__header-title">
          <button className="dash-back-btn" onClick={() => navigate("/Dashboard")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </button>
          <IconWindHeader size={22} color="var(--accent)" />
          <h2 className="wind-dashboard__title">Wind Conditions</h2>
        </div>
        {selectedLocation && (
          <span className="wind-dashboard__location">
            {selectedLocation.name}, {selectedLocation.country}
          </span>
        )}
      </div>

      {/* ── Grid ── */}
      <div className="wind-dashboard__grid">
        {/* Wind Speed — large card with speedometer */}
        <div className="wind-card wind-card--large">
          <div className="wind-card__side">
            <div className="wind-card__icon">
              <IconSpeed size={32} />
            </div>
            <div className="wind-card__label">Wind Speed</div>
            <div className="wind-card__value" style={{ color: "#34d399" }}>
              {windSpeed != null ? windSpeed.toFixed(1) : "—"}
              <span className="wind-card__unit"> {speedUnit}</span>
            </div>
            {beaufort && (
              <span
                className="wind-card__badge"
                style={{
                  background: "rgba(52,211,153,0.12)",
                  color: "#34d399",
                  border: "1px solid rgba(52,211,153,0.3)",
                }}
              >
                BFT {beaufort.scale} — {beaufort.desc}
              </span>
            )}
            <div className="wind-card__bar-track">
              <div
                className="wind-card__bar-fill"
                style={{
                  width: `${Math.min(100, ((windSpeed ?? 0) / 100) * 100)}%`,
                  background: "linear-gradient(90deg, #10b981, #34d399)",
                }}
              />
            </div>
          </div>
          <div className="wind-card__gauge">
            {windSpeed != null && (
              <Speedometer
                value={windSpeed}
                max={100}
                color="#34d399"
                label={speedUnit}
              />
            )}
          </div>
        </div>

        {/* Wind Direction Compass */}
        <div className="wind-card wind-card--center">
          <div className="wind-card__label">Wind Direction</div>
          {windDir != null ? (
            <CompassRose degrees={windDir} size={120} />
          ) : (
            <div
              style={{
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.3,
              }}
            >
              —
            </div>
          )}
          <div
            className="wind-card__value"
            style={{ fontSize: "1.2rem", marginTop: 4 }}
          >
            {windDir != null ? `${windDir}°` : "—"}
          </div>
          <div className="wind-card__sub">
            {windDir != null ? getWindCardinal(windDir) : ""}
          </div>
        </div>

        {/* Wind Gusts — large card with speedometer */}
        <div className="wind-card wind-card--large">
          <div className="wind-card__side">
            <div className="wind-card__icon">
              <IconGust size={32} />
            </div>
            <div className="wind-card__label">Wind Gusts</div>
            <div className="wind-card__value" style={{ color: "#fb923c" }}>
              {windGusts != null ? windGusts.toFixed(1) : "—"}
              <span className="wind-card__unit"> {gustUnit}</span>
            </div>
            {gustInfo && (
              <span
                className="wind-card__badge"
                style={{
                  background: gustInfo.color + "18",
                  color: gustInfo.color,
                  border: `1px solid ${gustInfo.color}40`,
                }}
              >
                {gustInfo.label}
              </span>
            )}
            <div className="wind-card__bar-track">
              <div
                className="wind-card__bar-fill"
                style={{
                  width: `${Math.min(100, ((windGusts ?? 0) / 150) * 100)}%`,
                  background: "linear-gradient(90deg, #ea580c, #fb923c)",
                }}
              />
            </div>
          </div>
          <div className="wind-card__gauge">
            {windGusts != null && (
              <Speedometer
                value={windGusts}
                max={150}
                color="#fb923c"
                label={gustUnit}
              />
            )}
          </div>
        </div>

        {/* Direction Detail */}
        <div className="wind-card">
          <div className="wind-card__icon">
            <IconDirection size={32} />
          </div>
          <div className="wind-card__label">Direction</div>
          <div className="wind-card__value" style={{ color: "#c084fc" }}>
            {windDir != null ? `${windDir}°` : "—"}
          </div>
          <div className="wind-card__sub">
            {windDir != null
              ? getWindCardinal(windDir) + " — " + windDir + "°"
              : "No data"}
          </div>
        </div>

        {/* Gust vs Speed ratio */}
        <div className="wind-card">
          <div className="wind-card__label">Gust / Speed Ratio</div>
          <div className="wind-card__value" style={{ color: "#e879f9" }}>
            {windSpeed != null && windGusts != null
              ? (windGusts / windSpeed).toFixed(2)
              : "—"}
            <span className="wind-card__unit">×</span>
          </div>
          <div className="wind-card__bar-track" style={{ marginTop: 8 }}>
            <div
              className="wind-card__bar-fill"
              style={{
                width: `${windSpeed && windGusts ? Math.min(100, (windGusts / windSpeed / 3) * 100) : 0}%`,
                background: "linear-gradient(90deg, #a855f7, #e879f9)",
              }}
            />
          </div>
          <div className="wind-card__sub">
            {windSpeed && windGusts
              ? windGusts / windSpeed > 2
                ? "Highly gusty conditions"
                : windGusts / windSpeed > 1.5
                  ? "Moderately gusty"
                  : "Steady wind"
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
