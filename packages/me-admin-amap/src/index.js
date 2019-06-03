import VAmap from './Amap'
const instance = VAmap

const install = (Vue, globalOptions) => {
  let compName = instance.name
  if (globalOptions) {
    compName = globalOptions.name || compName
    if (instance.props.globalOptions) {
      instance.props.globalOptions.default = () => globalOptions
    }
  }
  Vue.component(compName, instance)
}
instance.install = install
export default instance
export { instance, install }
