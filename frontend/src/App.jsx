import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import Calculator from "./pages/Calculator";
import History from "./pages/History";

// useNavigate ne marche qu'à l'intérieur de <BrowserRouter>,
// d'où ce composant séparé.
function AppRoutes() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  const addToHistory = (entry) => setHistory((prev) => [...prev, entry]);
  const deleteFromHistory = (id) =>
    setHistory((prev) => prev.filter((item) => item.id !== id));
  const clearHistory = () => setHistory([]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Calculator
            onAddHistory={addToHistory}
            onOpenHistory={() => navigate("/history")}
          />
        }
      />
      <Route
        path="/history"
        element={
          <History
            history={history}
            onBack={() => navigate("/")}
            onDelete={deleteFromHistory}
            onClear={clearHistory}
          />
        }
      />
      {/* toute autre URL renvoie à la calculatrice */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}