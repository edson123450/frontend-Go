import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { crear_encuesta } from "./api"; // Importar la API
import "./CrearEncuesta.css";

function CrearEncuesta() {
  const location = useLocation();
  const { tenant_id, c_estudiante } = location.state;

  const [formData, setFormData] = useState({
    c_programa: "",
    tipo_encuesta: "experiencia", // Valor predeterminado
    descripcion: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparar los valores para la API
    const valor1 = `${tenant_id}#${formData.c_programa}`;
    const valor2 = `${formData.tipo_encuesta.toLowerCase()}#${c_estudiante}`;
    const descripcion = formData.descripcion;

    try {
      // Llamar a la API
      const response = await crear_encuesta(valor1, valor2, descripcion);

      if (response.success) {
        setSuccessMessage("Encuesta creada exitosamente.");
        setErrorMessage("");
        // Reiniciar el formulario
        setFormData({
          c_programa: "",
          tipo_encuesta: "experiencia", // Reiniciar a valor predeterminado
          descripcion: "",
        });
      } else {
        setErrorMessage("Error al crear la encuesta. Intenta nuevamente.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error al enviar la encuesta:", error);
      setErrorMessage("Ocurrió un error. Por favor, intenta nuevamente.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="crear-encuesta-container">
      <h1>Crear Encuesta</h1>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="crear-encuesta-form">
        {/* Código del programa */}
        <div className="form-group">
          <label htmlFor="c_programa">Código del programa</label>
          <input
            type="text"
            id="c_programa"
            name="c_programa"
            value={formData.c_programa}
            onChange={handleChange}
            placeholder="Ingresa el código del programa"
            required
          />
        </div>

        {/* Tipo de encuesta */}
        <div className="form-group">
          <label>Tipo de encuesta</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="tipo_encuesta"
                value="experiencia"
                checked={formData.tipo_encuesta === "experiencia"}
                onChange={handleChange}
              />
              Experiencia
            </label>
            <label>
              <input
                type="radio"
                name="tipo_encuesta"
                value="recomendaciones"
                checked={formData.tipo_encuesta === "recomendaciones"}
                onChange={handleChange}
              />
              Recomendaciones
            </label>
            <label>
              <input
                type="radio"
                name="tipo_encuesta"
                value="satisfaccion"
                checked={formData.tipo_encuesta === "satisfaccion"}
                onChange={handleChange}
              />
              Satisfacción
            </label>
          </div>
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Escribe tu opinión sobre el programa..."
            required
          />
        </div>

        {/* Botón de envío */}
        <button type="submit" className="submit-button">
          Enviar Encuesta
        </button>
      </form>
    </div>
  );
}

export default CrearEncuesta;