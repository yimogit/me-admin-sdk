<template>
  <span :class="inline?'help-block-inline':'help-block'"
        v-if="show">
    <i class="el-icon-question" />
    <slot></slot>
  </span>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    inline: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
.help-block {
  display: block;
  color: #a9a9a9;
  font-size: 12px;
}
.help-block-inline {
  display: inline-block;
  color: #a9a9a9;
  font-size: 12px;
}
</style>
