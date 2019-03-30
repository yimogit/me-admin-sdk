import Vue from 'vue'
import ElementUI from 'element-ui'
import '../assets/styles/app.css'
import '../assets/styles/layout.css'

import directives from '../directives'
import components from '../components'
import filters from '../filters'
import $ui from './ui'

const register = function() {
  initFind()
  Vue.use(ElementUI, { size: 'small' })
  // 注册全局指令，过滤器，组件
  Object.keys(directives).forEach(e => Vue.directive(e, directives[e]))
  Object.keys(filters).forEach(e => Vue.filter(e, filters[e]))
  Object.keys(components).forEach(e => Vue.component(e, components[e]))

  // 扩展 $ui
  var allExtends = { $ui }
  Object.keys(allExtends).forEach(e => {
    const plugin = {}
    plugin[e] = {
      get() {
        return allExtends[e]
      }
    }
    Object.defineProperties(Vue.prototype, plugin)
  })
}
// const install = e => register(e)

export default {
  // install,
  register
}

/* eslint-disable */
function initFind() {
  if (!!Array.prototype.find) return
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined')
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function')
    }
    var list = Object(this)
    var length = list.length >>> 0
    var thisArg = arguments[1]
    var value

    for (var i = 0; i < length; i++) {
      value = list[i]
      if (predicate.call(thisArg, value, i, list)) {
        return value
      }
    }
    return undefined
  }
}
