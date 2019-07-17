<template>
  <el-tag :type="type"
          style="margin:1px;">
    <slot></slot>
  </el-tag>
</template>
<script>
export default {
  props: {
    type: {
      default: ''
    }
  },
  data() {
    return {}
  }
}
</script>

