<template>
    <div>
        <el-dialog title="编辑账号" :visible.sync="dialogFormVisible" width="500px" :before-close="handleClose" :close-on-click-modal="false">
            <el-form ref="accountEdit" :model="accountEdit" :rules="rule"  label-width="160px"  size="small" >
                <!-- <el-form-item label="账号：" prop="name">
                    <el-input v-model="accountEdit.name" clearable placeholder="请输入账号" minlength="2" maxlength="30" size="small" auto-complete="off" style="width:200px"></el-input>
                </el-form-item> -->
                <el-form-item label="姓名：" prop="realName">
                    <el-input v-model="accountEdit.realName" clearable placeholder="姓名" minlength="2" maxlength="30" size="small" auto-complete="off" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item label="角色：" prop="roleId">
                    <el-select filterable size="small" v-model="accountEdit.roleId" placeholder="角色" clearable style="width:200px">
                        <el-option v-for="item in roleList" :key="item.roleId" :label="item.name" :value="item.roleId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div class="dialog-footer" style="margin-top:40px;">
                    <el-button type="primary" @click="submit" :loading="submitFlag" style="width:120px">确 定</el-button>
                    <div style="width:50px;display:inline-block"></div>
                    <el-button @click="handleClose" style="width:120px">取 消</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import AES from "@/utility/aes.js";
export default {
    props: {
        detailData: {}
    },
    data(){
        return{
            dialogFormVisible:false,
            accountEdit:{
                platType: 2,
                supplierId: '', //平台账号默认 ’-1‘
                supplierName: '',
                name:'',
                realName:'',
                loginPassword: '',
                roleId: '',
                status: ''
            },
           
            rule:{
                name:{required:true,trigger:"blur",message:"请输入账号"},
                realName:{required:true,trigger:"blur",message:"请输入用户姓名"},
                roleId: {required:true,trigger:"change",message:"请选择角色"},
            },
            roleList: [],
            suplierList: [],
            submitFlag:false,
        }
    },
    watch: {
        dialogFormVisible(val) {
            if(val){
                this.getList()
                console.log(this.detailData)
                this.accountEdit.supplierId = this.detailData.supplierId
                this.accountEdit.name = this.detailData.name
                this.accountEdit.userId = this.detailData.userId
                this.accountEdit.realName = this.detailData.realName
                this.accountEdit.roleId = this.detailData.roleId || ''
                this.submitFlag = false
            }
        }
    },
    methods:{
        getList() {
            this.$post('role/findAll',{platType: 2, pageSize: 9999, pageNum: 1}).then(res => {
                if(res.result.code == 'success'){
                    this.roleList = res.data.list
                }
            })
            // this.$post('/supplierInfoEntity/listAll',{pageSize: 9999, pageNum: 1}).then(res => {
            //     if(res.code == 200){
            //         this.suplierList = res.data.list.filter(item => item.status==0)
            //     }
            // })
        },
        handleClose(){
            this.$refs.accountEdit.resetFields();
            this.dialogFormVisible = false
            
        },
        test(val) {
            if(!val){
                return false
            }else{
                return true
            }
        },
        submit(){
            this.$refs.accountEdit.validate(valid => {
                if (!valid){
                    this.$notify.error({title:"错误",message:"填写内容有误,请修改后点击提交"})
                    return false
                }

                // 操作用户确认登录密码
                
                this.submitFlag = true
                let key = process.env.VUE_APP_AES_KEY
                let params = JSON.parse(JSON.stringify(this.accountEdit))
                params.loginPassword = AES.encrypt(params.loginPassword,key)
                this.$post('/sys/plat/user/save', this.accountEdit).then(res => {
                    if(res.result.code=='success'){
                        this.$notify.success('操作成功')
                        this.$emit('refresh')
                        this.handleClose()
                    }else{
                        this.$notify.error(res.result.message||'添加失败')
                    }
                    this.submitFlag = false
                })

                
            })
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
.ts_class{
    font-size: 12px;
    color:#666;
}
</style>