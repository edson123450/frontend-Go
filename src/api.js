import axios from 'axios';

// URL de la API
const BASE_URL = "https://67uer66pk4.execute-api.us-east-1.amazonaws.com/dev/registro/login";

// Función de login
export const login = async (email, password) => {
  try {
    // Realizar la solicitud POST a la API con el email y password
    const response = await axios.post(BASE_URL, {
      email: email,
      password: password,
    });

    // Validar el statusCode de la respuesta
    if (response.data.statusCode === 200) {
      // Obtener el token del response
      const token = response.data.token;

      // Guardar el token en localStorage para usarlo más adelante
      localStorage.setItem("token", token);

      // Retornar éxito con el token
      return { success: true, token };
    } else {
      // Retornar false si el statusCode no es 200
      console.error("Login fallido:", response.data.body || "Error desconocido");
      return { success: false, error: response.data.body || "Error desconocido" };
    }
  } catch (error) {
    console.error("Error durante el login:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};


