import filter from '@/filter/global.js'

export default {
    install(vue) {
        // console.log('批量注册全局指令:', global)
        Object.keys(global).forEach(item => {
            vue.filter('valuefilter',function(value,valuePipe){
                return filter.valuefilter(value,valuePipe)
            })
        })
    }
}