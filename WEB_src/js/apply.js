var vm = new Vue ({
  el: '#apply',
  data: {
    name: '',
    phone: '',
    email: '',
    applyCon: '',
    setTips,
    tips:'',
    hasShow: false,
    footIndex:-1
  },
  methods: {
    submitClick () {
      this.hasShow = true
    },
    postData () {
      axios({
        url: '/Action.aspx',
        method: 'post',
        data: {
          Action: "Addteamwork",
          name: this.name,
          mail: this.email,
          phone: this.phone,
          memo: this.applyCon
        },
        transformRequest: [function (data) {
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }],
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(response => {
        if(response.data == 1){
          this.setTips('提交成功,2s后跳转') 
          this.applyCon = ''
          this.phone = ''
          this.name = ''
          this.email = ''
          setTimeout(() => {
            window.location.href = '/CESADefault.aspx?index=1'
          }, 2000)
        }else if(response.data == 0){
          this.setTips('提交失败~') 
        }
        }).catch(function (error) {
          this.setTips('网络异常~') 
        });
    },
    postClick () {
      let phonereg = /^1(3|4|5|6|7|8|9)\d{9}$/
      if(!this.name){
        this.setTips('姓名不能空')    
        return
      }
      if(!phonereg.test(this.phone)){
        this.setTips('手机号不能有误')    
        return
      }
      if(!this.applyCon){
        this.setTips('合作内容不能为空')    
        return
      }  
      this.postData()
  }
},
mounted () {
  setShare('','',ReviseURL("index=1"));
}
})