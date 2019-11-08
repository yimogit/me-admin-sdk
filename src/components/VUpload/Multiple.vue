<template>
  <el-upload
    :list-type="!isFile?'picture-card':'text'"
    action
    :accept="acceptValue"
    :limit="limit"
    :multiple="multiple"
    :http-request="uploadImg"
    :file-list="fileList"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :before-upload="beforeUpload"
    :on-exceed="handleLimit"
    v-bind="elOpt"
  >
    <el-button
      size="small"
      type="primary"
      v-if="isFile"
    >
      <i class="el-icon-plus"></i>点击上传
    </el-button>
    <i
      class="el-icon-plus"
      v-else
    ></i>
  </el-upload>
</template>
<script>
import Upload from "./mixins/upload";
export default {
  mixins: [Upload],
  props: {
    value: Array
  },
  data() {
    return {
      fileList: [],
      currentValue: this.value || [],
      dialogImageUrl: ""
    };
  },
  watch: {
    value(val) {
      this.currentValue = val || [];
    },
    currentValue(val) {
      this.fileList = val.map((e, i) => {
        return { name: i, url: this.$ui.pages.getDownloadUrl(e) };
      });
    }
  },
  methods: {
    uploadImg(e) {
      const _this = this;
      _this.$ui.pages.showProgress();
      var formData = new FormData();
      formData.append(_this.formName, e.file); // 文件对象
      var uploadAct = _this.uploadAction(formData, _this.category, e.file);
      uploadAct &&
        uploadAct
          .then(res => {
            if (res.status !== 1) {
              return _this.$ui.pages.warn(res.msg);
            }
            const tempValue = _this.currentValue;
            _this.fileList.push({
              name: res.data,
              url: res.data
            });
            tempValue.push(res.data);
            _this.$emit("input", tempValue);
            _this.$ui.pages.hideProgress();
          })
          .catch(e => {
            _this.$ui.pages.hideProgress();
          });
    },
    handleRemove(file, fileList) {
      const tempValue = this.currentValue.filter((e, i) => i !== file.name);
      this.$emit("input", tempValue);
    },
    handlePictureCardPreview(file) {
      window.open(this.$ui.pages.getDownloadUrl(file.url));
    },
    handleLimit() {
      this.$ui.pages.warn("最多上传" + this.limit + "个文件");
    }
  }
};
</script>
