<template>
  <div>
    <el-button
      type="primary"
      @click="dialogVisible=true"
    >地址选择</el-button>
    <div>
      <slot v-bind:data="model">{{model.address}} {{model.addressDetail}}</slot>
    </div>
    <el-dialog
      title="地址选择"
      width="60%"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <slot
        name="header"
        v-bind:data="dragData"
      >
        <div style="line-height: 32px;">
          位置信息：
          <input
            style="width:50%;line-height: 20px;"
            type="text"
            v-model="dragData.address"
            disabled
          ><span v-if="dragData.lng">({{dragData.lng}},{{dragData.lat}})</span>
        </div>
        <div style="line-height: 32px;">
          详细信息：
          <input
            style="width:80%;line-height: 20px;"
            type="text"
            v-model="dragData.addressDetail"
          >
        </div>
      </slot>
      <div class="amap-page-container-custom">
        <v-map-drag
          @drag="dragMap"
          :lng="lng"
          :lat="lat"
          :mapKey="amapMapKey"
        ></v-map-drag>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="save"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VMapDrag from "./AmapDrag";
export default {
  props: {
    mapKey: String,
    lng: {
      type: Number
    },
    lat: {
      type: Number
    },
    address: String,
    addressDetail: String,
    globalOptions: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  components: {
    VMapDrag
  },
  data() {
    return {
      dialogVisible: false,
      model: {},
      dragData: {},
      amapMapKey: String
    };
  },
  created() {
    this.amapMapKey = this.mapKey || this.globalOptions.mapKey;
    var model = {
      lng: this.lng,
      lat: this.lat,
      address: this.address,
      addressDetail: this.addressDetail
    };
    this.model = Object.assign({}, model);
    this.dragData = Object.assign({}, model);
  },
  methods: {
    dragMap(data) {
      this.dragData.lng = data.position.lng;
      this.dragData.lat = data.position.lat;
      this.dragData.address = data.address;
    },
    cancel() {
      this.dialogVisible = false;
    },
    save() {
      if (!this.dragData.address) {
        // this.$ui.pages.warn("请选择地址");
        this.$emit("select", null);
        return;
      }
      this.dialogVisible = false;
      this.model = {
        lng: this.dragData.lng,
        lat: this.dragData.lat,
        address: this.dragData.address,
        addressDetail: this.dragData.addressDetail
      };
      this.$emit("select", this.model);
    }
  }
};
</script>
