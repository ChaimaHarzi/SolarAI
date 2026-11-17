import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Accueil from "./pages/Accueil.jsx";
import Production from "./pages/Production.jsx";
import Alertes from "./pages/Alertes.jsx";
import DetailAlerte from "./pages/DetailAlerte.jsx";
import Installations from "./pages/Installations.jsx";

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/production" element={<Production />} />
          <Route path="/alertes" element={<Alertes />} />
          <Route path="/alertes/:id" element={<DetailAlerte />} />
          <Route path="/installations" element={<Installations />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
