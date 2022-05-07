<template>
    <!--原生 这个方案是先解析excel为数组，然后上传给后端 -->
    <div>
        <input type="file" @change="importFile" id="imFile" style="display:none"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
        <el-button type="primary" @click="importExcel()" size="small">{{uploadText}}</el-button>
    </div>
</template>

<script>
import XLSX from 'xlsx' 
export default {
    props:{
        uploadText: {
            type: String,
            require: true,
            default: '导入'
        },
        api: {
            type: String,
            require: true,
            default: '/'
        }
    },
    data(){
        return {
            importData:'',
            wb:''
        }
    },
    methods:{
        importExcel(){
            document.getElementById('imFile').click()
        },
        importFile: function(e) {
            let obj = e.target
            if(e.target.files.length==0) {
                console.log("没有获取到导入内容")
                return
            }
            var f = obj.files[0]
            var reader = new FileReader()
            reader.readAsBinaryString(f)
            reader.onload = (e) => {
                var data = e.target.result //获取上传的文件数据
                this.wb = XLSX.read(data, {
                    type: 'binary'
                })
                this.importData = XLSX.utils.sheet_to_json(this.wb.Sheets[this.wb.SheetNames[0]])
                //至此已完成对上传excel的内容解析 然后可以直接把这个对象数组传给后端
                console.log("this.importData is:",this.importData)
                // this.uploadExcelData()
            }
        },
        uploadExcelData(data){
            this.imFile.value = ''
            this.$post(this.api,data).then(
                res => {
                    if(res.code == 'success'){
                        this.$notify({title: '成功', message: '导入成功!', type: 'success'})
                        this.queryData()
                        this.fullscreenLoading = false
                    }else(
                        this.$alert(res.message, '导入失败', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.fullscreenLoading = false
                                this.queryData()
                            }
                        })
                    )
                }
            ).catch(err => {
                console.log("err is:",err)
                this.$notify.error({ title: '错误', message: '抱歉，导入失败!'})
                this.fullscreenLoading = false
            })
        }
    }
}
</script>