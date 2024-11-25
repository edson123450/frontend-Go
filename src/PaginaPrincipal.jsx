import React from "react";
import { useLocation } from "react-router-dom";
import UTECLogo from "./images/UTECLogo.png";
import UPCLogo from "./images/UPC.png";
import UNILogo from "./images/UNILogo.png";
import imagen01 from "./images/imagen01.png";
import imagen02 from "./images/imagen02.png";
import imagen03 from "./images/imagen03.png";
import imagen04 from "./images/imagen04.png";
import "./PaginaPrincipal.css";

function PaginaPrincipal() {
  const location = useLocation();
  const tenant_id = location.state?.tenant_id; // Obtener el tenant_id desde el estado

  let logo;

  // Determinar el logo según el tenant_id
  if (tenant_id === "UTEC") {
    logo = UTECLogo;
  } else if (tenant_id === "UPC") {
    logo = UPCLogo;
  } else if (tenant_id === "UNI") {
    logo = UNILogo;
  } else {
    logo = null; // Manejo opcional si tenant_id no es válido
  }

  return (
    <div className="pagina-principal-container">
      <div className="side-menu">
        {logo && <img src={logo} alt="University Logo" className="university-logo" />}
        <button className="menu-button">Perfil Estudiante</button>
        <button className="menu-button">Inscripciones</button>
        <button className="menu-button">Programas Intercambio</button>
        <button className="menu-button">Encuestas Programas</button>
      </div>
      <div className="image-grid">
        <img src={imagen01} alt="Imagen 01" className="image-item" />
        <img src={imagen02} alt="Imagen 02" className="image-item" />
        <img src={imagen03} alt="Imagen 03" className="image-item" />
        <img src={imagen04} alt="Imagen 04" className="image-item" />
      </div>
    </div>
  );
}

export default PaginaPrincipal;