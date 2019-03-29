<template>
  <el-table :data="tableData" :sort="sort" border style="width: 100%">
    <slot></slot>
    <el-table-column label="操作" align="center" :render-header="renderHeader" width="50">
      <template slot-scope="props">
        <i class="el-icon-delete" @click="removeItem(props.$index)"></i>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    value: Array,
    sort: Object,
    tempData: Object,
    customAdd: Function
  },
  data() {
    return {
      tableData: []
    }
  },
  watch: {
    value(val) {
      if (val !== this.tableData) {
        this.tableData = val
      }
    },
    tableData(val) {
      this.$emit('input', val)
    }
  },
  created() {
    this.tableData = this.value || []
  },
  methods: {
    renderHeader(createElement, { column, $index }) {
      return createElement('span', {}, [
        createElement('i', {
          attrs: { class: 'el-icon-plus' },
          on: {
            click: s => {
              if (this.customAdd) {
                this.customAdd()
              } else {
                this.tableData.push(this.tempData || {})
              }
            }
          }
        })
      ])
    },
    removeItem(index) {
      this.tableData.splice(index, 1)
    }
  }
}
</script>

<style>
</style>
