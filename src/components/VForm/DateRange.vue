<template>
  <el-date-picker
    :type="type"
    :disabled="disabled"
    :placeholder="placeholder"
    :readonly="readonly"
    :range-separator="rangeSeparator"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
    @change="change"
    :value-format="format"
    :format="format"
    v-model="currentValue"
    :picker-options="pickerOptions"
  />
</template>

<script>
const DEFAULT_FORMATS = {
  timerange: "HH:mm:ss",
  daterange: "yyyy-MM-dd",
  datetimerange: "yyyy-MM-dd HH:mm:ss"
};
export default {
  props: {
    type: {
      type: String,
      default: "daterange"
    },
    valueFormat: String,
    readonly: Boolean,
    placeholder: String,
    rangeSeparator: {
      type: String,
      default: "至"
    },
    startPlaceholder: String,
    endPlaceholder: String,
    start: [String, Date],
    end: [String, Date],
    disabled: {
      type: Boolean,
      default: false
    },
    pickerOptions: Object
  },
  data() {
    return {
      currentValue:
        this.start != null && this.end != null ? [this.start, this.end] : null,
      format: this.valueFormat || DEFAULT_FORMATS[this.type]
    };
  },
  watch: {
    start(val) {
      // console.log('start:' + val)
      var cv = this.currentValue || [];
      var val0 = val && new Date(val);
      var val1 = cv[1] || val0;
      this.currentValue = [val0, val1];
    },
    end(val) {
      // console.log('end:' + val)
      var cv = this.currentValue || [];
      var val1 = val && new Date(val);
      var val0 = cv[0] || val1;
      this.currentValue = [val0, val1];
    },
    currentValue(val) {
      if (val && val.filter(s => s == null).length > 0) {
        // console.log(val)
        this.currentValue = null;
      }
    }
  },
  methods: {
    change(val) {
      this.currentValue = val;
      this.$emit("input", val);
      this.$emit("start", val && (val.length === 2 ? val[0] : val));
      this.$emit("end", val && (val.length === 2 ? val[1] : val));
    }
  }
};
</script>

<style>
</style>
