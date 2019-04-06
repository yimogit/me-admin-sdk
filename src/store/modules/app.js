// import Vue from 'vue'
const REMOVE_NAV_TAB_KEY = 'REMOVE_NAV_TAB_KEY'
const appStore = {
  state: {
    removeNavTab: '',
    cacheViews: [],
    authName: null,
    sysTitle: null,
    sysLogo: null,
    sysMenus: [],
    modules: [],
    iconList: [],
    sysTheme: '#409EFF',
    indexPath: '/',
    loginPath: '/login',
    logoutPath: '/logout',
  },
  getters: {
    removeNavTab: state => state.removeNavTab,
    cacheViews: state => state.cacheViews,
    authName: state => state.authName,
    sysTitle: state => state.sysTitle,
    sysTheme: state => state.sysTheme,
    sysLogo: state => state.sysLogo,
    sysMenus: state => state.sysMenus,
    modules: state => state.modules,
    iconList: state => state.iconList,
    indexPath: state => state.indexPath,
    loginPath: state => state.loginPath,
    logoutPath: state => state.logoutPath,
    form_label_width: state => window.innerWidth > 600 ? '200px' : 'auto'
  },
  mutations: {
    REMOVE_NAV_TAB_KEY: (state, value) => {
      state.removeNavTab = value
    },
    ADD_CACHE_VIEW: (state, routeName) => {
      if (routeName && state.cacheViews.indexOf(routeName) === -1) {
        state.cacheViews.push(routeName)
      }
    },
    DEL_CACHE_VIEW: (state, routeName) => {
      if (!routeName || state.cacheViews.indexOf(routeName) === -1) {
        return
      }
      for (const i of state.cacheViews) {
        if (i === routeName) {
          const index = state.cacheViews.indexOf(i)
          state.cacheViews.splice(index, 1)
          break
        }
      }
    },
    CLEAR_CACHE_VIEW: state => {
      state.cacheViews = []
    },
    SET_SYS_INFO: (state, sysInfo) => {
      state.sysTitle = sysInfo.title || state.sysTitle
      state.sysLogo = sysInfo.logo || state.sysLogo
      state.authName = sysInfo.authName || state.authName
      state.sysMenus = sysInfo.menus || []
      state.modules = sysInfo.modules || []
      state.iconList = sysInfo.iconList || []
      state.sysTheme = sysInfo.themeColor || state.sysTheme
      state.indexPath = sysInfo.indexPath || state.indexPath
      state.loginPath = sysInfo.loginPath || state.loginPath
      state.logoutPath = sysInfo.logoutPath || state.logoutPath
    }
  },
  actions: {
    removeNavTab: ({ commit }, tabName) => {
      commit('DEL_CACHE_VIEW', tabName)
      commit(REMOVE_NAV_TAB_KEY, tabName)
    },
    addCacheView({ commit }, routeName) {
      commit('ADD_CACHE_VIEW', routeName)
    },
    delCacheView({ commit }, routeName) {
      commit('DEL_CACHE_VIEW', routeName)
    },
    clearCacheView({ commit }) {
      commit('CLEAR_CACHE_VIEW')
    },
    setSysInfo({ commit }, sysInfo) {
      commit('SET_SYS_INFO', sysInfo || {})
    }
  }
}
export default appStore
