<template>
  <el-cascader
    :placeholder="placeholder"
    :ref="refName"
    :options="showOptions"
    @change="on_select_change"
    filterable
    @focus="search"
    @blur="on_blur"
    v-model="currentValue"
    clearable
    :change-on-select="changeSelect"
  ></el-cascader>
</template>
<script>
import cascader from './cascader.js'
export default {
  mixins: [cascader],
  data() {
    return {
    }
  }
}
</script>
