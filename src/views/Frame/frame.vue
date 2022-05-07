<template>
  <div class="whole-container">
    <template v-if="!showData.pageLoading">
      <!-- 左边菜单栏 移动端 -->
      <el-drawer v-if="showData.deviceType=='Mobile'" class="drawer_self" title="我是标题" :visible.sync="showData.drawerShow" direction="ltr" size="60%" :with-header="false">
        <!-- logo -->
        <div class="logo" style="text-align: center">
          <img src='@/assets/images/logo.png' />
          <span v-if='!showData.isCollapseMenu'>运营后台</span>
        </div>
        <!-- 菜单 -->
        <el-menu class="el-menu-vertical-demo" :collapse-transition='false' ref="mainMenu" :router="true" :default-active="$route.path" :unique-opened="true" :collapse="showData.isCollapseMenu">
          <template v-for="menu1 in showData.navMenus">
            <el-submenu v-for="menu2 in menu1.items" :key="menu2.title" :index="menu2.title">
              <template slot="title">
                <i :class="[menu2.icon]"></i>
                <span slot="title" class="menu_name">{{menu2.title}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="menu3 in menu2.items" :key="menu3.path" :index="menu3.path" class="menu_name">
                  {{menu3.title}}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </template>
        </el-menu>
      </el-drawer>

      <!-- 左边菜单栏 pc端 -->
      <div :class="['aside', ]" :style="{width: showData.isCollapseMenu?'auto':''}" v-if="showData.deviceType=='Pc'">
        <!-- logo -->
        <div class="logo">
          <img src='@/assets/images/logo.png' />
          <span v-if='!showData.isCollapseMenu'>运营后台</span>
        </div>
        <!-- 菜单 -->
        <el-menu class="el-menu-vertical-demo menu_self" 
          :collapse-transition='false' 
          ref="mainMenu" 
          :router="true" 
          :default-active="$route.path" 
          :unique-opened="true" 
          :collapse="showData.isCollapseMenu">
          <template v-for="menu1 in showData.navMenus">
            <el-submenu v-for="menu2 in menu1.items" :key="menu2.title" :index="menu2.title">
              <template slot="title">
                <img :src="require('../../assets/images/'+(menu2.icon||'menu_seticon.png'))" alt=''  class='title_icon_local'/>
                <span slot="title" class="menu_name">{{menu2.title}}</span>
              </template>
              <el-menu-item-group>
                <!-- <template slot="title">{{menu2.title}}</template> -->
                <el-menu-item v-for="menu3 in menu2.items" :key="menu3.path" :index="menu3.path" class="menu_name" style="padding-left: 54px">
                  {{menu3.title}}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </template>
        </el-menu>

      </div>

      <div :class="['right-content', showData.isCollapseMenu?'width-60':'width-200']">
        <!-- 上边操作栏 -->
        <div class="aheader">
          <div style="position: relative; width: 100%; height: 100%">
            <!-- 操作按钮 左边部分 -->
            <div class="l_options" v-if="showData.deviceType=='Pc'">
              <i class="el-icon-s-fold" v-if="!showData.isCollapseMenu" @click="showData.isCollapseMenu=true"></i>
              <i class="el-icon-s-unfold" v-if="showData.isCollapseMenu" @click="showData.isCollapseMenu=false"></i>
              <i class="el-icon-refresh-right" style="font-weight: 600" @click="refreshRouter"></i>
            </div>

            <div class="l_options" v-if="showData.deviceType=='Mobile'">
              <i class="el-icon-s-unfold" v-if="!showData.isCollapseMenu" @click="showData.drawerShow=true"></i>
              <i class="el-icon-refresh-right" style="font-weight: 600" @click="refreshRouter"></i>
              <i class="el-icon-search" style="font-weight: 600" @click="filterQuerys"></i>
            </div>

            <!-- 管理平台名称 -->
            <div class="admin-name" v-if="showData.deviceType=='Pc'">
              {{objTitle}}
            </div>

            <!-- 操作按钮 右边部分 -->
            <div class="r_options">
              <!-- 通知信息 -->
              <div class='notice' @click='jumpPage("noticeInfo")'>
                <el-badge :value="noticeNum" :max='99' v-if='noticeNum>0'>
                  <i class='el-icon-bell'></i>
                </el-badge>
                <i class='el-icon-bell' v-else></i>
              </div>
              <!-- 用户信息 -->
              <div class="headImg">
                <img :src="showData.headImg" alt="">

                <!-- 用户信息及设置 -->
                <div class="userSet">
                  <div class="name">
                    <i class="el-icon-user" style="color: #7266ba"></i>
                    <span style="font-size:13px">{{user.username}}</span>
                  </div>
                  <!-- <div class="updatePassword" @click="jumpPage("updatepwd")">
                    <i class="el-icon-setting" style="color: #27c24c"></i>
                    <span>修改密码</span>
                  </div> -->
                  <div class="logoOut" @click="loginOut">
                    <i class="el-icon-switch-button" style="color: #f05050"></i>
                    <span style="font-size:13px">退出</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右边内容展示 -->
        <div class="acontent">
          <!-- 顶部选项卡等常规内容 -->
          <div class="content-head">
            <el-tabs type="card" v-if="showData.deviceType=='Pc'" v-model="showData.activeTab" @tab-remove="removeTab" @tab-click="handleClick" closable style="margin:5px 5px 0px 5px">
              <el-tab-pane v-for="(item,index) in pageTabs" :key="index+item.path" :label="item.title" :name="item.path"></el-tab-pane>
            </el-tabs>
          </div>

          <keep-alive v-if="showData.isRouterAlive" :exclude="excludeList">
            <router-view :deviceType='showData.deviceType' ref="son" ></router-view>
          </keep-alive>
        </div>

        <!-- 底部公司或版本信息等 -->
        <!-- <div class="info-box">娃哈哈</div> -->
      </div>
    </template>

    <!-- loading 效果 -->
    <Loading v-if="showData.pageLoading"></Loading>
  </div>
</template>

<script>
import Loading from "@/components/Loading/index.vue";
export default {
  name: "Home",

  components: {
    Loading,
  },

  data() {
    return {
      keepAliveList: ['GoodsList', 'AuditList'],
      excludeList: [''],
      showData: {
        // 页面展示信息
        deviceType: "Pc", // 设备类型
        drawerShow: false, // 在移动端显示样式
        logoImg: require("@/assets/images/logo.png"),
        headImg: require("@/assets/images/head.png"),
        isCollapseMenu: false, // 展开还是收起菜单
        navMenus: [], // 权限菜单
        activeTab: "", // 当前激活的tab标签
        isRouterAlive: true, // 页面内容刷新标志
        pageLoading: true, //项目加载效果
      },
      pageTabs: [], // tab标签数组
      user: {}, // 存放用户信息

      noticeNum:0, // 状态栏 系统提示信息数量
      objTitle:'', // 项目标题
    };
  },

  watch: {
    "$route.path": {
      handler(val, oldVal) {
        if(val!='/')
        this.appendTab()
      },
      immediate: true
    },
  },

  mounted() {
    // 是否从登录页面重定向回来
    if (this.$route.query.guid) this.login();
    else this.queryAllEnum();

    // 判断设备类型
    this.showData.deviceType = this.$validate.deviceTypeCheck();
    window.onresize = () => {
      this.showData.deviceType = this.$validate.deviceTypeCheck();
    };

    // 根据域名动态配置项目标题
    let _origin = location.origin
    if(_origin.includes('https://scm.18qy.cn') || _origin.includes('http://scm.admin.100bm.cn')){
      this.objTitle = '运营管理后台-千行供应链'
      this.showData.headImg = require('@/assets/images/user.jpg')
    }else{
      this.objTitle = '运营管理后台-三丰一品供应链'
      this.headImg = require('@/assets/images/head.png')
    }
  },

  methods: {
    login() {
      let tokenValue = this.$route.query.cookiekey || this.$route.query.guid
      this.$post("/member/login", { token: tokenValue }).then((response) => {
        if (response.result.code != "success") {
          this.$notify.error({
            title: "错误",
            message: response.result.message,
          });
          return false;
        }
      }).then(() => {
        this.queryAllEnum()
      })
    },
    queryAllEnum() {
      this.$post("dict/findPage", { pageNum: 1, pageSize: 9999 }).then((response) => {
        if (response.result.code != "success") return false;
        this.EnumUtility.Set(response.data.list);
      }).then(() => {
        this.queryUserInfo()
      })
    },
    queryUserInfo() {
      this.$get("/member/get/user/info", {}).then((response) => {
        if (response.result.code != "success") return false;
        this.user.username =
          response.data.userName || sessionStorage.getItem("user");
        sessionStorage.setItem("userId", response.data.roleId);
      }).then((res) => {
        this.getMenu()
      }).catch(err => {
        console.log('errr is:', err)
      })
    },
    getMenu() {
      this.$get("/member/get/menu", {
        username: this.user.username,
        platType: "1",
      }).then((response) => {
        if (response.result.code != "success") {
          this.$notify.error({ title: "错误", message: response.result.message });
          return false;
        }

        // 这下面的处理根据不同平台菜单接口返回数据结构，进行对应调整
        this.showData.navMenus = response.data.menuList.filter((menu) => menu.items && menu.items.length > 0) // 这个是接口返回数据已经构造好了层级，所以直接取出赋值使用即可

        if (this.$route.path == "/") {
          // 没有目标页面的情况下，默认进入返回菜单的第一项
          this.showData.activeTab = this.showData.navMenus[0].items[0].items[0].path; 
          this.$router.push(this.showData.activeTab)
        } else {
          // 有目标页直接进入对应目标页面
          this.showData.activeTab = this.$route.fullPath;
        }

        this.showData.pageLoading = false; // 取出加载效果，进入页面
      }).catch((err) => {
        console.error("获取菜单失败,error:", err);
      });
    },
    
    appendTab() {
      let tab = { 
        title: (this.$route.meta.title && this.$route.meta.title.includes('详情'))?this.$route.fullPath.split('=')[1]:this.$route.meta.title, 
        path: this.$route.fullPath 
      };
      let isNewTab = true;
      this.pageTabs.forEach(function (item) {
        if (item.path == tab.path) {
          isNewTab = false;
          return;
        }
      });
      // console.log('kkkkk:', isNewTab,this.showData.activeTab, tab)
      if (isNewTab) this.pageTabs.push(tab);
      this.showData.activeTab = tab.path;
    },
    removeTab(targetName) {
      if (this.pageTabs.length == 1) {
        this.$notify.warning({
          title: "警告",
          message: "不允许关闭全部选项卡",
        });
        return false;
      }

      this.pageTabs.forEach( (item, index) => {
        if (item.path == targetName) {
          this.pageTabs.splice(index, 1);
          
          if (this.$route.fullPath == targetName) {
            let nextTab = this.pageTabs[this.pageTabs.length-1];
            // 判断当前列表内是否存在上个路由页面
            let path = sessionStorage.getItem('fromPath')
            let result = this.pageTabs.filter(tabs=>{return  tabs.path == path})
            if(result.length>0){
              this.$router.push(result[0].path)
            }
            else{
              if (nextTab) this.$router.push(nextTab.path)
              this.showData.activeTab = nextTab.path;
            }
            
          }
        }
      });
    },
    handleClick(tab) {
      console.log('handleClick', )
      let _tab = this.pageTabs.filter(item => item.path==tab.name)
      this.$router.push(_tab[0].path)
    },

    filterQuerys() {
      console.log("移动端条件筛选");
      this.$refs.son.$refs.query.drawerShow = true;
    },

    refreshRouter() {
      console.log("刷新页面");
      this.showData.isRouterAlive = false;
      this.$nextTick(() => {
        this.showData.isRouterAlive = true;
      });
    },
    
    loginOut() {
      var date = new Date();
      date.setSeconds(date.getSeconds() + -1);
      // document.cookie="SID=; expires="+date.toGMTString()
      this.$post("/member/logout", "").then((response) => {
        if (response.result.code != "success") {
          this.$notify.error({ title: "错误", message: response.message });
          return false;
        }
        window.location.href =
          process.env.VUE_APP_LOGIN_HOME_URL +
          "/Member/LoginOn?redirectUrl=" +
          encodeURI(window.location.origin);
      });
    },

    // 页面跳转相关的统一用给这个方法
    jumpPage(name, query) {
      this.$router.push({name, query})
    }
  },
};
</script>

<style lang="less" scoped>
// 框架样式

// 最外层容器样式
.whole-container {
  width: 100vw;
  height: 100vh;
  background-color: #f0f2f5;
  overflow: hidden;
  display: flex;
}

// 左侧侧边栏容器样式
.aside {
  width: 200px;
  height: 100%;
  background: linear-gradient(360deg, #0F1630 0%, #1B2657 100%);

  // 侧边栏底部logo样式
  .logo {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color:#fff;
    padding-right: 10px;
    box-sizing: border-box;
    img{
      width: 30px;
    }
    span{
      box-sizing: border-box;
      padding-top: 5px;
    }
  }
}

// 右侧最外层容器样式
.right-content {
  position: relative;
  display: flex;
  width: calc(100vw - 200px);
  flex-direction: column;

  // 顶部状态栏容器样式
  .aheader {
    height: 50px;
    width: 100%;
    position: absolute;
    top: 0;
    right: 0;
    background-color: #fff;
    box-shadow: 15px -7px 10px;
    z-index: 99;
    
    .l_options {
      display: inline-block;
      width: auto;
      height: 100%;
      position: absolute;
      left: 0;

      i {
        height: 100%;
        width: 45px;
        vertical-align: middle;
        line-height: 50px;
        text-align: center;
        font-size: 23px;
      }

      i:hover {
        cursor: pointer;
        background-color: #f0f2f5;
      }
    }

    .admin-name {
      text-align: center;
      line-height: 50px;
      font-size: 22px;
      letter-spacing: 5px;
      font-weight: 600;
    }

    .r_options {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 100%;

      .headImg {
        width: 80px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        img {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          cursor: pointer;
        }

        .userSet {
          position: absolute;
          left: 0px;
          top: 50px;
          z-index: 99;
          display: none;
          width: 150px;
          height: auto;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0px 0px 10px #cac8c8;
          overflow: hidden;

          div {
            width: 100%;
            height: 35px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-weight: 500;

            i {
              width: 40px;
              text-align: center;
            }
          }

          div:hover {
            background-color: #e6f0ff;
            cursor: pointer;
          }
        }
      }

      .headImg:hover .userSet {
        display: block;
      }
    }
  }

  // 真正内容展示区域的容器样式
  .acontent {
    width: 100%;
    height: calc(100vh - 50px);
    float: left;
    background-color: #f0f2f5;
    margin-top: 50px;
    display: flex;
    flex-direction: column;

    .content-head {
      background-color: #fff;
      // overflow: hidden;
    }
  }

  // 底部公司软件版本等信息
  .info-box {
    text-align: center;
    color: #1a79ff;
  }
}


// 其它通用设置

// 用于动态配置右侧内容区域宽度
// 菜单未收起
.width-200 {
  width: calc(100vw - 200px);
}

// 菜单收起
.width-60 {
  width: calc(100vw - 60px)
}

// 手机端时，不再直接显示菜单，全屏显示表单
@media screen and (max-width: 1024px) {
  .right-content {
    width: 100%;
  }
}

// 菜单图标样式
.title_icon_local{
  width: 20px;
  padding-right: 12px;
}

// 提示图标样式
.notice{
  float: left;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 100%;
  i{
    font-size: 20px;
  }
}
</style>
