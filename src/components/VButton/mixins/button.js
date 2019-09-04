export default {
  props: {
    auth: String,
    type: String,
    icon: String,
    text: String,
    disabled: Boolean,
    loading: Boolean,
    size: {
      type: String,
      default: 'small'
    },
    //element-ui-table组件原始属性
    elOpt: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    click_handle() {
      this.$emit('click')
    }
  }
}
