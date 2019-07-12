import App from './App'
import _extends from './_extends'
import store from './store'
import { initRouter, default as router } from './router'
import Vue from 'vue'
import fetch from './_extends/ui/fetch'
import $ui from './_extends/ui'

var $api = {}
var $codes = {}

export const VERSION = process.env.VERSION
//注册通用的api接口模块,可通过$api.模块名.配置调用
export function registerApi(moduleName, apiInit) {
  if (moduleName) {
    $api[moduleName] = Object.assign(
      {},
      $api[moduleName],
      apiInit(fetch)
    )
  } else {
    Object.assign($api, apiInit(fetch))
  }
}
//注册一些通用的方法
export function registerCodes(moduleName, codesInit) {
  if (moduleName) {
    $codes[moduleName] = Object.assign(
      {},
      $codes[moduleName],
      codesInit($ui)
    )
  } else {
    Object.assign($codes, codesInit($ui))
  }
}

export function register(globalOptions) {
  globalOptions = Object.assign(
    {
      //绑定节点
      el: '#app',
      //window键值
      currentAppKey: '__currentApp',
      // 路由
      router: {
        routes: []
      },
      // vuex store
      store: {
        state: {},
        getters: {},
        mutations: {},
        actions: {}
      },
      // 系统信息
      sysInfo: {}
    },
    globalOptions
  )
  //初始化路由
  initRouter(globalOptions.router)
  //添加状态管理模块
  if (globalOptions.store) {
    store.registerModule('custom', globalOptions.store)
  }
  //系统信息
  if (globalOptions.sysInfo) {
    store.dispatch('setSysInfo', globalOptions.sysInfo)
  }
  _extends.register({ $api, $codes })
  if (globalOptions.el) {
    window[globalOptions.currentAppKey] = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount(globalOptions.el)
  }
  if (typeof window !== 'undefined' && typeof window.Vue === 'undefined') {
    window.Vue = Vue
  }
  // console.log(process.env.VERSION)
  return { router, store }
}
export default {
  register
}
