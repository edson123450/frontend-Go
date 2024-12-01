import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  crear_boleta_estudiante,
  descontar_stock_descuento_estudiante,
  eliminar_descuento_estudiante,
  cambiar_estado_inscripcion,
} from "./api";
import "./FaseDePago.css";

function FaseDePago() {
  const location = useLocation();
  const {
    tenant_id,
    c_estudiante,
    c_programa,
    c_descuento,
    descuento,
    new_stock,
    costoPrograma,
  } = location.state;

  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [cvv, setCvv] = useState("");
  const [empresaBancaria, setEmpresaBancaria] = useState("");
  const [loading, setLoading] = useState(false);
  const [costoActualizado, setCostoActualizado] = useState(costoPrograma);

  // Calcular el costo actualizado cuando hay descuento
  useEffect(() => {
    if (descuento) {
      const descuentoValor = (costoPrograma * descuento) / 100;
      setCostoActualizado(costoPrograma - descuentoValor);
    }
  }, [descuento, costoPrograma]);

  const handlePago = async () => {
    if (!numeroTarjeta || !cvv || !empresaBancaria) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    setLoading(true);

    try {
      // Determinar el descuento aplicado
      const descuentoAplicado = descuento || 0;

      // Llamar a la API para crear la boleta
      const boleta = await crear_boleta_estudiante(
        tenant_id,
        c_estudiante,
        c_programa,
        empresaBancaria,
        costoActualizado,
        descuentoAplicado
      );

      if (boleta.success === false) {
        alert("Error al crear la boleta. Inténtelo de nuevo.");
        setLoading(false);
        return;
      }

      // Si hay un descuento seleccionado, manejar el stock o eliminar el descuento
      if (descuento) {
        if (new_stock > 0) {
          // Descontar el stock
          const stockResponse = await descontar_stock_descuento_estudiante(
            tenant_id,
            c_estudiante,
            c_descuento,
            descuento,
            new_stock
          );

          if (stockResponse.success === false) {
            alert("Error al descontar el stock del descuento. Inténtelo de nuevo.");
            setLoading(false);
            return;
          }
        } else if (new_stock === 0) {
          // Eliminar el descuento si el stock es 0
          const deleteResponse = await eliminar_descuento_estudiante(
            tenant_id,
            c_estudiante,
            c_descuento
          );

          if (deleteResponse.success === false) {
            alert("Error al eliminar el descuento. Inténtelo de nuevo.");
            setLoading(false);
            return;
          }
        }
      }

      // Cambiar el estado de la inscripción a "Aprobado"
      const cambiarEstadoResponse = await cambiar_estado_inscripcion(
        tenant_id,
        c_estudiante,
        c_programa,
        costoActualizado
      );

      if (cambiarEstadoResponse.success === false) {
        alert("Error al cambiar el estado de la inscripción. Inténtelo de nuevo.");
        setLoading(false);
        return;
      }

      // Si todo fue exitoso
      alert("¡Pago realizado con éxito y estado de inscripción actualizado!");
    } catch (error) {
      console.error("Error durante el proceso de pago:", error);
      alert("Hubo un error al procesar el pago. Inténtelo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fase-pago-container">
      <h1>Fase de Pago</h1>
      <form className="fase-pago-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="numeroTarjeta">Número de Tarjeta</label>
          <input
            type="text"
            id="numeroTarjeta"
            value={numeroTarjeta}
            onChange={(e) => setNumeroTarjeta(e.target.value)}
            placeholder="Ingrese su número de tarjeta"
          />
        </div>
        <div className="form-group">
          <label htmlFor="cvv">CVV</label>
          <input
            type="password"
            id="cvv"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="Ingrese el CVV"
          />
        </div>
        <div className="form-group">
          <label htmlFor="empresaBancaria">Empresa Bancaria</label>
          <input
            type="text"
            id="empresaBancaria"
            value={empresaBancaria}
            onChange={(e) => setEmpresaBancaria(e.target.value)}
            placeholder="Ingrese su empresa bancaria"
          />
        </div>

        <div className="monto-a-pagar">
          <p>
            <strong>Monto a pagar:</strong> ${costoActualizado}
          </p>
        </div>

        <button
          type="button"
          className="realizar-pago-button"
          onClick={handlePago}
          disabled={loading}
        >
          {loading ? "Procesando..." : "Realizar Pago"}
        </button>
      </form>
    </div>
  );
}

export default FaseDePago;