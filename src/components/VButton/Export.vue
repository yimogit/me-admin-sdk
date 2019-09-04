<template>
  <el-button
    type
    size="small"
    v-auth="authName"
    :loading="loading||exportLoading"
    :disabled="disabled"
    @click="handle"
    v-bind="elOpt"
  >
    <slot name="icon">
      <i class="el-icon-download"></i>
    </slot>
    <slot>{{text}}</slot>
  </el-button>
</template>
<script>
import button from "./mixins/button.js";
export default {
  mixins: [button],
  props: {
    to: {
      type: Object
    },
    search: {},
    text: {
      type: String,
      default: "导出"
    }
  },
  data() {
    return {
      exportLoading: false
    };
  },
  computed: {
    authName() {
      return this.to ? this.to.name : "";
    }
  },
  methods: {
    handle() {
      this.exportLoading = true;
      this.$emit(
        "click",
        this.search,
        () => {
          this.exportLoading = false;
        },
        () => {
          this.exportLoading = false;
        }
      );
    }
  }
};
</script>
