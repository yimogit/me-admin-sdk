export default {
  props: {
    displayType: {
      type: String,
      default: 'text'
    },
    bindType: {
      type: String,
      default: 'value'
    },
    renderPanel: Boolean,
    value: [String, Number, Array],
    changeSelect: Boolean,
    placeholder: String,
    apiFunc: Function,
    cacheKeyPrefix: {
      type: String,
      default: 'MeAdminSdk_SelectOptions'
    },
    cacheKey: {
      type: String,
      default: 'cache_cascaer_' + Date.now()
    },
    filterable: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: true
    },
    //element-ui-table组件原始属性
    elOpt: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      refName: 'cascaer_' + Date.now() + parseInt(Math.random() * 100000),
      currentValue: [],
      loadtype: '', // loading nodata
      options: [],
      lastValue: null,
      loadOptions: [
        {
          label: '加载中...',
          value: '',
          disabled: true
        }
      ],
      noOptions: [
        {
          label: '暂无数据',
          value: '',
          disabled: true
        }
      ],
      errorOptions: [
        {
          label: '加载失败',
          value: '',
          disabled: true
        }
      ]
    }
  },
  watch: {
    value: {
      handler(val) {
        if (this.isMultiple) {
          this.search().then(() => {
            this.currentValue = val
          })
          return;
        }
        val = String(val || '')
        if (this.lastValue === String(val)) return
        this.search().then(() => {
          this.currentValue = this.getParentArrs(this.options, val)
          // this.on_select_change(this.currentValue) //如果需要马上监听change
        })
      },
      immediate: true
    }
  },
  computed: {
    isMultiple() {
      return this.elOpt && this.elOpt.props && this.elOpt.props.multiple
    },
    showOptions() {
      if (this.loadtype === 'loading') return this.loadOptions
      if (this.loadtype === 'nodata') return this.noOptions
      if (this.loadtype === 'error') return this.errorOptions
      return this.options
    }
  },
  methods: {
    getRef() {
      return this.$refs[this.refName]
    },
    currentLabels() {
      return this.$refs[this.refName].currentLabels
    },
    on_blur(e) {
      this.$emit('blur', e)
    },
    on_select_change(val) {
      if (this.isMultiple) {
        this.$emit('input', val)
        this.$emit('change', val)
        return
      }
      this.lastValue = val[val.length - 1]
      this.$emit('input', this.lastValue)
      this.$emit('change', val)
    },
    search() {
      if (this.options.length > 0) return Promise.resolve('error')
      if (
        this.cacheKey &&
        window[this.cacheKeyPrefix] &&
        window[this.cacheKeyPrefix][this.cacheKey]
      ) {
        this.options = window[this.cacheKeyPrefix][this.cacheKey]
        return Promise.resolve('cache')
      }
      if (!this.apiFunc && this.elOpt.options) {
        this.options = this.elOpt.options
        this.setData(this.options)
        return Promise.resolve('static')
      }
      this.loadtype = 'loading'
      return this.apiFunc()
        .then(resp => {
          this.options = this.mapLabel(resp.data)
          this.setData(this.options)
        })
        .catch(e => {
          this.loadtype = 'error'
        })
    },
    setData(options) {
      this.loadtype = options.length === 0 ? 'nodata' : ''
      if (this.cacheKey && window[this.cacheKeyPrefix] == null) {
        window[this.cacheKeyPrefix] = {}
      }
      if (this.cacheKey) {
        window[this.cacheKeyPrefix][this.cacheKey] = options
      }
    },
    mapLabel(items) {
      return items.map(e1 => {
        /* eslint-disable */
        const first = {
          label: e1[this.displayType],
          value: e1[this.bindType],
          disabled: false
        }
        if (!!e1.disabled) {
          first.disabled = true
        }
        if (e1.children && e1.children.length > 0) {
          first.children = this.mapLabel(e1.children)
        }
        return first
      })
    },
    getLastItem() {
      var cvals = this.currentValue
      var arr = this.mapText(this.options, cvals)
      return {
        text: arr[cvals.length - 1],
        value: cvals[cvals.length - 1]
      }
    },
    mapText(items, values) {
      var arr = []
      items.forEach(e1 => {
        /* eslint-disable */
        if (values.find(s => s == e1[this.bindType])) {
          arr.push(e1.label)
          console.log(e1.label)
        }
        if (e1.children && e1.children.length > 0) {
          arr.push(...this.mapText(e1.children, values))
        }
      })
      return arr
    },
    getParentArrs(_items, _val) {
      const attr_name = 'value'
      return (function getArr(items, val, arr) {
        var item = items.find(s => s[attr_name] == val)
        if (item) {
          arr.push(item[attr_name])
        } else {
          items.forEach(item_c => {
            if (!item_c.children) return
            var newArr = getArr(item_c.children, val, [])
            if (newArr.length > 0) {
              arr = arr.concat(newArr)
              arr.push(item_c[attr_name])
              return
            }
          })
        }
        return arr
      })(_items, _val, []).reverse()
    },
    clearCache() {
      if (this.cacheKey) window[this.cacheKeyPrefix][this.cacheKey] = null
    }
  },
  destroyed() {
    this.clearCache()
  }
}
