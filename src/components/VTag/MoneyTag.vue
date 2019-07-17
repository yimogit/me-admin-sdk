<template>
  <el-tag v-if="value!=null">
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
    }
  }
};
</script>

