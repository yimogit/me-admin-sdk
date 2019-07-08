// import TestLayout from './views/test/_Layout'
// import Index from './views/test/index'
// import Button from './views/test/button'
// import Select from './views/test/select'
// import TablePager from './views/test/table-pager'
// import Upload from './views/test/upload'
const Layout = { template: '<v-layout/>' }

//加载页面模块

function loadPageModules() {
  const files = require.context('./views', true, /\.vue/)
  const layoutModules = []
  const singleModules = []
  files.keys().forEach(key => {
    var mk = key.replace(/(^\.\/|\.vue$)/g, '')
    var m = files(key).default
    var path = '/' + mk
    if (!m.name) return
    var r = {
      name: m.name,
      path: path,
      meta: m.meta || {},
      component: m
    }
    if (r.meta.nolayout === true) {
      singleModules.push(r)
    } else {
      layoutModules.push(r)
    }
  })
  return { layoutModules, singleModules }
}

var { layoutModules, singleModules } = loadPageModules()
const routes = [
  {
    path: '/',
    component: Layout,
    children: layoutModules
  },
  ...singleModules,
  {
    name: '404',
    path: '/404',
    component: { template: '<div>404 NotFound</div>' },
    meta: {
      nolayout: true
    }
  },
  {
    path: '*',
    redirect: '/404',
    meta: {
      auth: false
    }
  }
]

export default routes
