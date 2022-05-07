<template>
    <div>
        <!-- 这里是先在前端解析 -->
        <!-- <el-upload style="display: inline" action="" :show-file-list="false" :on-change="uploadExcel_change">
            <el-button size="small" type="primary">导入excel</el-button>
        </el-upload> -->
        
        <!-- 这里是直接上传 然后获取上传成功过后的文件地址 -->
        <el-upload style="display: inline" action="" :show-file-list="false" :http-request="uploadExcel_repuest" >
            <el-button icon="el-icon-upload" size="small" type="primary" v-loading.fullscreen.lock="fullscreenLoading">{{uploadText}}</el-button>
        </el-upload>
        <div>{{fileName}}</div>

        <span v-show="false">{{filePath}}</span>
    </div>
</template>

<script>
// import XLSX from 'xlsx'
export default {
    name: 'UploadFile',
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
        },
        value: {}
    },
    data(){
        return {
            importData: '',
            wb: '',
            fullscreenLoading: false,
            fileName: ''
        }
    },
    computed: {
        // 图片数组数据
        filePath: {
            get () {
                console.log('get ---',this.value)
                return this.value
            },
            set (val) {
                console.log("执行了set方法",val)
                // 同步v-model
                this.$emit('input', val)
            }
        },
    },
    methods: {
        // 直接上传需要formData形式
        uploadExcel_repuest(content){
            let url = this.api+"?name="+content.file.name;////
            let formdata = new FormData();
            formdata.append('file',content.file);
            this.fullscreenLoading = true;
            this.$post(url, formdata).then(response=>{
                console.log('上传成功:', response)
                 this.fullscreenLoading = false;
                 this.fileName = content.file.name
                this.filePath = response.data.location
            }).catch(error => {
                console.log('System_Error:'+ error)
                this.$alert("文件上传失败", '警告', {
                    confirmButtonText: '确定',
                    type: 'warning'
                })
            })
        },
        uploadExcel_change(content){
            var reader = new FileReader()
            let XLSX = require('xlsx') 
            reader.readAsBinaryString(content.raw)
            reader.onload = (e) => {
                let data = e.target.result //获取上传的文件内容
                this.wb = XLSX.read(data, {
                    type: 'binary'
                })
                this.importData = XLSX.utils.sheet_to_json(this.wb.Sheets[this.wb.SheetNames[0]])
                console.log("解析到的excel数据为:",this.importData)
                this.$emit('getData',this.importData)
            }
        }
    }
}
</script>