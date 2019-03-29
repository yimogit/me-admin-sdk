<template>
  <el-date-picker
    :type="type"
    :disabled="disabled"
    :placeholder="placeholder"
    @change="change"
    :value-format="format"
    v-model="currentValue"
  />
</template>

<script>
const DEFAULT_FORMATS = {
  date: 'yyyy-MM-dd',
  month: 'yyyy-MM',
  datetime: 'yyyy-MM-dd HH:mm',
  fulldatetime: 'yyyy-MM-dd HH:mm:ss',
  time: 'HH:mm:ss',
  week: 'yyyywWW',
  year: 'yyyy'
}
export default {
  props: {
    value: {
      type: [String, Date]
    },
    type: {
      type: String,
      default: 'date'
    },
    placeholder: {
      type: String,
      default: '选择日期'
    },
    valueFormat: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  created() { },
  data() {
    return {
      currentValue: this.value && new Date(this.value),
      format: this.valueFormat || DEFAULT_FORMATS[this.type]
    }
  },
  watch: {
    value(val) {
      if (new Date(val) !== this.currentValue) {
        this.currentValue = val && new Date(val)
      }
    }
  },
  methods: {
    change(val) {
      this.currentValue = val && new Date(val)
      this.$emit('input', (val || '').toString())
    }
  }
}
</script>
