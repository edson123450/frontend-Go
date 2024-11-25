import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./Inicio";
import UTECInicio from "./UtecInicio";
import UPCInicio from "./UPCInicio";
import UNIInicio from "./UNIInicio";
import PaginaPrincipal from "./PaginaPrincipal";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/utec" element={<UTECInicio />} />
        <Route path="/upc" element={<UPCInicio />} />
        <Route path="/uni" element={<UNIInicio />} />
        <Route path="/pagina-principal" element={<PaginaPrincipal />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);