import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./EncuestasProgramas.css";
import ImagenPaginaEncuestas from "./images/ImagenPaginaEncuestas.png";

function EncuestasProgramas() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tenant_id, c_estudiante } = location.state;

  const handleNavigateToCrearEncuesta = () => {
    navigate("/crear-encuesta", { state: { tenant_id, c_estudiante } });
  };

  const handleNavigateToListarEncuestas = () => {
    navigate("/listar-encuestas", { state: { tenant_id, c_estudiante } });
  };

  return (
    <div className="encuestas-programas-container">
      <div className="encuestas-programas-header">
        <h1>Encuestas Programas</h1>
      </div>
      <div className="encuestas-programas-content">
        <div className="buttons-container">
          <button
            className="encuesta-button"
            onClick={handleNavigateToCrearEncuesta}
          >
            Crear Encuesta
          </button>
          <button
            className="encuesta-button"
            onClick={handleNavigateToListarEncuestas}
          >
            Listar Encuestas
          </button>
        </div>
        <div className="image-container">
          <img
            src={ImagenPaginaEncuestas}
            alt="Encuestas Programas"
            className="encuestas-image"
          />
        </div>
      </div>
    </div>
  );
}

export default EncuestasProgramas;