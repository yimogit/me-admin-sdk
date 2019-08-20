<template>
  <div class="custom-table">
    <el-table
      :data="tableData.rows"
      @row-dblclick="on_row_dblclick"
      v-loading="loading"
      style="width: 100%"
      :height="tableHeight"
      element-loading-text="拼命加载中"
      border
      ref="mytable"
      @selection-change="on_selection_change"
      @sort-change="on_sort_change"
      :default-expand-all="defaultExpandAll"
      :highlight-current-row="!!radioKey"
      @current-change="handle_current_change"
      :show-summary="showSummary"
      :summary-method="summaryMethod"
      @expand-change="(row,expandedRows)=>$emit('expand-change',row,expandedRows)"
      :span-method="spanMethod"
      :render-header="renderHeader"
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
    <div class="custom-table-toolbar">
      <slot name="toolbar"></slot>
    </div>
    <div class="custom-table-pager">
      <slot name="pager">
        <el-pagination
          v-show="!hidePager"
          background
          @size-change="on_size_change"
          @current-change="on_current_change"
          :current-page="pagedCriteria.pageIndex+1"
          :page-sizes="pageSizes"
          :page-size="pagedCriteria.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
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
    topHeight: Number,
    showSummary: Boolean,
    summaryMethod: Function,
    autoHeight: [Boolean,Number,String],
    spanMethod: Function,
    renderHeader:Function,
  },
  data() {
    return {
      pageSizes: [10, 20, 50, 100, 200],
      loading: true,
      pagedCriteria: {
        pageSize: 10,
        pageIndex: 0,
        columnName: "",
        columnOrder: ""
      },
      tableData: {
        rows: [],
        total: 0
      },
      select_arr: [],
      radio_index: {},
      tableHeight: 500
    };
  },
  // watch: {
  //   $route() {
  //     this.loadData()
  //   }
  // },
  created() {
    this.initTableHeight();
    if (!this.$route.meta.cache) {
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
        if (window.innerWidth < 600 || window.innerHeight < 600) return;
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
      if (p.column && p.column.sortable === "custom") {
        this.pagedCriteria.columnName = p.prop;
        this.pagedCriteria.columnOrder =
          p.order === "descending" ? "desc" : "asc";
      } else {
        this.pagedCriteria.columnName = "";
        this.pagedCriteria.columnOrder = "";
      }
      this.on_handle();
    },
    on_size_change(val) {
      this.showLoading();
      this.pagedCriteria.pageSize = val;
      this.on_handle();
    },
    on_current_change(val) {
      this.showLoading();
      this.pagedCriteria.pageIndex = Math.max(val - 1, 0);
      this.on_handle();
    },
    on_selection_change(e) {
      this.select_arr = e;
      this.$emit("handle-checkbox", e);
    },
    on_row_dblclick(row, event) {
      this.$refs.mytable.toggleRowSelection(row);
    },
    currentTable() {
      return this.$refs.mytable;
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
      this.pagedCriteria.pageIndex = 0;
      this.showLoading();
      this.loadData();
    },
    loadData() {
      var search = Object.assign(this.pagedCriteria, this.loadSearch);
      this.loadAction(search)
        .then(res => {
          if (res.status !== 1) return;
          this.tableData.rows = res.data.items;
          this.tableData.total = res.data.totalCount;
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
