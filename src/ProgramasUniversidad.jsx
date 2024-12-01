import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { obtener_programas_universidad } from "./api";
import "./ProgramasUniversidad.css";

function ProgramasUniversidad() {
  const location = useLocation();
  const navigate = useNavigate();
  const tenant_id = location.state?.tenant_id;
  const c_estudiante = location.state?.c_estudiante;
  const [programas, setProgramas] = useState([]);
  const [page, setPage] = useState(1); // Página actual para paginación
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Determina si hay más datos por cargar

  const itemsPerPage = 20; // Número de programas a cargar por página

  const extractCountryCity = (c_programa) => {
    const parts = c_programa.split("#");
    return {
      country: parts[1] || "N/A", // País después del primer "#"
      city: parts[2] || "N/A", // Ciudad después del segundo "#"
    };
  };

  useEffect(() => {
    const fetchProgramas = async () => {
      if (loading || !hasMore) return;
      setLoading(true);
      try {
        const response = await obtener_programas_universidad(tenant_id);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = page * itemsPerPage;

        // Simula paginación desde la respuesta completa
        const nextProgramas = response.slice(startIndex, endIndex);
        setProgramas((prev) => [...prev, ...nextProgramas]);

        // Determina si hay más elementos para cargar
        if (response.length <= endIndex) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error al obtener los programas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramas();
  }, [tenant_id, page]);

  // Detectar el scroll para cargar más elementos
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 50 &&
        hasMore &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  const handleVerMasDetalles = (c_programa) => {
    // Navegar hacia ProgramaUniversidadDetalles.jsx con los datos requeridos
    navigate("/programa-universidad-detalles", {
      state: { tenant_id, c_estudiante, c_programa },
    });
  };

  return (
    <div className="programas-container">
      <h1>Programas Disponibles</h1>
      {programas.map((programa, index) => {
        const { country, city } = extractCountryCity(programa.c_programa);
        return (
          <div key={index} className="programa-card">
            <h2>{programa.datos_programa.name}</h2>
            <div className="programa-info">
              <div className="programa-column">
                <p><strong>País:</strong> {country}</p>
                <p><strong>Ciudad:</strong> {city}</p>
              </div>
              <div className="programa-column">
                <p><strong>Fecha Inicio:</strong> {programa.datos_programa.start_date}</p>
                <p><strong>Fecha Fin:</strong> {programa.datos_programa.end_date}</p>
              </div>
              <div className="programa-column">
                <p><strong>Costo:</strong> ${programa.datos_programa.monto}</p>
                <p><strong>Cupos:</strong> {programa.datos_programa.capacity}</p>
              </div>
            </div>
            <button
              className="ver-mas-button"
              onClick={() => handleVerMasDetalles(programa.c_programa)}
            >
              Ver más detalles
            </button>
          </div>
        );
      })}
      {loading && <p>Cargando más programas...</p>}
      {!hasMore && <p>No hay más programas para mostrar.</p>}
    </div>
  );
}

export default ProgramasUniversidad;