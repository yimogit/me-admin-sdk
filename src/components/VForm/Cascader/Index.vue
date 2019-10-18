<template>
  <el-cascader
    :placeholder="placeholder"
    :ref="refName"
    :options="showOptions"
    @change="on_select_change"
    @focus="search"
    @blur="on_blur"
    v-model="currentValue"
    :change-on-select="changeSelect"
    :filterable="filterable"
    :clearable="clearable"
    v-bind="elOpt"
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
