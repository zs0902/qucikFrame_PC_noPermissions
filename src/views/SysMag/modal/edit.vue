<template>
  <el-dialog title="节点编辑" :visible.sync="dialogFormVisible" width="30%" :close-on-click-modal="false">
    <el-form :model="editForm" :rules="rules" ref="editForm">
      <el-form-item label="节点名称" prop="name" label-width="125px">
        <el-input v-model="editForm.name" size="small" style="width:75%"></el-input>
      </el-form-item>
      <el-form-item v-if="editForm.parentId!==0" label="节点URL" prop="url" label-width="125px">
        <el-input v-model="editForm.url" size="small" style="width:75%"></el-input>
      </el-form-item>
      <el-form-item v-if="editForm.parentId==0" label="选中图标" prop="icon" label-width="125px">
        <el-input v-model="editForm.icon" size="small" style="width:75%"></el-input>
      </el-form-item>
      <el-form-item v-if="editForm.parentId==0" label="未选中图标" prop="" label-width="125px">
        <el-input v-model="editForm.unactiveIcon" size="small" style="width:75%"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit('editForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Notification} from 'element-ui'
// import appConfig from '../../../config/service.js'

export default {
  data(){
    return{
      editForm:{
        name:'',
        url:'',
        icon: '',
        unactiveIcon: '',
        menuId:'',
        parentId: ''
      },
      
      rules:{
        name:[
          { message: "请填写节点名称", required: true, trigger: 'blur'}
        ],
        url:[
          { message: "请填写节点URL", required: true, trigger: 'blur'}
        ],
        icon:[
          { message: "请填写图标", required: true, trigger: 'blur'}
        ]
      },

      dialogFormVisible:false

    }
  },
  methods:{
    submit(data){
      this.$refs[data].validate((valid) => {
        if (valid) {
          console.log("adadd:", this.editForm)
          this.$post('/menu/save', this.editForm).then(response => {
            if(response.result.code == 'success'){
              Notification.success("操作成功！")
              this.$store.state.authorityFlag += 1
              this.dialogFormVisible = false
              this.$emit('refresh')
            }else{
              this.$alert("操作失败！"+"原因："+response.result.message, '警告', {
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
    resetForm(template){
      this.editForm.name = template.name
      this.editForm.url = template.url
      this.editForm.menuId = template.menuId
      this.editForm.icon = template.icon
      this.editForm.unactiveIcon = template.unactiveIcon
      // this.editForm = Object.assign(template)
      this.rules.url[0].required = this.editForm.parentId!=0
      this.rules.icon[0].required = this.editForm.parentId==0
    }
  }
}
</script>


