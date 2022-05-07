<template>
  <el-dialog title="枚举添加" :visible.sync="dialogFormVisible" width="30%" :close-on-click-modal="false" :before-close="clearForm">
    
    <el-form :model="editForm" name="editForm" :rules="rules" ref="editForm">
      <el-form-item label="子菜单名称" prop="name" label-width="125px">
        <el-input v-model="editForm.name" size="small" style="width:75%" placeholder="请输入子菜单名称"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="clearForm">取 消</el-button>
      <el-button type="primary" @click="submit('editForm')">确 定</el-button>
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
      editForm:{
        name:'',
        url:'',

      },
      
      rules:{
        name:[
          { message: "请输入角色名称", required: true, trigger: 'blur'}
        ],
        url:[
          { message: "请输入角色备注", required: false, trigger: 'blur'}
        ],
      },

      dialogFormVisible:false,

    }
  },
  watch:{
    dialogFormVisible(val){
      if(val) {
        this.editForm.parentId = this.template.menuId
      }
    }
  },
  methods:{
    submit(data){
      this.$refs[data].validate((valid) => {
        if (valid) {
          this.$post('/menu/save', this.editForm).then(response => {
            if(response.result.code == 'success'){
              Notification.success("操作成功！")
              this.clearForm()
              this.$emit('refresh')
            }else{
              this.$alert("操作失败！"+response.result.message, '警告', {
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
      this.$refs['editForm'].resetFields()
      this.$refs['editForm'].clearValidate();
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



