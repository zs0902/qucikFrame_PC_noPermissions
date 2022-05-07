<template>
  <el-select v-model="compValue" :name="name" :placeholder="placeholder" filterable size="small" clearable :disabled='disabled' :multiple='multiple'>
    <el-option v-for="item in list" :label="item.label" :key="item.value" :value="item.value+''">
    </el-option>
  </el-select>
</template>

<script>
import EnumUtility from "@/utility/enum";

export default {
  name: 'EnumSelect',
  props: {
    form: Object,
    name: String,
    type: String,
    placeholder: String,
    multiple: false,
    disabled: false
  },
  data() {
    return {
      list: [],
    };
  },
  computed: {
    compValue: {
      get() {
        var value = this.form[this.name];
        if (typeof value != "object" && value != undefined) {
          return String(value);
        }
        return value;
      },
      set(val) {
        this.$set(this.form, this.name, val);
      },
    },
  },
  beforeMount() {
    this.enumUtility = new EnumUtility();
    this.getData();
  },
  methods: {
    getData: function () {
      this.list = this.enumUtility.Get(this.type || this.name).sort((a, b) => {
        return a.sort - b.sort;
      });
    },
  },
};
</script>
