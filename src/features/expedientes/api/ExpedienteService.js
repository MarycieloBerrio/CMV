import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

const EXPEDIENTES_API = import.meta.env.VITE_EXPEDIENTES_API;

const apiClient = axios.create({
  baseURL: EXPEDIENTES_API,
  headers: {
   // Accept: 'application/json',
    'x-api-version': '1.0',
    'X-Channel-Id': 'GD'
  }
})

function handleApiError(error, defaultMessage) {
  console.error(error);

  let errorMessage = defaultMessage;
  if (error.response) {
    errorMessage = error.response.data?.detail || error.response.data?.message || defaultMessage;
  }

  // Solo mostramos el popup para errores que no sean de búsqueda
  if (!error.response || (error.response.status !== 404 && error.response.status !== 400)) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonColor: '#7cbc24'
    });
  }

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

async function getExpedientes(filters = {}) {
  try {
    const defaultFilters = {
      page: 1,
      page_size: 7,
      ...filters
    };

    const config = buildConfig({}, defaultFilters);

    const response = await apiClient.get('/api/expedientes', config);

    return {
      data: response.data.results || [],
      totalRecords: response.data.total || 0,
      page: response.data.page || 1,
      pageSize: response.data.page_size || 7,
      hasNext: response.data.has_next || false,
      hasPrev: response.data.has_prev || false
    };
  } catch (error) {
    // Si es un error de búsqueda, retornamos un resultado vacío sin mostrar error
    if (error.response?.status === 404 || error.response?.status === 400) {
      return {
        data: [],
        totalRecords: 0,
        page: 1,
        pageSize: 7,
        hasNext: false,
        hasPrev: false
      };
    }
    // Para otros errores, usamos el manejador de errores estándar
    return handleApiError(error, 'No se pudieron obtener los expedientes');
  }
}

async function createExpediente(expedienteData) {
  try {
    const config = buildConfig();
    const response = await apiClient.post('/api/expedientes', expedienteData, config);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'No se pudo crear el expediente');
  }
}

async function getDocumentosByExpediente(expedienteId) {
  try {
    const config = buildConfig();
    const response = await apiClient.get(`/api/expedientes/${expedienteId}/documentos`, config);
    return response.data.results || [];
  } catch (error) {
    return handleApiError(error, 'No se pudieron obtener los documentos del expediente');
  }
}

async function uploadDocumento(expedienteId, tipoDocumentoId, file, folder = '') {
  try {
    const formData = new FormData();
    formData.append('expediente_id', expedienteId);
    formData.append('tipo_documento_id', tipoDocumentoId);
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Channel-Id': 'GD',
        'X-Request-ID': uuidv4(),
        'X-Correlation-ID': uuidv4(),
        'X-Api-Version': '1.0'
      }
    };

    const response = await axios.post(
      `${EXPEDIENTES_API}api/expedientes/documentos`,
      formData,
      config
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, 'No se pudo subir el documento');
  }
}

async function getDocumentoPreview(expedienteId, documentoId) {
  try {
    const config = buildConfig({
      'Accept': 'application/json',
      'X-Api-Version': '1.0'
    });

    const response = await apiClient.get(
      `/api/expedientes/${expedienteId}/documentos/${documentoId}/preview`,
      config
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, 'No se pudo obtener la vista previa del documento');
  }
}

async function downloadDocumento(expedienteId, documentoId) {
  try {
    const config = buildConfig({}, {});
    config.responseType = 'blob';

    const response = await apiClient.get(
      `/api/expedientes/${expedienteId}/documentos/${documentoId}/download`,
      config
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, 'No se pudo descargar el documento');
  }
}

async function remitirDocumentos(expedienteId) {
  try {
    const config = buildConfig();
    const response = await apiClient.put(`/api/expedientes/${expedienteId}/documentos/remision`, null, config);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'No se pudieron remitir los documentos');
  }
}

async function getExpedientesMocked() {
  return ""
}

export {
  getExpedientes,
  createExpediente,
  getDocumentosByExpediente,
  uploadDocumento,
  getDocumentoPreview,
  downloadDocumento,
  remitirDocumentos,
  getExpedientesMocked
};
