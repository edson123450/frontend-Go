import React, { useState } from "react";
import "./UtecInicio.css";
import avionUtec from "./images/avionUtec.png";
import { useNavigate } from "react-router-dom";
import { login } from "./api";
import { informacion_estudiante } from "./api";

function UtecInicio() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Validar si el email termina en "utec.edu.pe"
    if (!email.endsWith("@utec.edu.pe")) {
      setError("El correo debe pertenecer al dominio 'utec.edu.pe'");
      return;
    }

    // Intentar iniciar sesión usando la API
    try {
      const response = await login(email, password);
      console.log(response.success);
      if (response.success) {
        // Redirigir a PaginaPrincipal.jsx con el tenant_id "UTEC"
        const c_estudiante= await informacion_estudiante(email);
        console.log(c_estudiante);
        if (!c_estudiante || c_estudiante.success === false) {
            setError("Error obteniendo información del estudiante.");
            return;
        }
        //console.log(response.success);
        navigate("/pagina-principal", { state: { tenant_id: "UTEC", c_estudiante: c_estudiante } });
      } else {
        setError("Credenciales inválidas. Por favor, intente nuevamente.");
      }
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión. Intente nuevamente.");
    }
  };

  return (
    <div className="utec-container">
      <header className="header">
        <img src={avionUtec} alt="UTEC Logo" className="utec-logo-header" />
        <button className="back-button" onClick={() => navigate("/")}>
          Atrás
        </button>
      </header>
      <div className="login-section">
        <img src={avionUtec} alt="UTEC GO" className="utec-image" />
        <div className="login-box">
          <h1>Ingresar a UTEC GO</h1>
          {error && <p className="error-message">{error}</p>}
          <input
            type="email"
            placeholder="example@utec.edu.pe"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" onClick={handleLogin}>
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default UtecInicio;