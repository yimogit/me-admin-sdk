# me-admin-sdk

封装了 me-admin-template，使其真正的可开箱即用

示例：[完整版](https://yimogit.github.io/me-admin-sdk/example/html/full.html) [无依赖版本](https://yimogit.github.io/me-admin-sdk/example/html/mini.html)


## 完整版

将依赖的 vue 全家桶及所有依赖的包一并打包到一个文件

相关依赖：`vue,vuex,vue-router,element-ui,axios,nprogress`
若不适用 `this.$ui.pages.fetch` 方法发送 ajax 请求则可以不引用 `axios`
若不需要线上顶部进度条则可以不引用 `nprogress`

```js
<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
<link rel="stylesheet" href="https://unpkg.com/nprogress@0.2.0/nprogress.css">

// <script src="./me-admin-sdk-full.js"></script>
<script src="https://unpkg.com/me-admin-sdk/dist/me-admin-sdk-full.js"></script>
<script type="text/javascript">
      MeAdminSdk.register(options)
</script>
```

## 组件版

组件形式打包,打包时将依赖排除，使用时需要引用使用的依赖

```js
<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
<link rel="stylesheet" href="https://unpkg.com/nprogress@0.2.0/nprogress.css">

<script src="https://unpkg.com/vue@2.5.17/dist/vue.min.js"></script>
<script src="https://unpkg.com/vuex@3.1.0/dist/vuex.min.js"></script>
<script src="https://unpkg.com/vue-router@3.0.2/dist/vue-router.min.js"></script>
<script src="https://unpkg.com/element-ui@2.7.0/lib/index.js"></script>
<script src="https://unpkg.com/axios@0.18.0/dist/axios.min.js"></script>
<script src="https://unpkg.com/nprogress@0.2.0/nprogress.js"></script>
<script src="https://unpkg.com/me-admin-sdk/dist/me-admin-sdk.js"></script>
<script type="text/javascript">
      MeAdminSdk.register(options)
</script>
```

## options

```js
{
  //要绑定的节点
  el: '#app',
  //vue实例
  currentAppKey: '__currentApp',
  // vue路由
  routes: [],
  // vuex store
  store: {
    state: {},
    getters: {},
    mutations: {},
    actions: {}
  },
  // 系统信息
  sysInfo: {
    //登录名
    authName: '超级管理员',
    //系统标题
    title: 'XXXX后台管理系统',
    //菜单图标列表
    iconList: ['iconfont icon-system','el-icon-info'],//手动引入图标库，传入其class名
    //菜单
    menus: [{
        menuId: 'a3361b3ceada4fc8bc1a65969fb652b9',
        menuName: '控制台',
        menuIcon: 'iconfont icon-dashboard',
        menuCode: 'home',
        children: null//可多级嵌套
    }],
    //权限模块
    modules: ['system_admin_list'],//['*'] 为超级管理员权限
    //默认主题颜色
    themeColor: '#2D5681',
    //首页访问路由
    indexPath: '/',
    //登录访问路由
    loginPath: '/login',
    //退出访问路由
    logoutPath: '/logout'
  }
},
```
