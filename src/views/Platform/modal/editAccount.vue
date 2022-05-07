<template>
    <div>
        <el-dialog title="编辑账号" :visible.sync="dialogFormVisible" width="500px" :before-close="handleClose" :close-on-click-modal="false">
            <el-form ref="addAccount" :model="addAccount" :rules="rule"  label-width="160px"  size="small" >
                <!-- <el-form-item label="供应商：" v-if="addAccount.supplierId!='-1'" prop="supplierId">
                    <el-select disabled filterable size="small" v-model="addAccount.supplierId" placeholder="供应商" clearable style="width:200px">
                        <el-option v-for="item in suplierList" :key="item.supplierId" :label="item.supplierName" :value="item.supplierId">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item label="账号：" prop="name">
                    <el-input v-model="addAccount.name" clearable placeholder="请输入账号" minlength="2" maxlength="30" size="small" auto-complete="off" style="width:200px"></el-input>
                </el-form-item> -->
                <el-form-item label="姓名：" prop="realName">
                    <el-input v-model="addAccount.realName" clearable placeholder="姓名" minlength="2" maxlength="30" size="small" auto-complete="off" style="width:200px"></el-input>
                </el-form-item>
                <!-- <el-form-item label="重置密码：" prop="resetPassword">
                    <el-radio-group v-model="addAccount.resetPassword">
                        <el-radio :label="0">是</el-radio>
                        <el-radio :label="1">否</el-radio>
                    </el-radio-group>
                </el-form-item> -->
                <el-form-item label="角色：" prop="roleId">
                    <el-select filterable size="small" v-model="addAccount.roleId" placeholder="角色" clearable style="width:200px">
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
        tempData: {}
    },
    data(){
        return{
            dialogFormVisible:false,
            addAccount:{
                supplierId: '-1', //平台账号默认 ’-1‘
                name:'',
                realName:'',
                resetPassword: 1,
                roleId: ''
            },
           
            rule:{
                name:{required:true,trigger:"blur",message:"请输入账号"},
                realName:{required:true,trigger:"blur",message:"请输入用户姓名"},
                resetPassword: {required:true,trigger:"change",message:"请选择是否重置密码"},
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
                this.addAccount = Object.assign(this.addAccount, this.tempData)
                this.addAccount.resetPassword = 1
                this.submitFlag = false
                this.getList()
            }
        }
    },
    methods:{
        getList() {
            this.$post('/role/findAll',{platType: 0, pageSize: 9999, pageNum: 1}).then(res => {
                if(res.code == 200){
                    this.roleList = res.data
                }
            })
            this.$post('/supplierInfoEntity/listAll',{pageSize: 9999, pageNum: 1}).then(res => {
                if(res.code == 200){
                    this.suplierList = res.data.list.filter(item => item.status==0)
                }
            })
        },
        handleClose(){
            this.$refs.addAccount.resetFields();
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
            this.$refs.addAccount.validate(valid => {
                if (!valid){
                    this.$notify.error({title:"错误",message:"填写内容有误,请修改后点击提交"})
                    return false
                }

                // 操作用户确认登录密码
                this.$prompt('请输入您的登录密码', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValidator: this.test,
                    inputErrorMessage: '密码不能为空'
                }).then(({ value }) => {
                    this.submitFlag = true
                    let key = process.env.VUE_APP_LOCAL_AES_KEY
                    this.addAccount.loginPassword = AES.encrypt(value,key)
                    this.$post('/user/save', this.addAccount).then(res => {
                        if(res.code==200){
                            this.$notify.success('操作成功')
                            this.$emit('refresh')
                            this.handleClose()
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