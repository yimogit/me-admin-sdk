// import Vue from 'vue'
import MeAdminSdk from '../../src/index.js'
const Layout = { template: '<v-layout/>' }
// Vue.use(MeAdminSdk, {
MeAdminSdk.register({
  //绑定节点
  el: '#app',
  //window键值
  currentAppKey: '__currentApp',
  // vuex store
  store: {
    state: {},
    getters: {
      indexTitle: state => '首页'
    },
    mutations: {},
    actions: {}
  },
  // 系统信息
  sysInfo: {
    authName: '管理员',
    title: 'XXX后台管理系统',
    logo: '',
    iconList: [],
    menus: [
      {
        menuId: 'a3361b3ceada4fc8bc1a65969fb652b9',
        menuName: '控制台',
        menuIcon: 'iconfont icon-dashboard',
        menuCode: 'home',
        children: null
      },
      {
        menuId: '4ae619b2e52d4f2daa80674603a16b2a',
        menuName: '系统管理',
        menuIcon: 'iconfont icon-system',
        menuCode: null,
        children: [
          {
            menuId: '49ca8eb42fbe484ba75957d853fc57aa',
            menuName: '管理员列表',
            menuIcon: null,
            menuCode: 'system_admin_list',
            children: null
          },
          {
            menuId: '59ca8eb42fbe484ba75957d853fc57aa',
            menuName: '管理员创建',
            menuIcon: null,
            menuCode: 'system_admin_create',
            children: null
          }
        ]
      },
      {
        menuId: '859a87df80ac47559e27317f2023b69e',
        menuName: '商品管理',
        menuIcon: 'iconfont icon-goods',
        menuCode: null,
        children: [
          {
            menuId: 'c64669ba96f64748aa3f9e073883ec6b',
            menuName: '商品列表',
            menuIcon: null,
            menuCode: 'goods_goods_list',
            children: null
          },
          {
            menuId: '7fe242078ecb4e4fb96e7881b8b68c6d',
            menuName: '商品分类列表',
            menuIcon: null,
            menuCode: 'goods_category_list',
            children: null
          },
          {
            menuId: 'cbfb92370f834cc8a9d9c1df065c858d',
            menuName: '商品规格列表',
            menuIcon: null,
            menuCode: 'goods_spec_list',
            children: null
          }
        ]
      }
    ],
    modules: ['*']
  },
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: {
            template: '<div>标题：{{$store.getters.indexTitle}}</div>'
          },
          meta: { auth: true, title: '首页' }
        },
        {
          name: 'welcome',
          path: 'welcome',
          component: {
            template: '<div>welcome</div>'
          },
          meta: {
            cache: true,
            auth: true,
            title: '欢迎页',
            skipauth: true
          }
        }
      ]
    },
    {
      name: 'redirect_data',
      path: '/redirect',
      component: {
        beforeCreate() {
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
      path: '/system',
      component: Layout,
      children: [
        {
          path: 'admin/list',
          name: 'system_admin_list',
          component: {
            name: 'system_admin_list',
            template: '<div>管理员列表<v-form-input/></div>'
          },
          meta: {
            cache: true,
            title: '管理员列表'
          }
        },
        {
          path: 'admin/create',
          name: 'system_admin_create',
          component: {
            name: 'system_admin_create',
            template: '<div>管理员创建<v-form-input/></div>'
          },
          meta: {
            cache: true,
            title: '管理员创建',
            pname: 'system_admin_list'
          }
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: { template: '<div>登录页</div>' }
    },
    {
      name: 'logout',
      path: '/logout',
      component: { template: '<div>退出</div>' }
    },
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
})
