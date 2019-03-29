<template>
  <el-select
    v-model="currentValue"
    placeholder="请选择"
    filterable
    clearable
  >
    <el-option
      v-for="item in iconList"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      <span style="float: left">
        <i :class="item.value"></i>
        {{ item.label }}
      </span>
    </el-option>
  </el-select>
</template>

<script>
// 复制 iconfont 图标
// var arr=[]
// document.querySelectorAll(".icon-code.icon-code-show").forEach(s=>{
//    arr.push(s.innerText.replace('icon-',''))
// })
// JSON.stringify(arr)
export default {
  props: {
    value: String
  },
  watch: {
    value: {
      handler(val) {
        if (this.currentValue !== val) {
          this.currentValue = val;
        }
      },
      immediate: true
    },
    currentValue(val) {
      if (this.value !== val) {
        this.$emit("input", val);
      }
    }
  },
  data() {
    return {
      currentValue: null,
      iconList: []
    };
  },
  computed: {
    iconList() {
      return this.$store.getters.iconList.map(s => {
        return {
          label: s,
          value: s
          // value: "iconfont icon-" + s
        };
      });
    }
  }
};
</script>
