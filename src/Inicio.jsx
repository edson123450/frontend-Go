import React from "react";
import { useNavigate } from "react-router-dom";
import "./Inicio.css";
//import universidadUTEC from "./assets/images/universidadUTEC.jpg";
//import universidadUPC from "./assets/images/universidadUPC.jpg";
//import universidadUNI from "./assets/images/universidadUNI.jpeg";
import universidadUTEC from "./images/universidadUTEC.jpg";
import universidadUPC from "./images/universidadUPC.jpg";
import universidadUNI from "./images/universidadUNI.jpeg";

function Inicio() {
  const navigate = useNavigate();

  const handleNavigation = (tenant_id) => {
    navigate("/universidades-inicio", { state: { tenant_id } });
  };

  return (
    <div className="inicio">
      {/* UTEC */}
      <div className="universidad-container">
        <img src={universidadUTEC} alt="UTEC" className="universidad-imagen" />
        <button
          className="boton utec"
          onClick={() => handleNavigation("UTEC")}
        >
          UTEC
        </button>
      </div>
      {/* UPC */}
      <div className="universidad-container">
        <img src={universidadUPC} alt="UPC" className="universidad-imagen" />
        <button
          className="boton upc"
          onClick={() => handleNavigation("UPC")}
        >
          UPC
        </button>
      </div>
      {/* UNI */}
      <div className="universidad-container">
        <img src={universidadUNI} alt="UNI" className="universidad-imagen" />
        <button
          className="boton uni"
          onClick={() => handleNavigation("UNI")}
        >
          UNI
        </button>
      </div>
    </div>
  );
}

export default Inicio;