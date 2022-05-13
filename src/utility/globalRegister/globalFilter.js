import filter from '@/filter/global.js'

export default {
    install(vue) {
        vue.filter('valuefilter',function(value,valuePipe){
            return filter.valuefilter(value,valuePipe)
        })
    }
}