import axios from 'axios';

// URL de la API
const BASE_URL = "https://6nhw9wc802.execute-api.us-east-1.amazonaws.com/dev/registro/login";

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
      console.log("Token guardado:", token);
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


export const informacion_estudiante=async(email)=>{
    try{
        const token=localStorage.getItem("token");
        if(!token){
            throw new Error("Token no encontrado. Inicia sesión para continuar")
        }
        console.log("token obtenido:",token);
        const response=await axios.post(
            'https://6nhw9wc802.execute-api.us-east-1.amazonaws.com/dev/registro/estudiante/search',
            {
                email:email,
            },
            {
                headers:{
                    Authorization:token,
                },
            }
        );
        console.log("seguimos bien");
        console.log(response);
        console.log(response.data);
        console.log(response.data.statusCode);
        console.log(response.data.body.c_estudiante);
        if(response.data.statusCode===200){
            return response.data.body.c_estudiante;
        }else{
            console.error("informacion_estudiante fallido:", response.data.body || "Error desconocido");
            return {success:false, error: error.response?.data || error.message};
        }
    }catch(error){
        console.error("Error durante el api llamado informacion_estudiante:",error.response?.data || error.message);
        return {success:false,error: error.response?.data || error.message };
    }
}

export const obtener_programas_universidad= async (tenant_id)=>{
    try{
        const token=localStorage.getItem("token");
        if(!token){
            throw new Error("Token no encontrado. Inicia sesión para continuar")
        }
        console.log("Euh token:",token);
        console.log(tenant_id);
        const response= await axios.post(
            'https://ibrfkttxja.execute-api.us-east-1.amazonaws.com/dev/programas/listar',
            {
                tenant_id:tenant_id,
            },
            {
                headers: {
                    Authorization: token,
                },
            }
        );
        console.log("seguimos bien");
        console.log(response.data.programas);
        if(response.data.statusCode===200){
            return response.data.programas;
        }else{
            console.error("obtener_programas_universidad fallido:", response.data.programas || "Error desconocido");
            return {success:false, error: error.response?.programas || error.message};
        }
    }catch(error){
        console.error("Error durante el api llamado obtener_programas_universidad:", error.response?.data || error.message);
        return {success:false,error: error.response?.data || error.message};
    }
}

export const obtener_programa_universidad_especifico= async (tenant_id,c_programa)=>{
    try{
        const token=localStorage.getItem("token");
        if(!token){
            throw new Error("Token no encontrado. Inicia sesión para continuar")
        }
        //console.log(token);
        //console.log(tenant_id);
        //console.log(c_programa);
        const response= await axios.post(
            'https://ibrfkttxja.execute-api.us-east-1.amazonaws.com/dev/programas/search',
            {
                tenant_id:tenant_id,
                c_programa:c_programa,
            },
            {
                headers: {
                    Authorization: token,
                }
            }
        );
        //console.log(response.data.statusCode);
        if(response.data.statusCode===200 || response.data.statusCode===404){
            return response.data;
        }else{
            console.error("obtener_programa_universidad_especifico fallido:", response.data.response || "Error desconocido");
            return {success:false, error: error.response?.data || error.message};
        }



    }catch(error){
        console.error("Error durante el api llamado obtener_programa_universidad_especifico:", error.response?.data || error.message);
        return {success:false,error: error.response?.data || error.message};
    }
};

export const inscribirse_programa_estudiante = async (tenant_id, c_estudiante, c_programa, monto) => {
    try {
      // Obtener el token desde localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token no encontrado. Inicia sesión para continuar");
      }
  
      // Crear la variable combinada tenant_id#c_estudiante
      const tenant_id_c_estudiante = `${tenant_id}#${c_estudiante}`;
  
      // Construir el body de la solicitud
      const body = {
        'tenant_id#c_estudiante': tenant_id_c_estudiante, // Combina tenant_id y c_estudiante
        c_programa,             // Código del programa
        c_estudiante,           // Código del estudiante
        datos_inscripcion: {
          estado: "Pendiente",  // Estado predeterminado
          monto: monto,         // Monto del programa
        },
      };
  
      // Realizar la solicitud POST a la API
      const response = await axios.post(
        'https://2xf0f7dt09.execute-api.us-east-1.amazonaws.com/dev/inscripciones/crear',
        body,
        {
          headers: {
            Authorization: token,
          },
        }
      );
  
      // Validar si la inscripción fue exitosa
      if (response.data.statusCode === 201) {
        return { success: true, data: response.data.body };
      } else {
        console.error("inscribirse_programa_estudiante fallido:", response.data.body || "Error desconocido");
        return { success: false, error: response.data.body || "Error desconocido" };
      }
    } catch (error) {
      console.error("Error durante el API llamado inscribirse_programa_estudiante:", error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  };

export const inscripciones_pendientes_estudiante=async(tenant_id,c_estudiante)=>{
    try{
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token no encontrado. Inicia sesión para continuar");
        }
        const tenant_id_c_estudiante = `${tenant_id}#${c_estudiante}`;
        const response=await axios.post(
            'https://2xf0f7dt09.execute-api.us-east-1.amazonaws.com/dev/inscripciones/search',
            {
                'tenant_id#c_estudiante': tenant_id_c_estudiante,
            },
            {
                headers:{
                    Authorization:token,
                }
            }

        );
        if (response.data.statusCode===200){
            console.log("En este paso inscripciones_pendientes_estudiante estamos bien!");
            console.log(response.data);
            console.log(response.data.programas);
            return response.data.programas;
        }else{
            console.error("inscripciones_pendientes_estudiante fallido:", response.data.programas || "Error desconocido");
            return { success: false, error: response.data.programas || "Error desconocido" };
        }
    }catch(error){
        console.error("Error durante el API llamado inscripciones_pendientes_estudiante:", error.response?.data || error.message);
        return {success:false, error: error.response?.data || error.message};
    }
};

export const descuentos_estudiante=async(tenant_id,c_estudiante)=>{
    try{

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token no encontrado. Inicia sesión para continuar");
        }
        const tenant_id_c_estudiante = `${tenant_id}#${c_estudiante}`;
        const response= await axios.post(
            'https://lba5i4cn18.execute-api.us-east-1.amazonaws.com/dev/descuentos/listar',
            {
                'tenant_id#c_estudiante': tenant_id_c_estudiante,
            },
            {
                headers:{
                    Authorization:token,
                }
            });
        if(response.data.statusCode===200){
            return response.data.tipoDescuentos;
        }else{
            console.error("descuentos_estudiante fallido:", response.data.tipoDescuentos || "Error desconocido");
            return { success: false, error: response.data.tipoDescuentos || "Error desconocido" };
        }
    }catch(error){
        console.error("Error durante el API llamado descuentos_estudiante:", error.response?.data || error.message);
        return {success:false, error: error.response?.data || error.message};
    }
};

export const descontar_stock_descuento_estudiante=async(tenant_id,c_estudiante,c_descuento,descuento,new_stock)=>{
    try{
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token no encontrado. Inicia sesión para continuar");
        }
        const tenant_id_c_estudiante = `${tenant_id}#${c_estudiante}`;
        const response=await axios.put(
            'https://lba5i4cn18.execute-api.us-east-1.amazonaws.com/dev/descuentos/modificar',
            {
                'tenant_id#c_estudiante':tenant_id_c_estudiante,
                'c_descuento':c_descuento,
                'datos_descuento':{
                    'descuento':descuento,
                    'stock':new_stock,
                },

            },
            {
                headers:{
                    Authorization:token,
                }
            }
        );
        if (response.data.statusCode===200){
            return {success:true};
        }else{
            console.error("descontar_stock_descuento_estudiante fallido:", response.data.response || "Error desconocido");
            return { success: false, error: response.data.response || "Error desconocido" };
        }


    }catch(error){
        console.error("Error durante el API llamado descontar_stock_descuento_estudiante:", error.response?.data || error.message);
        return {success:false, error: error.response?.data || error.message};
    }
};

export const eliminar_descuento_estudiante = async (tenant_id, c_estudiante, c_descuento) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Token no encontrado. Inicia sesión para continuar");
        }
        const tenant_id_c_estudiante = `${tenant_id}#${c_estudiante}`;
        const response = await axios.delete(
            'https://lba5i4cn18.execute-api.us-east-1.amazonaws.com/dev/descuentos/eliminar',
            {
                headers: {
                    Authorization: token,
                },
                data: {
                    'tenant_id#c_estudiante': tenant_id_c_estudiante,
                    'c_descuento': c_descuento,
                },
            }
        );
        if (response.data.statusCode === 200) {
            return { success: true };
        } else {
            console.error("eliminar_descuento_estudiante fallido:", response.data.response || "Error desconocido");
            return { success: false, error: response.data.response || "Error desconocido" };
        }
    } catch (error) {
        console.error("Error durante el API llamado eliminar_descuento_estudiante:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

export const crear_boleta_estudiante=async(tenant_id,c_estudiante,c_programa,empresa_bancaria,monto,descuento_aplicado)=>{
    try{
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Token no encontrado. Inicia sesión para continuar");
        }
        const response= await axios.post(
            'https://74bj00ga4c.execute-api.us-east-1.amazonaws.com/dev/boletas/crear',
            {
                'tenant_id':tenant_id,
                'c_estudiante':c_estudiante,
                'c_programa':c_programa,
                'empresa_bancaria':empresa_bancaria,
                'monto':monto,
                'descuento_aplicado':descuento_aplicado,
            },
            {
                headers:{
                    Authorization: token,
                }
            }
        );

        if (response.data.statusCode===201){
            return response.data.body.datos_boleta;
        }else{
            console.error("crear_boleta_estudiante fallido:", response.data.body || "Error desconocido");
            return { success: false, error: response.data.body || "Error desconocido" };
        }
    }catch(error){
        console.error("Error durante el API llamado crear_boleta_estudiante:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

export const obtener_inscripcion_especifica=async(tenant_id,c_estudiante,c_programa)=>{
    try{
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Token no encontrado. Inicia sesión para continuar");
        }

        const response=await axios.post(
            'https://2xf0f7dt09.execute-api.us-east-1.amazonaws.com/dev/inscripciones/specificsearch',
            {
                'tenant_id':tenant_id,
                'c_estudiante':c_estudiante,
                'c_programa':c_programa,
            },
            {
                headers:{
                    Authorization: token,
                }
            }
        );
        if(response.data.statusCode===200){
            return response.data.body;
        }else{
            console.error("obtener_inscripcion_especifica fallido:", response.data.body || "Error desconocido");
            return { success: false, error: response.data.body || "Error desconocido" };
        }



    }catch(error){
        console.error("Error durante el API llamado obtener_inscripcion_especifica:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

export const cambiar_estado_inscripcion=async(tenant_id,c_estudiante,c_programa,monto)=>{
    try{
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Token no encontrado. Inicia sesión para continuar");
        }

        const response=await axios.put(
            'https://2xf0f7dt09.execute-api.us-east-1.amazonaws.com/dev/inscripciones/changestate',
            {
                'tenant_id':tenant_id,
                'c_estudiante':c_estudiante,
                'c_programa':c_programa,
                'datos_inscripcion':{
                    'estado':'Aprobado',
                    'monto':monto,
                },
            },
            {
                headers:{
                    Authorization:token,
                }
            }
        );

        if(response.data.statusCode===200){
            return response.data.body;
        }else{
            console.error("cambiar_estado_inscripcion fallido:", response.data.body || "Error desconocido");
            return { success: false, error: response.data.body || "Error desconocido" };
        }
    }catch(error){
        console.error("Error durante el API llamado cambiar_estado_inscripcion:", error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};


export const listar_encuestas=async(tenant_id)=>{
    try{
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Token no encontrado. Inicia sesión para continuar");
        }

        const response=await axios.post(
            'https://o5wbqbhba2.execute-api.us-east-1.amazonaws.com/dev/encuestas/listarencuestas',
            {
                'tenant_id':tenant_id,
            },
            {
                headers:{
                    Authorization:token,
                }
            }
        );

        if(response.data.statusCode===200){
            return response.data.body;
        }else{
            console.error("listar_encuestas fallido:", response.data.body || "Error desconocido");
            return { success: false, error: response.data.body || "Error desconocido" };
        }
    }catch(error){
        console.error("Error durante el API llamado listar_encuestas:", error.response?.data || error.message);
        return {success: false, error: error.response?.data || error.message};
    }
};

export const obtener_alumno_por_codigo=async(tenant_id,c_estudiante)=>{
    try{
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Token no encontrado. Inicia sesión para continuar");
        }

        const response=await axios.post(
            'https://6nhw9wc802.execute-api.us-east-1.amazonaws.com/dev/registro/estudiante/searchbycode',
            {
                'tenant_id':tenant_id,
                'c_estudiante':c_estudiante,
            },
            {
                headers:{
                    Authorization:token,
                }
            }
        );
        if(response.data.statusCode===200){
            return response.data.body;
        }else{
            console.error("obtener_alumno_por_codigo fallido:", response.data.body || "Error desconocido");
            return { success: false, error: response.data.body || "Error desconocido" };
        }

    }catch(error){
        console.error("Error durante el API llamado obtener_alumno_por_codigo:", error.response?.data || error.message);
        return {success: false, error: error.response?.data || error.message};
    }
};

export const crear_encuesta=async(valor1,valor2,descripcion)=>{
    try{
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Token no encontrado. Inicia sesión para continuar");
        }

        const response=await axios.post(
            'https://o5wbqbhba2.execute-api.us-east-1.amazonaws.com/dev/encuestas/crear',
            {
                'tenant_id#c_programa':valor1,
                'tipo#c_estudiante':valor2,
                'descripcion':descripcion,
            },
            {
                headers:{
                    Authorization:token,
                }
            }
        );

        if(response.data.statusCode===201){
            return {success:true, body: response.data.body};
        }else{
            console.error("crear_encuesta fallido:", response.data.body || "Error desconocido");
            return { success: false, error: response.data.body || "Error desconocido" };
        }

    }catch(error){
        console.error("Error durante el API llamado crear_encuesta:", error.response?.data || error.message);
        return {success: false, error: error.response?.data || error.message};
    }
};