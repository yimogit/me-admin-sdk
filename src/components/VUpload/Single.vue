<template>
  <el-upload
    class="single-uploader"
    action
    :show-file-list="false"
    :accept="acceptValue"
    :http-request="uploadImg"
    :before-upload="beforeUpload"
    :disabled="isUploading"
    v-bind="elOpt"
  >
    <img
      v-if="prewiewUrl && !isFile"
      :src="prewiewUrl"
      :style="styleName"
      :class="classValue"
    >
    <i
      v-if="!prewiewUrl"
      :style="styleName"
      :class="{'el-icon-loading':isUploading,'el-icon-plus':!isUploading}"
      class="el-icon-plus single-uploader-icon"
    ></i>
    <span
      :class="classValue"
      class="single-uploader-icon"
      :style="styleName"
      v-if="prewiewUrl&&isFile"
    >
      <i class="el-icon-document"></i>
    </span>
    <span
      class="single-file-delete"
      v-if="prewiewUrl"
      @click.stop="handleRemove"
    >
      <i class="el-icon-delete"></i>
    </span>
  </el-upload>
</template>
<script>
import Upload from "./mixins/upload";
export default {
  mixins: [Upload],
  props: {
    value: String,
    styleName: {
      type: String,
      default: "width:100px;height:100px;line-height:100px;"
    },
    className: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      classValue: this.className + " single-img",
      prewiewUrl: "",
      imageUrl: "",
      isUploading: false
    };
  },
  created() {
    this.prewiewUrl = this.value
      ? this.$ui.pages.getDownloadUrl(this.value)
      : "";
  },
  watch: {
    value(val) {
      this.imageUrl = val;
    },
    imageUrl(val) {
      this.prewiewUrl = this.$ui.pages.getDownloadUrl(val);
    }
  },
  methods: {
    uploadImg(e) {
      const _this = this;
      if (_this.isUploading) return;
      _this.isUploading = true;
      _this.$ui.pages.showProgress();
      var formData = new FormData();
      formData.append(_this.formName, e.file); // 文件对象
      var uploadAct = _this.uploadAction(formData, _this.category, e.file);
      uploadAct &&
        uploadAct
          .then(res => {
            _this.isUploading = false;
            if (res.status !== 1) {
              return _this.$ui.pages.warn(res.msg);
            }
            // _this.imageUrl = res.data.filePath // 监听的value会自动更新
            _this.imageUrl = res.data;
            _this.$emit("input", _this.imageUrl);
            _this.$emit("change", res.data);
            _this.$ui.pages.hideProgress();
          })
          .catch(() => {
            _this.$ui.pages.hideProgress();
            _this.isUploading = false;
          });
    },
    handleRemove() {
      this.prewiewUrl = "";
      this.imageUrl = "";
      this.$emit("input", this.imageUrl);
    }
  }
};
</script>
<style >
.single-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.single-uploader .el-upload:hover {
  border-color: #409eff;
}
.single-uploader .single-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.single-uploader .single-img {
  width: 178px;
  height: 178px;
  display: block;
}
.single-uploader-tip {
  display: block;
}
.single-file-delete {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  background: white;
  opacity: 0.8;
  border-top: 1px dashed #d9d9d9;
}
</style>
