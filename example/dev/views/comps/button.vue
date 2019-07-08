<template>
  <div>
    button
    <v-btn-create auth="system_admin_list" />
    <v-btn-create auth="system_admin_list2">无权限按钮</v-btn-create>
    <v-btn-edit>编辑</v-btn-edit>
    <v-btn-del>删除</v-btn-del>
    <v-btn-export>导出</v-btn-export>
  </div>
</template>

<script>
export default {
  name: "comps-btn",
  meta: {
    title: "按钮"
  }
};
</script>

<style>
</style>
