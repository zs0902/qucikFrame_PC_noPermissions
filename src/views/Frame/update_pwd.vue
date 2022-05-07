<template>
    <div class="container_form">
        <div class="up-pwd">
            <div class="title1">密码重置</div>
            <el-form :model="form" status-icon :rules="rule" ref="form" label-width="100px">
                <el-form-item label="原密码" prop="oldPassword" style="margin-top: 22px;width:360px">
                    <el-input type="password" v-model="form.oldPassword" placeholder="请输入原密码" auto-complete="off" minlength="15" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" v-model="form.newPassword" placeholder="请输入新密码" style="width:260px" auto-complete="off" minlength="15" maxlength="30"></el-input>
                    <i class="el-icon-question" style="margin-left: 0.2rem" :title="passwordText" 
                        @click="() => this.$alert(passwordText, '提示', { confirmButtonText: '确定'})">
                    </i>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input type="password" v-model="form.confirmPassword" placeholder="请再次输入新密码" style="width:260px" auto-complete="off" minlength="15" maxlength="30"></el-input>
                </el-form-item>
                <!-- <el-form-item style="text-align: center"> -->
                <div style="text-align: center">
                    <el-button type="primary" style="width: 100%;margin-top: 20px" @click.native="submit" class="qx-el-button" :loading="submitFlag">提交</el-button>
                </div>
                    
                <!-- </el-form-item> -->
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        var validatePass1 = (rule, value, callback) => {
            let p1 = /^.*(?=.{15,30})(?=.*\d).*$/ // 数字校验
            let p2 = /^.*(?=.{15,30})(?=.*[A-Z]{1,}).*$/ // 两个大写字母校验
            let p3 = /^.*(?=.{15,30})(?=.*[a-z]{1,}).*$/ // 两个小写字母校验
            let p4 = /^.*(?=.{15,30})(?=.*[!@#$%^&*?\(\)]).*$/ // 特殊字符校验
            // console.log('llll:', p1.test(value),p2.test(value),p3.test(value),p4.test(value) )
            if (value.length<15){
                callback(new Error('密码最短为15位'));
            }else if (value == this.form.oldPassword) {
                callback(new Error('新密码与原密码不能一样'))
            }else if(!p1.test(value)) {
                callback(new Error('密码必须包含1个数字'));
            }else if(!p2.test(value)) {
                callback(new Error('密码必须包含1个大写字母'));
            }else if(!p3.test(value)) {
                callback(new Error('密码必须包含1个小写字母'));
            }else if(!p4.test(value)) {
                callback(new Error('密码必须包含1个特殊字符'));
            } else {
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入新密码'))
            } else if (value !== this.form.newPassword) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        };
        return {
            form: {
                userId:'',
                oldPassword:"",
                newPassword:"",
                confirmPassword:"",
            },
            rule: {
                oldPassword: [
                    { required: true, trigger: 'blur', message: "请输入原密码" },
                    { min: 15, max: 30, message: '密码长度 15 到 30 个字符', trigger: 'blur' }
                ],
                newPassword: [
                    { validator: validatePass1, required: true, trigger: 'blur' },
                ],
                confirmPassword: [
                    { validator: validatePass2, required: true, trigger: 'blur' },
                ],
            },
            submitFlag:false,
            passwordText: '密码长度为15到30位，必须包含数字、1个大写字母、1个小写字母和1个特殊字符'
        }
    },
    mounted(){
    },
    methods: {
        submit() {
            this.$refs.form.validate(valid => {
                if (!valid){
                    this.$notify.error({title:"错误",message:"填写内容有误,请修改后点击提交"})
                    return false
                }
                let key = '286f1a3a733951db'
                let formData = JSON.parse(JSON.stringify(this.form))
                formData.oldPassword = AES.encrypt(this.form.oldPassword,key)
                formData.newPassword = AES.encrypt(this.form.newPassword,key)

                this.submitFlag=true
                this.$post("/user/update/password", formData).then(response => {
                    if (response.code == 200){
                        this.logout()
                        this.$notify.success({title:"成功",message:"密码修改成功,请重新登录"})
                    }else{
                        this.$notify.error({title:"错误",message:response.msg})
                    }
                    this.submitFlag=false
                }).catch(err => {
                    this.$notify.error({title:"错误",message:"操作失败,请联系管理员"})
                    this.submitFlag=false
                })
            })
        },
        logout(){
            sessionStorage.removeItem('token')
            this.$router.replace({name:'Login'})
        }
    }
}
</script>
<style scoped>
/* #ffb4b4 */
.up-pwd{ width:400px; border:1px solid #999; margin:auto; position: relative; margin-top: 8%; padding: 20px; border-radius: 10px;background-color: #fff !important}
.title1 {
    text-align: center;
    font-size: 30px;
}
</style>
