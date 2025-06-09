import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

const EXPEDIENTES_API = import.meta.env.VITE_EXPEDIENTES_API;

const apiClient = axios.create({
  baseURL: EXPEDIENTES_API,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-api-version': '1.0',
    'X-Channel-Id': 'GD'
  }
});

function handleApiError(error, defaultMessage) {
  console.error(error);

  let errorMessage = defaultMessage;
  if (error.response) {
    errorMessage = error.response.data?.detail || error.response.data?.message || defaultMessage;
  }

  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: errorMessage,
    confirmButtonColor: '#7cbc24'
  });

  throw error;
}

function buildConfig(extraHeaders = {}, params = {}) {
  const requestId = uuidv4();
  const correlationId = uuidv4();

  return {
    headers: {
      'X-Request-ID': requestId,
      'X-Correlation-ID': correlationId,
      ...extraHeaders
    },
    params
  };
}

async function getExpedientesRemitidos(filters = {}) {
    try {
        const defaultFilters = {
            page: 1,
            page_size: 3, // Para probar se toma como si los primeros 3 expedientes fueran los remitidos
            ...filters
        };

        const config = buildConfig({}, defaultFilters);

        const response = await apiClient.get('/api/expedientes', config);

        return {
            data: response.data.results || [],
        };
    } catch (error) {
      return handleApiError(error, 'No se pudieron obtener los documentos');
    }
}

export {
    getExpedientesRemitidos
  };

export const RemisionService = {
  async remitirExpediente(id, datosRemision) {
    try {
      const requestId = uuidv4();
      const correlationId = uuidv4();

      const response = await axios.post(`${EXPEDIENTES_API}/expedientes/${id}/remitir`, datosRemision, {
        headers: {
          'X-Request-ID': requestId,
          'X-Correlation-ID': correlationId
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error al remitir expediente ${id}:`, error);
      throw error;
    }
  },

  async getHistorialRemisiones(id) {
    try {
      const requestId = uuidv4();
      const correlationId = uuidv4();

      const response = await axios.get(`${EXPEDIENTES_API}/expedientes/${id}/remisiones`, {
        headers: {
          'X-Request-ID': requestId,
          'X-Correlation-ID': correlationId
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener historial de remisiones del expediente ${id}:`, error);
      throw error;
    }
  }
};
