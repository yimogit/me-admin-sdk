<template>
  <div>
    <div>CustomTag:<v-tag-custom>哈哈哈</v-tag-custom>
      <v-tag-custom>哈哈哈</v-tag-custom>
    </div>
    <div>EnableTag:
      <v-tag-enable v-model="status" />
      <v-btn-auth @click="status=!status">切换状态</v-btn-auth>
    </div>
    <div>MoneyTag:
      <v-tag-money :value="moneyValue" />
      <el-input-number
        v-model="moneyValue"
        placeholder=""
      ></el-input-number>
    </div>
  </div>
</template>

<script>
export default {
  name: "comps-tag",
  meta: {
    title: "标签"
  },
  data() {
    return {
      status: false,
      moneyValue: 100
    };
  }
};
</script>

<style>
</style>
