import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  inscripciones_pendientes_estudiante,
  obtener_programa_universidad_especifico,
  descuentos_estudiante,
} from "./api";
import "./InscripcionesEstudiante.css";

function InscripcionesEstudiante() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tenant_id, c_estudiante } = location.state;

  const [programas, setProgramas] = useState([]);
  const [descuentos, setDescuentos] = useState([]);
  const [programaSeleccionado, setProgramaSeleccionado] = useState(null);
  const [descuentoSeleccionado, setDescuentoSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProgramas = async () => {
      try {
        const programasPendientes = await inscripciones_pendientes_estudiante(
          tenant_id,
          c_estudiante
        );

        const programasValidos = [];
        for (const programa of programasPendientes) {
          const response = await obtener_programa_universidad_especifico(
            tenant_id,
            programa.c_programa
          );

          if (response.statusCode === 200) {
            const datosPrograma = response.response;

            const [_, country, city] = programa.c_programa.split("#");
            programasValidos.push({
              ...programa,
              datos_programa: {
                ...datosPrograma,
                country: country || "N/A",
                city: city || "N/A",
                payment_deadline: calculatePaymentDeadline(datosPrograma.start_date),
              },
            });
          }
        }

        setProgramas(programasValidos);
      } catch (error) {
        console.error("Error al obtener programas:", error);
      }
    };

    fetchProgramas();
  }, [tenant_id, c_estudiante]);

  const calculatePaymentDeadline = (startDate) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() - 14);
    return date.toISOString().split("T")[0];
  };

  const handleVerDescuentos = async () => {
    try {
      const response = await descuentos_estudiante(tenant_id, c_estudiante);
      setDescuentos(response);
    } catch (error) {
      console.error("Error al obtener descuentos:", error);
    }
  };

  const handleSeleccionarPrograma = (programa) => {
    setProgramaSeleccionado(programa === programaSeleccionado ? null : programa);
  };

  const handleSeleccionarDescuento = (descuento) => {
    if (descuentoSeleccionado === descuento) {
      setDescuentoSeleccionado(null);
      descuento.datos_descuento.stock += 1;
    } else {
      if (descuentoSeleccionado) {
        descuentoSeleccionado.datos_descuento.stock += 1;
      }
      descuento.datos_descuento.stock -= 1;
      setDescuentoSeleccionado(descuento);
    }
  };

  const handleConfirmarPago = () => {
    const new_stock = descuentoSeleccionado
      ? descuentoSeleccionado.datos_descuento.stock
      : null;
    const c_descuento = descuentoSeleccionado?.c_descuento || null;
    const descuento = descuentoSeleccionado
      ? parseInt(descuentoSeleccionado.datos_descuento.descuento, 10)
      : null;
    const costoPrograma = programaSeleccionado.datos_programa.monto;
    const c_programa = programaSeleccionado.c_programa; // Obtener c_programa del programa seleccionado

    navigate("/fase-de-pago", {
      state: {
        tenant_id,
        c_estudiante,
        c_programa, // Enviar c_programa
        c_descuento,
        descuento,
        new_stock,
        costoPrograma,
      },
    });
  };

  return (
    <div className="inscripciones-container">
      <h1>Inscripciones Pendientes</h1>
      <div className="programas-lista">
        {programas.map((programa, index) => (
          <div
            key={index}
            className={`programa-card ${
              programaSeleccionado === programa ? "seleccionado" : ""
            }`}
          >
            <h2>{programa.datos_programa.name}</h2>
            <div className="programa-grid">
              <div>
                <p><strong>País:</strong> {programa.datos_programa.country}</p>
                <p><strong>Ciudad:</strong> {programa.datos_programa.city}</p>
              </div>
              <div>
                <p><strong>Fecha Inicio:</strong> {programa.datos_programa.start_date}</p>
                <p><strong>Fecha Fin:</strong> {programa.datos_programa.end_date}</p>
              </div>
              <div>
                <p><strong>Costo:</strong> ${programa.datos_programa.monto}</p>
                <p><strong>Cupos:</strong> {programa.datos_programa.capacity}</p>
              </div>
              <div>
                <p><strong>Fecha Límite de Pago:</strong> {programa.datos_programa.payment_deadline}</p>
              </div>
              <div className="seleccionar-container">
                <button onClick={() => handleSeleccionarPrograma(programa)}>
                  Seleccionar
                </button>
                <input
                  type="checkbox"
                  readOnly
                  checked={programaSeleccionado === programa}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="ver-descuentos-button" onClick={handleVerDescuentos}>
        Ver mis descuentos
      </button>

      {descuentos.length > 0 && (
        <>
          <div className="descuentos-titulos">
            <h2>Descuentos</h2>
            <h2>Stock</h2>
          </div>
          <div className="descuentos-lista">
            {descuentos.map((descuento, index) => (
              <div
                key={index}
                className={`descuento-card ${
                  descuentoSeleccionado === descuento ? "seleccionado" : ""
                }`}
              >
                <p>{descuento.datos_descuento.descuento}%</p>
                <p>{descuento.datos_descuento.stock}</p>
                <div className="seleccionar-container">
                  <button onClick={() => handleSeleccionarDescuento(descuento)}>
                    Seleccionar
                  </button>
                  <input
                    type="checkbox"
                    readOnly
                    checked={descuentoSeleccionado === descuento}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <button
        className="pagar-button"
        disabled={!programaSeleccionado}
        onClick={() => setShowModal(true)}
      >
        Pagar
      </button>

      {showModal && (
        <div className="modal">
          <p>¿Está seguro de realizar el pago de este programa?</p>
          <div className="modal-buttons">
            <button onClick={handleConfirmarPago}>Sí</button>
            <button onClick={() => setShowModal(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InscripcionesEstudiante;