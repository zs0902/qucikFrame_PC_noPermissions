import global from '@/directive/global.js'

export default {
    install(vue) {
        // console.log('批量注册全局指令:', global)
        Object.keys(global).forEach(item => {
            vue.directive(item, global[item])
        })
    }
}