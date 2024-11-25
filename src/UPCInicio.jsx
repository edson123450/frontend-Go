import React from "react";
import "./UPCInicio.css";
import upcLogo from "./images/UPC.png";
import { useNavigate } from "react-router-dom";

function UPCInicio() {
  const navigate = useNavigate();

  return (
    <div className="upc-container">
      <div className="header">
        <button className="back-button" onClick={() => navigate("/")}>
          Atrás
        </button>
        <div className="upc-go">
          <span>UPC GO</span>
        </div>
      </div>
      <div className="login-section">
        <img src={upcLogo} alt="UPC Logo" className="upc-logo" />
        <div className="login-box">
          <h1>Ingresar a UPC GO</h1>
          <input type="email" placeholder="example@gmail.com" className="input" />
          <input type="password" placeholder="Password" className="input" />
          <button className="login-button2">Iniciar Sesión</button>
        </div>
      </div>
    </div>
  );
}

export default UPCInicio;