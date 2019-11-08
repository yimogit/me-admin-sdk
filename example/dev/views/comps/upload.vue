<template>
  <div>
    <div>
      单选上传图片：{{uploadSingleValue.length}}
      <v-upload-s v-model="uploadSingleValue" :maxSize="1"/>
    </div>
    <div>
      单选上传文件：{{uploadSingleValue.length}}
      <v-upload-s v-model="uploadSingleValue" is-file :maxSize="0.1"/>
    </div>
    <div>
      <div>
        多选上传多张图片：{{uploadMultipleValue.length}}
        <v-upload-m v-model="uploadMultipleValue" :multiple="true" />
      </div>
      <div>
        多选上传单个文件：{{uploadMultipleValue.length}}
        <v-upload-m v-model="uploadMultipleValue" is-file />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "comps-upload",
  meta: {
    title: "文件上传"
  },
  data() {
    return {
      uploadSingleValue: '',
      uploadMultipleValue: []
    }
  }
}
</script>

<style>
</style>
