Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/images/timg.jpg',
  loading: '/images/timg.jpg',
  attempt: 1
});
new Vue ({
  el: '#acSearch',
  data: {
    navFont: ['活动','新闻','图片','视频'],
    navActive: 0,
    // 搜索的内容
    actArr: [],
    picArr: [],
    vdoArr: [],
    newsArr: [],
    //搜索的val
    searchVal: '',
    searchMo: '',
    // 上拉加载
    // counter: 1, //当前页
    num: 10, // 一页显示多少条
    pageStart: 0, // 开始页数
    pageEnd: 0, // 结束页数
    picArr: [], // 下拉更新数据存放数组
    // noflag: false, //暂无更多数据显示
    hasClick: false,
    dataObj: {
      list1: {
        flag: false,
        noflag: false,
        counter: 1,
        datas: {}
      },
      list2: {
        flag: false,
        counter: 1,
        datas: {}
      },
      list3: {
        flag: false,
        noflag: false,
        counter: 1,
        datas: {}
      },
      list4:{
        flag: false,
        noflag: false,
        counter: 1,
        datas: {}
      }
    },
    type: null,
    isload: false,
    hassearchMo: false
  },
  methods: {
    start () {
      if(getScrollTop() + getClientHeight() + 5 > getScrollHeight()){
        let pageType = this.type
        if(!this.type){
          pageType = 1
        }
        this.dataObj['list'+ pageType].counter++
        if(this.dataObj['list'+ pageType].flag) {
          let pEnd = this.dataObj['list'+ pageType].counter
          this.clickEnter (pEnd)
        } 
      }
  },
    navFn (i) {
      this.navActive = i
      this.type = i + 1
       for(var j = 1; j < 5; j++){
        if(this.type === j ){
          if(this.getObjLen(this.dataObj['list'+ j].datas) == 0) {
            var len = this.getObjLen(this.dataObj['list'+ j].datas)
            var cou = this.dataObj['list'+ j].counter
            this.clickEnter(cou)
            if(len > 9){
              this.dataObj['list'+ j].flag = true
            }
          }
        }
      }
    },
    //格式化日期
    mydate(date){
      var formatDate = date.split('T')[0];
      formatDate = formatDate.replace(/-/g, '.');
      return formatDate;
   },
   getObjLen(obj){
    let arr = Object.keys(obj);
    return arr.length;
  },
  search () {
    // var str = this.searchMo.replace(/ /g, '')
    // if(str == '' ){
    //   this.hassearchMo = true
    // }else{
    //   this.hassearchMo = false
      this.clickEnter (1)
    // }
    
    this.picArr = []
    this.newsArr = []
    this.vdoArr = []
    this.actArr = []
    this.dataObj = {
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
        },
        list3: {
          flag: false,
          noflag: false,
          counter: 1,
          datas: {}
        },
        list4:{
          flag: false,
          noflag: false,
          counter: 1,
          datas: {}
        }
      }
    localStorage.setItem('val',this.searchMo)
  },
  clickEnter (page) {
    var str = this.searchMo.replace(/ /g, '')
    if(str == '' ){
     this.hassearchMo = true
     return 
    }else{
      this.hassearchMo = false
    }
    if(page == 1){
      this.isload = true
    }
    axios({
        url: '/Action.aspx',
        method: 'post',
        data: {
          Action: "GetDatumList",
          datum_type: this.navActive+1,
          character: this.searchMo,
          page: page,
          count: this.num
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
        this.dataObj['list'+ (this.navActive+1)].datas[page]=response.data
        // //如果没有数据flag为false，如果数据少于10也为false
        this.dataObj['list'+ (this.navActive+1)].flag=(response.data.length < 10 || response.data == '')? false : true
        if(this.navActive + 1 == 1){
            //活动
            if(response.data == '') {
            }else{
              this.dataObj['list'+ (this.navActive+1)].datas[page].forEach((v,i) => {
                this.actArr.push(v)
              })
            }
          }else if(this.navActive + 1  == 2) {
            
            if(response.data == '') {
            }else{
              this.dataObj['list'+ (this.navActive+1)].datas[page].forEach((v,i) => {
                this.newsArr.push(v)
              })
              
            }
          }else if(this.navActive + 1 == 3) {
            
            if(response.data == '') {
            }else{
              this.dataObj['list'+ (this.navActive+1)].datas[page].forEach((v,i) => {
                this.picArr.push(v)
              })
            }    
          }else if(this.navActive + 1 == 4) {
            
            if(response.data == '') {
            }else{
              this.dataObj['list'+ (this.navActive+1)].datas[page].forEach((v,i) => {
                this.vdoArr.push(v)
              })
            }
        }
        if(this.dataObj['list'+ (this.navActive+1)].datas[page].length <= 9 && page >= 2 ){
            this.dataObj['list'+ (this.navActive+1)].noflag = true
          }else{
            this.dataObj['list'+ (this.navActive+1)].noflag = false
          }
        }).catch(function (error) {
          this.isload = false
        });
    },
    onRefresh(done) {
      done(); // call done
    },
    onInfinite(done) {
      let pageType = this.type
      if(!this.type){
        pageType = 1
      }
      this.dataObj['list'+ pageType].counter++
      if(this.dataObj['list'+ pageType].flag) {
        let pEnd = this.dataObj['list'+ pageType].counter
        this.clickEnter (pEnd)
      } 
    done();
  }
  },
  created () {
      this.searchVal = localStorage.getItem('val')
      this.searchMo = this.searchVal
    },
  mounted () {
    this.clickEnter(1)
    setShare()
    // 上拉加载
    window.addEventListener('scroll',()=>{
      this.start()
    })
  }  
})