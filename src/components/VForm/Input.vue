<template>
  <el-input
    :type="type"
    v-model="currentValue"
    @change="change"
    @blur="blur"
    :maxlength="maxlength"
    :disabled="disabled"
    :class="small?'inline-small-input':''"
    :placeholder="placeholder"
    v-bind="elOpt"
  >
    <slot
      name="prefix"
      slot="prefix"
    ></slot>
    <slot
      name="suffix"
      slot="suffix"
    ></slot>
    <slot
      name="prepend"
      slot="prepend"
    ></slot>
    <slot
      name="append"
      slot="append"
    ></slot>
  </el-input>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number]
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String
    },
    maxlength: {
      type: Number
    },
    small: {
      type: Boolean,
      default: false
    },
    validate: {
      type: String,
      default: '' // number float
    },
    fixed: {
      type: Number,
      default: -1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    hasNull: Boolean,
    //element-ui-table组件原始属性
    elOpt:{
      type:Object,
      default:{}
    }
  },
  data() {
    return {
      currentValue: this.value
    }
  },
  watch: {
    value(val) {
      this.currentValue = val
    }
  },
  methods: {
    convert(val) {
      if (this.hasNull && (val === null || val === undefined || val === '')) {
        return
      }
      switch (this.validate) {
        case 'number':
          val = parseInt(this.currentValue) || 0
          break
        case 'z-number':
          val = Math.max(parseInt(this.currentValue) || 0, 0)
          console.log(val)
          break
        case 'f-number':
          val = Math.min(parseInt(this.currentValue) || 0, 0)
          break
        case 'float':
          val = parseFloat(this.currentValue) || 0
          val = this.fixed > -1 ? val.toFixed(this.fixed) : val
          break
        case 'z-float':
          val = Math.max(parseFloat(this.currentValue) || 0, 0)
          val = this.fixed > -1 ? val.toFixed(this.fixed) : val
          break
        case 'f-float':
          val = Math.min(parseFloat(this.currentValue) || 0, 0)
          val = this.fixed > -1 ? val.toFixed(this.fixed) : val
          break
        default:
          break
      }
      if (this.validate !== '') {
        if (typeof this.max === 'number') {
          val = Math.min(this.max, val)
        }
        if (typeof this.min === 'number') {
          val = Math.max(val, this.min)
        }
      }
      return val
    },
    change(val) {
      val = this.convert(val)
      this.currentValue = val
      this.$emit('input', val)
      this.$emit('change', val)
    },
    blur(e) {
      var val = this.convert(this.currentValue)
      if (val !== '' && val !== this.currentValue) {
        this.currentValue = val
        this.$emit('input', val)
      }
      this.$emit('blur', e)
    }
  }
}
</script>

<style scoped>
.inline-small-input {
  margin-left: 0;
}
</style>
