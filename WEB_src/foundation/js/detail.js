new Vue ({
  el: '#detail',
  data: {
    index: 0,
    dataObj: {
      list1: {
        flag: false,
        noflag: false,
        counter: 1,
        datas: {}
      },
      list2: {
        flag: false,
        noflag: false,
        counter: 1,
        datas: {}
      }
    },
    arr1: [],
    arr2: [],
    type: null,
    hint:null,
    isload: false,
    sumMoney: 0,
    number: 0
  },
  methods: {
    start () {
      if(getScrollTop() + getClientHeight() + 5 > getScrollHeight()){
        let pageType = this.type
        if(this.type == null){
          pageType = 1
        }
        this.dataObj['list'+ pageType].counter++
        if(this.dataObj['list'+ pageType].flag) {
          let pEnd = this.dataObj['list'+ pageType].counter
          this.GetDonationPublicity(pageType, pEnd, 10)
        }
    }
  },
  clickTitle (v) {
    this.index = v
    this.type = v+ 1
    for(var j = 1; j < 3; j++){
      if(this.type === j ){
          if(this.getObjLen(this.dataObj['list'+ j].datas) == 0) {
              var len = this.getObjLen(this.dataObj['list'+ j].datas)
              var cou = this.dataObj['list'+ j].counter
              this.GetDonationPublicity(this.type, cou, 10)
              if(len > 9){
                this.dataObj['list'+ j].flag = true
              }
          }
      }
    }
    },
    getObjLen(obj){
      let arr = Object.keys(obj);
      return arr.length;
    },
    //获取爱心流水列表
    GetDonationPublicity (type, page, count) {
      if(page == 1){
        this.isload = true
      }
      axios({
          url: '/Action.aspx',
          method: 'post',
          data: {
            Action: "GetDonationPublicity",
            type: type,
            page: page,
            count: count
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
          this.isload = false
          this.dataObj['list'+ type].datas[page]=response.data
          this.dataObj['list'+ type].flag=(response.data.length < 10 || response.data == '')? false : true
          if(type === 1){
            if(response.data == '') {
            }else{
              this.dataObj['list'+ type].datas[page].forEach((v,i) => {
                this.arr1.push(v)
              })
              this.sumMoney = response.data[0].sumMoney?response.data[0].sumMoney: 0
              this.number = response.data[0].number?response.data[0].number: 0
            }
          }else if(type === 2){
            if(response.data == '') {
            }else{
                this.dataObj['list'+ type].datas[page].forEach((v,i) => {
                    this.arr2.push(v)
                })
            }
          }
          if(this.dataObj['list'+ type].datas[page].length <= 9 && page >= 2){
            this.dataObj['list'+ type].noflag = true
          }else{
              this.dataObj['list'+ type].noflag = false
          }
        }).catch(function (error) {
          this.isload = false
        });
    }
  },
  mounted () {
    this.GetDonationPublicity(1,1,10)
    //  上拉加载
     window.addEventListener('scroll',()=>{
      this.start()
    })
    this.hint = this.$refs.hint
  }
})