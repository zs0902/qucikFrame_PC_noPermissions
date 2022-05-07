import axios1 from 'axios';

const exportExcel = function (content = {}) {
    let url = content.url||'api/role/exportExcelRoleInfo',
    token = localStorage.getItem('token')
    axios1.get(url,{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token':token
        },
        responseType: 'blob'
    }).then(res => {
        if(!res)
            return
        let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf8'})
        var downloadElement = document.createElement('a')
        var href = window.URL.createObjectURL(blob) //创建下载链接
        downloadElement.href = href
        downloadElement.download = '数据.xlsx' //导出文件的文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() //点击下载
        downloadElement.removeChild(downloadElement) //下载完成移除元素
        window.URL.revokeObjectURL(href) //释放blob对象
    }).catch(err => {
        console.log(err)
    })
}

/**
 * 下载图片等二进制流返回数据也差不多
 */
// this.$post('/merContractInfo/download',{contractId:item.contractId},{responseType: 'arraybuffer'}).then(res=>{
                
//     let blob = new Blob([res.data])
//     var downloadElement = document.createElement('a')
//     var href = window.URL.createObjectURL(blob) //创建下载链接
//     downloadElement.href = href
//     // debugger
//     downloadElement.download = res.headers['content-disposition'].split('filename=')[1] //导出文件的文件名
//     document.body.appendChild(downloadElement)
//     downloadElement.click() //点击下载
//     document.body.removeChild(downloadElement) //下载完成移除元素
//     window.URL.revokeObjectURL(href) //释放blob对象
// })

export default exportExcel