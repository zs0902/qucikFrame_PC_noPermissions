import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 引入elementui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 引入公共css
import "@/assets/css/com.css"
import "@/assets/css/elementui.css"
// import "@/assets/font/font.css"
import "@/assets/css/init.css"

// 引入cookie插件
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

// 注入全局组件
import GlobalComponents from '@/utility/globalRegister/globalComponents'
Vue.use(GlobalComponents)

// 注入全局指令
import GlobalDirective from '@/utility/globalRegister/globalDirective'
Vue.use(GlobalDirective)

// 注入全局过滤器
import GlobalFilter from '@/utility/globalRegister/globalFilter'
Vue.use(GlobalFilter)

// 引入自定义js 
import "@/utility/init.js"
import Validate from "@/utility/validate/validate"
import {get,post} from '@/utility/http/http'
import EnumUtility from './utility/enum'
import DateUtility from "@/utility/date/date"
import dataget from "@/utility/date/dateget"
import GetColorByStatus from "@/utility/colorForStatus.js"
Vue.prototype.$get = get //全局变量声明，使用方法 this.$get
Vue.prototype.$post = post
Vue.prototype.EnumUtility = new EnumUtility()
Vue.prototype.dateUtility = new DateUtility()
Vue.prototype.$validate = new Validate()
Vue.prototype.$dataGet = dataget
Vue.config.productionTip = false;
Vue.prototype.$getColorByStatus = GetColorByStatus

// 事件总线---用于各种类型组件之间的通信(通过---$emit/$on 来实现类似于订阅发布模式的实时通信)
Vue.prototype.$busCommunication = new Vue()

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
