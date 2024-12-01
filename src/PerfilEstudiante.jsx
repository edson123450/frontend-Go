import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { obtener_alumno_por_codigo } from "./api";
import "./PerfilEstudiante.css";

function PerfilEstudiante() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tenant_id, c_estudiante } = location.state;

  const [studentInfo, setStudentInfo] = useState({
    nombres: "",
    apellidos: "",
    edad: "",
    c_estudiante: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await obtener_alumno_por_codigo(tenant_id, c_estudiante);
        if (response) {
          setStudentInfo({
            nombres: response.datos_estudiante.nombres,
            apellidos: response.datos_estudiante.apellidos,
            edad: response.datos_estudiante.edad,
            c_estudiante: response.c_estudiante,
            email: response.email,
          });
        } else {
          setError("No se pudo cargar la información del estudiante.");
        }
      } catch (error) {
        setError("Hubo un error al obtener la información del estudiante.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [tenant_id, c_estudiante]);

  const handleBack = () => {
    navigate(-1); // Navegar hacia la página anterior
  };

  if (loading) {
    return <p>Cargando información del estudiante...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="perfil-estudiante-container">
      <h1>Perfil del Estudiante</h1>
      <div className="perfil-estudiante-card">
        <p><strong>Nombre:</strong> {studentInfo.nombres} {studentInfo.apellidos}</p>
        <p><strong>Edad:</strong> {studentInfo.edad}</p>
        <p><strong>Código del Estudiante:</strong> {studentInfo.c_estudiante}</p>
        <p><strong>Email:</strong> {studentInfo.email}</p>
      </div>
      <button onClick={handleBack} className="back-button">
        Atrás
      </button>
    </div>
  );
}

export default PerfilEstudiante;