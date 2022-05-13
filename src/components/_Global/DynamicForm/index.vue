
<script>
// 这个组件是针对一般常见的表单，进行高效的开发，使业务页面只关注于表单字段本身。
// 针对同一套表单字段，分别用于添加和编辑，这里就可以很好的复用，并且后期维护改一处而全部生效
export default {
    name: 'DynamicForm',
    props: {
        formOptions: {
            formName: '',
            colNum: 1,

            formModel: {},
            formItems: {},
            rules: {},

            btnList: [],
            inline: false,
            isDisabled: false,
            labelWidth: '150px',
        }
    },
    // beforeCreate() {
    //     console.log('动态表单_beforeCreate')
    // },
    // created() {
    //     console.log('动态表单_created')
    // },
    // beforeMount() {
    //     console.log('动态表单_beforeMount')
    // },
    // beforeUpdate() {
    //     console.log('动态表单_beforeUpdate')
    // },
    render(h) {
        let ele = []
        // 这里使用函数调用形式的原型，见generateList中管理optionList的解释
        // console.log('动态表单_render:', Object.keys(this.formOptions.formItems)
        //         .filter(con => !this.formOptions.formItems[con]?.show || this.formOptions.formItems[con].show?.()))
        ele = Object.keys(this.formOptions.formItems)
                .filter(con => !this.formOptions.formItems[con]?.show || this.formOptions.formItems[con].show?.())
                .map(item => this.generateFormItems(item, this.formOptions.formItems[item])) 
        
        let _arr = []
        while(ele.length > 0){
            _arr.push(ele.splice(0, this.formOptions.colNum))
        }

        ele = _arr.map(item => {
            return  <el-row gutter={24}>
                        {item}
                    </el-row>
        })

        // 按钮列表
        let btnListEle = []
        this.formOptions.btnList.forEach((btn) => {
            btnListEle.push(<el-button type={ btn.type } loading={btn.loading} style={"width:120px;"} on-click={ () => { btn.onClick(this.$refs[this.formOptions.formName], this.formOptions.formModel) } }>{ btn.text }</el-button>)
        })
        
        return (
            <el-form 
                ref={ this.formOptions.formName } 
                // model={this.formOptions.formModel}  会报错
                // https://blog.csdn.net/a843334549/article/details/119109912
                props = {{ model:  this.formOptions.formModel }}
                
                rules={ this.formOptions.rules } 
                inline={ this.formOptions.inline } 
                disabled={ this.formOptions.isDisabled } 
                label-width={ this.formOptions.labelWidth || '150px'}
                width="520px">
                { ele }
                <el-form-item style={'text-align: center;'} label-width='0px'>{ btnListEle }</el-form-item>
            </el-form>
        )
    },
    mounted() {
        // console.log('动态表单_mounted')
        // 这里是来解决 多选下来框 出现内部输入框的样式问题(至于为啥出现这个问题，暂时不清楚)
        document.querySelector('.el-select__tags') && document.querySelector('.el-select__tags').removeChild(document.querySelector('.el-select__tags').lastChild)
    },
    updated() {
        // console.log('动态表单_updated')
        // 这里是来解决 多选下来框 出现内部输入框的样式问题(至于为啥出现这个问题，暂时不清楚)
        document.querySelector('.el-select__tags') && document.querySelector('.el-select__tags').childNodes.length==3 && document.querySelector('.el-select__tags').removeChild(document.querySelector('.el-select__tags').lastChild)
    },
    methods: {
        generateFormItems(fieldName, fieldProp) {
            switch(fieldProp.type) {
                case 'text':
                    return  <el-col span={24}>
                                <el-form-item label={fieldProp.label} prop={fieldName}> 
                                    <span>{this.formOptions.formModel[fieldName]}</span> 
                                </el-form-item>    
                            </el-col>
                case 'input': 
                case 'input-text':
                    return  <el-col span={24/this.formOptions.colNum}>
                                <el-form-item label={fieldProp.label} prop={fieldName}> 
                                    <el-input disabled={fieldProp.disabled&&fieldProp.disabled(this.formOptions.formModel)} maxlength={fieldProp.maxLength} type="text" size="small" placeholder="请输入内容" v-model={this.formOptions.formModel[fieldName]} style="width: 215px"> </el-input> 
                                </el-form-item>
                            </el-col>
                    break;
                case 'input-textarea':
                    return  <el-col span={24/this.formOptions.colNum}>
                                <el-form-item label={fieldProp.label} prop={fieldName}> 
                                    <el-input disabled={fieldProp.disabled&&fieldProp.disabled(this.formOptions.formModel)} maxlength={fieldProp.maxLength} type="textarea" size="small" placeholder="请输入内容" v-model={this.formOptions.formModel[fieldName]} style="width: 215px"> </el-input> 
                                </el-form-item>
                            </el-col>
                case 'input-number': 
                    return  <el-col span={24/this.formOptions.colNum}>
                                <el-form-item label={fieldProp.label} prop={fieldName}> 
                                    <el-input-number disabled={fieldProp.disabled&&fieldProp.disabled(this.formOptions.formModel)} size="small" v-model={this.formOptions.formModel[fieldName]} clearable placeholder="请输入内容"
                                    // 以下属性严格按照 elementui 组件属性传入即可  
                                     precision={fieldProp.precision} 
                                     step={fieldProp.step} 
                                     min={fieldProp.min} 
                                     auto-complete="off" 
                                     style="width:215px">
                                    </el-input-number>
                                </el-form-item>
                            </el-col>
                    break;
                case 'select': 
                    return  <el-col span={24/this.formOptions.colNum}>
                                <el-form-item label={fieldProp.label} prop={fieldName}> 
                                    <el-select filterable multiple={fieldProp.multiple} v-model={this.formOptions.formModel[fieldName]} size="small" clearable placeholder={fieldProp.label}>
                                        { this.generateList(fieldProp) }
                                    </el-select> 
                                </el-form-item>
                            </el-col>;
                    break; 
                case 'radio': 
                    return  <el-col span={24/this.formOptions.colNum}>
                                <el-form-item label={fieldProp.label} prop={fieldName}> 
                                    <el-radio-group v-model={this.formOptions.formModel[fieldName]}>
                                        { this.generateList(fieldProp) }
                                    </el-radio-group> 
                                </el-form-item>
                            </el-col>;
                    break; 
                case 'checkbox': 
                    return  <el-col span={24/this.formOptions.colNum}>
                                <el-form-item label={fieldProp.label} prop={fieldName}> 
                                    <el-checkbox-group v-model={this.formOptions.formModel[fieldName]}>
                                        { this.generateList(fieldProp) }
                                    </el-checkbox-group> 
                                </el-form-item>
                            </el-col>;
                    break; 
                case 'date': 
                    return  <el-col span={24/this.formOptions.colNum}>
                                <el-form-item label={fieldProp.label} prop={fieldName}> 
                                    <el-date-picker
                                        v-model={this.formOptions.formModel[fieldName]}
                                        type="date"
                                        size='mini'
                                        placeholder={'选择'+fieldProp.label}>
                                    </el-date-picker> 
                                </el-form-item>
                            </el-col>;
                case 'daterange': 
                    return  <el-col span={24/this.formOptions.colNum}>
                                <el-form-item label={fieldProp.label} prop={fieldName}> 
                                    <el-date-picker
                                        v-model={this.formOptions.formModel[fieldName]}
                                        type="daterange"
                                        size='mini'
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>;
                default: break;
            }
        },
        generateList(fieldProp) {
            let itemEle = []
            /**
             * 这里推荐使用 函数的形式 传入选项数据。
             * 因为根据vue的父子组件生命周期，父组件执行完beforeMount后，会立即执行子组件生命周期知道mounted
             * 这里的组件执行的钩子函数依次为：
             * 列表页面 beforeCreate => created => breforeMount => 
             * 弹窗页面 beforeCreate => created => breforeMount =>
             * 表单组件 beforeCreate => created => breforeMount(render)
             * 
             * 注意点： 
             * 表单组件的内容是从父组件（弹窗页面）props的方式获取的 组件定义在data中的内容。而data的内容只会初始化一次
             * 所以直接取值赋值给 optionList的话，无法在render函数再次调用时，动态获取到最新的值
             * 因此使用 函数的方式 在每次render调用的时候，能触发函数调用，进而获取到最新的值
             * 
             * 案例
             * 这是如果所需的optionList 是在祖父组件（列表页面）进行异步获取并传入父组件（弹窗页面）的话，而optionList的值是这样获取，optionList: this.list
             * 就会出现 optionList 的值一直是 undefied 获取 其他list的初始化值，因为子组件渲染的速度很快，这时接口还未返回。
             * 后续接口返回了，哪怕再渲染也无法取到对应值了
             */
            let optionList = (typeof fieldProp.optionList=='function'?fieldProp.optionList():fieldProp.optionList)
            for (let index = 0; index < optionList.length; index++) {
                const item = optionList[index]
                switch(fieldProp.type) {
                    // 下拉菜单
                    case 'select':
                        itemEle.push(<el-option key={ item.index } label={ item[fieldProp.text||'text'] } value={ +item[fieldProp.index||'index'] }></el-option>)
                        break
                    // 多选框
                    case 'checkbox':
                        itemEle.push(<el-checkbox label={ item[fieldProp.index||'index'] }>{ item[fieldProp.text||'text'] }</el-checkbox>)
                        break
                    // 单选框
                    case 'radio':
                        itemEle.push(<el-radio label={ item[fieldProp.index||'index'] }>{ item[fieldProp.text||'text'] }</el-radio>)
                        break
                }
            }
            return itemEle
        },
    }
    
}
</script>