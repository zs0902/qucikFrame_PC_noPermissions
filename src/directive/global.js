import Vue from 'vue'

const global = {
  // 此指令用于根据屏幕宽度，隐藏内容
  tooLongHide: {
    inserted: function(el, binding, vnode){
      if(document.body.clientWidth<1680){
        el.style.display = 'none'
      }
    }
  },
  // 其他指令
  copy: {
    inserted: function(el, binding, vnode){
      console.log('复制内容',binding.value)
      // 绑定点击事件
      el.addEventListener('click', async () => {
        let res = await Vue.prototype.generalUtil.copy(binding.value)
        if(res.code == 'success'){
          Vue.prototype.$notify({title:'复制成功',type: 'success'});
        }else{
          Vue.prototype.$notify({title:'复制失败',type: 'err'});
        }
      });
    }
  }
}

export default global