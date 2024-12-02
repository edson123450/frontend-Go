import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./Inicio";
import UTECInicio from "./UtecInicio";
import UPCInicio from "./UPCInicio";
import UNIInicio from "./UNIInicio";
import PaginaPrincipal from "./PaginaPrincipal";
import ProgramasUniversidad from "./ProgramasUniversidad";
import ProgramaUniversidadDetalles from "./ProgramaUniversidadDetalles";
import InscripcionesEstudiante from "./InscripcionesEstudiante";
import FaseDePago from "./FaseDePago";
import EncuestasProgramas from "./EncuestasProgramas";
import ListaEncuestas from "./ListaEncuestas";
import CrearEncuesta from "./CrearEncuesta";
import PerfilEstudiante from "./PerfilEstudiante";
import UniversidadesInicio from "./UniversidadesInicio";
/*
        <Route path="/utec" element={<UTECInicio />} />
        <Route path="/upc" element={<UPCInicio />} />
        <Route path="/uni" element={<UNIInicio />} />
*/

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/universidades-inicio" element={<UniversidadesInicio />} />
        <Route path="/pagina-principal" element={<PaginaPrincipal />} />
        <Route path="/programas-universidad" element={<ProgramasUniversidad/>} />
        <Route path="/programa-universidad-detalles" element={<ProgramaUniversidadDetalles />} />
        <Route path="/inscripciones-estudiante" element={<InscripcionesEstudiante/>} />
        <Route path="/fase-de-pago" element={<FaseDePago/>} />
        <Route path="/encuestas-programas" element={<EncuestasProgramas/>} />
        <Route path="/listar-encuestas" element={<ListaEncuestas/>} />
        <Route path="/crear-encuesta" element={<CrearEncuesta/>} />
        <Route path="/perfil-estudiante" element={<PerfilEstudiante/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);