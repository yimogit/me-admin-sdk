<template>
  <el-row :gutter="10">
    <el-col
      :xs="3"
      :sm="8"
      :md="8"
    >
      <div>
        <slot name="left"></slot>&nbsp;
      </div>
    </el-col>
    <el-col
      :xs="16"
      :sm="8"
      :md="8"
    >
      <div
        style="text-align:center;"
        class="custom-main-title"
      >
        <router-link
          to="/"
          style="text-decoration: none;"
          v-text="$store.getters.sysTitle"
        ></router-link>
      </div>
    </el-col>
    <el-col
      :xs="5"
      :sm="8"
      :md="8"
      class="text-right"
      style="float:right;overflow-y: hidden; height: 50px;"
    >
      <el-button type="text" size="mini" v-for="item in $store.getters.headerMsgLinks" :key="item.name" @click="$ui.pages.link({name: item.routeName})" style="margin-right:10px">
        <span :style="{color: item.textColor}">{{item.name}}<span v-if="item.count&&item.count>0" :style="{color: item.countColor}">({{item.count}})</span></span>
      </el-button>
      <v-picker-theme v-if="$store.getters.defaultThemeColors&&$store.getters.defaultThemeColors.length>0" />
      <el-button
        type="text"
        v-if="!showDropFunc"
      >
        {{$store.getters.authName}}
      </el-button>
      <el-dropdown
        v-if="showDropFunc"
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
            v-if="$store.getters.updatePwdPath"
          >修改密码</el-dropdown-item>
          <el-dropdown-item
            v-if="$store.getters.sysMenus&&$store.getters.sysMenus.length>0&&!$store.getters.isMobile"
            command="disabledTab"
            divided
          >{{disabledTab?'使用多':'使用单'}}选项卡</el-dropdown-item>
          <el-dropdown-item
            v-if="$store.getters.logoutPath"
            command="logout"
            divided
          >退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      disabledTab: localStorage.DISABLE_TAB === "true"
    };
  },
  computed: {
    showDropFunc() {
      return (
        this.$store.getters.updatePwdPath ||
        (this.$store.getters.sysMenus 
        && this.$store.getters.sysMenus.length > 0 
        && !this.$store.getters.isMobile) ||
        this.$store.getters.logoutPath
      );
    }
  },
  methods: {
    logout() {
      location.href = this.$store.getters.logoutPath;
    },
    handleClick(e) {
      if (e === "disabledTab") {
        localStorage.DISABLE_TAB = !this.disabledTab;
        if (!this.disabledTab) {
          this.$store.dispatch("clearCacheView");
        }
        location.reload();
      } else if (e === "logout") {
        this.logout();
      } else if (e === "updatepwd") {
        this.$ui.pages.link(this.$store.getters.updatePwdPath);
      }
    }
  }
};
</script>

<style>
</style>
