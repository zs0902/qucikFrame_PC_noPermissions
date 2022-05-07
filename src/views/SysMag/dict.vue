<template>
  <div class="container_form">
    <DynamicQuery ref="query" :deviceType="deviceType">
      <template v-slot:query>
        <el-form :inline="true" :model="query" class="demo-form-inline" id="queryForm">
          <el-form-item class="radios_selected_input" label v-if="inputSelectList.length">
            <el-input size="small" placeholder="请输入内容" v-model="inputSelectVlaue" class="input-with-select" style="width:280px !important" clearable>
              <el-select v-model="inputSelect" slot="prepend" placeholder="请选择" style="width:100px !important">
                <el-option v-for="(item,index) in inputSelectList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:btn>
        <el-button type="primary" @click.native="onSearch" size="small">查询</el-button>
        <el-button class="reset_btn_sup" @click.native="resetQuery" size="small">重置</el-button>

        <el-button type="success" style="margin-left: 50px" @click.native="showAdd()" size="small">添加</el-button>
      </template>
    </DynamicQuery>

    <div class="table-wrapper">
      <el-table height="100%" stripe show-header fit ref="table" :data="data.list" v-loading="fullscreenLoading" element-loading-text="拼命加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)">
        <el-table-column sortable align="center" header-align="center" v-for="item in columns" :min-width="item.width > 0?item.width:130" :key="item.title" :prop="item.field" :label="item.title" :show-overflow-tooltip="item.tooltip">
          <template slot-scope="scope">
            <span>
              {{scope.row[item.field] | valuefilter(item.value)}}
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column fixed="right" label="操作" align="center" header-align="center" width="145">
                  <template slot-scope="scope">
                      <a href="javascript:" class="text-info-dker" @click="editData(scope.row)"><i class="el-icon-edit el-icon--left"></i>编辑</a>
                  </template>
              </el-table-column> -->
      </el-table>
    </div>

    <el-pagination background :class="[deviceType=='Pc'?'page-pagination-pc':'page-pagination-mobile']" :layout="deviceType=='Pc'?'total, sizes, prev, pager, next, jumper':'prev, pager, next'" @size-change="pageSizeChange" @current-change="pageNumChange" :pager-count="5" :current-page="query.pageNum" :page-size="query.pageSize" :page-sizes="pageSizes" :total="data.totalCount">
    </el-pagination>
    
    <dictAdd ref='add' @refresh='onSearch'></dictAdd>
    <dictEdit ref='edit'></dictEdit>
  </div>
</template>

<script>
import dictAdd from "./modal/dictAdd.vue";
import dictEdit from "./modal/dictEdit.vue";
export default {
  props: {
    deviceType: "",
  },
  components: {
    dictEdit,
    dictAdd,
  },
  data() {
    return {
      //单选
      inputSelectVlaue: "", //复合输入选择序号
      inputSelect: "label", // 复合输入内容
      inputSelectList: [
        { value: "label", label: "枚举名称" },
        { value: "type", label: "枚举类型" },
      ],
      pageSizes: [10, 20, 50, 100],
      defaultQuery: {},
      query: {
        pageNum: 1,
        pageSize: 10,
      },
      data: {
        totalCount: 0,
        list: [],
      },
      columns: [
        { title: "枚举编号", field: "id", value: { placeholder: "---" } },
        { title: "枚举名称", field: "label", value: { placeholder: "---" } },
        { title: "枚举类型", field: "type", value: { placeholder: "---" } },
        { title: "枚举值", field: "value", value: { placeholder: "---" } },
        {
          title: "枚举描述",
          field: "description",
          value: { placeholder: "---" },
        },
      ],
      drawerShow: false, //移动端展示删选条件与否
      fullscreenLoading: false,
      defaultQuery:{}
    };
  },
  mounted() {
    this.onSearch();
  },
  created(){
    this.defaultQuery = JSON.parse(JSON.stringify(this.query))
  },
  methods: {
    resetQuery(){
      this.query = this.defaultQuery
      this.onSearch()
    },
    setRadiosValue() {
      if (this.inputSelectList && this.inputSelect) {
        this.inputSelectList.forEach((item) => {
          this.query[item.value] = null;
        });
        this.query[this.inputSelect] = this.inputSelectVlaue;
      }
    },
    showAdd() {
      this.$refs.add.dialogFormVisible = true;
    },
    showEdit() {},
    onSearch() {
      this.query.pageSize = 50;
      this.query.pageNum = 1;
      this.refreshDataList();
    },
    refreshDataList: function () {
      this.setRadiosValue();
      this.$post("/dict/findPage", this.query).then((response) => {
        if (response.result.code == "success") {
          this.data.list = response.data.list;
          this.data.totalCount = response.data.total;
        }
      });
    },
    pageSizeChange(pageSize) {
      this.query.pageNum = 1;
      this.query.pageSize = pageSize;
      this.refreshDataList();
    },
    pageNumChange(pageNum) {
      this.query.pageNum = pageNum;
      this.refreshDataList();
    },
  },
};
</script>
<style scoped>
.el-input {
  padding-top: 5px !important;
  width: 107px !important;
}
.el-tree {
  position: relative;
  cursor: default;
  background: #f2f9f8 !important;
  color: #898b91;
}
</style>
