import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./UniversidadesInicio.css";
import avionUtec from "./images/avionUtec.png";
import upcLogo from "./images/UPC.png";
import uniLogo from "./images/UNILogo.png";
import { login, informacion_estudiante } from "./api";

function UniversidadesInicio() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tenant_id } = location.state || {};

  // Estado para formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Manejar login
  const handleLogin = async () => {
    // Validar dominio de correo según la universidad
    let domain;
    switch (tenant_id) {
      case "UTEC":
        domain = "utec.edu.pe";
        break;
      case "UPC":
        domain = "upc.edu.pe";
        break;
      case "UNI":
        domain = "uni.edu.pe";
        break;
      default:
        setError("Universidad no válida.");
        return;
    }

    if (!email.endsWith(`@${domain}`)) {
      setError(`El correo debe pertenecer al dominio '${domain}'`);
      return;
    }

    try {
      // Intentar iniciar sesión usando la API
      const response = await login(email, password);

      if (response.success) {
        // Obtener información del estudiante
        const c_estudiante_response = await informacion_estudiante(email);
        const c_estudiante = c_estudiante_response;

        if (!c_estudiante || c_estudiante_response.success === false) {
          setError("Error obteniendo información del estudiante.");
          return;
        }

        // Redirigir a PaginaPrincipal.jsx con tenant_id y c_estudiante
        navigate("/pagina-principal", { state: { tenant_id, c_estudiante } });
      } else {
        setError("Credenciales inválidas. Por favor, intente nuevamente.");
      }
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión. Intente nuevamente.");
    }
  };

  // Configuración dinámica según el tenant_id
  const universityConfig = {
    UTEC: {
      image: avionUtec,
      buttonColor: "blue",
      title: "Ingresar a UTEC GO",
      backColor: "darkblue",
    },
    UPC: {
      image: upcLogo,
      buttonColor: "red",
      title: "Ingresar a UPC GO",
      backColor: "darkred",
    },
    UNI: {
      image: uniLogo,
      buttonColor: "#8B4513", // Marrón
      title: "Ingresar a UNI GO",
      backColor: "#5A3310", // Marrón oscuro
    },
  };

  const { image, buttonColor, title, backColor } =
    universityConfig[tenant_id] || {};

  return (
    <div className="universidades-container">
      <header className="header">
        <button
          className="back-button"
          style={{ backgroundColor: buttonColor }}
          onClick={() => navigate("/")}
        >
          Atrás
        </button>
      </header>
      <div className="login-section">
        {image && <img src={image} alt={`${tenant_id} Logo`} className="uni-logo" />}
        <div className="login-box">
          <h1>{title}</h1>
          {error && <p className="error-message">{error}</p>}
          <input
            type="email"
            placeholder={`Correo institucional (@${tenant_id.toLowerCase()}.edu.pe)`}
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="login-button"
            style={{ backgroundColor: buttonColor }}
            onClick={handleLogin}
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default UniversidadesInicio;