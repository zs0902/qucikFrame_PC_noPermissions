<template>
    <div>
        <el-dialog title="账号管理" :visible.sync="dialogFormVisible" width="900px" :before-close="handleClose" :close-on-click-modal="false">
            <el-form ref="accountManage"  label-position="right"  size="small">
                <el-form-item>
                    <el-button plain type="success"  size="small" @click='showAdd'>添加账号</el-button>
                </el-form-item>
                <div class="table-wrapper" style="height: 500px">
                    <el-table height="100%"  stripe show-header fit  class="real-table" ref="table" :data="data.list"
                        v-loading="fullscreenLoading" 
                        element-loading-text="拼命加载中..."
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(255, 255, 255, 0.8)">
                        <el-table-column header-align="center" align="center" :min-width="item.width > 0?item.width:130" v-for="item in columns" :key="item.field" :prop="item.field" :label="item.title" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{scope.row[item.field]|valuefilter(item.filter)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" align="center" header-align="center" width="250" >
                            <template slot-scope="scope">
                                 <el-button type="primary"  plain @click.native="showEdit(scope.row)" size="mini">编辑</el-button>
                                <el-button type="danger"  plain @click.native="changeState(scope.row)" size="mini" v-if='scope.row.status == 0'>禁用</el-button>
                                <el-button type="success" plain @click.native="changeState(scope.row)" size="mini" v-else>启用</el-button>
                                <el-button type="warning" plain  @click.native="resetPas(scope.row)" size="mini" >重置密码</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div>
                    <el-pagination  class="page-pagination-pc" layout="total, sizes, prev, pager, next, jumper"
                        @size-change="pageSizeChange" @current-change="pageNumChange" :pager-count="5"
                        :current-page="query.pageNum" :page-size="query.pageSize" :page-sizes="pageSizes" :total="data.totalCount">
                    </el-pagination>
                </div>
            </el-form>
        </el-dialog>
        <add-modal ref='add' @refresh="onSearch"></add-modal>
        <edit-modal ref='edit' @refresh="onSearch" :detailData='detailData'></edit-modal>
        <resPasModal ref='respas' @refresh="queryData"></resPasModal>
    </div>
</template>
<script>
import addModal from './accountAdd.vue'
import editModal from './accountEdit.vue'
import AES from "@/utility/aes.js";
import resPasModal from './resetPas.vue'
export default {
    components:{
        'add-modal':addModal,
        'edit-modal':editModal,
        'resPasModal':resPasModal
    },
    props:{
        manageData:Object
    },
    data(){
        
        return{
            dialogFormVisible:false,
            pageSizes:[10,20,50,100],
            data:{
                totalCount:0,
                list:[]
            },
            columns:[
                { title: "序号", field: "userId", filter: { placeholder: '---' }, width: 80 },  
                { title: "账号", field: "name", filter: { placeholder: '---' } },  
                { title: "姓名", field: "realName", filter: { placeholder: '---' } }, 
                { title: "角色", field: "roleName", filter: { placeholder: '---' } }, 
                { title: "状态", field: "status", filter: { tof: '启用,禁用' }, width: 80 },
            ],
            fullscreenLoading:false,
            query:{
                pageNum:1,
                pageSize:20,
                platType: 2,
                supplierId:'',
            },
            detailData:{}
        }
    },
    watch:{
       'dialogFormVisible':function(val){
           if(val){
               this.onSearch()
           }
       } 
    },
    methods:{
        showEdit(item){
            this.detailData = item
            this.$refs.edit.dialogFormVisible = true
        },
        showAdd(){
            this.$refs.add.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs.add.accountAdd.supplierId = this.manageData.supplierId
                this.$refs.add.accountAdd.supplierName = this.manageData.supplierName
            })
        },
        handleClose(){
            this.$refs.accountManage.resetFields();
            this.dialogFormVisible = false
        },
        onSearch(){
            this.query.pageNum = 1
            this.queryData()
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
        queryData(){
            this.query.supplierId = this.manageData.supplierId
            this.fullscreenLoading = true
            this.$post("/sys/plat/user/list", this.query).then(res=>{
                console.log(res)
                if (res.result.code == 'success'){
                    this.data.totalCount = parseInt(res.data.total||0)
                    this.data.list = res.data.list                     
                }else{
                    this.data.totalCount = 0
                    this.data.list = []
                }
                this.fullscreenLoading = false
            })
        },
        changeState(item){
            var tips  = `是否确认${item.status == 0?'禁用':'启用'}此账号?`
            this.$confirm(tips, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$post('/sys/plat/user/enable',{userId:item.userId,status:item.status}).then(res=>{
                    if(res.result.code == 'success'){
                        this.$notify({title:'操作成功',type: 'success'});
                        this.onSearch()
                    }
                    else{
                       this.$notify({title: res.result.message,type: 'error'}); 
                    }
                })
            }).catch(() => {    
            });
        },
        resetPas(content) {
            this.$refs.respas.respas.userId = content.userId
            this.$refs.respas.dialogFormVisible  = true
        },
    }
}
</script>
<style scoped>
.dialog-footer{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}
</style>
