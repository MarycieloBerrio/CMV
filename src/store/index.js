import { createStore } from 'vuex'
import expedientes from "../features/expedientes/store/expedientes"

export default createStore({
  modules: {expedientes},
  state: {
    token: localStorage.getItem('token') || null,
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  mutations: {
    SET_TOKEN(state, newToken) {
      state.token = newToken
      localStorage.setItem('token', newToken)
    },
    CLEAR_TOKEN(state) {
      state.token = null
      localStorage.removeItem('token')
    },
  },
  actions: {
    login({ commit }, newToken) {
      commit('SET_TOKEN', newToken)
    },
    logout({ commit }) {
      commit('CLEAR_TOKEN')
    },
  },
})
