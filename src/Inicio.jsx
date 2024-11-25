import React from "react";
import { useNavigate } from "react-router-dom";
import "./Inicio.css";

function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="inicio">
      <button
        className="boton utec"
        onClick={() => navigate("/utec")}
      >
        UTEC
      </button>
      <button
        className="boton upc"
        onClick={() => navigate("/upc")}
      >
        UPC
      </button>
      <button
        className="boton uni"
        onClick={() => navigate("/uni")}
      >
        UNI
      </button>
    </div>
  );
}

export default Inicio;