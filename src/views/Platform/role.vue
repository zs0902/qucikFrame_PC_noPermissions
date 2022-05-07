<template>
    <div class="container_form">
        <DynamicQuery ref="query" :deviceType="deviceType">
            <template v-slot:query>
                <el-form :inline="true" :model="query" class="demo-form-inline" id="queryForm">
                    <el-form-item label="角色名称">
                        <el-input v-model="query.name" clearable placeholder="请输入角色名称" minlength="2" maxlength="50" size="small" auto-complete="off" style="width:200px"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template v-slot:btn>
                <el-button type="primary" @click.native="onSearch" size="small">查询</el-button>
                <el-button class="reset_btn_sup" @click.native="clearQuery" size="small">重置</el-button>

                <el-button type="success" style="margin-left: 50px" @click.native="AddRole()" size="small">添加</el-button>
            </template>
        </DynamicQuery>

        <!-- 调用通用的table封装组件，表格数据通过v-model绑定，表格相关配置通过tableData对象传入，表格所有交互动作通过tableHandle暴露 -->
        <DynamicTable ref="table" v-model="data.list" :tableData="tableData" @tableHandle="tableHandle"></DynamicTable>
        

        <el-pagination  :class="[deviceType=='Pc'?'page-pagination-pc':'page-pagination-mobile']" 
        background
            :layout="deviceType=='Pc'?'total, sizes, prev, pager, next, jumper':'prev, pager, next'"
            @size-change="pageSizeChange" @current-change="pageNumChange" :pager-count="5"
            :current-page="query.pageNum" :page-size="query.pageSize" :page-sizes="pageSizes" :total="data.totalCount">
        </el-pagination>

        <RoleManager ref='roleManager' @refresh="onSearch" :initData="tempData"></RoleManager>
        <WebAuth ref="webAuth" :tempData="tempData"  @refresh='onSearch' :platList='platList'></WebAuth>
    </div>
</template>

<script>
import RoleManager from './modal/roleManager.vue'
import WebAuth from './modal/webAuth.vue'

import mixinTable from '@/mixins/mixin_table.js'
export default {
    props: {
        deviceType: ''
    },
    components:{
        RoleManager,
        WebAuth
    },
    mixins: [mixinTable],
    data() {
        return {
            tableData: {
                columns: [
                    { title: "角色名称", field: "name", filter: { placeholder: '---' }},  
                    { title: "角色描述", field: "remark", filter: { placeholder: '---' }}, 
                    { title: "角色数量", field: "count", filter: { placeholder: '0' }}, 
                    { title: "平台", field: "platType", filter: { enum:'PLAT_TYPE' }}, 
                    { title: "状态", field: "delFlag", filter: { tof: '启用,禁用' }, color: row => row.delFlag==0?'text-success':'text-danger'},  
                ],
                fullscreenLoading: false,
                chooseData: false,
                operationList: [
                    { type: 'success', show: row => true, disabled: row => row.delFlag==0, isPlain: true, size: 'mini', icon: '', buttonText: '权限设置', handler: (row) => { }, handleName: 'webAuth' },
                    { type: 'primary', show: row => true, isPlain: true, size: 'mini', icon: '', buttonText: '编辑', handler: (row) => { }, handleName: 'editRole' },
                ],
                operationWidth: 180
            },

            tempData:{},
            platList:[], //平台列表
        }
    },
    created(){
        this.platList = this.EnumUtility.Get('PLAT_TYPE')
        console.log('根组件数据获取:', this.$children)
    },
    methods: {
        queryData(){
            this.tableData.fullscreenLoading = true
            this.$post("/role/findAll", this.query).then(res=>{
                if (res.result.code == 'success'){
                    
                    this.data.totalCount = parseInt(res.data.total||0)
                    this.data.list = res.data.list                    
                }else{
                    this.data.totalCount = 0
                    this.data.list = []
                }
                this.tableData.fullscreenLoading = false
            })
        },
        AddRole(item) {
            this.tempData = {}
            this.$refs.roleManager.dialogFormVisible = true
        },
        webAuth(item) {
            this.tempData  = item
            this.$refs.webAuth.dialogFormVisible = true
        },
        editRole(item) {
            this.tempData  = Object.assign(item, {$type: 'edit'})
            this.$refs.roleManager.dialogFormVisible = true
        }
    }
}
</script>
<style lang="less" scoped>
.el-select{
    padding-left:0px !important;
}
.el-button--info{
    color: #FFF;
    background-color: #e280ea;
    border-color: #e280ea;
}
</style>
