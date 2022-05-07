<template>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="handleClose" :width="this.formOptions.colNum*350+150+'px'">
        <DynamicForm ref="dynamicForm" :formOptions="formOptions"></DynamicForm>
    </el-dialog>
</template>
<script>
export default {
    props: {
        initData: {}
    },
    data() {
        const _LockStockStartTime = [{value:0,label:'00'},{value:1,label:'01'},{value:2,label:'02'},
        {value:3,label:'03'},{value:4,label:'04'},{value:5,label:'05'},
        {value:6,label:'06'},{value:7,label:'07'},{value:8,label:'08'},
        {value:9,label:'09'},{value:10,label:'10'},{value:11,label:'11'},
        {value:12,label:'12'},{value:13,label:'13'},{value:14,label:'14'},
        {value:15,label:'15'},{value:16,label:'16'},{value:17,label:'17'},
        {value:18,label:'18'},{value:19,label:'19'},{value:20,label:'20'},
        {value:21,label:'21'},{value:22,label:'22'},{value:23,label:'23'}]
        const _LockStockEndTime = [{value:0,label:'00'},{value:1,label:'01'},{value:2,label:'02'},
        {value:3,label:'03'},{value:4,label:'04'},{value:5,label:'05'},
        {value:6,label:'06'},{value:7,label:'07'},{value:8,label:'08'},
        {value:9,label:'09'},{value:10,label:'10'},{value:11,label:'11'},
        {value:12,label:'12'},{value:13,label:'13'},{value:14,label:'14'},
        {value:15,label:'15'},{value:16,label:'16'},{value:17,label:'17'},
        {value:18,label:'18'},{value:19,label:'19'},{value:20,label:'20'},
        {value:21,label:'21'},{value:22,label:'22'},{value:23,label:'23'}]

        const numberValidator = (_, value, cb) => {
            if (value == "" || value == null) {
                cb(new Error('上浮折扣数值必须正数'));
                return;
            }
            let pattern = /^\d+(\.\d+)?$/;
            if (!pattern.test(value)) {
                cb(Error("上浮折扣数值必须正数"));
                return;
            }
            cb();
        };
        const validatePhone = (rule, value, callback) => {
            if (!this.$validate.phoneNoCheck(value)) {
                callback(new Error('请输入正确的手机号码'));
            } else{
                callback();
            }
        };
        return {
            dialogFormVisible: false,
            title: '',
            api: '',
            formOptions: {
                formName: 'form',
                colNum: 2, // 每行多少列
                labelWidth: '150px',
                formModel: {
                    supplierId: null,
                    supplierName: null,
                    companyName: null,
                    companyAddress: null,
                    businessScope: '-', // 这个无需配置，但是接口属于必传字段
                    userName: null, // 联系人名字
                    tel: null,
                    contractNo: null, // 合同编号
                    dataMode: null,
                    // riseDiscount: null,
                    invoiceMode:1, // 这个无需配置
                    isCheckStock:null, // 下单是否检查库存
                    lockStockStartTime:null, 
                    lockStockEndTime:null,
                    supplierStatus:0, // 默认启用
                    profitMode: 2, // 默认盈利模式

                    // 价格体系调整
                    minClientSaleRate: null,
                    maxClientSaleRate: null,
                    commissionRate: null

                },
                formItems: {
                    supplierName: { type: 'input', label: '供应商名称'},
                    companyName: { type: 'input', label: '公司名称'},
                    companyAddress: { type: 'input', label: '公司地址'},
                    contractNo: { type: 'input', label: '合同编号'},
                    userName: { type: 'input', label: '联系人姓名'},
                    tel: { type: 'input', maxLength: 11, label: '联系人电话'},
                    dataMode: { type: 'select', label: '数据交互模式', optionList: [...this.EnumUtility.Get('DataMode')], index: 'value', text: 'label'},
                    // riseDiscount: { type: 'input-number', label: '上浮后的总折扣数值', precision: 2, step: 0.1, min: 1},
                    lockStockStartTime: { type: 'select', label: '锁库存开始时间', optionList: _LockStockStartTime, index: 'value', text: 'label'},
                    lockStockEndTime: { type: 'select', label: '锁库存结束时间', optionList: _LockStockEndTime, index: 'value', text: 'label'},
                    isCheckStock: { type: 'select', label: '下单是否减库存', optionList: [{value:'0',label:'是'},{value:'1',label:'否'}], index: 'value', text: 'label'},
                    commissionRate: {type: 'input-number', label: '返佣比例', precision: 2, step: 0.1, min: 0},
                    minClientSaleRate: {type: 'input-number', label: '最低终端加价比例', precision: 2, step: 0.1, min: 0},
                    maxClientSaleRate: {type: 'input-number', label: '最高终端加价比例', precision: 2, step: 0.1, min: 0},
                },
                rules: {
                    supplierName: {
                        required: true,
                        trigger: "blur",
                        message: "请输入供应商名称",
                    },
                    companyName: {
                        required: true,
                        trigger: "blur",
                        message: "请输入公司名称",
                    },
                    companyAddress: {
                        required: true,
                        trigger: "blur",
                        message: "请输入公司地址",
                    },
                    businessScope: {
                        required: true,
                        trigger: "blur",
                        message: "请输入经营范围",
                    },
                    userName: {
                        required: true,
                        trigger: "blur",
                        message: "请输入名称",
                    },
                    tel: {
                        required: true,
                        validator: validatePhone,
                        trigger: "blur",
                    },
                    contractNo: {
                        required: true,
                        trigger: "blur",
                        message: "请输入合同编号",
                    },
                    // riseDiscount: {
                    //     required: true,
                    //     validator: numberValidator,
                    //     trigger: "blur",
                    // },
                    
                    dataMode: {
                        required: true,
                        trigger: "change",
                        message: "请选择数据交互模式",
                    },
                    // invoiceMode: {
                    //   required: true,
                    //   trigger: "change",
                    //   message: "请选择开票模式",
                    // },
                    lockStockStartTime:{
                        required: true,
                        trigger: "change",
                        message: "请选择锁库存开始时间",
                    },
                    lockStockEndTime:{
                        required: true,
                        trigger: "change",
                        message: "请选择锁库存结束时间",
                    },
                    isCheckStock:{
                        required: true,
                        trigger: "change",
                        message: "请选择下单是否减库存",
                    },
                    minClientSaleRate: {
                        required: true,
                        trigger: 'blur',
                        message: '请输入最小终端加价比例'
                    },
                    maxClientSaleRate: {
                        required: true,
                        trigger: 'blur',
                        message: '请输入最高终端加价比例'
                    }
                },
                btnList: [
                    {type: 'primary', onClick: (form, formModel) => {this.submit(form, formModel)}, text: '确定', loading: false},
                    {type: '', onClick: (form, formModel) => {this.handleClose(form, formModel)}, text: '取消'},
                ],
            }
        }
    },
    watch: {
        dialogFormVisible(val){
            if(val){
                this.$nextTick(() => {
                    this.submitFlag = false // 复位提交按钮
                    this.$refs.dynamicForm.$refs[this.formOptions.formName].resetFields() // 复位清空可能存在的校验
                    this.initForm()
                })
            }
        },
    },
    methods: {
        initForm() {
            if(this.initData.$type=='edit') {
                // 进入此分支，说明是编辑弹框
                this.title = '供应商编辑'
                this.api = 'supplier/editSupplier'
                
                Object.keys(this.formOptions.formModel).forEach(item => {
                    this.formOptions.formModel[item] = this.initData[item]
                }) 
            }else {
                this.api = 'supplier/addSupplier'
                this.title = '供应商添加'
            }
        },
        handleClose(form, formModel) {
            this.$refs.dynamicForm.$refs[this.formOptions.formName].resetFields()
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
                        this.$notify.error({title:"错误",message: res.result.message || '系统异常'});
                        return false;
                    }
                    this.$notify.success({title:"成功",message:"操作成功"});
                    
                    this.handleClose()
                    this.$emit("refresh");
                }).catch(err => {
                    console.log('err is:', err)
                    this.formOptions.btnList[0].loading = false
                    this.$notify.error({title:"错误",message:"操作失败,请联系管理员"})
                })
            })
        },
    }
}
</script>