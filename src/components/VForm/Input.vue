<template>
  <el-input
    :type="type"
    v-model="currentValue"
    @blur="blur"
    @clear="$emit('clear')"
    @focus="$emit('focus')"
    :maxlength="maxlength"
    :disabled="disabled"
    :class="small?'inline-small-input':''"
    :placeholder="placeholder"
    :showWordLimit="showWordLimit"
    v-bind="elOpt"
    :ref="refName"
  >
    <slot
      name="prefix"
      slot="prefix"
    ></slot>
    <slot
      name="suffix"
      slot="suffix"
    ></slot>
    <slot
      name="prepend"
      slot="prepend"
    ></slot>
    <slot
      name="append"
      slot="append"
    ></slot>
  </el-input>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number]
    },
    type: {
      type: String,
      default: "text"
    },
    placeholder: {
      type: String
    },
    maxlength: {
      type: Number
    },
    small: {
      type: Boolean,
      default: false
    },
    validate: {
      type: String,
      default: null // number float
    },
    fixed: {
      type: Number,
      default: -1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    hasNull: Boolean,
    showWordLimit: Boolean,
    //element-ui-table组件原始属性
    elOpt: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      refName: "input_" + Date.now() + parseInt(Math.random() * 100000),
      currentValue: this.value
    };
  },
  watch: {
    value(val) {
      var newVal = this.convert(val);
      if (newVal === this.currentValue) return;
      this.currentValue = newVal;
    },
    currentValue(val) {
      var newVal = this.convert(val);
      if (newVal !== val) {
        this.currentValue = newVal;
        this.$emit("change", newVal);
      }
      this.$emit("input", newVal);
    }
  },
  methods: {
    getRef() {
      return this.$refs[this.refName];
    },
    convert(val) {
      if (this.hasNull && (val === null || val === undefined || val === "")) {
        return;
      }
      switch (this.validate) {
        case "number":
          val = parseInt(val) || 0;
          break;
        case "z-number":
          val = Math.max(parseInt(val) || 0, 0);
          break;
        case "f-number":
          val = Math.min(parseInt(val) || 0, 0);
          break;
        case "float":
          val = parseFloat(val) || 0;
          val = this.fixed > -1 ? val.toFixed(this.fixed) : val;
          break;
        case "z-float":
          val = Math.max(parseFloat(val) || 0, 0);
          val = this.fixed > -1 ? val.toFixed(this.fixed) : val;
          break;
        case "f-float":
          val = Math.min(parseFloat(val) || 0, 0);
          val = this.fixed > -1 ? val.toFixed(this.fixed) : val;
          break;
        default:
          break;
      }
      if (this.validate && typeof this.max === "number") {
        val = Math.min(this.max, val);
      }
      if (this.validate && typeof this.min === "number") {
        val = Math.max(val, this.min);
      }
      return val;
    },
    blur(e) {
      var val = this.convert(this.currentValue);
      if (val !== "" && val !== this.currentValue) {
        this.currentValue = val;
        this.$emit("input", val);
      }
      this.$emit("blur", e);
    }
  }
};
</script>

<style scoped>
.inline-small-input {
  margin-left: 0;
}
</style>
