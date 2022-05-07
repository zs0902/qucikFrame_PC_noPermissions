<template>
    <div class="container_form">
        <!-- pc端 筛选条件 -->
        <div class="top_operation" v-if="deviceType=='Pc'">
            <el-form :inline="true" :model="query" class="demo-form-inline" id="queryForm">
                <el-form-item label="">
                    <el-input v-model="query.loginName" clearable placeholder="请输入账号" minlength="2" maxlength="50" size="small" auto-complete="off" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-select filterable size="small" v-model="query.roleId" placeholder="角色" clearable style="width:200px">
                        <el-option v-for="item in roleList" :key="item.roleId" :label="item.name" :value="item.roleId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select filterable size="small" v-model="query.status" placeholder="状态" clearable style="width:200px">
                        <el-option v-for="item in [{label: '启用', value: '0'}, {label: '禁用', value: '1'}]" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click.native="onSearch" size="small">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="success" size="small" @click="addAcount">添加</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 移动端 筛选条件 -->
        <el-drawer
            v-if="deviceType=='Mobile'"
            title="我是标题"
            :visible.sync="drawerShow"
            direction="ltr"
            size="80%"
            style="text-align: center"
            :with-header="false">
            <el-form :inline="true" :model="query" class="demo-form-inline" id="queryForm">
                <el-form-item label="">
                    <el-input v-model="query.name" clearable placeholder="请输入账号" minlength="2" maxlength="50" size="small" auto-complete="off" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-select filterable size="small" v-model="query.roleId" placeholder="角色" clearable style="width:200px">
                        <el-option v-for="item in roleList" :key="item.roleId" :label="item.name" :value="item.roleId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select filterable size="small" v-model="query.status" placeholder="状态" clearable style="width:200px">
                        <el-option v-for="item in [{label: '启用', value: '0'}, {label: '禁用', value: '1'}]" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <br>
                <el-form-item label="">
                    <el-button type="primary" @click.native="onSearch" size="small">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="success" size="small" @click="addAcount">添加</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <div class="table-wrapper">
            <el-table height="100%"  stripe show-header fit ref="table" :data="data.list" 
                v-loading="fullscreenLoading" 
                element-loading-text="拼命加载中..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.8)">
                <el-table-column header-align="center" align="center" :min-width="item.width > 0?item.width:130" v-for="item in columns" :key="item.field" :prop="item.field" :label="item.title" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="item.field=='status'" :class="scope.row['status']=='0'?'text-success' : 'text-danger'">
                            {{scope.row[item.field]|valuefilter(item.filter)}}
                        </span>
                        <span v-else>
                            {{scope.row[item.field]|valuefilter(item.filter)}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center" header-align="center" width="280" >
                    <template slot-scope="scope">
                        <el-button type="primary" v-if="scope.row['status']==0" plain @click.native="editAccount(scope.row)" size="mini"  >编辑</el-button>
                        <el-button type="danger" plain v-if="scope.row['status']==0" @click.native="disable(scope.row, '禁用')" size="mini"  >禁用</el-button>
                        <el-button type="success" plain v-if="scope.row['status']==1" @click.native="disable(scope.row, '启用')" size="mini" >启用</el-button>
                        <el-button type="warning" plain  @click.native="resetPas(scope.row)" size="mini" >重置密码</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        

        <div v-if="deviceType=='Pc'">
            <el-pagination  class="page-pagination-pc" layout="total, sizes, prev, pager, next, jumper"
                background
                @size-change="pageSizeChange" @current-change="pageNumChange" :pager-count="5"
                :current-page="query.pageNum" :page-size="query.pageSize" :page-sizes="pageSizes" :total="data.totalCount">
            </el-pagination>
        </div>
        
        <div v-if="deviceType=='Mobile'">
            <el-pagination
                class="page-pagination-mobile"
                layout="prev, pager, next"
                @current-change="pageNumChange"
                :total="data.totalCount">
            </el-pagination>
        </div>
        <addAccount ref='addAccount' @refresh='onSearch'></addAccount>
        <editAccount ref='editAccount' :tempData='tempData' @refresh='queryData'></editAccount>
    </div>
</template>

<script>
import addAccount from './modal/addAccount.vue'
import editAccount from './modal/editAccount.vue'
import AES from "@/utility/aes.js";
export default {

    props: {
        deviceType: ''
    },
    components:{
        addAccount,
        editAccount
    },
    data() {
        return {
            pageSizes:[10,20,50,100],
            defaultQuery:{},
            query:{
                pageNum:1,
                pageSize:20,
                roleId: '',
                status: '',
                loginName: ''
            },
            data:{
                totalCount:0,
                list:[]
            },
            columns:[
                // 
                { title: "账号ID", field: "userId", filter: { placeholder: '---' }, width: 160 },  
                // { title: "供应商名称", field: "supplierName", filter: { placeholder: '---' }}, 
                { title: "账号", field: "name", filter: { placeholder: '---' }}, 
                { title: "姓名", field: "realName", filter: { placeholder: '---' }}, 
                { title: "角色", field: "roleNames", filter: { placeholder: '---' }},  
                { title: "状态", field: "status", filter: { tof: '启用,禁用' }},  
            ],
            drawerShow: false, //移动端展示删选条件与否
            fullscreenLoading: false,
            roleList:[],
            tempData:{},
        }
    },
    created(){
        this.defaultQuery = JSON.parse(JSON.stringify(this.query));
        this.getList()
        this.onSearch()
    },
    methods: {
        getList() {
            this.$post('/role/findAll', {platType: 0, pageSize: 9999, pageNum: 1}).then(res => {
                if(res.code == 200){
                    this.roleList = res.data
                }
            })
        },
        onSearch(){
            this.query.pageNum = 1
            this.queryData()
        },
        clearQuery(){
            this.query = JSON.parse(JSON.stringify(this.defaultQuery))
            this.onSearch()
        },
        queryData(){
            this.fullscreenLoading = true
            this.$post("/user/findPage", this.query).then(res=>{
                if (res.code == 200){
                    
                    this.data.totalCount = parseInt(res.data.totalSize||0)
                    this.data.list = res.data.content                     
                }else{
                    this.data.totalCount = 0
                    this.data.list = []
                }
                this.fullscreenLoading = false
            })
        },
        pageSizeChange(pageSize){
            this.query.pageNum = 1
            this.query.pageSize = pageSize
            this.queryData()
        },
        pageNumChange(pageNum){
            this.query.pageNum = pageNum
            this.queryData()
        },
        addAcount() {
            this.$refs.addAccount.dialogFormVisible = true
        },
        editAccount(item) {
            this.tempData = item
            this.$refs.editAccount.dialogFormVisible = true
        },
        test(val) {
            if(!val){
                return false
            }else{
                return true
            }
        },
        resetPas(content) {
            // 操作用户确认登录密码
            this.$prompt('请输入您的登录密码', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValidator: this.test,
                inputErrorMessage: '密码不能为空'
            }).then(({ value }) => {
                let key = process.env.VUE_APP_LOCAL_AES_KEY
                let valueData = JSON.parse(JSON.stringify(value))
                valueData = AES.encrypt(value,key)
                this.$post('/user/resetPassword', {
                    userId: content.userId,
                    loginPassword: valueData
                }).then(res => {
                    if(res.code==200){
                        this.$notify.success('操作成功')
                        this.$emit('refresh')
                    }else{
                        this.$notify.error(res.msg||'添加失败')
                    }
                    this.submitFlag = false
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });       
            });
        },
        disable(content, type) {
            this.$confirm('此操作将'+type+'该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$post('/user/update/enable', {userId: content.userId, status: content.status==0?'1':'0'}).then(res => {
                    if(res.code==200){
                        this.$notify.success('操作成功')
                        this.queryData()
                    }else{
                        this.$notify.error(res.msg||'操作失败')
                    }
                    this.submitFlag = false
                })
            })
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
