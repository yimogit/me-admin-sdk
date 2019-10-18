export default {
  props: {
    id: String,
    displayType: {
      type: String,
      default: 'text'
    },
    bindType: {
      type: String,
      default: 'value'
    },
    value: [String, Number],
    changeSelect: Boolean,
    placeholder: String,
    apiFunc: Function,
    cacheKey: {
      type: String,
      default: 'cache_cascaer_' + Date.now
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
      refName: this.id || 'cascaer_' + Date.now,
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
    showOptions() {
      if (this.loadtype === 'loading') return this.loadOptions
      if (this.loadtype === 'nodata') return this.noOptions
      if (this.loadtype === 'error') return this.errorOptions
      return this.options
    }
  },
  methods: {
    currentLabels() {
      return this.$refs[this.refName].currentLabels
    },
    on_blur(e) {
      this.$emit('blur', e)
    },
    on_select_change(val) {
      this.lastValue = val[val.length - 1]
      this.$emit('input', this.lastValue)
      this.$emit('change', val)
    },
    search() {
      if (this.options.length > 0) return Promise.resolve('error')
      if (
        this.cacheKey &&
        window.selectOptions &&
        window.selectOptions[this.cacheKey]
      ) {
        this.options = window.selectOptions[this.cacheKey]
        return Promise.resolve('cache')
      }
      this.loadtype = 'loading'
      return this.apiFunc()
        .then(resp => {
          this.options = this.mapLabel(resp.data)
          this.loadtype = resp.data.length === 0 ? 'nodata' : ''
          if (this.cacheKey && window.selectOptions == null) {
            window.selectOptions = {}
          }
          if (this.cacheKey) {
            window.selectOptions[this.cacheKey] = this.options
          }
        })
        .catch(e => {
          this.loadtype = 'error'
        })
    },
    mapLabel(items) {
      return items.map(e1 => {
        /* eslint-disable */
        const first = {
          label: e1[this.displayType],
          value: e1[this.bindType]
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
      if (this.cacheKey) window.selectOptions[this.cacheKey] = null
    }
  },
  destroyed() {
    this.clearCache()
  }
}
