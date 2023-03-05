export const state = () => ({
  background_color: [],
  color_is_locked: false,
})

export const actions = {
  setBackgroundColor({ commit }, { color1, color2 }) {
    commit('setNewBackgroundColor', { color1, color2 })
  },

  setColorLocked({ commit }, value) {
    commit('setNewColorLocked', value)
  },
}

export const mutations = {
  setNewBackgroundColor(state, { color1, color2 }) {
    state.background_color = [
      color1,
      color2,
    ]
  },

  setNewColorLocked(state, value) {
    state.color_is_locked = value;
  },
}

export const getters = {
    getBackgroundColor(state) { return state.background_color },
    getColorLocked(state) { return state.color_is_locked },
}