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
    sysTheme: '#7D8D9D',
    sysNavTheme: {},
    indexPath: null,
    loginPath: null,
    logoutPath: null,
    updatePwdPath: null,
    isMobile: window.innerWidth < 600,
    defaultThemeColors: [], //["#409EFF", "#3EBBB1", "#BB963E"],
    customHeaderComp: null,
    lastRoutePath:null
  },
  getters: {
    removeNavTab: state => state.removeNavTab,
    cacheViews: state => state.cacheViews,
    authName: state => state.authName,
    sysTitle: state => state.sysTitle,
    sysTheme: state => state.sysTheme,
    sysNavTheme: state => state.sysNavTheme,
    sysLogo: state => state.sysLogo,
    sysMenus: state => state.sysMenus,
    modules: state => state.modules,
    indexPath: state => state.indexPath,
    loginPath: state => state.loginPath,
    logoutPath: state => state.logoutPath,
    updatePwdPath: state => state.updatePwdPath,
    isMobile: state => state.isMobile,
    defaultThemeColors: state => state.defaultThemeColors,
    customHeaderComp: state => state.customHeaderComp,
    lastRoutePath: state => state.lastRoutePath
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
      for (let index = 0; index < state.cacheViews.length; index++) {
        if (state.cacheViews[index] === routeName) {
          state.cacheViews.splice(index, 1)
          break
        }
      }
    },
    CLEAR_CACHE_VIEW: state => {
      state.cacheViews = []
      sessionStorage.CurrentPageTabs = '[]'
    },
    SET_SYS_INFO: (state, sysInfo) => {
      state.sysTitle = sysInfo.sysTitle
      state.sysLogo = sysInfo.sysLogo
      state.sysTheme = sysInfo.sysTheme || state.sysTheme
      state.sysNavTheme = sysInfo.sysNavTheme || state.sysNavTheme
      state.authName = sysInfo.authName
      state.sysMenus = sysInfo.menus || []
      state.modules = sysInfo.modules || []
      state.indexPath = sysInfo.indexPath
      state.loginPath = sysInfo.loginPath
      state.logoutPath = sysInfo.logoutPath
      state.updatePwdPath = sysInfo.updatePwdPath
      state.defaultThemeColors = sysInfo.defaultThemeColors || state.defaultThemeColors
      state.customHeaderComp = sysInfo.customHeaderComp
      if (typeof sysInfo.isMobile === 'boolean') {
        state.isMobile = sysInfo.isMobile
      }
    },
    SET_LAST_ROUTE_PATH: (state, path) => {
      state.lastRoutePath = path
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
    },
    setLastRoutePath({ commit }, path) {
      commit('SET_LAST_ROUTE_PATH', path)
    }
  }
}
export default appStore
