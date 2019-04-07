import Vue from 'vue'
import Router from 'vue-router'
import logic from './logic'
import VLayout from '../components/VLayout/Index'
Vue.use(Router)

const router = new Router({
  mode: localStorage.IS_HASH_MODE ? 'hash' : 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    const position = {}
    if (to.hash) {
      position.selector = to.hash
    }
    position.x = 0
    position.y = 0
    return position
  },
  routes: [
    {
      name: 'redirect_data',
      path: '/redirect',
      component: {
        created() {
          var route = JSON.parse(
            decodeURIComponent(this.$route.query.data) || '{}'
          )
          this.$ui.pages.link(route)
        },
        render: function(h) {
          return h() // avoid warning message
        }
      }
    },
    {
      name: 'webview',
      path: '/webview',
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
})
router.beforeEach(logic.beforeEach)
router.afterEach(logic.afterEach)

export default router
