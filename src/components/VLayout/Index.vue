<template>
  <el-container>
    <el-header
      :style="headerStyle"
      class="custom-theme-bg"
    >
      <v-app-header>
        <div
          slot="left"
          style="margin-right: 5px;"
          v-if="isMobile"
          @click="e=>menuCollspse=!menuCollspse"
        >
          <i class="el-icon-menu"></i>
        </div>
      </v-app-header>
    </el-header>
    <el-container>
      <div
        v-if="!menuCollspse&&isMobile"
        @click="e=>menuCollspse=!menuCollspse"
        style="position: absolute;z-index: 99;top: 0px;width:100%;height:100%;opacity:0.3;background:#000;"
      ></div>
      <el-aside :style="sidebarStyle">
        <v-app-sidebar :collspse="menuCollspse" />
      </el-aside>
      <el-container class="layout-main">
        <div
          @click="e=>menuCollspse=!menuCollspse"
          v-if="!isMobile"
          class="layout-toggle-menu custom-theme-bg"
        >
          <i :class="{'el-icon-arrow-left':!menuCollspse,'el-icon-arrow-right':menuCollspse}"></i>
        </div>
        <el-tabs
          v-if="!isMobile"
          v-model="currentTab"
          type="card"
          @tab-click="clickTab"
          @tab-remove="removeTab"
          class="layout-nav-tabs"
        >
          <el-tab-pane
            :label="item.tabName"
            :closable="!disableTab"
            v-for="item in pageTabs"
            :key="item.tabKey"
            :name="item.tabKey"
          >
            <div
              v-if="!disableTab"
              class="layout-tab-title"
              slot="label"
              :id="'tab_'+item.tabKey"
              @contextmenu.prevent="openMenu(item,$event)"
            >{{item.tabName}}</div>
          </el-tab-pane>
        </el-tabs>
        <v-app-main
          class="layout-main-content-mobile"
          :style="{'height':(innerHeight-this.headerHeight)+'px'}"
          v-if="isMobile"
        >
          <router-view :key="key" />
        </v-app-main>
        <v-app-main
          class="layout-main-content"
          v-else
        >
          <keep-alive
            :include="cacheViews"
            :max="20"
          >
            <router-view :key="key" />
          </keep-alive>
        </v-app-main>
        <ul
          v-show="rmenuVisible"
          :style="{left:rmenuLeft+'px',top:rmenuTop+'px'}"
          class="contextmenu"
        >
          <li
            v-for="item in rmenus"
            :key="item.key"
            @click="rmenuHandler(item)"
          >{{item.title}}</li>
        </ul>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import VAppContainer from "./components/AppContainer";
import VAppHeader from "./components/AppHeader";
import VAppSidebar from "./components/AppSidebar";
import VAppMain from "./components/AppMain";
export default {
  name: "layout",
  components: {
    VAppContainer,
    VAppHeader,
    VAppSidebar,
    VAppMain
  },
  data() {
    return {
      currentTab: "",
      pageTabs: [],
      menuCollspse: window.innerWidth < 600,
      headerHeight: 50,
      innerHeight: 0,
      disableTab: localStorage.DISABLE_TAB === "true",
      rmenus: [
        {
          key: "refresh",
          title: "刷新"
        },
        {
          key: "close",
          title: "关闭"
        },
        {
          key: "closeOthers",
          title: "关闭其他"
        },
        {
          key: "closeAll",
          title: "关闭全部"
        }
      ],
      rmenuVisible: false,
      rmenuTop: 0,
      rmenuLeft: 0,
      selectTab: {}
    };
  },
  watch: {
    $route: {
      handler(val) {
        if (val.name === "redirect_data") {
          return;
        }
        if (this.isMobile && !this.menuCollspse) {
          this.menuCollspse = true;
        }
        const routeInfo = this.currentRouteInfo(this.$route.name) || {
          menuName: this.$route.meta.title || this.$route.fullPath,
          menuUrl: this.$route.fullPath,
          menuCode: this.$route.name
        };
        if (this.$route.meta.cache) {
          this.$store.dispatch("addCacheView", this.$route.name);
        }
        this.currentTab = this.$route.name;
        if (this.pageTabs.find(e => e.tabKey === this.currentTab)) return;
        var newRoute = {
          tabName: routeInfo.menuName,
          tabRoute: routeInfo.menuUrl
            ? routeInfo.menuUrl
            : { name: routeInfo.menuCode },
          tabKey: routeInfo.menuCode
        };
        if (newRoute.tabKey) {
          this.disableTab
            ? (this.pageTabs = [newRoute])
            : this.pageTabs.push(newRoute);
        }
      },
      immediate: true
    },
    removeNavTab(val) {
      if (val) {
        this.removeTab(val);
        this.$store.dispatch("removeNavTab", "");
      }
    },
    rmenuVisible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    }
  },
  created() {
    var _this = this;
    _this.innerHeight = window.innerHeight;
    window.onresize = () => {
      if (_this.innerHeight !== window.innerHeight) {
        _this.innerHeight = window.innerHeight;
      }
    };
  },
  computed: {
    sysMenus() {
      return this.$store.getters.sysMenus;
    },
    removeNavTab() {
      return this.$store.getters.removeNavTab;
    },
    headerStyle() {
      return `height:${this.headerHeight}px;line-height: ${
        this.headerHeight
      }px;`;
    },
    isMobile() {
      return window.innerWidth < 600;
    },
    sidebarStyle() {
      var w =
        this.menuCollspse && window.innerWidth < 600
          ? "width:0;min-width:0px;"
          : "width:auto;min-width:70px;";
      this.$nextTick(() => {
        window.ChangeFooterEvent && window.ChangeFooterEvent();
      });
      var h = this.headerHeight;
      var mobileStyle = "";
      if (window.innerWidth < 600) {
        mobileStyle = "position: absolute;z-index: 999;top: 0;";
        h = 0;
      }
      return "height:" + (this.innerHeight - h) + "px;" + w + mobileStyle;
    },
    cacheViews() {
      return this.$store.state.app.cacheViews;
    },
    key() {
      // var key = this.$route.fullPath.replace(new RegExp(/(.*?)(\?|&)cv1=[\d]+/), '$1')
      // return key
      return this.$route.fullPath.replace(/\//g, "_");
    }
  },
  methods: {
    currentRouteInfo(routeName) {
      var arr = [];
      function fn(key, value, items, resultArr) {
        var checkResult = false;
        for (let index = 0; index < items.length; index++) {
          const e = items[index];
          checkResult =
            e[key] === value ||
            (e.children && fn(key, value, e.children, resultArr));
          if (checkResult) {
            resultArr.push(e);
            break;
          }
        }
        return checkResult;
      }
      fn("menuCode", routeName, this.sysMenus, arr);
      return arr[0];
    },
    clickTab(tab) {
      var currentRoute = this.pageTabs.find(e => e.tabKey === this.currentTab);
      if (!currentRoute)
        return this.$ui.pages.link(this.$store.getters.indexPath);
      else return this.$ui.pages.link(currentRoute.tabRoute);
    },
    removeTab(targetName) {
      if (this.pageTabs.length === 1) return this.$ui.pages.warn("已经是最后一个选项卡了");
      this.$store.dispatch("delCacheView", targetName);
      this.pageTabs = this.pageTabs.filter(e => e.tabKey !== targetName);
      const currentRoute =
        this.pageTabs.length > 0 &&
        this.pageTabs[this.pageTabs.length - 1].tabRoute;

      if (targetName !== this.currentTab) {
        return;
      }
      if (!currentRoute) {
        return this.$ui.pages.link(this.$store.getters.indexPath);
      }
      // console.log(targetName)
      // this.currentTab = currentRoute.tabKey
      this.$ui.pages.link(currentRoute);
    },
    openMenu(tab, e) {
      const menuMinWidth = 117;
      // const offsetLeft = e.target.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX + 10; // margin right
      // console.log(e.clientX, offsetLeft, offsetWidth, maxLeft, left)
      if (left > maxLeft) {
        this.rmenuLeft = maxLeft;
      } else {
        this.rmenuLeft = left;
      }
      this.rmenuTop = e.clientY;
      this.rmenuVisible = true;
      this.selectTab = tab;
    },
    closeMenu() {
      this.rmenuVisible = false;
    },
    rmenuHandler(item) {
      switch (item.key) {
        case "refresh":
          this.$store.dispatch("delCacheView", this.selectTab.tabKey);
          this.$ui.pages.link(
            "/redirect?data=" +
              encodeURIComponent(JSON.stringify(this.selectTab.tabRoute))
          );
          break;
        case "close":
          this.removeTab(this.selectTab.tabKey);
          break;
        case "closeOthers":
          this.pageTabs = [];
          this.$store.dispatch("clearCacheView");
          this.$ui.pages.link(
            "/redirect?data=" +
              encodeURIComponent(JSON.stringify(this.selectTab.tabRoute))
          );
          break;
        case "closeAll":
          this.pageTabs = [];
          this.$store.dispatch("clearCacheView");
          this.$ui.pages.link(
            "/redirect?data=" +
              encodeURIComponent(JSON.stringify(this.$store.getters.indexPath))
          );
          break;
      }
    }
  }
};
</script>
<style>
.layout-main {
  position: relative;
}
.layout-main-content {
  position: absolute;
  top: 43px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  padding: 15px;
}
.layout-main-content-mobile {
  width: 100%;
  overflow: auto;
  padding: 15px;
}
.layout-toggle-menu {
  width: 40px;
  height: 39px;
  background: #1f2f3d;
  position: absolute;
  top: 0;
  z-index: 10;
  cursor: pointer;
  line-height: 40px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  opacity: 0.5;
  transition: opacity 0.3s ease-out;
  margin-left: 1px;
  margin-top: 2px;
}
.layout-nav-tabs {
  width: 100%;
  height: 40px;
}
.layout-nav-tabs .el-tabs__header {
  padding-left: 42px;
  padding-top: 2px;
}
.layout-nav-tabs .el-tabs__item:focus.is-active.is-focus:not(:active) {
  box-shadow: 0px 0px 0px;
  -webkit-box-shadow: 0px 0px 0px;
}
.layout-nav-tabs .layout-tab-title {
  float: left;
  /* padding-left: 8px; */
}
.layout-nav-tabs.el-tabs--card
  > .el-tabs__header
  .el-tabs__item.is-active.is-closable {
  padding-left: 10px;
  padding-right: 10px;
}
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 100;
  position: fixed;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}
.contextmenu li {
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
}
.contextmenu li:hover {
  background: #eee;
}
</style>
