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
    }
  }
}

export default global