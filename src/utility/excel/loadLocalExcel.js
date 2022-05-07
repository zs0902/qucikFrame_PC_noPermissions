import XLSX from 'xlsx'

/**
 * 读取项目目录中的excel文件
 * @params 参数 url --- 目标文件相对路径
 * @eg this.$queryExcel('/static/template/订单信息表 (2).xls').then( res => { console.log("res is:",res) })
 */
export default function queryExcelFile(url){
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest()
        let temp = []
        xhr.open('get', url, true) //第三个参数规定是否进行异步处理 true 是
        xhr.responseType = 'arraybuffer' //这个配置是请求二进制数据
        xhr.onload = function (e) {
            if (xhr.status === 200) {
                console.log("获取文件成功", xhr)
                var data = new Uint8Array(xhr.response) //解析对应的二进制数据
                var workbook = XLSX.read(data, {type: 'array'})  
                Object.values(workbook.Sheets).map(sheet=>{ //Object.values() 方法将对象可枚举值转为数组
                    temp = XLSX.utils.sheet_to_json(sheet) // 转换得到按行的数组
                    resolve(temp)
                })
            }else{
                console.log("XMLHttpRequest 出错啦")
                reject()
            }
        }
        xhr.send()
    })
    
}