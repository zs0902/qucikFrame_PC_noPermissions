// 为了防止打包过后入口文件过大，这里只配置需要全局注册的组件
const ctx = require.context('@/components/Global', true, /.vue$/)

export default {
    install(vue) {
        // console.log('批量注册全局组件:', ctx.keys())
        ctx.keys().forEach(path => {
            let component = ctx(path).default
            
            if(component.name){
                // console.log('全局组件名称:', component.name)
                vue.component(component.name, component)
            }
        })
    }
}