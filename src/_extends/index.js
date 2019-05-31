import Vue from 'vue'
import ElementUI from 'element-ui'
import '../assets/styles/app.css'
import '../assets/styles/layout.css'

import directives from '../directives'
import components from '../components'
import filters from '../filters'
import $ui from './ui'

const register = function(extend) {
  initPolyfill()
  Vue.use(ElementUI, { size: 'small' })
  // 注册全局指令，过滤器，组件
  Object.keys(directives).forEach(e => Vue.directive(e, directives[e]))
  Object.keys(filters).forEach(e => Vue.filter(e, filters[e]))
  Object.keys(components).forEach(e => Vue.component(e, components[e]))

  // 扩展 $ui,..
  var allExtends = { $ui, ...extend }
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
function initPolyfill() {
  if (!Array.prototype.find) {
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
  if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, 'findIndex', {
      value: function(predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError('"this" is null or not defined')
        }

        var o = Object(this)

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0

        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function')
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1]

        // 5. Let k be 0.
        var k = 0

        // 6. Repeat, while k < len
        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kValue be ? Get(O, Pk).
          // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
          // d. If testResult is true, return k.
          var kValue = o[k]
          if (predicate.call(thisArg, kValue, k, o)) {
            return k
          }
          // e. Increase k by 1.
          k++
        }

        // 7. Return -1.
        return -1
      }
    })
  }
}
