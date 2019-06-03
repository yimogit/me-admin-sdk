import Vue from 'vue'
import App from './App.vue'
import VAmap from '../../src/index.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI, { size: 'small' })
Vue.use(VAmap, {
  name: 'v-me-admin-amap',
  mapKey: 'da86b9bd9ed7cd346e0a028d004fbb76'
})
new Vue({
  el: '#app',
  render: h => h(App)
})
