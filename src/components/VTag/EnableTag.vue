<template>
  <el-tag
    :type="value ? yesType : noType"
    style="margin:1px;"
    v-if="showText"
    close-transition
    v-bind="elOpt"
  >{{showText}}</el-tag>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: null
    },
    text: {},
    yes: {},
    no: {},
    //element-ui-table组件原始属性
    elOpt: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      textItems: [],
      showText: "",
      yesType: this.yes || "success",
      noType: this.no || "info"
    };
  },
  watch: {
    value(val) {
      this.showText = this.textItems[Number(this.value)];
    }
  },
  created() {
    this.textItems = this.text || ["否", "是"];
    this.showText = this.textItems[Number(this.value)];
  }
};
</script>

