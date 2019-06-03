<template>
  <div id="app">
    <v-me-admin-amap
      v-if='isLoadEnd'
      :lat="form.workAddressLatitude"
      :lng="form.workAddressLongitude"
      :address="form.workAddress"
      :addressDetail="form.workAddressDetail"
      @select="selectAmap"
    />
    <pre>
      {{form}}
    </pre>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
  data() {
    return {
      isLoadEnd: false,
      form: {
        workAddressLatitude: 0,
        workAddressLongitude: 0,
        workAddress: null,
        workAddressDetail: null
      }
    };
  },
  mounted() {
    setTimeout(() => {
      this.isLoadEnd = true;
    }, 2000);
  },
  methods: {
    selectAmap(e) {
      if (e == null) {
        alert("请选择地址");
        return;
      }
      this.form.workAddressLatitude = e.lat;
      this.form.workAddressLongitude = e.lng;
      this.form.workAddress = e.address;
      this.form.workAddressDetail = e.addressDetail;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
</style>
