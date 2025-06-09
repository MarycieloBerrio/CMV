import axios from 'axios';
import Swal from 'sweetalert2';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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
  const requestId = generateUUID();
  const correlationId = generateUUID();

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