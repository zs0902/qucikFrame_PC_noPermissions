<template>
    <div>
        <el-dialog title="重置密码" :visible.sync="dialogFormVisible" width="500px" :before-close="handleClose" :close-on-click-modal="false">
            <el-form ref="addAccount" :model="respas" :rules="rule"  label-width="180px"  size="small" >
                <!-- <el-form-item label="请输入您的登录密码：" prop="name" style="margin-top:30px;">
                    <el-input v-model="respas.name" clearable placeholder="请输入您的登录密码" minlength="2" maxlength="30" size="small" auto-complete="off" style="width:200px"></el-input>
                </el-form-item> -->
                <el-form-item label="设置账号最新密码：" prop="password">
                    <el-input v-model="respas.password" clearable placeholder="请输入账号最新密码" show-password minlength="2" maxlength="30" size="small" auto-complete="off" style="width:200px"></el-input>
                    <i class="el-icon-question" style="margin-left: 0.2rem" :title="passwordText" 
                        @click="() => this.$alert(passwordText, '提示', { confirmButtonText: '确定'})">
                    </i>
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
    data(){
        return{
            dialogFormVisible:false,
            respas:{
                password: '',
                userId: '',
            },
           
            rule:{
                password: {trigger:"blur",validator: this.$validate.validatePass},
            },
            submitFlag:false,
            passwordText: '密码长度为8到20位，必须包含数字、1个大写字母、1个小写字母和1个特殊字符'
        }
    },
    watch: {
        dialogFormVisible(val) {
            if(val){
                
            }
        }
    },
    methods:{
        
        handleClose(){
            this.$refs.addAccount.resetFields()
            this.dialogFormVisible = false
            
        },
        submit(){
            this.$refs.addAccount.validate(valid => {
                if (!valid){
                    this.$notify.error({title:"错误",message:"填写内容有误,请修改后点击提交"})
                    return false
                }
                let key = process.env.VUE_APP_AES_KEY
                let accountAddData = JSON.parse(JSON.stringify(this.respas))
                accountAddData.password = AES.encrypt(this.respas.password,key)
                this.submitFlag = true
                this.$post('/sys/plat/user/resetPassword', accountAddData).then(res => {
                    if(res.result.code=='success'){
                        this.$notify.success('密码重置成功')
                        this.$emit('refresh')
                        this.handleClose()
                    }else{
                        this.$notify.error(res.result.message||'密码重置失败')
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
</style>