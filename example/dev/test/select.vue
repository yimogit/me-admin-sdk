<template>
  <div>
    <p>
      <v-form-select
        v-model="role0"
        :apiFunc="roleFunc"
      ></v-form-select>
      role0: {{role0}}
    </p>
    <p>
      <el-button @click="e=>this.role1=this.role0">同步role0到role1</el-button>
    </p>
    <p>
      <v-form-select
        v-model="role1"
        :apiFunc="roleFunc"
      ></v-form-select>
      role1:{{role1}}
    </p>
    <br />
    <p>
      <v-form-select
        v-model="role2"
        multiple
        :apiFunc="roleFunc"
      ></v-form-select>
      role2:{{role2}}
    </p>
    <p>
      <el-button @click="e=>this.role3=this.role2">↓同步</el-button>
    </p>
    <p>
      <v-form-select
        v-model="role3"
        collapse-tags
        multiple
        :apiFunc="roleFunc"
      ></v-form-select>
      多个标签折叠:{{role3}}
    </p>
    <p>
      <v-form-select
        v-model="role4"
        multiple
        multipleSplit=","
        :apiFunc="roleFunc"
      ></v-form-select>
      字符串分割:{{role4}}
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleFunc: () =>
        new Promise((resolve, reject) => {
          console.log("apiRequest.........");
          setTimeout(() => {
            resolve({
              status: 1,
              msg: "ok",
              data: [
                { text: "LP", value: "lp", children: null },
                { text: "JLDL", value: "jldl", children: null }
              ]
            });
          }, 5000);
        }),
      role0: null,
      role1: 2,
      role2: [],
      role3: [],
      role4: "1,2"
    };
  }
};
</script>

<style>
</style>
