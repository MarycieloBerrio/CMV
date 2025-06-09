import { getExpedientesMocked } from '../api/ExpedienteService'

export default {
  namespaced: true,
  state: () => ({
    expedientes: [],
    loading: false,
    error: null,
    totalRecords: 0,
    filters: {
      PageNumber: 1,
      PageSize: 10,
      ExpedienteId: null,
      SocioId: null,
      EstadoId: null,
      Nombre: '',
      Curp: '',
      SortBy: 'fechaCreacion',
      SortOrder: 'desc'
    }
  }),
  mutations: {
    SET_EXPEDIENTES(state, payload) {
      state.expedientes = payload.data
      state.totalRecords = payload.totalRecords
    },
    SET_LOADING(state, value) {
      state.loading = value
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    UPDATE_FILTERS(state, newFilters) {
      state.filters = { 
        ...state.filters,
        PageNumber: newFilters.PageNumber || state.filters.PageNumber,
        PageSize: newFilters.PageSize || state.filters.PageSize,
        ...newFilters
      }
    }
  },
  actions: {
    async fetchExpedientes({ commit, state }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const response = await getExpedientesMocked()
        commit('SET_EXPEDIENTES', {
          data: response.data,
          totalRecords: response.totalRecords
        })
      } catch (error) {
        commit('SET_ERROR', error.message || 'Error al obtener expedientes')
      } finally {
        commit('SET_LOADING', false)
      }
    },
    updateFilters({ commit, dispatch }, newFilters) {
      commit('UPDATE_FILTERS', newFilters)
      dispatch('fetchExpedientes')
    }
  },
  getters: {
    currentPage: state => state.filters.PageNumber,
    pageSize: state => state.filters.PageSize,
    totalPages: state => Math.ceil(state.totalRecords / state.filters.PageSize),
    currentFilters: state => state.filters
  }
}