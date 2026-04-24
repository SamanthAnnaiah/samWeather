import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getGeoCodeData,
  getWeatherData,
  setSelectedDay,
  setSelectedUnits,
  setWeatherDisplay,
  setSearchCardsVisible,
  setSearchWord,
  setLatLan,
  setSelectedLocation,
  resetSearchState,
} from "../../services/dashboardSlice";
import {
  debounceDelay,
  Precipitation,
  Temperature,
  weatherDays,
  weatherParams,
  WindSpeed,
} from "../../utils/constants";
import AutoSelectorData from "../../components/AutoSelectorData";
import MultiSelectorCheckbox from "../../components/MultiSelctorCheckbox";
import { SearchTextField } from "../../components/SearchTextField";
import { ButtonForSearch } from "../../components/ButtonForSearch";
import { SearchCards } from "./SearchCards";
import { WeatherDisplay } from "./WeatherDisplay";

export function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { geoCodeData, weatherData } = useSelector(
    (state) => state.dashboard.data,
  );
  let loading = useSelector((state) => state.dashboard.loading);
  const debounceRef = useRef(null);
  const isFirstRender = useRef(true);
  let {
    selectedDay,
    selectedUnits,
    weatherDisplay,
    searchCardsVisible,
    searchWord,
    latlan,
    selectedLocation,
  } = useSelector((state) => state.dashboard.ui);
  let [localGeoCodeDataLoading, setLocalGeoCodeDataLoading] = useState(false);

  let propsForAutoSelectDay = {
    options: weatherDays || [],
    selectedValue: selectedDay,
    setSelectedValue: (val) => dispatch(setSelectedDay(val)),
    defaultValue: "",
    heading: "",
    isVisible: true,
    isEditable: true,
    placeholder: "Day",
  };
  let propsForAutoSelectUnits = {
    optionsGroup: { Temperature, WindSpeed, Precipitation },
    selectedValues: selectedUnits,
    setSelectedValues: (val) => dispatch(setSelectedUnits(val)),
    isVisible: true,
    isEditable: true,
    heading: "Units",
  };
  let propsButtonForSearch = {
    handleMethod: handleSearch,
    heading: "Search",
    className: "search-button",
  };

  // useEffect(() => {
  //   dispatch(getGeoCodeData("New York"));
  // }, [dispatch]);

  // useEffect(() => {
  //   dispatch(getWeatherData(weatherParams));
  // }, [dispatch]);

  // useEffect(() => {
  //   console.log("Selected Day:", selectedDay);
  // }, [selectedDay]);

  const localGeoCodeData =
    searchWord?.length > 0 && geoCodeData?.results?.length > 0
      ? geoCodeData.results
      : null;

  useEffect(() => {
    if (searchWord?.length === 0) {
      dispatch(resetSearchState());
    }
  }, [searchWord, dispatch]);

  useEffect(() => {
    if (weatherData?.timezone) {
      console.log("Weather Data Updated:", weatherData);
    }
  }, [weatherData]);

  async function handleChangeOnType(value) {
    if (value?.length === 0) {
      return;
    } else {
      setLocalGeoCodeDataLoading(true);
    }
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    await new Promise((resolve) => {
      debounceRef.current = setTimeout(() => {
        resolve();
      }, debounceDelay);
    });
    isFirstRender.current = false;
    setLocalGeoCodeDataLoading(false);
    dispatch(getGeoCodeData(value));
  }

  function handleSelectGeoCodeResult(item) {
    if (!item) return;
    const { latitude, longitude } = item;
    dispatch(
      setSearchWord(
        `${item.name}, ${item.country} - Lat: ${latitude}, Lon: ${longitude}`,
      ),
    );
    dispatch(setSelectedLocation(item));
    dispatch(setLatLan({ latitude, longitude }));
  }

  function handleSearch() {
    let updatedWeatherParams = { ...weatherParams };
    // Only send non-default (non-metric) units — API defaults are celsius, kmh, mm
    if (selectedUnits.includes("fahrenheit")) {
      updatedWeatherParams.temperature_unit = "fahrenheit";
    }
    if (selectedUnits.includes("mph")) {
      updatedWeatherParams.wind_speed_unit = "mph";
    }
    if (selectedUnits.includes("in")) {
      updatedWeatherParams.precipitation_unit = "inch";
    }
    if (latlan.latitude && latlan.longitude) {
      console.log("Fetching weather data for:", latlan);
      dispatch(setSearchCardsVisible(false));
      dispatch(getWeatherData({ ...updatedWeatherParams, ...latlan }));
      dispatch(setWeatherDisplay(true));
    } else {
      if (searchWord?.length > 0) {
        const [lat, lon] = searchWord
          .match(/Lat: ([\d.-]+), Lon: ([\d.-]+)/)
          .slice(1);
        dispatch(setSearchCardsVisible(false));
        dispatch(
          getWeatherData({
            ...updatedWeatherParams,
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
          }),
        );
        dispatch(setWeatherDisplay(true));
      } else {
        console.log(
          "Search word does not contain valid latitude and longitude.",
        );
      }
    }
  }

  let propsForSearchTextField = {
    value: searchWord,
    setValue: (val) => dispatch(setSearchWord(val)),
    handleChangeOnType,
    placeholder: "Search for a place...",
    isVisible: true,
    isEditable: true,
    width: "100%",
  };

  return (
    <>
      <div className="heading1">
        <div>
          <img src="/logo.svg" alt="favicon svg" />
        </div>
        <MultiSelectorCheckbox {...propsForAutoSelectUnits} />
      </div>
      <div className="heading2">
        <h1 className="">How's the sky looking today?</h1>
      </div>

      <div className="search-container">
        <div className="search-field-wrapper">
          <SearchTextField {...propsForSearchTextField} />
          <SearchCards
            localGeoCodeData={localGeoCodeData}
            handleSelectGeoCodeResult={handleSelectGeoCodeResult}
            isFirstRender={isFirstRender}
            localGeoCodeDataLoading={localGeoCodeDataLoading}
            loading={loading}
            searchWord={searchWord}
            visible={searchCardsVisible}
          />
        </div>
        <ButtonForSearch {...propsButtonForSearch} />
      </div>
      <>
        {weatherDisplay &&
          (loading ? (
            <p>Loading weather data...</p>
          ) : weatherData ? (
            <>
              <WeatherDisplay
                propsForAutoSelectDay={propsForAutoSelectDay}
                selectedLocation={selectedLocation}
              />
              <div className="dash-nav-buttons">
                <Link
                  to="/Dashboard/SeaDashboard"
                  className="dash-nav-btn dash-nav-btn--sea"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 6c.6-.5 1.2-.8 2-.8 1 0 2 .8 3 1.3s2 1.3 3 1.3 2-.8 3-1.3 2-1.3 3-1.3 1.4.3 2 .8" />
                    <path d="M2 12c.6-.5 1.2-.8 2-.8 1 0 2 .8 3 1.3s2 1.3 3 1.3 2-.8 3-1.3 2-1.3 3-1.3 1.4.3 2 .8" />
                    <path d="M2 18c.6-.5 1.2-.8 2-.8 1 0 2 .8 3 1.3s2 1.3 3 1.3 2-.8 3-1.3 2-1.3 3-1.3 1.4.3 2 .8" />
                  </svg>
                  Sea Dashboard
                </Link>
                <button
                  className="dash-nav-btn dash-nav-btn--wind"
                  onClick={() =>
                    navigate("/Dashboard/WindDashboard", {
                      state: { from: "Dashboard" },
                    })
                  }
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 32 32"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 10 L20 10 C23 10 25 8 25 6 C25 4 23 2 21 2 C19 2 18 3 18 5" />
                    <path d="M4 16 L24 16 C28 16 30 18 30 20 C30 22 28 24 26 24 C24 24 23 23 23 21" />
                    <path d="M4 22 L18 22 C21 22 23 24 23 26 C23 28 21 30 19 30 C17 30 16 29 16 27" />
                  </svg>
                  Wind Dashboard
                </button>
              </div>
            </>
          ) : null)}
      </>
    </>
  );
}
