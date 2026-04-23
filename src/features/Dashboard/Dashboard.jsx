import { use, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getGeoCodeData,
  getWeatherData,
  setLocalGeoCodeData,
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
  let { geoCodeData, weatherData } = useSelector(
    (state) => state.dashboard.data,
  );
  let loading = useSelector((state) => state.dashboard.loading);
  let error = useSelector((state) => state.dashboard.error);
  const debounceRef = useRef(null);
  const isFirstRender = useRef(true);
  let [selectedDay, setSelectedDay] = useState("");
  let [selectedUnits, setSelectedUnits] = useState([]);
  let [weatherDisplay, setWeatherDisplay] = useState(null);
  let [searchCardsVisible, setSearchCardsVisible] = useState(false);
  let [searchWord, setSearchWord] = useState("");
  let [latlan, setLatLan] = useState({ latitude: null, longitude: null });
  let [selectedLocation, setSelectedLocation] = useState(null);
  let [localGeoCodeDataLoading, setLocalGeoCodeDataLoading] = useState(false);

  let propsForAutoSelectDay = {
    options: weatherDays || [],
    selectedValue: selectedDay,
    setSelectedValue: setSelectedDay,
    defaultValue: "",
    heading: "",
    isVisible: true,
    isEditable: true,
    placeholder: "Day",
  };
  let propsForAutoSelectUnits = {
    optionsGroup: { Temperature, WindSpeed, Precipitation },
    selectedValues: selectedUnits,
    setSelectedValues: setSelectedUnits,
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
      setSearchCardsVisible(true);
      setWeatherDisplay(null);
      setSelectedLocation(null);
      setLatLan({ latitude: null, longitude: null });
      dispatch(setLocalGeoCodeData(null));
    }
  }, [searchWord]);

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
    setSearchWord(
      `${item.name}, ${item.country} - Lat: ${latitude}, Lon: ${longitude}`,
    );
    setSelectedLocation(item);
    setLatLan({ latitude, longitude });
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
      setSearchCardsVisible(false);
      dispatch(getWeatherData({ ...updatedWeatherParams, ...latlan }));
      setWeatherDisplay(true);
    } else {
      if (searchWord?.length > 0) {
        const [lat, lon] = searchWord
          .match(/Lat: ([\d.-]+), Lon: ([\d.-]+)/)
          .slice(1);
        setSearchCardsVisible(false);
        dispatch(
          getWeatherData({
            ...updatedWeatherParams,
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
          }),
        );
        setWeatherDisplay(true);
      } else {
        console.log(
          "Search word does not contain valid latitude and longitude.",
        );
      }
    }
  }

  let propsForSearchTextField = {
    value: searchWord,
    setValue: setSearchWord,
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
            <WeatherDisplay
              propsForAutoSelectDay={propsForAutoSelectDay}
              selectedLocation={selectedLocation}
            />
          ) : null)}
      </>
    </>
  );
}
