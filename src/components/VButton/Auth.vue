<template>
  <el-button
    :size="size"
    :type="type"
    :disabled="disabled"
    :loading="loading"
    v-auth="auth"
    @click="click_handle"
    v-bind="elOpt"
  >
    <slot name="icon">
      <i :class="icon"></i>
    </slot>
    <slot>{{text}}</slot>
  </el-button>
</template>

<script>
import button from "./mixins/button.js";
export default {
  mixins: [button]
};
</script>
