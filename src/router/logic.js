import $ui from '../_extends/ui'
const beforeEach = (to, from, next) => {
  $ui.pages.showProgress()
  if (to.meta.skipauth || $ui.pages.checkAuth(to.name)) {
    return next()
  }
  if (to.meta.authRedirect) {
    next(to.meta.authRedirect)
  } else {
    $ui.pages.warn('无访问权限')
  }
}
const afterEach = (to, from) => {
  $ui.pages.hideProgress()
}

export default {
  beforeEach,
  afterEach
}
