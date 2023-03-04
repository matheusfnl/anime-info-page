export const state = () => ({
  background_color: [],
})

export const actions = {
  setBackgroundColor({ commit }, { color1, color2 }) {
    commit('setNewBackgroundColor', { color1, color2 })
  }
}

export const mutations = {
  setNewBackgroundColor(state, { color1, color2 }) {
    state.background_color = [
      color1,
      color2,
    ]
  }
}

export const getters = {
    getBackgroundColor(state) { return state.background_color }
}