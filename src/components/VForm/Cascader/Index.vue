<template>
  <el-cascader
    :placeholder="placeholder"
    :ref="refName"
    :options="showOptions"
    @change="on_select_change"
    @focus="search"
    @blur="on_blur"
    @expand-change="$emit('expand-change')"
    @visible-change="$emit('visible-change')"
    @remove-tag="$emit('remove-tag')"
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
  mixins: [cascader]
}
</script>
