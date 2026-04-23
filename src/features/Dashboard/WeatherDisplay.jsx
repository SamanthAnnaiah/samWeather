import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AutoSelectorData } from "../../components/AutoSelectorData";
import { getWeatherIcon } from "../../utils/constants";

export function WeatherDisplay({ propsForAutoSelectDay, selectedLocation }) {
  const weatherData = useSelector((state) => {
    return state.dashboard.data.weatherData;
  });
  const rawDate = weatherData.current.time.split("T")[0]; // "2026-04-21"
  const formattedDate = new Date(rawDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedDay = new Date(rawDate).toLocaleDateString("en-US", {
    weekday: "short",
  });
  const [selectedDay, setSelectedDay] = useState(formattedDay);
  //   const rawTime = weatherData.current.time.split("T")[1]; // "14:30:00"
  const rawTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: selectedLocation?.timezone || "UTC",
  }); // Get current time in the location's timezone
  const formattedTime = new Date(`1970-01-01T${rawTime}`).toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: selectedLocation?.timezone || "UTC",
    },
  );
  const hourlyForecast = weatherData.hourly.time.map((time, index) => {
    const dateStr = time.split("T")[0]; // "2026-04-21"
    const timeStr = time.split("T")[1];
    const day = new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
    }); // "Tue"
    const formattedTime = new Date(`1970-01-01T${timeStr}`).toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        hour12: true,
      },
    ); // "3 PM"
    return {
      time: `${dateStr};${formattedTime};${day}`, // "2026-04-21;Tue"
      temperature: weatherData.hourly.temperature_2m[index],
      weatherCode: weatherData.hourly.weather_code[index] || null,
    };
  });

  const dailyForecast = weatherData.daily.time.map((date, index) => {
    const day = new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
    }); // "Tuesday"

    return {
      day, // "Tuesday"
      weatherCode: weatherData.daily.weather_code[index], // 3
      maxTemp: weatherData.daily.apparent_temperature_max[index], // 55.9
      minTemp: weatherData.daily.apparent_temperature_min[index], // 33.6
    };
  });

  useEffect(() => {
    if (selectedDay) {
      let matchingDayData = hourlyForecast.filter((entry) =>
        entry.time.includes(selectedDay),
      );
      console.log("Matching day data:", matchingDayData);
    }
  }, [selectedDay]);

  return (
    <>
      <div className="weatherDisplay">
        <div className="weatherDisplay__item1">
          <div>
            <h2>
              {selectedLocation
                ? `${selectedLocation.name}, ${selectedLocation.country}`
                : "Location data not available"}
            </h2>
            <p>{formattedDate}</p>
            <p>{formattedTime}</p>
          </div>
          <div className="weatherDisplay__item1__temp">
            <span>
              {weatherData?.current?.weather_code !== undefined ? (
                <img
                  src={`/icon-${getWeatherIcon(weatherData.current.weather_code)}.webp`}
                  alt="Weather Icon"
                  height="90"
                  width="100"
                />
              ) : null}
            </span>
            <span className="tempHead">
              {weatherData?.current?.temperature_2m !== undefined
                ? `${weatherData.current.temperature_2m.toFixed(0)}${weatherData?.current_units?.temperature_2m}`
                : "Temperature data not available"}
            </span>
          </div>
        </div>
        <div className="weatherDisplay__item2">
          <div>
            <AutoSelectorData
              {...propsForAutoSelectDay}
              heading="Hourly forecast"
              selectedValue={selectedDay}
              setSelectedValue={setSelectedDay}
            />
          </div>
          <div>
            {hourlyForecast
              .filter((entry) => entry.time.includes(selectedDay))
              .map((entry, index) => (
                <div key={index} className="hourly-entry">
                  <p>
                    <img
                      src={`/icon-${getWeatherIcon(entry.weatherCode)}.webp`}
                      alt="Weather Icon"
                      height="30"
                      width="40"
                    />{" "}
                    {entry.time.split(";")[1]}
                  </p>
                  <p>
                    {entry.temperature.toFixed(1)}
                    {weatherData?.current_units?.temperature_2m}
                  </p>
                </div>
              ))}
          </div>
        </div>
        <div className="weatherDisplay__item3">
          <div>
            <p>Feels like </p>
            <p>
              {weatherData?.current?.apparent_temperature !== undefined
                ? `${weatherData.current.apparent_temperature.toFixed(0)}${weatherData?.current_units?.apparent_temperature}`
                : "Data not available"}
            </p>
          </div>
          <div>
            <p>Humidity </p>
            <p>
              {weatherData?.current?.relative_humidity_2m !== undefined
                ? `${weatherData.current.relative_humidity_2m.toFixed(0)}${weatherData?.current_units?.relative_humidity_2m}`
                : "Data not available"}
            </p>
          </div>
          <div>
            <p>Wind </p>
            <p>
              {weatherData?.current?.wind_speed_10m !== undefined
                ? `${weatherData.current.wind_speed_10m.toFixed(0)}${weatherData?.current_units?.wind_speed_10m}`
                : "Data not available"}
            </p>
          </div>
          <div>
            <p>Precipitation </p>
            <p>
              {weatherData?.current?.precipitation !== undefined
                ? `${weatherData.current.precipitation.toFixed(0)}${weatherData?.current_units?.precipitation}`
                : "Data not available"}
            </p>
          </div>
        </div>
        <div className="weatherDisplay__item4">
          <p className="mb1">Daily Forecast</p>
          <div className="weatherDisplay__item4__details">
            {dailyForecast.map((entry, index) => (
              <div key={index} className="daily-entry">
                <p>{entry.day}</p>
                <p>
                  <img
                    src={`/icon-${getWeatherIcon(entry.weatherCode)}.webp`}
                    alt="Weather Icon"
                    height="30"
                    width="40"
                  />
                </p>
                <p className="daily-entry__temp">
                  <div>{entry.maxTemp.toFixed(0)}&deg;</div>
                  <div>{entry.minTemp.toFixed(0)}&deg;</div>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
