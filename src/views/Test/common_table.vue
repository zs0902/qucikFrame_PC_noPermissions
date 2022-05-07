<template>
  <div class="container_form">
    <DynamicQuery ref="query" :deviceType="deviceType">
      <!-- 查询表单 -->
      <template v-slot:query>
        <el-form :inline="true" :model="query" class="demo-form-inline" id="queryForm">
          <el-form-item class="radios_selected_input" v-if="inputSelectList.length" label="复合筛选">
            <el-input size="small" placeholder="请输入内容" v-model="inputSelectVlaue" class="input-with-select" style="width:280px !important" clearable>
              <el-select v-model="inputSelect" slot="prepend" placeholder="请选择" style="width:120px !important">
                <el-option v-for="(item,index) in inputSelectList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="订单交互模式">
            <enum-select :form="query" name="dataMode" type="DataMode" placeholder="订单交互模式" style="width:220px !important"></enum-select>
          </el-form-item>
        </el-form>
      </template>
      <!-- 操作按钮 -->
      <template v-slot:btn>
          <el-button type="primary" @click.native="onSearch" size="small">查询</el-button>
          <el-button class="reset_btn_sup" @click.native="resetQuery" size="small">重置</el-button>
          <el-button type="success" style="margin-left: 50px" @click.native="addItem" size="small">添加</el-button>

          <!-- <el-button type="success" style="margin-left: 50px" @click.native="addAddress" size="small">新增地址</el-button> -->
      </template>
    </DynamicQuery>

    <!-- 调用通用的table封装组件，表格数据通过v-model绑定，表格相关配置通过tableData对象传入，表格所有交互动作通过tableHandle暴露 -->
    <DynamicTable ref="table" v-model="data.list" :tableData="tableData" @tableHandle="tableHandle"></DynamicTable>

    <el-pagination background :class="[deviceType=='Pc'?'page-pagination-pc':'page-pagination-mobile']" :layout="deviceType=='Pc'?'total, sizes, prev, pager, next, jumper':'prev, pager, next'" @size-change="pageSizeChange" @current-change="pageNumChange" :pager-count="5" :current-page="query.pageNum" :page-size="query.pageSize" :page-sizes="pageSizes" :total="data.totalCount"></el-pagination>

    <SupplierManager ref='supplierManager' @refresh="onSearch" :initData="tempData"></SupplierManager>
    <!-- 供应商账号管理 -->
    <account-modal ref='accountManage' :manageData='manageData'></account-modal>
  </div>
</template>

<script>
//components
import SupplierManager from './modal/supplierManager.vue'
import accountModal from './modal/accountManage.vue'
//mixins
import mixinTable from "@/mixins/mixin_table.js";
export default {
  props: {
    deviceType: "",
  },
  components: {
    SupplierManager,
    'account-modal':accountModal,
  },
  mixins: [mixinTable], // 通过混入公共内容，简化业务页面代码
  data() {
    return {
      inputSelectVlaue: "", //复合输入选择序号
      inputSelect: "supplierName", // 复合输入内容
      inputSelectList: [
        { value: "supplierName", label: "供应商名称" },
        { value: "companyName", label: "公司名称" },
      ],

      query: {
        api: "supplier/listSupplier",
        supplierName: "",
        companyName: "",
        dataMode: "",
      },
      tableData: {
        columns: [
          { title: "供应商编号", field: "supplierId", filter: { placeholder: "---" }, width: 100, },
          { title: "供应商名称", field: "supplierName", filter: { placeholder: "---" }, },
          { title: "公司名称", field: "companyName", filter: { placeholder: "---" }, },
          { title: "公司地址", field: "companyAddress", filter: { placeholder: "---" }, },
          { title: "联系人姓名", field: "userName", filter: { placeholder: "---" }, },
          { title: "联系人电话", field: "tel", filter: { placeholder: "---" }, },
          { title: "合同编号", field: "contractNo", filter: { placeholder: "---" }, width: 160, },
          { title: "交互模式", field: "dataMode", filter: { enum: "DataMode" }, }, 
          { title: "开票模式", field: "invoiceMode", filter: { enum:'InvoiceMode' }, }, 
          { title: "下单是否减库存", field: "isCheckStock", filter: { tof: "是,否" }, },
          { title: "锁库存开始时间", field: "lockStockStartTime", filter: { placeholder: "---" }, width: 125, },
          { title: "锁库存结束时间", field: "lockStockEndTime", filter: { placeholder: "---" }, width: 125, },
          { title: "供应商状态", field: "supplierStatus", filter: { enum:'SupplierStatus' }, color: (row) => {
              if (row["supplierStatus"] == 1) {
                return "text-danger";
              } else if (row["supplierStatus"] == 0) {
                return "text-success";
              }
            },
          },
          { title: "创建时间", field: "createTime", filter: { date: "yyyy-MM-dd HH:mm:ss" }, width: 160, },
          { title: "创建人", field: "createUser", filter: { placeholder: "---" }, },
          { title: "修改时间", field: "updateTime", filter: { date: "yyyy-MM-dd HH:mm:ss" }, width: 160, },
          { title: "修改人", field: "updateUser", filter: { placeholder: "---" }, },
        ],
        fullscreenLoading: false,
        chooseData: false,
        rowKey: "supplierId",
        operationList: [
          {
            type: "success",
            show: (row) => true,
            isPlain: true,
            size: "mini",
            buttonText: "编辑",
            handler: (row) => {},
            handleName: "edit",
          },
          {
            type: "warning",
            show: (row) => true,
            isPlain: true,
            size: "mini",
            buttonText: "账号",
            handler: (row) => {},
            handleName: "showManage"
          },
          {
            type: "primary",
            show: (row) => row.auditStatus == 2,
            isPlain: true,
            size: "mini",
            buttonText: "审核",
            handler: (row) => {},
            handleName: "auditDialog"
          },
          {
            type: "primary",
            show: (row) => row.auditStatus == 2,
            isPlain: true,
            size: "mini",
            buttonText: "测试",
            handler: (row) => {},
            handleName: "auditDialog"
          },
        ],
        operationWidth: 240,
      },

      tempData: {},
      manageData: {}
    };
  },
  watch:{
    'inputSelect':function(val){
      this.inputSelectVlaue = ''
    }
  },
  created() {
    console.log('created is')
    this.$post('/mock/random/data')
  },
  methods: {
    addItem() {
      this.tempData = {}
      this.$refs.supplierManager.dialogFormVisible = true
    },
    edit(row) {
      this.tempData = Object.assign(row, {$type: 'edit'})
      this.$refs.supplierManager.dialogFormVisible = true
    },
    showManage(item) {
      console.log("账号管理", item)
      this.manageData = item
      this.$refs.accountManage.dialogFormVisible = true
    },
    auditDialog(val){
      this.$confirm('是否通过该供应商审核', '审核', {
        confirmButtonText: '通过',
        cancelButtonText: '拒绝',
        type: 'warning',
        center: true
      }).then(() => {
        this.$post('/supplier/audit',{supplierId:val.supplierId,aduityStatus:0}).then(res=>{
          if(res.code == 200){
            this.$notify.success('操作成功')
            this.onSearch()
          }else{
            this.$notify.error(res.msg||'添加失败')
          }
        })
      }).catch(() => {
        this.$post('/supplier/audit',{supplierId:val.supplierId,aduityStatus:1}).then(res=>{
          if(res.code == 200){
            this.$notify.success('操作成功')
            this.onSearch()
          }else{
            this.$notify.error(res.msg||'添加失败')
          }
        })
      });
    },
  },
};
</script>
<style lang="less" scoped>
.el-input {
  // padding-top: 5px !important;
  width: 150px !important;
}
.el-select {
  padding-left: 0px !important;
}
.el-button--info {
  color: #fff;
  background-color: #e280ea;
  border-color: #e280ea;
}
</style>