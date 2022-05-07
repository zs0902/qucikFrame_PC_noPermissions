
const dayTime = 24*60*60*1000

function toString(date){
    return (date.getFullYear()+"-" + (date.getMonth()+1) + "-" + date.getDate())
}

export default{

    /* 
     *获取今天的规范化的日期
    */
    getToday:function(){
        var date = new Date()
        return toString(date)
    },
    
    /* 
     *获取过去的规范化的日期
     *@cout 是往过去多少天
    */
    getDayBefore:function(count){
        var date = new Date()
        date.setTime(date.getTime()-dayTime*count)
        return toString(date)
    },
    /* 
     *获取未来的规范化的日期
     *@cout 是往前多少天
    */
    getDayAfter:function(count){
        var date = new Date()
        date.setTime(date.getTime()+dayTime*count)
        return toString(date)
    },
    /* 
     *获取过去的规范化的月份
    */
    getMonthBefore:function(count){
        var date = new Date()
        date.setMonth(date.getMonth() - count)
        return date
    },

    /*
    *自定义日期格式
    */
    dateCovert:function(fmt, date, UTC) {
    if (!fmt){
      fmt = fmt || "yyyy-MM-dd HH:mm:ss";
    }
    if (date && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
        date = date.toString().replace(/-/g, "/")
    }
    if (date)
        date = new Date(Date.parse(date))
    else
        date = new Date()
    
    let o = {
        "M+": (UTC ? date.getUTCMonth() : date.getMonth()) + 1,
        "d+": UTC ? date.getUTCDate() : date.getDate(),
        "H+": UTC ? date.getUTCHours() : date.getHours(),
        "m+": UTC ? date.getUTCMinutes() : date.getMinutes(),
        "s+": UTC ? date.getUTCSeconds() : date.getSeconds(),
        "q+": Math.floor(((UTC ? date.getUTCMonth() : date.getMonth()) + 3) / 3), /*季度*/
        "S": UTC ? date.getUTCMilliseconds() : date.getMilliseconds(),
        "W": ["日", "一", "二", "三", "四", "五", "六"][date.getDay()]
    };
    if (/(y+)/.test(fmt)) 
        fmt = fmt.replace(RegExp.$1, ((UTC ? date.getUTCFullYear() : date.getFullYear()) + "").substr(4 - RegExp.$1.length));
    
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return fmt
    }
}