import { Routes, Route, Navigate } from "react-router-dom";
import { SeaDashboard } from "./features/SeaDashboard/SeaDashboard";
import { WindDashboard } from "./features/WindDashboard";
import { Dashboard } from "./features/Dashboard/Dashboard";
import { SomeError } from "./features/ErrorHandling/SomeError";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Dashboard" replace />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Dashboard/WindDashboard" element={<WindDashboard />} />
      <Route path="/Dashboard/SeaDashboard" element={<SeaDashboard />} />
      <Route path="*" element={<SomeError />} />
    </Routes>
  );
}

export default App;
