import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// ── SVG Icon Components ───────────────────────────────────────────────────────

function IconWaves({ size = 24, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 6c.6-.5 1.2-.8 2-.8 1 0 2 .8 3 1.3s2 1.3 3 1.3 2-.8 3-1.3 2-1.3 3-1.3 1.4.3 2 .8" />
      <path d="M2 12c.6-.5 1.2-.8 2-.8 1 0 2 .8 3 1.3s2 1.3 3 1.3 2-.8 3-1.3 2-1.3 3-1.3 1.4.3 2 .8" />
      <path d="M2 18c.6-.5 1.2-.8 2-.8 1 0 2 .8 3 1.3s2 1.3 3 1.3 2-.8 3-1.3 2-1.3 3-1.3 1.4.3 2 .8" />
    </svg>
  );
}

function IconBarometer({ size = 32, color = "#c084fc" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle
        cx="16"
        cy="16"
        r="13"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.35"
      />
      <circle
        cx="16"
        cy="16"
        r="9"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="2 4"
        opacity="0.25"
      />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
        const major = deg % 90 === 0;
        const r1 = major ? 10 : 11;
        const a = (deg * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={16 + r1 * Math.cos(a)}
            y1={16 + r1 * Math.sin(a)}
            x2={16 + 13 * Math.cos(a)}
            y2={16 + 13 * Math.sin(a)}
            stroke={color}
            strokeWidth={major ? 1.5 : 1}
            opacity={major ? 0.55 : 0.25}
          />
        );
      })}
      <line
        x1="16"
        y1="16"
        x2="22"
        y2="9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="2.5" fill={color} opacity="0.85" />
    </svg>
  );
}

function PressureGauge({ value = 1013, min = 950, max = 1060 }) {
  const fraction = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const R = 65;
  const arcLen = Math.PI * R;
  const filled = fraction * arcLen;

  // Needle: fraction 0 → 180° (left), fraction 1 → 0° (right)
  const angleDeg = 180 - fraction * 180;
  const angleRad = (angleDeg * Math.PI) / 180;
  const nx = 80 + 50 * Math.cos(angleRad);
  const ny = 90 - 50 * Math.sin(angleRad);

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const a = ((180 - t * 180) * Math.PI) / 180;
    return {
      x1: 80 + (R - 6) * Math.cos(a),
      y1: 90 - (R - 6) * Math.sin(a),
      x2: 80 + (R + 6) * Math.cos(a),
      y2: 90 - (R + 6) * Math.sin(a),
    };
  });

  return (
    <svg width="170" height="105" viewBox="0 0 170 105" overflow="visible">
      <defs>
        <linearGradient id="seaGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="30%" stopColor="#facc15" />
          <stop offset="60%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      {/* Background arc */}
      <path
        d={`M 20 95 A ${R} ${R} 0 0 1 150 95`}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      {/* Colored fill arc */}
      <path
        d={`M 20 95 A ${R} ${R} 0 0 1 150 95`}
        stroke="url(#seaGaugeGrad)"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${arcLen + 20}`}
      />
      {/* Tick marks */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1 + 5}
          y1={t.y1 + 5}
          x2={t.x2 + 5}
          y2={t.y2 + 5}
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
      {/* End labels */}
      <text
        x="18"
        y="101"
        fontSize="8.5"
        fill="rgba(255,255,255,0.35)"
        textAnchor="middle"
      >
        950
      </text>
      <text
        x="152"
        y="101"
        fontSize="8.5"
        fill="rgba(255,255,255,0.35)"
        textAnchor="middle"
      >
        1060
      </text>
      <text
        x="85"
        y="26"
        fontSize="8.5"
        fill="rgba(255,255,255,0.35)"
        textAnchor="middle"
      >
        1005
      </text>
      {/* Needle */}
      <line
        x1="85"
        y1="95"
        x2={nx + 5}
        y2={ny + 5}
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="85"
        cy="95"
        r="5.5"
        fill="hsl(243,18%,21%)"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IconCloud({ size = 32, color = "#93c5fd" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle
        cx="11"
        cy="13"
        r="5"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.4"
      />
      <line
        x1="11"
        y1="5"
        x2="11"
        y2="7"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <line
        x1="3"
        y1="13"
        x2="5"
        y2="13"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <line
        x1="5.5"
        y1="7.5"
        x2="6.9"
        y2="8.9"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M 8 25 A 5 5 0 0 1 8 15 A 4 4 0 0 1 15 12 A 7 7 0 0 1 27 18 A 4 4 0 0 1 27 26 Z"
        fill={color}
        fillOpacity="0.18"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSurfacePressure({ size = 32, color = "#a78bfa" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <line
        x1="4"
        y1="28"
        x2="28"
        y2="28"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <line
        x1="4"
        y1="30"
        x2="28"
        y2="30"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.25"
      />
      <path
        d="M10 6 L10 18 M7 15 L10 18 L13 15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 6 L22 18 M19 15 L22 18 L25 15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 4 L16 12 M13.5 9.5 L16 12 L18.5 9.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </svg>
  );
}

function IconWind({ size = 32, color = "#34d399" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M4 10 L20 10 C23 10 25 8 25 6 C25 4 23 2 21 2 C19 2 18 3 18 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 16 L24 16 C28 16 30 18 30 20 C30 22 28 24 26 24 C24 24 23 23 23 21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 22 L18 22 C21 22 23 24 23 26 C23 28 21 30 19 30 C17 30 16 29 16 27"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
        opacity="0.55"
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

function IconRain({ size = 32, color = "#7dd3fc" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M 6 18 A 5 5 0 0 1 8 8 A 4 4 0 0 1 14 5 A 6 6 0 0 1 26 11 A 4 4 0 0 1 24 19 Z"
        fill={color}
        fillOpacity="0.15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <line
        x1="10"
        y1="23"
        x2="8"
        y2="29"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="23"
        x2="14"
        y2="29"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="22"
        y1="23"
        x2="20"
        y2="29"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CompassRose({ degrees = 0, size = 96 }) {
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
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1.5"
      />
      <circle
        cx={cx}
        cy={cy}
        r={R * 0.75}
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
        strokeDasharray="2 5"
      />
      {[45, 135, 225, 315].map((deg) => {
        const a = ((deg - 90) * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={cx + size * 0.39 * Math.cos(a)}
            y1={cy + size * 0.39 * Math.sin(a)}
            x2={cx + size * 0.46 * Math.cos(a)}
            y2={cy + size * 0.46 * Math.sin(a)}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />
        );
      })}
      {cardinals.map(({ l, d, c }) => {
        const a = ((d - 90) * Math.PI) / 180;
        return (
          <text
            key={l}
            x={cx + R * 0.68 * Math.cos(a)}
            y={cy + R * 0.68 * Math.sin(a)}
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
      {/* Needle tip (direction) */}
      <polygon
        points={`${tipX},${tipY} ${sx1},${sy1} ${cx},${cy} ${sx2},${sy2}`}
        fill="#c084fc"
        opacity="0.92"
      />
      {/* Needle tail */}
      <polygon
        points={`${tailX},${tailY} ${sx1},${sy1} ${cx},${cy} ${sx2},${sy2}`}
        fill="rgba(255,255,255,0.22)"
      />
      <circle cx={cx} cy={cy} r={size * 0.045} fill="white" opacity="0.7" />
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getPressureLevel(hPa) {
  if (hPa < 980) return { label: "Very Low", color: "#f87171" };
  if (hPa < 1000) return { label: "Low", color: "#fb923c" };
  if (hPa < 1013) return { label: "Below Normal", color: "#facc15" };
  if (hPa < 1025) return { label: "Normal", color: "#4ade80" };
  if (hPa < 1040) return { label: "High", color: "#60a5fa" };
  return { label: "Very High", color: "#a78bfa" };
}

function getCloudLabel(pct) {
  if (pct < 10) return "Clear Sky";
  if (pct < 30) return "Mostly Clear";
  if (pct < 50) return "Partly Cloudy";
  if (pct < 75) return "Mostly Cloudy";
  return "Overcast";
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

// ── Component ─────────────────────────────────────────────────────────────────

export function SeaDashboard() {
  const navigate = useNavigate();
  const weatherData = useSelector((state) => state.dashboard.data.weatherData);
  const selectedLocation = useSelector(
    (state) => state.dashboard.ui.selectedLocation,
  );

  if (!weatherData?.current) {
    return (
      <div className="sea-dashboard__empty">
        <IconWaves size={48} color="var(--accent)" />
        <p>No atmospheric data available.</p>
        <button
          className="dash-back-btn"
          onClick={() => navigate("/Dashboard")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const c = weatherData.current;
  const u = weatherData.current_units || {};

  const pressureMSL = c.pressure_msl;
  const surfacePressure = c.surface_pressure;
  const cloudCover = c.cloud_cover;
  const windSpeed = c.wind_speed_10m;
  const windGusts = c.wind_gusts_10m;
  const windDir = c.wind_direction_10m;
  const rain = c.rain;
  const precipitation = c.precipitation;

  const pressureInfo =
    pressureMSL != null ? getPressureLevel(pressureMSL) : null;

  return (
    <div className="sea-dashboard">
      {/* ── Header ── */}
      <div className="sea-dashboard__header">
        <div className="sea-dashboard__header-title">
          <button
            className="dash-back-btn"
            onClick={() => navigate("/Dashboard")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </button>
          <IconWaves size={22} color="var(--accent)" />
          <h2 className="sea-dashboard__title">Atmospheric Conditions</h2>
        </div>
        {selectedLocation && (
          <span className="sea-dashboard__location">
            {selectedLocation.name}, {selectedLocation.country}
          </span>
        )}
      </div>

      {/* ── Grid ── */}
      <div className="sea-dashboard__grid">
        {/* Pressure MSL — large card spanning 2 cols */}
        <div className="sea-card sea-card--large">
          <div className="sea-card__side">
            <div className="sea-card__icon">
              <IconBarometer size={34} />
            </div>
            <div className="sea-card__label">Mean Sea Level Pressure</div>
            <div
              className="sea-card__value"
              style={{ color: pressureInfo?.color }}
            >
              {pressureMSL != null ? pressureMSL.toFixed(1) : "—"}
              <span className="sea-card__unit"> {u.pressure_msl || "hPa"}</span>
            </div>
            {pressureInfo && (
              <span
                className="sea-card__badge"
                style={{
                  background: pressureInfo.color + "22",
                  color: pressureInfo.color,
                  border: `1px solid ${pressureInfo.color}44`,
                }}
              >
                {pressureInfo.label}
              </span>
            )}
          </div>
          <div className="sea-card__gauge">
            {pressureMSL != null && <PressureGauge value={pressureMSL} />}
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="sea-card">
          <div className="sea-card__icon">
            <IconCloud size={32} />
          </div>
          <div className="sea-card__label">Cloud Cover</div>
          <div className="sea-card__value" style={{ color: "#93c5fd" }}>
            {cloudCover != null ? cloudCover : "—"}
            <span className="sea-card__unit"> %</span>
          </div>
          <div className="sea-card__bar-track">
            <div
              className="sea-card__bar-fill"
              style={{
                width: `${cloudCover ?? 0}%`,
                background: "linear-gradient(90deg, #60a5fa, #93c5fd)",
              }}
            />
          </div>
          <div className="sea-card__sub">
            {cloudCover != null ? getCloudLabel(cloudCover) : ""}
          </div>
        </div>

        {/* Surface Pressure */}
        <div className="sea-card">
          <div className="sea-card__icon">
            <IconSurfacePressure size={32} />
          </div>
          <div className="sea-card__label">Surface Pressure</div>
          <div className="sea-card__value" style={{ color: "#a78bfa" }}>
            {surfacePressure != null ? surfacePressure.toFixed(1) : "—"}
            <span className="sea-card__unit">
              {" "}
              {u.surface_pressure || "hPa"}
            </span>
          </div>
          {pressureMSL != null && surfacePressure != null && (
            <div className="sea-card__sub">
              Δ {Math.abs(pressureMSL - surfacePressure).toFixed(1)} hPa vs MSL
            </div>
          )}
        </div>

        {/* Wind Speed */}
        <div className="sea-card">
          <div className="sea-card__icon">
            <IconWind size={32} />
          </div>
          <div className="sea-card__label">Wind Speed</div>
          <div className="sea-card__value" style={{ color: "#34d399" }}>
            {windSpeed != null ? windSpeed.toFixed(1) : "—"}
            <span className="sea-card__unit">
              {" "}
              {u.wind_speed_10m || "km/h"}
            </span>
          </div>
          <div className="sea-card__bar-track">
            <div
              className="sea-card__bar-fill"
              style={{
                width: `${Math.min(100, ((windSpeed ?? 0) / 100) * 100)}%`,
                background: "linear-gradient(90deg, #10b981, #34d399)",
              }}
            />
          </div>
        </div>

        {/* Wind Gusts */}
        <div className="sea-card">
          <div className="sea-card__icon">
            <IconGust size={32} />
          </div>
          <div className="sea-card__label">Wind Gusts</div>
          <div className="sea-card__value" style={{ color: "#fb923c" }}>
            {windGusts != null ? windGusts.toFixed(1) : "—"}
            <span className="sea-card__unit">
              {" "}
              {u.wind_gusts_10m || "km/h"}
            </span>
          </div>
          <div className="sea-card__bar-track">
            <div
              className="sea-card__bar-fill"
              style={{
                width: `${Math.min(100, ((windGusts ?? 0) / 150) * 100)}%`,
                background: "linear-gradient(90deg, #ea580c, #fb923c)",
              }}
            />
          </div>
        </div>

        {/* Wind Direction Compass */}
        <div className="sea-card sea-card--center">
          <div className="sea-card__label">Wind Direction</div>
          {windDir != null ? (
            <CompassRose degrees={windDir} size={96} />
          ) : (
            <div
              style={{
                height: 96,
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
            className="sea-card__value"
            style={{ fontSize: "1.15rem", marginTop: 4 }}
          >
            {windDir != null ? `${windDir}°` : "—"}
          </div>
          <div className="sea-card__sub">
            {windDir != null ? getWindCardinal(windDir) : ""}
          </div>
        </div>

        {/* Precipitation */}
        <div className="sea-card">
          <div className="sea-card__icon">
            <IconRain size={32} color="#7dd3fc" />
          </div>
          <div className="sea-card__label">Precipitation</div>
          <div className="sea-card__value" style={{ color: "#7dd3fc" }}>
            {precipitation != null ? precipitation.toFixed(1) : "—"}
            <span className="sea-card__unit"> {u.precipitation || "mm"}</span>
          </div>
        </div>

        {/* Rain */}
        <div className="sea-card">
          <div className="sea-card__icon">
            <IconRain size={32} color="#38bdf8" />
          </div>
          <div className="sea-card__label">Rain</div>
          <div className="sea-card__value" style={{ color: "#38bdf8" }}>
            {rain != null ? rain.toFixed(1) : "—"}
            <span className="sea-card__unit"> {u.rain || "mm"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
