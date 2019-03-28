new Vue ({
  el: '#content',
  data: {
    idea: '',
    phone: '',
    val: '',
    setTips,
    tips:''
  },
  methods: {
    postData () {
      axios({
        url: '/Action.aspx',
        method: 'post',
        data: {
          Action: "AddOpinion",
          memo: this.idea,
          phone_mail: this.phone
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
          this.idea = ''
          this.phone = ''
          setTimeout(() => {
            window.location.href = '/CESADefault.aspx?user=1'
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
      let emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if(!this.idea){
        this.setTips('建议不能为空')    
        return
      }
      if(!emailReg.test(this.phone) && !phonereg.test(this.phone)){
        this.setTips('手机号或邮箱有误')    
        return
      }
      this.postData()
  }
},
mounted () {
  setShare('','',ReviseURL("user=1"))
}
})