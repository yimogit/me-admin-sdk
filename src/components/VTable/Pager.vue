<template>
  <div class="custom-table">
    <el-table
      :data="tableData.rows"
      @row-dblclick="on_row_dblclick"
      v-loading="loading"
      style="width: 100%"
      :height="tableHeight"
      :element-loading-text="loadingText"
      :border="border"
      :ref="refName"
      @selection-change="on_selection_change"
      @sort-change="on_sort_change"
      :default-expand-all="defaultExpandAll"
      :highlight-current-row="!!radioKey"
      @current-change="handle_current_change"
      :show-summary="showSummary"
      :summary-method="summaryMethod"
      :span-method="spanMethod"
      @expand-change="(row,expandedRows)=>$emit('expand-change',row,expandedRows)"
      v-bind="elOpt"
    >
      <el-table-column
        v-if="showCheckbox"
        type="selection"
        width="40"
        :resizable="false"
      ></el-table-column>
      <el-table-column
        v-if="radioKey"
        width="40"
        :resizable="false"
      >
        <template slot-scope="prop">
          <el-radio
            v-model="radio_index"
            :label="prop.$index"
            class="custom-table-radio"
          ></el-radio>
        </template>
      </el-table-column>
      <slot></slot>
    </el-table>
    <div
      class="custom-table-toolbar"
      v-show="!(toolbarLoadingHide&&loading)"
    >
      <slot name="toolbar"></slot>
    </div>
    <div class="custom-table-pager">
      <slot name="pager">
        <el-pagination
          v-show="!hidePager"
          :disabled="loading"
          background
          @size-change="on_size_change"
          @current-change="on_current_change"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pagedCriteria[pagedKeyConfig.pageSize]"
          :layout="pageLayout"
          :total="tableData.total"
          :pagerCount="pagerCount"
          :hide-on-single-page="pagerSingleHide"
        ></el-pagination>
      </slot>
    </div>
  </div>
</template>
<script>
/**
 * 若要添加el-table属性,通过tableAttr传入，并在el-table节点添加绑定
 */
export default {
  props: {
    loadAction: {
      type: Function,
      required: true
    },
    loadSearch: {
      type: Object
    },
    defaultExpandAll: {
      type: Object,
      default: null
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    radioKey: {
      type: String,
      default: null
    },
    hidePager: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: "拼命加载中"
    },
    border: {
      type: Boolean,
      default: true
    },
    topHeight: Number,
    showSummary: Boolean,
    summaryMethod: Function,
    autoHeight: [Boolean, Number, String],
    spanMethod: Function,
    /**
     * 表格数据转换 返回{rows:Array,total:Number}
     */
    convertTableData: Function,
    /**
     * 加载表格时工具栏是否隐藏
     */
    toolbarLoadingHide: Boolean,
    /**
     * 默认页码
     */
    defaultPageSize: Number,
    /**
     * 只有一页时隐藏分页
     */
    pagerSingleHide: Boolean,
    /**
     * 页码按钮的数量 大于等于 5 且小于等于 21 的奇数
     */
    pagerCount: {
      type: Number,
      default: 5
    },
    /**
     * 组件布局，子组件名用逗号分隔
     */
    pagerLayout: String,
    /**
     * 每页显示个数选择器的选项设置
     */
    pagerSizes: Array,
    /**
     * 分页，排序，返回值对象自定义键值
     */
    pagerKeyConfig: Object,
    //element-ui-table组件原始属性
    elOpt: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    var isMobile = this.$store.getters.isMobile;
    var pageSizes = this.pagerSizes || [10, 20, 50, 100, 200];
    var pagedKeyConfig = Object.assign(
      {
        startPageIndex: 0,
        pageIndex: "pageIndex",
        pageSize: "pageSize",
        rows: "items",
        total: "totalCount",
        columnName: "columnName",
        columnOrder: "columnOrder"
      },
      this.pagerKeyConfig
    );
    var pagedCriteria = {};
    pagedCriteria[pagedKeyConfig.pageIndex] = pagedKeyConfig.startPageIndex;
    pagedCriteria[pagedKeyConfig.pageSize] = this.defaultPageSize
      ? this.defaultPageSize
      : pageSizes[0];
    if (pagedKeyConfig.columnName) {
      pagedCriteria[pagedKeyConfig.columnName] = "";
      pagedCriteria[pagedKeyConfig.columnOrder] = "";
    }
    return {
      refName: "table_" + Date.now() + parseInt(Math.random() * 100000),
      pageSizes: pageSizes,
      pageLayout: this.pagerLayout || "total, sizes, prev, pager, next, jumper",
      loading: true,
      pagedKeyConfig: pagedKeyConfig,
      pagedCriteria: pagedCriteria,
      tableData: {
        rows: [],
        total: 0
      },
      select_arr: [],
      radio_index: {},
      tableHeight: 500,
      isMobile: isMobile,
      currentPage:
        pagedCriteria[pagedKeyConfig.pageIndex] +
        (pagedKeyConfig.startPageIndex > 0 ? 0 : 1)
    };
  },
  created() {
    this.initTableHeight();
    //isMobile=true时activated不触发
    if (!this.$route.meta.cache || this.isMobile) {
      this.loadData();
    }
  },
  activated() {
    if (this.$route.meta.cache) {
      this.loadData();
    }
  },
  methods: {
    initTableHeight() {
      this.$nextTick(() => {
        if (this.autoHeight) {
          this.tableHeight =
            this.autoHeight === true ? "auto" : this.autoHeight;
          return;
        }
        if (this.isMobile) return;
        var tableTop = document.getElementsByClassName("custom-table")[0]
          .offsetTop;
        //浏览器高度- 搜索框高度-分页底部高度-主体到顶部的距离
        this.tableHeight =
          document.body.clientHeight - tableTop - 70 - (this.topHeight || 90);
      });
    },
    handle_current_change(val) {
      const _key = this.radioKey;
      this.radio_index = val
        ? this.tableData.rows.findIndex(e => e[_key] === val[_key])
        : {};
      this.$emit("handle-radio", val);
    },
    on_handle() {
      this.$emit("handle-pager", this.pagedCriteria);
      this.loadData();
    },
    on_sort_change(p) {
      if (
        p.column &&
        p.column.sortable === "custom" &&
        this.pagedKeyConfig.columnName
      ) {
        this.pagedCriteria[this.pagedKeyConfig.columnName] = p.prop;
        this.pagedCriteria[this.pagedKeyConfig.columnOrder] =
          p.order === "descending" ? "desc" : "asc";
      } else if (this.pagedKeyConfig.columnName) {
        this.pagedCriteria[this.pagedKeyConfig.columnName] = "";
        this.pagedCriteria[this.pagedKeyConfig.columnOrder] = "";
      }
      this.on_handle();
    },
    on_size_change(val) {
      this.showLoading();
      this.pagedCriteria[this.pagedKeyConfig.pageSize] = val;
      this.on_handle();
    },
    on_current_change(val) {
      this.showLoading();
      this.pagedCriteria[this.pagedKeyConfig.pageIndex] = Math.max(
        val - (this.pagedKeyConfig.startPageIndex > 0 ? 0 : 1),
        this.pagedKeyConfig.startPageIndex
      );
      this.on_handle();
    },
    on_selection_change(e) {
      this.select_arr = e;
      this.$emit("handle-checkbox", e);
    },
    on_row_dblclick(row, event) {
      this.$refs[this.refName].toggleRowSelection(row);
    },
    currentTable() {
      return this.$refs[this.refName];
    },
    getSelectorArr() {
      return this.select_arr;
    },
    getPagedCriteria() {
      return this.pagedCriteria;
    },
    showLoading() {
      this.loading = true;
    },
    hideLoading() {
      this.$nextTick(() => {
        this.loading = false;
      });
    },
    search() {
      this.pagedCriteria[
        this.pagedKeyConfig.pageIndex
      ] = this.pagedKeyConfig.startPageIndex;
      this.showLoading();
      this.loadData();
    },
    loadData() {
      var search = Object.assign(this.pagedCriteria, this.loadSearch);
      this.loadAction(search)
        .then(res => {
          if (typeof convertTableData === "function") {
            this.tableData = this.convertTableData(res);
            this.hideLoading();
            return;
          }
          if (res.status !== 1) return;
          this.tableData.rows = res.data[this.pagedKeyConfig.rows];
          this.tableData.total = res.data[this.pagedKeyConfig.total];
          this.hideLoading();
        })
        .catch(() => {
          this.hideLoading();
        });
    }
  }
};
</script>
<style lang="scss">
.custom-table {
  margin-bottom: 20px;
  margin-top: 5px;
}
.custom-table-pager {
  float: right;
  margin-top: 20px;
}
@media screen and (max-width: 600px) {
  .custom-table-pager {
    float: none;
    clear: both;
    margin-top: 0px;
    padding-top: 10px;
    .el-pagination {
      white-space: normal;
    }
  }
}
.custom-table-toolbar {
  float: left;
  margin-top: 20px;
}
.custom-table-radio .el-radio__label {
  display: none;
}

.custom-table .name-wrapper {
  display: inline-block;
}
.custom-table .custom-table-expand label {
  width: 100px;
  color: #99a9bf;
}
.custom-table .custom-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 45%;
}
.custom-table .custom-table-expand img {
  width: 50px;
  height: 50px;
  margin-right: 2px;
}
</style>
