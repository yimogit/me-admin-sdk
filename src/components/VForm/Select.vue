<template>
  <el-select
    v-model="currentValue"
    v-loading="isloading"
    :collapse-tags="collapseTags"
    :allowCreate="allowCreate"
    :filterable="filterable"
    :clearable="clearable"
    :defaultFirstOption="defaultFirstOption"
    @change="change"
    @visible-change="$emit('visible-change')"
    @remove-tag="$emit('remove-tag')"
    @clear="$emit('clear')"
    @blur="$emit('blur')"
    @focus="loadData(true)"
    :multiple="multiple"
    :placeholder="placeholder"
    :ref="refName"
    v-bind="elOpt"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.text||item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    value: [String, Number, Array],
    multipleSplit: String,
    multiple: Boolean,
    collapseTags: Boolean,
    placeholder: String,
    allowCreate: Boolean,
    filterable: Boolean,
    defaultFirstOption: Boolean,
    clearable: {
      type: Boolean,
      default: true
    },
    apiFunc: {
      type: Function
    },
    //element-ui-table组件原始属性
    elOpt: {
      type: Object,
      default: () => {}
    }
    // cacheKey: String
  },
  watch: {
    value: {
      handler(val) {
        var isLoad = val === 0;
        if (this.multiple) {
          if (this.multipleSplit) {
            this.currentValue = (val || "")
              .split(this.multipleSplit)
              .filter(s => s.trim() !== "");
          } else {
            this.currentValue = (val || []).map(e => String(e));
          }
        } else {
          this.currentValue = String(isLoad ? "0" : val || "");
        }
        if (isLoad || (this.currentValue && this.currentValue.length > 0)) {
          this.loadData();
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      refName: "select_" + Date.now() + parseInt(Math.random() * 100000),
      options: [],
      currentValue: this.multiple ? [] : null,
      isloading: false
    };
  },
  methods: {
    getRef() {
      return this.$refs[this.refName];
    },
    change(val) {
      if (this.multipleSplit) {
        this.$emit("input", (val || []).join(","));
      } else {
        this.$emit("input", val);
      }
    },
    loadData(autoOpen) {
      if (!this.apiFunc && this.elOpt.options) {
        this.options = this.elOpt.options;
        this.isloading = false;
        return;
      }
      if (this.isloading || this.options.length > 0 || !this.apiFunc) return;
      this.isloading = true;
      setTimeout(() => {
        this.apiFunc()
          .then(res => {
            this.options = res.data.map(s => {
              s.value = String(s.value);
              return s;
            });
            this.isloading = false;
            if (autoOpen) this.$refs[this.refName].selectOption();
          })
          .catch(_ => {
            this.isloading = false;
          });
      }, 200);
    }
  }
};
</script>
