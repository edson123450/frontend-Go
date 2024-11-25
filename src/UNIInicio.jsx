import React from "react";
import "./UNIInicio.css";
import uniLogo from "./images/UNILogo.png";
import { useNavigate } from "react-router-dom";

function UNIInicio() {
  const navigate = useNavigate();

  return (
    <div className="uni-container">
      <div className="header">
        <button className="back-button" onClick={() => navigate("/")}>
          Atrás
        </button>
        <div className="uni-go">
          <span>UNI GO</span>
        </div>
      </div>
      <div className="login-section">
        <img src={uniLogo} alt="UNI Logo" className="uni-logo" />
        <div className="login-box">
          <h1>Ingresar a UNI GO</h1>
          <input type="email" placeholder="example@gmail.com" className="input" />
          <input type="password" placeholder="Password" className="input" />
          <button className="login-button">Iniciar Sesión</button>
        </div>
      </div>
    </div>
  );
}

export default UNIInicio;