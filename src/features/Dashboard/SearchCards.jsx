export function SearchCards({
  localGeoCodeData,
  handleSelectGeoCodeResult,
  isFirstRender,
  localGeoCodeDataLoading,
  loading,
  searchWord,
  visible,
}) {
  if (!visible) return null;
  return (
    <div className="search-type-results">
      <div className="search-type-results__container">
        {localGeoCodeData?.length > 0 ? (
          localGeoCodeData.map((item, index) => (
            <div key={index}>
              <p onClick={() => handleSelectGeoCodeResult(item)}>
                {item.name}, {item.admin1} & {item.country} - Lat:
                {item.latitude}, Lon: {item.longitude}
              </p>
            </div>
          ))
        ) : (
          <p>
            {isFirstRender.current
              ? ""
              : localGeoCodeDataLoading
                ? "Loading..."
                : loading
                  ? "Loading..."
                  : searchWord?.length > 0 && "No results found"}
          </p>
        )}
      </div>
    </div>
  );
}
