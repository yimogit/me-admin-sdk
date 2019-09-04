<template>
  <el-tag
    v-if="value!=null"
    v-bind="elOpt"
  >
    <slot>{{prefix}}{{value}}</slot>
  </el-tag>
</template>
<script>
export default {
  props: {
    value: null,
    prefix: {
      type: String,
      default: "￥"
    },
    //element-ui-table组件原始属性
    elOpt: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

