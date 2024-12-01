import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { listar_encuestas, obtener_programa_universidad_especifico, obtener_alumno_por_codigo } from "./api";
import "./ListaEncuestas.css";

function ListaEncuestas() {
  const location = useLocation();
  const { tenant_id, c_estudiante } = location.state;

  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEncuestas = async () => {
      try {
        const encuestasResponse = await listar_encuestas(tenant_id);

        if (!encuestasResponse || encuestasResponse.success === false) {
          console.error("Error al listar encuestas:", encuestasResponse?.error);
          setLoading(false);
          return;
        }

        const encuestasData = encuestasResponse.data;

        const processedEncuestas = await Promise.all(
          encuestasData.map(async (encuesta) => {
            try {
              // Extraer el valor completo de c_programa
              const c_programa =
                encuesta["c_programa#c_estudiante"]?.split("#").slice(0, 4).join("#") ||
                encuesta["tipo#c_programa"]?.split("#").slice(1).join("#") ||
                encuesta["tenant_id#c_programa"]?.split("#").slice(1).join("#");

              if (!c_programa) return null;

              // Obtener datos del programa
              //console.log(tenant_id);
              //console.log(c_programa);
              const programaResponse = await obtener_programa_universidad_especifico(tenant_id, c_programa);
              if (!programaResponse || programaResponse.success === false) return null;

              const programaName = programaResponse.response?.name || "Programa desconocido";

              // Extraer c_estudiante2
              const c_estudiante2 =
                encuesta["tenant_id#c_estudiante"]?.split("#")[1] ||
                encuesta["c_programa#c_estudiante"]?.split("#")[4] ||
                encuesta["tipo#c_estudiante"]?.split("#")[1];

              if (!c_estudiante2) return null;

              // Obtener datos del estudiante
              console.log(c_estudiante2);
              const estudianteResponse = await obtener_alumno_por_codigo(tenant_id, c_estudiante2);
              console.log(estudianteResponse);
              if (!estudianteResponse || estudianteResponse.success === false) return null;

              const estudianteName = `${estudianteResponse.datos_estudiante.nombres} ${estudianteResponse.datos_estudiante.apellidos}`;

              // Extraer el tipo de encuesta
              const tipo =
                encuesta["tenant_id#tipo"]?.split("#")[1] ||
                encuesta["tipo#c_programa"]?.split("#")[0] ||
                encuesta["tipo#c_estudiante"]?.split("#")[0];

              // Retornar la encuesta procesada
              return {
                programaName,
                estudianteName,
                descripcion: encuesta.descripcion,
                tipo,
              };
            } catch (error) {
              console.error("Error procesando encuesta:", error);
              return null;
            }
          })
        );

        setEncuestas(processedEncuestas.filter((encuesta) => encuesta !== null));
      } catch (error) {
        console.error("Error al obtener encuestas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEncuestas();
  }, [tenant_id]);

  if (loading) {
    return <p>Cargando encuestas...</p>;
  }

  if (encuestas.length === 0) {
    return <p>No hay encuestas disponibles.</p>;
  }

  return (
    <div className="lista-encuestas-container">
      <h1>Lista de Encuestas</h1>
      <div className="encuestas-list">
        {encuestas.map((encuesta, index) => (
          <div key={index} className="encuesta-card">
            <h2>{encuesta.programaName}</h2>
            <p><strong>Autor:</strong> {encuesta.estudianteName}</p>
            <p><strong>Descripción:</strong> {encuesta.descripcion}</p>
            <p><strong>Tipo de encuesta:</strong> {encuesta.tipo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListaEncuestas;