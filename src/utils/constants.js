export const dashBoardScreenHeader1 = "Weather Now";
export const dashBoardScreenHeader2 = "How's the sky looking today?";
export const debounceDelay = 1000;

export let weatherParams = {
  latitude: 52.52,
  longitude: 13.41,
  daily: [
    "apparent_temperature_max",
    "apparent_temperature_min",
    "weather_code",
  ],
  hourly: ["temperature_2m", "weather_code", "relative_humidity_2m"],
  current: [
    "wind_speed_10m",
    "weather_code",
    "precipitation",
    "rain",
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "wind_speed_10m",
    "wind_direction_10m",
    "wind_gusts_10m",
    "pressure_msl",
    "surface_pressure",
    "cloud_cover",
  ],
};

export const weatherDays = [
  { label: "Monday", value: "Mon" },
  { label: "Tuesday", value: "Tue" },
  { label: "Wednesday", value: "Wed" },
  { label: "Thursday", value: "Thu" },
  { label: "Friday", value: "Fri" },
  { label: "Saturday", value: "Sat" },
  { label: "Sunday", value: "Sun" },
];
export const getWeatherIcon = (code) => {
  if (code === 0) return "sunny";
  if (code <= 3) return "partly-cloudy";
  if (code <= 48) return "fog";
  if (code <= 55) return "drizzle";
  if (code <= 65) return "rain";
  if (code <= 75) return "snow";
  if (code <= 82) return "drizzle";
  if (code <= 95) return "storm";
};

export const Temperature = [
  { label: "Fahrenheit(°F)", value: "fahrenheit" },
  { label: "Celsius(°C)", value: "celsius" },
];
export const WindSpeed = [
  { label: "mph", value: "mph" },
  { label: "km/h", value: "kmh" },
];
export const Precipitation = [
  { label: "Inches(in)", value: "in" },
  { label: "Millimeters(mm)", value: "mm" },
];
