// import Vue from 'vue'
import MeAdminSdk from '../../src/index.js'
// Element-UI 样式
import 'element-ui/lib/theme-chalk/index.css'
import 'nprogress/nprogress.css' // Progress 进度条样式
import routes from './router'
var i = 1
function getCompModules() {
  const files = require.context('./views/comps', true, /\.vue/)
  const modules = []
  files.keys().forEach(key => {
    var mk = key.replace(/(^\.\/|\.vue$)/g, '')
    var m = files(key).default
    var path = '/' + mk
    if (!m.name) return
    var r = {
      menuId: i++,
      menuName: m.meta.title,
      menuIcon: null,
      menuCode: m.name
    }
    modules.push(r)
  })
  return modules
}

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
    actions: {
      uploadAction({ commit }, d) {
        console.log('开始上传',d)
        return new Promise((resolve, reject) => {
          var reader = new FileReader()
          reader.onload = function () {
            resolve({
              status: 1,
              data: this.result
            })
          }
          reader.readAsDataURL(d.file)

          // if (d.category) {
          //   d.fromData.append('category', d.category)
          // }
        })
        // return __currentApp.$ui.fetch.post(null, null, {
        //   url: '/common/upload',
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   },
        //   transformRequest: function(data) {
        //     return data
        //   },
        //   data: d.fromData
        // })
      }
    }
  },
  // 系统信息
  sysInfo: {
    authName: '管理员',
    sysTitle: 'XXX后台管理系统',
    sysLogo: '',
    iconList: [],
    sysNavTheme: {
      backgroundColor: '#545c64',
      textColor: '#fff',
      activeTextColor: '#ffd04b',
      uniqueOpened: false,
      collapseTransition: false
    },
    menus: [
      {
        menuId: 'a3361b3ceada4fc8bc1a65969fb652b9',
        menuName: '控制台',
        menuIcon: 'el-icon-menu',
        menuCode: 'home',
        children: null
      },
      {
        menuId: '4ae619b2e52d4f2daa80674603a16b2a',
        menuName: '组件',
        menuIcon: 'el-icon-menu',
        menuCode: null,
        children: getCompModules()
      },
      {
        menuId: '博客',
        menuName: '博客',
        menuIcon: 'el-icon-menu',
        menuCode: '',
        children: [
          {
            menuId: '个人博客',
            menuName: '个人博客',
            menuCode: '',
            children: [
              {
                menuId: 'test3',
                menuName: '易墨博客',
                menuIcon: null,
                menuUrl: '/webview?url=http://www.yimo.link/',
                children: null
              }
            ]
          }
        ]
      },
      // {
      //   menuId: '859a87df80ac47559e27317f2023b69e',
      //   menuName: '链接管理',
      //   menuIcon: 'iconfont icon-goods',
      //   menuCode: null,
      //   children: [
      //     {
      //       menuId: 'c64669ba96f64748aa3f9e073883ec6b',
      //       menuName: '百度',
      //       menuIcon: null,
      //       menuCode: '',
      //       menuUrl: '/webview?url=https%3A%2F%2Fwww.baidu.com%2F',
      //       children: null
      //     },
      //     {
      //       menuId: 'c64669ba96f64748233f9e073883ec6b',
      //       menuName: '1xy2',
      //       menuIcon: null,
      //       menuCode: '',
      //       menuUrl: '/webview?url=https%3A%2F%2Fwww.1xy2.com%2F',
      //       children: null
      //     }
      //   ]
      // }
    ],
    modules: ['*']
  },
  router: {
    mode: 'hash',
    routes: routes
  }
})
