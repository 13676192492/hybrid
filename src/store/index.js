import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    info: [],
    detailsInfo: null,
    isLoad: false
  },
  mutations: {
    update(state, val) {
      state.info = val;
    },
    details(state, val) {
      state.detailsInfo = val;
    },
    changeLoadType(state,val){
      state.isLoad = val;
    }
  },
  actions: {},
  modules: {}
})