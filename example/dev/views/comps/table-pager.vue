<template>
  <div>
    <el-row>
      <el-col :span="18">
        <el-form :inline="true">
          <el-form-item label="关键字">
            <el-input
              type="text"
              v-model="search.keyword"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="e=>this.$refs.mytable.search()"
              ></el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col
        :span="6"
        class="text-right"
      >
        <!-- <v-btn-create @click="$ui.pages.link('/system/admin/create')" auth="system_admin_create">添加管理员</v-btn-create> -->
        <v-btn-create
          @click="showDialog({})"
          auth="system_admin_create"
        >添加管理员</v-btn-create>
      </el-col>
    </el-row>
    <v-table-pager
      :loadAction="getAdminList"
      :loadSearch="search"
      ref="mytable"
      :show-checkbox="true"
      :border="true"
      radio-key="id"
      :hide-pager="false"
      toolbarLoadingHide
      pagerLayout="total,sizes, prev, pager, next"
      :pagerSizes="[10,50,100]"
      :defaultPageSize="10"
      :pagerCount="7"
      :pagerSingleHide="true"
      @handle-radio="e=>$ui.pages.info(e.adminName)"
      @handle-checkbox="e=>{checkList=e;$ui.pages.info(e.map(s=>s.adminName))}"
      :pagerKeyConfig="pagerKeyConfig"
      :elOpt="{stripe:true}"
    >
      <div slot="toolbar">
        <el-button
          type="primary"
          @click="e=>this.$ui.pages.info(checkList.length)"
        >选中行数</el-button>
        <el-button
          type="danger"
          @click="e=>this.$ui.pages.info(checkList.map(s=>s.adminName))"
        >选择名称</el-button>
      </div>

      <el-table-column
        type="expand"
        :resizable="false"
      >
        <template>
          <p>表格嵌套,固定高度</p>
          <v-table-pager
            :loadAction="getAdminList"
            :auto-height="300"
            :pagerKeyConfig="pagerKeyConfig"
          >
            <el-table-column
              prop="adminName"
              label="管理员名称"
            >
            </el-table-column>
          </v-table-pager>
        </template>
      </el-table-column>
      <el-table-column
        prop="adminName"
        label="管理员名称"
        sortable="custom"
      >
      </el-table-column>
      <el-table-column label="是否启用">
        <template slot-scope="prop">
          <v-tag-enable v-model="prop.row.isEnable" />
          <!-- <el-tag type="prop.row.isEnable?'success':'info'">{{prop.row.isEnable?'是':'否'}}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        width="180"
        label="操作"
      >
        <template slot-scope="prop">
          <v-btn-edit
            @click="showDialog({})"
            auth="system_admin_edit"
            icon="el-icon-document"
          >编辑</v-btn-edit>
          <!-- <v-btn-edit @click="showDialog(prop.row)" auth="system_admin_edit">编辑</v-btn-edit> -->
          <v-btn-del
            @click="delAdmin"
            auth="system_admin_del"
          >删除</v-btn-del>
        </template>
      </el-table-column>
    </v-table-pager>

    <el-dialog
      width="80%"
      :title="editDialog.title"
      v-if="editDialog.show"
      :visible.sync="editDialog.show"
      :close-on-click-modal="false"
    >
      <div>
        编辑
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "comps-table-pager",
  meta: {
    title: "分页表格"
  },
  data() {
    return {
      //自定义
      pagerKeyConfig: {
        startPageIndex: 0,
        pageIndex: "page",
        pageSize: "size",
        columnName: "",
        columnOrder: "",
        rows: "items1",
        total: "totalCount1"
      },
      search: {
        keyword: ""
      },
      list: [],
      editDialog: {
        title: "",
        editId: null,
        show: false
      },
      checkList: []
    };
  },
  methods: {
    showDialog(row) {
      this.editDialog.title = "管理员" + (row.id > 0 ? "编辑" : "创建");
      this.editDialog.editId = row.id;
      this.editDialog.show = true;
    },
    delAdmin(id) {
      this.$ui.pages.confirm("确认删除？").then(res => {
        this.delAdmin({ id: id }).then(res => {
          if (res.status !== 1) return;
          this.$ui.pages.success(res.msg);
        });
      });
    },
    getAdminList(search) {
      console.log(search);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var total = 100;
          var items = [];
          var pageIndex =
            search[this.pagerKeyConfig.pageIndex] -
            this.pagerKeyConfig.startPageIndex;
          var pageSize = search[this.pagerKeyConfig.pageSize];
          for (let index = 1; index <= pageSize; index++) {
            items.push({
              id: pageIndex * pageSize + index,
              adminName: "admin_" + (pageIndex * pageSize + index),
              isEnable: index % 3 === 0,
              createdAt: "2005-06-01 18:14:20"
            });
          }
          var data = {};
          data[this.pagerKeyConfig.rows] = items;
          data[this.pagerKeyConfig.total] = total;
          resolve({
            status: 1,
            data: data
          });
        }, 1000);
      });
    },
    delAdmin() {}
  }
};
</script>
