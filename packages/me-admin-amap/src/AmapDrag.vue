<template>
  <div class="m-map">
    <div
      class="search"
      v-if="placeSearch"
    >
      <input
        type="text"
        placeholder="请输入关键字"
        v-model="searchKey"
        @keydown.enter="handleSearch"
      >
      <button
        type="button"
        @click="handleSearch"
      >搜索</button>
      <div
        id="js-result"
        v-show="searchKey"
        class="result"
      ></div>
    </div>
    <div
      id="js-container"
      class="map"
    >正在加载数据 ...</div>
  </div>
</template>

<script>
/* eslint-disable */
const MapCityName = "全国";
export default {
  props: {
    lat: Number,
    lng: Number,
    mapKey: String
  },
  data() {
    return {
      searchKey: "",
      placeSearch: null,
      dragStatus: false,
      AMapUI: null,
      AMap: null
    };
  },
  watch: {
    searchKey() {
      if (this.searchKey === "") {
        this.placeSearch.clear();
      }
    }
  },
  methods: {
    remoteLoad(url, callback) {
      let promise = new Promise((resolve, reject) => {
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        if (typeof callback === "function") {
          script.onload = script.onreadystatechange = function() {
            if (
              !this.readyState ||
              this.readyState === "loaded" ||
              this.readyState === "complete"
            ) {
              callback();
              script.onload = script.onreadystatechange = null;
            }
          };
        } else {
          script.onload = script.onreadystatechange = function() {
            resolve();
          };
        }
        head.appendChild(script);
      });
      return promise;
    },
    // 搜索
    handleSearch() {
      if (this.searchKey) {
        this.placeSearch.search(this.searchKey);
      }
    },

    // 实例化地图
    initMap() {
      // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
      let AMapUI = (this.AMapUI = window.AMapUI);
      let AMap = (this.AMap = window.AMap);
      AMapUI.loadUI(["misc/PositionPicker"], PositionPicker => {
        let mapConfig = {
          zoom: 16,
          cityName: MapCityName
        };
        if (this.lat && this.lng) {
          mapConfig.center = [this.lng, this.lat];
        }
        let map = new AMap.Map("js-container", mapConfig);
        this.$on("hook:beforeDestroy", () => {
          map && map.destroy();
        });
        // 加载地图搜索插件
        AMap.service("AMap.PlaceSearch", () => {
          this.placeSearch = new AMap.PlaceSearch({
            pageSize: 3,
            pageIndex: 1,
            citylimit: true,
            city: MapCityName,
            map: map,
            panel: "js-result"
          });
        });
        // console.log("经纬度", this.lat, this.lng);
        AMap.plugin(["AMap.Geolocation"], () => {
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: false, //是否使用高精度定位，默认:true
            // noIpLocate: 0,
            noGeoLocation: 2,
            timeout: 10000, //超过10秒后停止定位，默认：无穷大
            maximumAge: 0, //定位结果缓存0毫秒，默认：0
            convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true, //显示定位按钮，默认：true
            buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          });
          map.addControl(geolocation);
          if (!this.lat && !this.lng) {
            geolocation.getCurrentPosition();
          }
          AMap.event.addListener(geolocation, "complete", data => {
            this.$emit("drag", data);
          });
          AMap.event.addListener(geolocation, "error", error => {
            console.warn(error);
            // alert("定位失败");
          });
        });

        // 创建地图拖拽
        let positionPicker = new PositionPicker({
          mode: "dragMap", // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
          map: map // 依赖地图对象
        });
        // 拖拽完成发送自定义 drag 事件
        positionPicker.on("success", positionResult => {
          // 过滤掉初始化地图后的第一次默认拖放
          if (!this.dragStatus) {
            this.dragStatus = true;
          } else {
            this.$emit("drag", positionResult);
          }
        });
        // 启动拖放
        positionPicker.start();
      });
    }
  },
  created() {
    // 已载入高德地图API，则直接初始化地图
    if (window.AMap && window.AMapUI) {
      this.initMap();
      // 未载入高德地图API，则先载入API再初始化
    } else {
      var protocolPrefx = location.protocol === "file:" ? "http:" : "";
      this.remoteLoad(
        `${protocolPrefx}//webapi.amap.com/maps?v=1.4.0&key=${this.mapKey}`
      ).then(res => {
        this.remoteLoad(`${protocolPrefx}webapi.amap.com/ui/1.0/main.js`).then(
          res2 => {
            this.initMap();
          }
        );
      });
    }
  }
};
</script>

<style lang="css" scoped>
.m-map {
  height: 300px;
  position: relative;
}
.m-map .map {
  width: 100%;
  height: 100%;
}
.m-map .search {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 40%;
  z-index: 1;
}
.m-map .search input {
  width: 180px;
  border: 1px solid #ccc;
  line-height: 20px;
  padding: 5px;
  outline: none;
}
.m-map .search button {
  line-height: 30px;
  background: #fff;
  border: 1px solid #ccc;
  width: 50px;
  text-align: center;
}
.m-map .result {
  max-height: 300px;
  overflow: auto;
  margin-top: 10px;
}
</style>
