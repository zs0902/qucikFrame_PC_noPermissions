import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);


const routes = [
    { path: "*", redirect: {name: '样例测试'}},
    {
        path: "/login",
        name: "Login",
        component: () => import("@/views/Frame/login"),
    },
    {
        path: "/",
        name: 'Frame',
        component: () => import(/*webpackChunkName: 'Frame'*/"@/views/Frame/frame"),
        children: [ // 系统管理
            { path: "sys/menu", name: "Sysmenu", component: () => import(/*webpackChunkName: 'Sysmenu'*/"@/views/SysMag/menu"),meta: { title: "菜单管理" } },
            { path: "sys/dict", name: "sysDict", component: () => import(/*webpackChunkName: 'sysDict'*/"@/views/SysMag/dict"), meta: { title: "枚举管理" }},
            { path: "role/info", name: "roleInfo", component: () => import(/*webpackChunkName: 'roleInfo'*/"@/views/Platform/role"), meta: { title: "角色管理" }},
            { path: "updatepwd", name: "updatepwd", component: () => import(/*webpackChunkName: 'updatepwd'*/"@/views/Frame/update_pwd"),meta: { title: "修改密码" } },
            // demo
            { path: "demo", name: "样例测试", component: () => import(/*webpackChunkName: '样例测试'*/"@/views/Test/common_table"),meta: { title: "样例测试" } },
        ],
    },
];

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push;
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};

//获取原型对象上的replace函数
const originalReplace = VueRouter.prototype.replace;
//修改原型对象中的push方法
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch((err) => err);
};

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});
// 获取跳转页面前地址
router.beforeEach((to, from, next) => {
    sessionStorage.setItem('fromPath',from.path)
    next()
})
export default router;
