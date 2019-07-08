<template>
  <div
    style="width:100%;"
    v-if="loadend"
  >
    <v-btn-auth @click="form.preview1=!form.preview1">{{form.preview1?'显示编辑器':'预览内容'}}</v-btn-auth>
    <div v-if="!form.preview1">
      <v-form-editor v-model="form.text1" />
      <div>
        {{form.text1}}
      </div>
    </div>
    <div
      v-else
      v-html="previewHtml(form.text1)"
      class="preview-content"
    ></div>

    <v-btn-auth @click="form.preview2=!form.preview2">{{form.preview2?'显示编辑器':'预览内容'}}</v-btn-auth>
    <div v-if="!form.preview2">
      <v-form-editor v-model="form.text2" />
      <div>
        {{form.text2}}
      </div>
    </div>
    <div
      v-else
      v-html="previewHtml(form.text2)"
      class="preview-content"
    ></div>
  </div>
</template>

<script>
export default {
  name: "comps-editor",
  meta: {
    title: "编辑器"
  },
  data() {
    return {
      loadend: false,
      form: {
        text1: "",
        text2: "",
        preview1: false,
        preview2: false
      }
    };
  },
  created() {
    if (window.isLoadEditor) {
      this.loadend = true;
      return;
    }
    this.$ui.pages.dynamicLoadJs(
      "https://unpkg.com/yimo-vue-editor@1.1.3/dist/yimo-vue-editor.js",
      () => {
        window.Vue.use(YimoVueEditor, {
          name: "v-form-editor", //Custom name
          config: {}, //wagnEditor config
          uploadHandler: (type, resTxt) => {
            //Upload processing hook
            if (type === "success") {
              var res = JSON.parse(resTxt); //Do not process the default look at the return value bit image path
              if (res.status !== 1) {
                return null;
              }
              return res.data;
            } else if (type === "error") {
              //todo toast
            } else if (type === "timeout") {
              //todo toast
            }
            return "upload failed__";
          }
        });
        this.loadend = true;
        window.isLoadEditor = true;
      }
    );
  },
  methods: {
    previewHtml(html, areaWidth) {
      console.log(html);
      if (!html) return html;
      var maps = html.match(
        /[\s]+coords=[\s=\"\']([\d|,|.]+)[\s=\"\'][\s]{0,}bl=[\s=\"\']([\d|.|,]+)[\s=\"\']/g
      );
      if (maps && maps.length > 0) {
        maps.forEach(str => {
          var coords = [];
          var coordsArr = str.match(
            /[\s]{0,}coords=[\s=\"\']([\d|,|.]+)[\s=\"\']/
          );
          var blArr = str.match(/[\s]{0,}bl=[\s=\"\']([\d|.|,]+)[\s=\"\']/);

          if (coordsArr && coordsArr.length > 1) {
            var coordsVal = coordsArr[1].split(",").map(s => parseInt(s));
            if (blArr && blArr.length > 1) {
              var bl = blArr[1].split(",").map(s => parseInt(s));
              // 如果是全屏显示则传入areaWidth=window.innerWidth,否则使用原始图片
              var imageWidth = areaWidth > 0 ? areaWidth : bl[0];
              var imageHeight =
                (imageWidth / parseInt(bl[0])) * parseInt(bl[1]);
              var blW = parseFloat(bl[0]) / imageWidth;
              var blH = parseFloat(bl[1]) / imageHeight;
              coords.push(coordsVal[0] / blW);
              coords.push(coordsVal[1] / blH);
              coords.push(coordsVal[2] / blW);
              coords.push(coordsVal[3] / blH);
              coords = coords.map(e => parseFloat(e.toFixed(1)));
              console.log(bl);
            }
            var newstr = ' coords="' + coords.join(",") + '"';
            html = html.replace(str, newstr);
          }
        });
      }
      return html;
    }
  }
};
</script>

<style>
.preview-content img {
  /* width: 100%; */
}
</style>
