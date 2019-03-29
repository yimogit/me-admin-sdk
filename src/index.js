import App from './App'
import _extends from './_extends'
import store from './store'
import router from './router'
import Vue from 'vue'

const install = function(_vue, globalOptions) {
  globalOptions = Object.assign(
    {
      //绑定节点
      el: '#app',
      //window键值
      currentAppKey: '__currentApp',
      // 路由
      routes: [],
      // vuex store
      store: {
        state: {},
        getters: {},
        mutations: {},
        actions: {}
      },
      // 系统信息
      sysInfo: {
        authName: null,
        title: null,
        logo: null,
        iconList: [],
        menus: [],
        modules: [],
        themeColor: '#2D5681',
        loginPath: '/login',
        indexPath: '/',
        logoutPath: '/logout'
      }
    },
    globalOptions
  )
  //添加路由
  router.addRoutes(globalOptions.routes)
  //添加状态管理模块
  if (globalOptions.store) {
    store.registerModule('custom', globalOptions.store)
  }
  //系统信息
  if (globalOptions.sysInfo) {
    store.dispatch('setSysInfo', globalOptions.sysInfo)
  }
  _extends.register(_vue)

  window[globalOptions.currentAppKey] = new _vue({
    el: globalOptions.el,
    router: router,
    store,
    components: { App },
    template: '<App/>'
  })
}
export default {
  install,
  register
}
export function register(opt) {
  if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue, opt)
  } else {
    Vue.use({ install }, opt)
  }
}
