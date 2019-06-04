<template>
  <el-button
    type
    size="small"
    v-auth="authName"
    :loading="loading||exportLoading"
    :disabled="disabled"
    @click="handle"
  >
    <slot name="icon">
      <i class="el-icon-download"></i>
    </slot>
    <slot>{{text}}</slot>
  </el-button>
</template>
<script>
export default {
  props: {
    to: {
      type: Object
    },
    search: {},
    loading: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '导出'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      exportLoading: false
    }
  },
  computed: {
    authName() {
      return this.to ? this.to.name : ''
    }
  },
  methods: {
    handle() {
      this.exportLoading = true
      this.$emit('click', this.search, () => {
        this.exportLoading = false
      }, () => {
        this.exportLoading = false
      })
    }
  }
}
</script>
