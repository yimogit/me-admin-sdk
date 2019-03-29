import store from '../store'
export function checkAuth(code) {
  return (
    store.getters.modules &&
    (store.getters.modules.indexOf(code) > -1 ||
      store.getters.modules[0] === '*')
  )
}
export default {}
