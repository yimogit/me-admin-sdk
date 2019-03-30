
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    app
  },
  strict: false
})
export default store
