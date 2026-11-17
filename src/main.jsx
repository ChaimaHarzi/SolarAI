import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, MemoryRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";

// HashRouter : les adresses ressemblent à .../#/alertes, ce qui marche
// même sur un hébergement simple sans configuration du serveur.
// Si la page est affichée dans un cadre (iframe), on garde la navigation en mémoire.
const Router = window.self !== window.top ? MemoryRouter : HashRouter;
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
