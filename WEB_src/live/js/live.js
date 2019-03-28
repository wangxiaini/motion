new Vue ({
  el: '#live',
  data: {
    navFont1: ['赛程'],
    navActive1: 0,
    navFont2: ['2018-11-30','2018-12-1','2018-12-2'],
    navActive2: 2,
    // 赛程
    agenArr1: [],
    agenArr2: [],
    agenArr3: [],
    shootArr:[],
    cardArr: [],
    dayObj: {},
    // 是否显示赛事
    hasCompet: true,
    hasHint: false,
    footIndex:0
  },
  methods: {
    navFn1 (i) {
      this.navActive1 = i
      if(this.dayObj[i]){
      }else{
        this.getJson(i)
      }
    },
    navFn2 (i) {
      this.navActive2 = i
    },
    // 赛事
    getJson(idx){
      axios({
        url: '/live/json/json'+ idx + '.json?m='+ new Date()*1,
        method: 'get',
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
      }).then(response =>{
        this.hasHint = false
        this.dayObj[idx] = response.data
        if(idx === 0){
          this.agenArr1 = response.data[0]
          this.agenArr2 = response.data[1]
          this.agenArr3 = response.data[2]
        }else if(idx === 1) {
          this.shootArr =  response.data
          this.hasHint = true
        } else if (idx === 2) {
          this.cardArr =  response.data
          this.hasHint = true
        }
      })
    }
  },
  mounted () {
    setShare('中国职工足球联赛总决赛视频直播','2018中国足球发展基金会杯中国职工足球联赛总决赛视频直播')
    // 赛事
    this.getJson(0)
  }
})