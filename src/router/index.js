import Vue from 'vue'
import Router from 'vue-router'
import logic from './logic'
import VLayout from '../components/VLayout/Index'
Vue.use(Router)
const defRoutes = [
  {
    name: 'redirect_data',
    path: '/redirect',
    meta: {
      skipauth: true
    },
    component: {
      created() {
        var route = JSON.parse(
          decodeURIComponent(this.$route.query.data) || '{}'
        )
        this.$ui.pages.link(route)
      },
      render: h => h()
    }
  },
  {
    name: 'webview',
    path: '/webview',
    meta: {
      skipauth: true
    },
    component: VLayout,
    children: [
      {
        path: '',
        name: 'webview_home',
        meta: { title: 'Webview' },
        component: {
          template:
            '<iframe style="width: 100%;height: 100%;border: 0;padding: 0;" :src="dataUrl" v-if="dataUrl" ></iframe>',
          data() {
            return {
              dataUrl: null
            }
          },
          created() {
            this.dataUrl = decodeURIComponent(this.$route.query.url)
          }
        }
      }
    ]
  }
]
const router = new Router({
  mode: 'history'
})

export default router

export function initRouter(routerConfig) {
  routerConfig.routes = defRoutes.concat(routerConfig.routes)
  Object.assign(router, new Router(routerConfig))
  routerConfig.beforeEach
    ? router.beforeEach(routerConfig.beforeEach)
    : router.beforeEach(logic.beforeEach)
  routerConfig.afterEach
    ? router.afterEach(routerConfig.afterEach)
    : router.afterEach(logic.afterEach)
  return router
}
