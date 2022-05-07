<template>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="handleClose" :width="this.formOptions.colNum*300+150+'px'">
        <DynamicForm ref="dynamicForm" :formOptions="formOptions"></DynamicForm>
    </el-dialog>
</template>
<script>
export default {
    props: {
        initData: {}
    },
    data() {
        return {
            dialogFormVisible: false,
            title: '',
            api: '',
            formOptions: {
                formName: 'form',
                colNum: 1, // 每行多少列
                formModel: {
                    roleId: null,
                    platType: '',
                    name: '',
                    remark: '',
                    delFlag: '',
                },
                formItems: {
                    platType: {type: 'radio', label: '平台类型', optionList: [...this.EnumUtility.Get('PLAT_TYPE').filter(item => item.value!=1)], index: 'value', text: 'label', show: () => this.title=='角色添加'},
                    name: { type: 'input', label: '角色名称'},
                    remark: {type: 'input', label: '角色说明'},
                    delFlag: {type: 'select', label: '角色状态', optionList: [{index: 0, text: '启用'}, {index: 1, text: '禁用'}]},
                },
                rules: {
                    platType: [{ message: "请选择角色类型", required: true, trigger: 'change' }],
                    name: [{ message: "请输入角色名称", required: true, trigger: 'blur'}], 
                    remark: [{ message: "请输入角色说明", required: true, trigger: 'blur'}],
                    delFlag: [{ message: "请选择角色状态", required: true, trigger: 'change'}]
                },
                btnList: [
                    {type: 'primary', onClick: (form, formModel) => {this.submit(form, formModel)}, text: '确定', loading: false},
                    {type: '', onClick: (form, formModel) => {this.handleClose(form, formModel)}, text: '取消'},
                ],
                labelWidth: '100px',
            }
        }
    },
    watch: {
        dialogFormVisible(val){
            if(val){
                this.$nextTick(() => {
                    this.formOptions.btnList[0].loading = false // 复位提交按钮
                    this.$refs.dynamicForm.$refs[this.formOptions.formName].resetFields() // 复位清空可能存在的校验
                    this.initForm()
                })
            }
        },
    },
    methods: {
        initForm() {
            if(this.initData.$type == 'edit') {
                // 进入此分支，说明是编辑弹框
                this.title = '角色编辑'
                this.api = '/role/save'
                // 以下delete 是特定操作
                // delete this.formOptions.formModel.platType
                // delete this.formOptions.formItems.platType
                // delete this.formOptions.rules.platType

                // this.formOptions.formModel.roleId = this.initData.roleId
                Object.keys(this.formOptions.formModel).forEach(item => {
                    this.formOptions.formModel[item] = this.initData[item]
                }) 
            }else {
                this.api = '/role/save'
                this.title = '角色添加'
            }
        },
        handleClose(form, formModel) {
            this.dialogFormVisible = false
        },
        submit(form, formModel){
            let submitData = {}
            submitData = JSON.parse(JSON.stringify(formModel))
            form.validate(valid => {
                if (!valid){
                    this.$notify.error({title:"错误",message:"填写内容有误,请修改后点击提交"})
                    return false
                }
                this.formOptions.btnList[0].loading = true
                
                this.$post(this.api, submitData).then(res => {
                    this.formOptions.btnList[0].loading = false
                    if (res.result.code != 'success'){
                        this.$notify.error({title:"错误",message: res.result.code || res.result.message || '系统异常'});
                        return false;
                    }
                    this.$notify.success({title:"成功",message:"操作成功"});
                    
                    this.handleClose()
                    this.$emit("refresh");
                }).catch(err => {
                    this.formOptions.btnList[0].loading = false
                    this.$notify.error({title:"错误",message:"操作失败,请联系管理员"})
                })
            })
        },
    }
}
</script>