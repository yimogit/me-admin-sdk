<template>
  <el-row :gutter="24">
    <el-col
      :xs="3"
      :sm="6"
      :md="6"
    >
      <div>
        <slot name="left"></slot>&nbsp;
      </div>
    </el-col>
    <el-col
      :xs="13"
      :sm="12"
      :md="12"
    >
      <div style="text-align:center;">
        <router-link
          to="/"
          style="text-decoration: none;"
          v-text="$store.getters.sysTitle"
        ></router-link>
      </div>
    </el-col>
    <el-col
      :xs="8"
      :sm="6"
      :md="6"
      class="text-right"
      style="float:right"
    >
      <v-theme-picker />
      <el-dropdown
        trigger="click"
        placement="bottom-end"
        @command="handleClick"
      >
        <el-button type="text">
          {{$store.getters.authName}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            command="updatepwd"
            v-auth="'system_admin_updatepwd'"
          >修改密码</el-dropdown-item>
          <el-dropdown-item
            command="disabledTab"
            divided
          >{{disabledTab?'启用':'禁用'}}选项卡</el-dropdown-item>
          <el-dropdown-item
            command="logout"
            divided
          >退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
// import 'element-ui/lib/theme-chalk/display.css'
import VThemePicker from "./ThemePicker";
export default {
  components: {
    VThemePicker
  },
  data() {
    return {
      disabledTab: localStorage.DISABLE_TAB === "true"
    };
  },
  methods: {
    logout() {
      this.$ui.pages.link(this.$store.getters.logoutPath);
      // localStorage.removeItem('token')
      // this.$ui.cookie.removeItem(this.$ui.cookie.KEYS.login_token)
      // location.reload()
    },
    handleClick(e) {
      if (e === "disabledTab") {
        localStorage.DISABLE_TAB = !this.disabledTab;
        location.reload();
      } else if (e === "logout") {
        this.logout();
      } else if (e === "updatepwd") {
        this.$ui.pages.link({ name: "system_admin_updatepwd" });
      }
    }
  }
};
</script>

<style>
</style>
