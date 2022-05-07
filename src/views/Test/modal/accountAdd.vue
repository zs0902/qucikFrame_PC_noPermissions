<template>
    <div>
        <el-dialog title="添加账号" :visible.sync="dialogFormVisible" width="440px" :before-close="handleClose" :close-on-click-modal="false">
            <el-form ref="addAccount" :model="accountAdd" :rules="rule"  label-width="130px"  size="small" >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="供应商编号：" prop="carrierNo">{{accountAdd.supplierId}}</el-form-item>
                    </el-col>
                    
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="供应商名称：" prop="carrierNo">{{accountAdd.supplierName}}</el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="账号：" prop="name">
                    <el-input v-model="accountAdd.name" clearable placeholder="请输入账号" minlength="2" maxlength="30" size="small" auto-complete="off" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item label="姓名：" prop="realName">
                    <el-input v-model="accountAdd.realName" clearable placeholder="姓名" minlength="2" maxlength="30" size="small" auto-complete="off" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item label="默认密码：" prop="loginPassword">
                    <el-input show-password v-model="accountAdd.loginPassword" clearable placeholder="请输入默认密码" minlength="8" maxlength="20" size="small" auto-complete="off" style="width:200px"></el-input>
                    <i class="el-icon-question" style="margin-left: 0.2rem" :title="passwordText" 
                        @click="() => this.$alert(passwordText, '提示', { confirmButtonText: '确定'})">
                    </i>
                    <!-- <div>
                        <i class="el-icon-circle-check"></i> 密码最短为15位 
                        <i class="el-icon-circle-check"></i> 密码必须包含1个大写字母
                        <i class="el-icon-circle-check"></i> 密码最短为15位 
                        <i class="el-icon-circle-check"></i> 密码最短为15位 
                        <i class="el-icon-circle-check"></i> 密码最短为15位 
                    </div> -->
                </el-form-item>
                <el-form-item label="角色：" prop="roleId">
                    <el-select filterable size="small" v-model="accountAdd.roleId" placeholder="角色" clearable style="width:200px">
                        <el-option v-for="item in roleList" :key="item.roleId" :label="item.name" :value="item.roleId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：" prop="carrierNo">
                    <el-select filterable size="small" v-model="accountAdd.status" placeholder="账号状态" clearable style="width:200px">
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
            accountAdd:{
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
                accountType: {required:true,trigger:"change",message:"请选择账号类型"},
                // supplierId: {required:true,trigger:"change",message:"请选择供应商"},
                name:{required:true,trigger:"blur",validator: this.$validate.validateAccount},
                realName:{required:true,trigger:"blur",message:"请输入用户姓名"},
                loginPassword: {required:true,trigger:"blur",validator: this.$validate.validatePass},
                status: {required:true,trigger:"change",message:"请选择状态"},
                roleId: {required:true,trigger:"change",message:"请选择角色"},
            },
            roleList: [],
            suplierList: [],
            submitFlag:false,
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
            this.$post('role/findAll',{platType: 2, pageSize: 9999, pageNum: 1}).then(res => {
                if(res.result.code == 'success'){
                    console.log("aaa:", res.data.list)
                    this.roleList = res.data.list
                    this.accountAdd.roleId = this.roleList[0].roleId
                }
            })
            // this.$post('/supplierInfoEntity/listAll',{pageSize: 9999, pageNum: 1}).then(res => {
            //     if(res.code == 200){
            //         this.suplierList = res.data.list.filter(item => item.status==0)
            //     }
            // })
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
                let key = process.env.VUE_APP_AES_KEY
                let accountAddData = JSON.parse(JSON.stringify(this.accountAdd))
                accountAddData.loginPassword = AES.encrypt(this.accountAdd.loginPassword,key)
                this.submitFlag = true
                this.$post('/sys/plat/user/save', accountAddData).then(res => {
                    if(res.result.code=='success'){
                        this.$notify.success('添加成功')
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
</style>