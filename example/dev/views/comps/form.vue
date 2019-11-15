<template>
  <el-form
    ref="form"
    :model="form"
    label-width="80px"
  >
    <el-form-item
      label="活动名称"
      v-input-small
    >
      <v-form-input
        v-model="form.name"
        :maxlength="20"
        show-word-limit
      ></v-form-input>{{form.name}}
    </el-form-item>
    <el-form-item
      label="数量"
      v-input-small
    >
      <v-form-input
        validate="number"
        v-model="form.num"
        :maxlength="10"
        show-word-limit
        @change="changeInput"
      ></v-form-input>{{form.num}}
    </el-form-item>
    <el-form-item label="活动区域">
      <el-select
        v-model="form.region"
        placeholder="请选择活动区域"
      >
        <el-option
          label="区域一"
          value="shanghai"
        ></el-option>
        <el-option
          label="区域二"
          value="beijing"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="活动时间"
      v-input-small
    >
      <el-col :span="11">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="form.date1"
          style="width: 100%;"
        ></el-date-picker>
      </el-col>
      <el-col
        class="line"
        style="text-align:center;"
        :span="2"
      >-</el-col>
      <el-col :span="11">
        <el-time-picker
          placeholder="选择时间"
          v-model="form.date2"
          style="width: 100%;"
        ></el-time-picker>
      </el-col>
    </el-form-item>
    <el-form-item label="即时配送">
      <el-switch v-model="form.delivery"></el-switch>
    </el-form-item>
    <el-form-item label="活动性质">
      <el-checkbox-group v-model="form.type">
        <el-checkbox
          label="美食/餐厅线上活动"
          name="type"
        ></el-checkbox>
        <el-checkbox
          label="地推活动"
          name="type"
        ></el-checkbox>
        <el-checkbox
          label="线下主题活动"
          name="type"
        ></el-checkbox>
        <el-checkbox
          label="单纯品牌曝光"
          name="type"
        ></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="特殊资源">
      <el-radio-group v-model="form.resource">
        <el-radio label="线上品牌商赞助"></el-radio>
        <el-radio label="线下场地免费"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      label="活动形式"
      class="custom-input-small"
    >
      <el-input
        type="textarea"
        v-model="form.desc"
      ></el-input>
    </el-form-item>
    <div v-footer-btns>
      <el-button
        type="primary"
        @click="onSubmit"
      >立即创建</el-button>
      <el-button>取消</el-button>
    </div>
  </el-form>
</template>

<script>
export default {
  name: "comps-form",
  meta: {
    title: "表单"
  },
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
      console.log(this.form);
    },
    changeInput(val) {
      console.log("555", val);
    }
  }
};
</script>
