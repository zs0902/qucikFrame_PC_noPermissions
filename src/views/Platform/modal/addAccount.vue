<template>
    <div>
        <el-dialog title="添加账号" :visible.sync="dialogFormVisible" width="500px" :before-close="handleClose" :close-on-click-modal="false">
            <el-form ref="addAccount" :model="addAccount" :rules="rule"  label-width="160px"  size="small" >
                <!-- <el-form-item label="账号类型：" prop="accountType">
                    <el-radio-group v-model="addAccount.accountType">
                        <el-radio :label="0">平台账号</el-radio>
                        <el-radio :label="1">供应商账号</el-radio>
                    </el-radio-group>
                </el-form-item> -->
                <el-form-item label="供应商：" v-if="addAccount.accountType==1" prop="supplierId">
                    <el-select filterable size="small" v-model="addAccount.supplierId" placeholder="供应商" clearable style="width:200px">
                        <el-option v-for="item in suplierList" :key="item.supplierId" :label="item.supplierName" :value="item.supplierId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账号：" prop="name">
                    <el-input v-model="addAccount.name" clearable placeholder="请输入账号" minlength="2" maxlength="30" size="small" auto-complete="off" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item label="姓名：" prop="realName">
                    <el-input v-model="addAccount.realName" clearable placeholder="姓名" minlength="2" maxlength="30" size="small" auto-complete="off" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item label="默认密码：" prop="password">
                    <el-input show-password v-model="addAccount.password" clearable placeholder="请输入默认密码" minlength="15" maxlength="30" size="small" auto-complete="off" style="width:200px"></el-input>
                    <i class="el-icon-question" style="margin-left: 0.2rem" :title="passwordText" 
                        @click="() => this.$alert(passwordText, '提示', { confirmButtonText: '确定'})">
                    </i>
                </el-form-item>
                <el-form-item label="角色：" prop="roleId">
                    <el-select filterable size="small" v-model="addAccount.roleId" placeholder="角色" clearable style="width:200px">
                        <el-option v-for="item in roleList" :key="item.roleId" :label="item.name" :value="item.roleId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账号状态：" prop="delFlag">
                    <el-select filterable size="small" v-model="addAccount.delFlag" placeholder="账号状态" clearable style="width:200px">
                        <el-option v-for="item in [{label: '启用', value: 0}, {label: '禁用', value: 1}]" :key="item.value" :label="item.label" :value="item.value">
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
    data(){
        return{
            dialogFormVisible:false,
            addAccount:{
                accountType: 0,
                supplierId: '', //平台账号默认 ’-1‘
                name:'',
                realName:'',
                password: '',
                roleId: '',
                delFlag: ''
            },
           
            rule:{
                accountType: {required:true,trigger:"change",message:"请选择账号类型"},
                supplierId: {required:true,trigger:"change",message:"请选择供应商"},
                name:{required:true,trigger:"blur",message:"请输入账号"},
                realName:{required:true,trigger:"blur",message:"请输入用户姓名"},
                password: {trigger:"blur",validator: this.$generalChcek.validatePass},
                delFlag: {required:true,trigger:"change",message:"请选择状态"},
                roleId: {required:true,trigger:"change",message:"请选择角色"},
            },
            roleList: [],
            suplierList: [],
            submitFlag:false,

            // 密码规则
            passwordText: '密码长度为8到20位，必须包含数字、1个大写字母、1个小写字母和1个特殊字符'
        }
    },
    watch: {
        dialogFormVisible(val) {
            if(val){
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
        submit(){
            this.$refs.addAccount.validate(valid => {
                if (!valid){
                    this.$notify.error({title:"错误",message:"填写内容有误,请修改后点击提交"})
                    return false
                }
                this.addAccount.supplierId = this.addAccount.accountType==0?'-1':this.addAccount.supplierId
                let key = process.env.VUE_APP_LOCAL_AES_KEY
                let addAccountData = JSON.parse(JSON.stringify(this.addAccount))
                addAccountData.password = AES.encrypt(this.addAccount.password,key)
                this.submitFlag = true
                this.$post('/user/save', addAccountData).then(res => {
                    if(res.code==200){
                        this.$notify.success('添加成功')
                        this.$emit('refresh')
                        this.handleClose()
                    }else{
                        this.$notify.error(res.msg||'添加失败')
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