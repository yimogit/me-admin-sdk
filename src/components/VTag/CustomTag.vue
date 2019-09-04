<template>
  <el-tag
    :type="type"
    style="margin:1px;"
    v-bind="elOpt"
  >
    <slot></slot>
  </el-tag>
</template>
<script>
export default {
  props: {
    type: {
      default: ""
    },
    //element-ui-table组件原始属性
    elOpt: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  }
};
</script>

