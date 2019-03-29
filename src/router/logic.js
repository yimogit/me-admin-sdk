import $ui from '../_extends/ui'
import NProgress from 'nprogress' // Progress 进度条
import { checkAuth } from '../filters'
const beforeEach = (to, from, next) => {
  NProgress.start()
  if (!to.meta.auth || to.meta.skipauth || checkAuth(to.name)) {
    return next()
  }
  if (to.meta.authRedirect) {
    next(to.meta.authRedirect)
  } else {
    $ui.pages.warn('无访问权限')
  }
}
const afterEach = (to, from) => {
  NProgress.done()
}

// function checkAuth(code) {
//   return (
//     store.getters.modules &&
//     (store.getters.modules.indexOf(code) > -1 || store.getters.modules[0] === '*')
//   )
// }

export default {
  beforeEach,
  afterEach
}
