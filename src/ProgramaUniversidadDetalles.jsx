import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { obtener_programa_universidad_especifico, inscribirse_programa_estudiante } from "./api";
import "./ProgramaUniversidadDetalles.css";

function ProgramaUniversidadDetalles() {
  const location = useLocation();
  const { tenant_id, c_estudiante, c_programa } = location.state;
  const [programaDetalles, setProgramaDetalles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgramaDetalles = async () => {
      try {
        const response = await obtener_programa_universidad_especifico(
          tenant_id,
          c_programa
        );

        if (response.statusCode === 200) {
          setProgramaDetalles(response.response); // Ajustar según la estructura de la respuesta
        } else if (response.statusCode === 404) {
          setError("El programa solicitado no fue encontrado.");
        } else {
          setError("Hubo un error al cargar los detalles del programa.");
        }
      } catch (error) {
        console.error("Error al obtener los detalles del programa:", error);
        setError("Ocurrió un error al intentar obtener los detalles del programa.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgramaDetalles();
  }, [tenant_id, c_programa]);

  const handleInscribirse = async () => {
    if (!programaDetalles) return;

    try {
      const response = await inscribirse_programa_estudiante(
        tenant_id,
        c_estudiante,
        c_programa,
        programaDetalles.monto
      );

      if (response.success) {
        alert(
          "Inscripción exitosa. Puede proceder con el pago en el apartado de 'Inscripciones' en la página principal de inicio."
        );
      } else {
        alert(
          `Hubo un error al intentar inscribirse: ${response.error || "Error desconocido"}`
        );
      }
    } catch (error) {
      console.error("Error durante la inscripción:", error);
      alert("Error al intentar inscribirse. Por favor, intente nuevamente.");
    }
  };

  if (loading) {
    return <p>Cargando detalles del programa...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!programaDetalles) {
    return <p>Error al cargar los detalles del programa.</p>;
  }

  return (
    <div className="detalles-container">
      <h1>Detalles del Programa</h1>
      <div className="detalles-card">
        <h2>{programaDetalles.name}</h2>
        <p><strong>Descripción:</strong> {programaDetalles.descripcion}</p>
        <p><strong>Empresa:</strong> {programaDetalles.empresa}</p>
        <p><strong>Costo:</strong> ${programaDetalles.monto}</p>
        <p><strong>Cupos Disponibles:</strong> {programaDetalles.capacity}</p>
        <p><strong>Fecha de Inicio:</strong> {programaDetalles.start_date}</p>
        <p><strong>Fecha de Fin:</strong> {programaDetalles.end_date}</p>
        <p><strong>Dirección de Alojamiento:</strong> {programaDetalles.direccion_alojamiento}</p>
      </div>
      <button className="inscribirse-button" onClick={handleInscribirse}>
        Inscribirse
      </button>
    </div>
  );
}

export default ProgramaUniversidadDetalles;