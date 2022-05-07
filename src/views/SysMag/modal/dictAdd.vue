<template>
  <el-dialog title="枚举添加" :visible.sync="dialogFormVisible"  width="500px"  :close-on-click-modal="false" :before-close="clearForm">
    <el-form :model="addForm" name="addForm" :rules="rules" ref="addForm">
      <el-form-item label="枚举名称" prop="label" label-width="125px">
        <el-input v-model="addForm.label" size="small" style="width:75%" placeholder="请输入枚举名称"></el-input>
      </el-form-item>
      <el-form-item label="枚举类型" prop="type" label-width="125px">
        <el-input v-model="addForm.type" size="small" style="width:75%" placeholder="请输入枚举类型"></el-input>
      </el-form-item>
      <el-form-item label="枚举值" prop="value" label-width="125px">
        <el-input v-model="addForm.value" size="small" style="width:75%" placeholder="请输入枚举值"></el-input>
      </el-form-item>
      <el-form-item label="枚举描述" prop="description" label-width="125px">
        <el-input v-model="addForm.description" size="small" style="width:75%" placeholder="请输入枚举描述"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="clearForm">取 消</el-button>
      <el-button type="primary" @click="submit('addForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Notification} from 'element-ui'

export default {
  props:{
    template:{}
  },
  data(){
    return{
      addForm:{
        label:'',
        type:'',
        value:'',
        description:'',
        sort:0,
      },
      
      rules:{
        label:[
          { message: "请输入枚举编号", required: true, trigger: 'blur'}
        ],
        type:[
          { message: "请输入枚举类型", required: true, trigger: 'blur'}
        ],
        value:[
          { message: "请输入枚举值", required: true, trigger: 'blur'}
        ],
        description:[
          { message: "请输入角色备注", required: true, trigger: 'blur'}
        ],
      },

      dialogFormVisible:false,

    }
  },
  watch:{
    dialogFormVisible(val){
      if(val) {
        
      }
    }
  },
  methods:{
    submit(data){
      this.$refs[data].validate((valid) => {
        if (valid) {
          this.$post('/dict/save', this.addForm).then(response => {
            if(response.result.code == 'success'){
              Notification.success("操作成功！")
              this.clearForm()
              this.$emit('refresh')
            }else{
              this.$alert("操作失败！"+ (response.result.msg || response.result.message), '警告', {
                confirmButtonText: '确定',
                type: 'warning'
              })
            }
          }).catch(err => {
            console.log("catch err:", err)
            this.$alert("系统繁忙！", '警告', {
              confirmButtonText: '确定',
              type: 'warning'
            })
          })    
        } else {
          Notification.warning("填写内容有误,请修改后点击提交")
          return false;
        }
      });
    },
    clearForm(){
      this.$refs['addForm'].resetFields()
      this.$refs['addForm'].clearValidate();
      this.dialogFormVisible = false
    }
  },
  
}
</script>

<style>
.test1{
    position:absolute;
    right:-15px;
    top:-12px;
    width:40px;
    height:24px;
    background:#13ce66;
    text-align:center;
    transform:rotate(45deg);
    box-shadow:0 0 1pc 1px rgba(0,0,0,.2)
}
</style>



