<template>

    <el-radio-group v-model="compValue">
        <el-radio v-for="item in list" :label="item.value" :name="name" :key="item.value">{{item.label}}</el-radio>
    </el-radio-group>
  
</template>

<script>

import EnumUtility from '@/utility/enum'

export default {
    name: 'EnumCheckBox',
    props:{
        form: Object,
        name: String,
        type: String
    },
    data(){
        return {
            list: [],
        }
    },
    computed:{
        compValue:{
            get(){
                var value = this.form[this.name]
                if (typeof value != "object" && value!=undefined) {
                    return String(value)
                }
                return value
            },
            set(val){
                this.$set(this.form,this.name,val)
            }
        }
    },
    beforeMount() {
        this.enumUtility = new EnumUtility();
        this.getData();
    },
    methods: {
        getData: function(){
            
            this.list = this.enumUtility.Get(this.type || this.name);
            console.log('this.type is:', this.type, this.name, this.list, this.form)
        }
    }
}
</script>
