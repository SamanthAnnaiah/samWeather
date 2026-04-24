import { useNavigate } from "react-router-dom";

export function SomeError() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-page__card">
        <div className="error-page__logo">
          <img src="/logo.svg" alt="samWeather logo" />
        </div>
        <div className="error-page__code">404</div>
        <h1 className="error-page__title">Page Not Found</h1>
        <p className="error-page__message">
          Looks like this page drifted off the radar. The route you're looking
          for doesn't exist.
        </p>
        <button
          className="search-button error-page__btn"
          onClick={() => navigate("/Dashboard", { replace: true })}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
