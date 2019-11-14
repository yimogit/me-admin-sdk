
import QcImageLrz from 'qc-image-lrz'
export default {
  props: {
    value: {
      type: [String, Array] // 对象属性包含filePath
    },
    category: {
      type: String,
      default: 'uploader'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    isFile: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String
    },
    limit: {
      type: Number
    },
    maxSize: {
      type: Number,
      default: 5
    },
    formName: {
      type: String,
      default: 'file'
    },
    //element-ui-table组件原始属性
    elOpt: {
      type: Object,
      default: () => { }
    },
    uploadHandler: {
      type: Function,
    },
    compressTypes: {
      type: Array,
      default: () => ['image/jpeg']
    },
    lrzInitOptions: Object,
    lrzOptions: Object
  },
  data() {
    return {
      acceptValue: !this.isFile && !this.accept ? 'image/*' : this.accept
    }
  },
  methods: {
    uploadAction(fromData, category, file) {
      if (!this.checkSize(file)) {
        return Promise.reject('error')
      }
      if (this.uploadHandler) {
        return this.uploadHandler(fromData, category, file)
      }
      return this.$store.dispatch('uploadAction', { fromData, category, file })
    },
    beforeUpload(file) {
      if (this.compressTypes && this.compressTypes.indexOf(file.type) > -1 && typeof (QcImageLrz) !== 'undefined') {
        const ilt = new QcImageLrz(null, this.lrzInitOptions)
        return ilt.compress(file, Object.assign({
          resultMode: 'file'
        }, this.lrzOptions)).then(compressRes => {
          return compressRes
        })
      }
      else {
        return this.checkSize(file)
      }
    },
    checkSize(file) {
      const isLt = file.size / 1024 / 1024 < this.maxSize
      if (!isLt) {
        this.$ui.pages.warn('上传文件大小不能超过 ' + this.maxSize + 'MB!')
      }
      return isLt
    }
  }
}
