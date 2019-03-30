import router from '../../router'
import { Message, MessageBox } from 'element-ui'
import NProgress from 'nprogress' // Progress 进度条

//#region 提示
export const back = _ => {
  router.back()
}
export const redirect = route => {
  return router.replace({
    name: 'redirect_data',
    query: { data: encodeURIComponent(JSON.stringify(route)) }
  })
}
export const link = (route, isReplace) => {
  if (!route) return
  if (
    typeof route === 'string' &&
    (route.indexOf('http') > -1 || route.indexOf('//') > -1)
  ) {
    return (location.href = route)
  }
  return isReplace ? router.replace(route) : router.push(route)
}
export function message(options) {
  return Message(options)
}
export const info = (msg, opt) => {
  _currentMessage({
    message: msg,
    type: 'info',
    showClose: true,
    duration: 1500,
    ...opt
  })
}
export const warn = (msg, opt) => {
  _currentMessage({
    message: msg,
    type: 'warning',
    showClose: true,
    duration: 2000,
    ...opt
  })
}
export const success = (msg, opt) => {
  _currentMessage({
    message: msg,
    type: 'success',
    showClose: true,
    duration: 1500,
    ...opt
  })
}
export const confirm = (content, opt) => {
  return _currentConfirm(
    content,
    '提示',
    Object.assign(
      {
        type: 'warning',
        closeOnClickModal: false
      },
      opt
    )
  )
}
export const prompt = (content, opt) => {
  return MessageBox.prompt(content, '提示', {})
}

function _currentMessage(opt) {
  opt.dangerouslyUseHTMLString = true
  return Message(opt)
}
function _currentConfirm(content, title, opt) {
  return MessageBox.confirm(content, title, opt)
}

//#endregion

//#region 进度条

export function showProgress() {
  NProgress && NProgress.start()
}
export function hideProgress() {
  NProgress && NProgress.done()
}

//#endregion

//#region 辅助方法
/**
 * 动态加载JS
 * @param {string} url 脚本地址
 * @param {function} callback  回调函数
 */
export function dynamicLoadJs(url, callback) {
  let promise = new Promise((resolve, reject) => {
    var head = document.getElementsByTagName('head')[0]
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    if (typeof callback === 'function') {
      script.onload = script.onreadystatechange = function() {
        if (
          !this.readyState ||
          this.readyState === 'loaded' ||
          this.readyState === 'complete'
        ) {
          callback()
          script.onload = script.onreadystatechange = null
        }
      }
    } else {
      script.onload = script.onreadystatechange = function() {
        resolve()
      }
    }
    head.appendChild(script)
  })
  return promise
}

//#endregion

/**
 * 数组降序排列
 */
export function sortDown(items, key) {
  return sort(items, key)
  function sort(items, key) {
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        item.children = sort(item.children)
      }
    })
    return items.sort(compareDown(key))
  }
  function compareDown(propertyName) {
    return (obj1, obj2) => {
      var value1 = Number(obj1[propertyName]) || 0
      var value2 = Number(obj2[propertyName]) || 0
      return value2 - value1
    }
  }
}

export function genRandomId() {
  var splitStr = ''
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (
    S4() +
    S4() +
    splitStr +
    S4() +
    splitStr +
    S4().substr(0, 3) +
    splitStr +
    S4() +
    splitStr +
    S4() +
    S4() +
    S4()
  ).toLowerCase()
}
