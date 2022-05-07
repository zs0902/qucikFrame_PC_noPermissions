<template>
  <div class="continer">
        <div class="login-content">
            <div class="login-title-new">{{title}}</div> 
            <div class="account">
                <input type="text" placeholder="请输入账号" v-model="query.name" />    
            </div>
            <div class="account">
                <input type="password" placeholder="请输入密码" v-model="query.password" @keydown="enterLogin" />
            </div>
            <div class='code-box'>
                <div class="account" style="flexl:1;margin-bottom:0;margin-right:15px">
                    <input type="text" placeholder="请输入验证码" v-model="query.captcha" maxlength="8" />
                </div>
                <img :src="imgUrl" title="点击更换验证码" @click="refreshCode" />
            </div>
            <div class="login-btn1" @click="submit" >立即登录</div>
        </div>
    </div>
</template>
<script>
import AES from "../../utility/aes.js";
export default {
  data() {
    return {
      mobileClient: false,
      query: {
        name: "",
        password: "",
        captcha: "",
        verifyToken: "",
        platType: 1
      },
      imgUrl: "", //'/api/captcha.jpg'
      keyupFlag:false,
      title:'',
    };
  },
  mounted() {
    if (document.body.clientWidth < 768){
        this.mobileClient = true
    }
    let _origin = location.origin
    if(_origin.includes('https://scm.18qy.cn')||_origin.includes('http://scm.admin.100bm.cn')){
      this.title = '运营管理后台-千行供应链'
    }else{
      this.title = '运营管理后台-三丰一品供应链'
    }
    this.refreshCode()
    this.keyupFlag = true
    this.setkey()
    var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
  },
  beforeDestroy(){
      this.keyupFlag = false
  },
  
  methods: {
    setkey(){
        document.onkeydown=(event)=>{
            var key = window.event.keyCode;
            if (key == 13 && this.keyupFlag){
                this.submit()
            }
        }
    },
    submit() {
      console.log(AES.encrypt('12345aB@12345aB@12345aB@','286f1a3a733951db')) 
      // // 
      var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{15,30}/
      if (!this.query.name) {
        this.$notify.error({ title: "错误", message: "请输入用户名" });
        return false;
      }
      if (!this.query.password) {
        this.$notify.error({ title: "错误", message: "请输入密码" });
        return false;
      }
      let key = '286f1a3a733951db'
      console.log("zzzz:",this.query.password)
      let loginData = JSON.parse(JSON.stringify(this.query))
    //   loginData.password = AES.encrypt(this.query.password,key)

      this.$post("/login", loginData)
        .then((res) => {
          if (res.code == "200") {
            sessionStorage.setItem("token", res.data.token)
            this.$router.push({ name: "Frame" });
          } else {
            this.$notify.error({ title: "错误", message: res.msg });
            this.refreshCode();
          }
        }).catch((err) => {
          console.log("login err is:", err);
          this.$notify.error({
            title: "错误",
            message: "登录失败,请联系管理员",
          });
        });
    },
    enterLogin() {
      var event = window.event || arguments.callee.caller.arguments[0];
      if (event.keyCode == 13) {
        this.submit();
      }
    },
    refreshCode() {
      this.$get("/getBase64Captcha").then((res) => {
        if (res.code == 200) {
          this.imgUrl = res.data.image;
          this.query.verifyToken = res.data.verifyToken;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.continer {
    position: relative;
    width: 100%;
    height: 100%;
    background: transparent url('../../assets/images/loginBg.png') no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
}

.login-content {
    position: absolute;
    top: 27%;
    right: 22%;
    height: 50%;
}
.login-title-new{
    color:#04394E;
    font-size: 36px;
    font-weight: bold;
    text-align: center;
    margin-bottom:27px;
}
.login-btn1 {
   width: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
   background: linear-gradient(90deg, #68ACFF, #0260FF);
   border-radius: 25px;
   height: 50px;
   color:#fff;
   font-size: 16px;
   margin-top: 40px;
   cursor: pointer;
}
.code-box{
    display: flex;
    align-items: center;
    overflow: hidden;
    width:100%;
}
.account{
    
    height: 50px;
    border: 1px solid #A7A7A7;
    border-radius: 25px;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    padding: 0 23px;
    margin-bottom:25px;
    background-color: #fff;
}
.account>input{
    width: 100%;
    height:100%;
    border:none;
    outline: none;
    background-color: transparent !important;
}
</style>