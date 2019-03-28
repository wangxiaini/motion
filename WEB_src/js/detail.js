$(document).ready(function () {
  $("#active_place").html($("#myactive_place").html());
  var begin_time = mydate1($("#myenroll_begin_time").html())
  var end_time =  mydate1($("#myenroll_end_time").html());
   $('#enroll_begin_time').html(begin_time+'-'+end_time);
   if(!begin_time || !end_time){
    $('#timer').hide();
   }else{
    $('#timer').show()
   }
  $('#active_begin_time').html(mydate1($("#myactive_begin_time").html()));
  var list = $("#myunit_id_list").html();
  $('#unit_id_list').html( list.replace(/\|/g,'、'));
  var path = $('#myimg_path').html()
  var path1 = path.split(';')
  $('#img_path').attr('src',path1[0]);
  $('.rule').html($('#mytext').html());
  $('.tit').html($('#mytit').html());
  setShare($('#mytit').html(), $('#mysubtit').html());
  sessionStorage.setItem('actit',$('#mytit').html());
  sessionStorage.setItem('acsubtit',$('#mysubtit').html());
   function mydate1(date){
    var formatDate = date.split(' ')[0];
    formatDate = formatDate.replace('-', '.');
    formatDate = formatDate.replace('-', '.');
    return formatDate += '';
  }
  // 是否可以报名
  var isApply = $('#myStatus').text();
  var active_id = getActive('activeDetail');
  if(isApply == 0) {
    $('.status').text('报名未开始')
    $('.status').show()
  }else if(isApply == 1) {
    $('.status').text('马上报名')
    $('.status').show()
    $('.status').click(function(){
      if($('#mysubtit').html() == '2018七彩云南国际汽车拉力赛'){
        window.location.href = '/CESADefault.aspx?registration=1&id='+ active_id;
      }else{
        window.location.href = '/CESADefault.aspx?sign=1&id='+ active_id;
      }
    })
  }else if(isApply == 2) {
    $('.status').text('报名结束');
    $('.status').show();
  }else if(isApply == 3) {
    $('.status').text('活动已开始');
    $('.status').show();
  }else if(isApply == 4) {
    $('.status').text('活动已结束');
    $('.status').show();
  }else {
    $('.status').hide();
    $('.detail-box').css({paddingBottom: '10px'});
  }
  function getActive(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
  }
  if($('.status').css('display') == 'none'){
    $('.yo-scroll').css({bottom: '0'})
  }else{
    $('.yo-scroll').css({bottom: '110px'})
  }
})
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/images/timg.jpg',
  loading: '/images/timg.jpg',
  attempt: 1
});
new Vue ({
  el: '#active',
  data: {
    navFont: ['图集','视频','新闻','赛事须知'],
    navActive: 0,
    getId: null,
    picArr: [],
    vdoArr: [],
    newsArr: [],
    getIdArr: [],


    num: 10, // 一页显示多少条
    pageStart: 0, // 开始页数
    pageEnd: 0, // 结束页数
    type: null,
    actStatus: '',
    dataObj: {
      list1: {
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
    },
    isload: false,
    actionShow: false
  },
  methods: {
    start () {
      if(getScrollTop() + getClientHeight() + 5 > getScrollHeight()){
        let pageType = this.type
        if(pageType == 5) return 
        if(!this.type){
          pageType = 3
        }
        this.dataObj['list'+ pageType].counter++
        if(this.dataObj['list'+ pageType].flag) {
          let pEnd = this.dataObj['list'+ pageType].counter
          this.GetDatumByIDAndType (this.getId, pageType, pEnd, this.num)
        }
      }
  },
  play () {
    
  },
    navFn (i) {
      this.navActive = i
      if(i == 0){
        this.type = 3
      }else if(i == 1) {
        this.type = 4
      }else if(i == 2){
        this.type = 1
      } else if (i== 3){
        this.type = 5
      }
      for(var j = 1; j < 5; j++){
      if(this.type === j){
        if(j === 2) continue
          if(this.getObjLen(this.dataObj['list'+ j].datas) == 0) {
            var len = this.getObjLen(this.dataObj['list'+ j].datas)
            var cou = this.dataObj['list'+ j].counter
            this.GetDatumByIDAndType(this.getId, j , cou, 10)
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
      formatDate = formatDate.replace('-', '.');
      formatDate = formatDate.replace('-', '.');
      return formatDate += '';
    },
    getObjLen(obj){
      let arr = Object.keys(obj);
      return arr.length;
    },
    //查询是否有子活动
    GetSubActivity () {
      axios({
        url: '/Action.aspx',
        method: 'post',
        data: {
          Action: "GetSubActivityByID",
          active_id: this.getId,
          page: 1,
          count: 1000,
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
          this.getIdArr = response.data
        }).catch(function (error) {
        });
    },
    getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg);  //匹配目标参数
      if (r != null) return unescape(r[2]); return null; //返回参数值
    },
    GetDatumByIDAndType (act, type, page, count) {
      if(page == 1){
        this.isload = true
      }
      axios({
        url: '/Action.aspx',
        method: 'post',
        data: {
          Action: "GetDatumByIDAndType",
          active_id: act,
          datum_type: type,
          page: page,
          count: count,
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
        //如果没有数据flag为false，如果数据少于10也为false
        this.dataObj['list'+ type].flag=(response.data.length < 10 || response.data == '')? false : true
        if (type === 1){
          if(response.data == '') {
            }else{
              this.dataObj['list'+ type].datas[page].forEach((v,i) => {
                this.newsArr.push(v)
              })
            }
        }else if(type === 3) {
          if(response.data == '') {
            }else{
              this.dataObj['list'+ type].datas[page].forEach((v,i) => {
                this.picArr.push(v)
              })
            }
        }else if (type === 4) {
          if(response.data == '') {
            }else{
              this.dataObj['list'+ type].datas[page].forEach((v,i) => {
                this.vdoArr.push(v)
              })
            }
        }
        if(this.dataObj['list'+ type].datas[page].length <= 9 && page >= 2){
            this.dataObj['list'+ type].noflag = true
          }else{
            this.dataObj['list'+ type].noflag = false
          }
        }).catch( (error)=> {
          this.isload = false
        });
    },
    //子活动的状态
    myStatus (actStatus) {
      if(actStatus == 0){
          return "报名未开始"
        }else if(actStatus == 1){
          return "马上报名"
        }else if(actStatus == 2){
          return "报名结束"
        }else if(actStatus == 3){
          return "活动已开始"
        }else if(actStatus == 4){
          return "活动已结束"
        }else {
          return "网络异常"
        }
    }
  },
  created () {
    this.getId = this.getUrlParam('activeDetail')
  },
  mounted () {
    this.GetDatumByIDAndType(this.getId, 3, 1, 10)
    localStorage.removeItem('team_id')
    this.GetSubActivity()
    // 上拉加载
    window.addEventListener('scroll',()=>{
      this.start()
    })
    if(this.getId == 16) {
      this.actionShow = true
    }
  }
})