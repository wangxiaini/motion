var date = ''
var dat = new Date()
$(document).ready(function () {
  $.ajax({
      async: false, // 默认true(异步请求)
      cache: false, // 默认true,设置为 false 将不会从浏览器缓存中加载请求信息。
      url: "/Action.aspx",
      type: "POST",
      data: { "Action": "GetRollPicture" },
      success: function (val) {
        if(val == '') return
          var arr = val.split(",");
          var htmls = '';
          for (var i = 0; i < arr.length; i++)
          {
              var arrItem = arr[i].split('^');
              var urlHtml = '';
              if (arrItem[2].length > 0)
                  urlHtml = 'onclick = "javascript:window.location.href=\'' + arrItem[2] + '\'"';
              htmls += '<div class="swiper-slide"><img src="' + arrItem[1] + '" alt="' + arrItem[0] + '" '+urlHtml+'></div>'
          }
          $("#rollImgs").html(htmls)
      },
      complete: function (val) { 
        if($("#rollImgs").children().length == 1){

        }else{
         var swiper = new Swiper('.swiper-container',{
           loop : true,
           autoplay: true,
           speed:500,
           pagination: {
               el: '.swiper-pagination',
             }
         })
        } 
      }
  })
});

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/images/timg.jpg',
  loading: '/images/timg.jpg',
  attempt: 1
});
new Vue ({
  el: '#index',
  data: {
    navFont: ['活动', '图片', '视频', '新闻'],
    navActive: 0,
    searchVal: '',
    //活动数据是否显示
    hasAct: null,
    //进行的活动
    actIng: [],
    //即将开始
    actBegin: [],
    //活动回顾
    actEnd: [],
    hasShow: false,
    //精选推荐
    newArr: [],
    footIndex:0,
    place: [],
    isload:false
  },
  methods: {
    navFn (i) {
      this.navActive = i;
    },
    isDay (item,v) {
      if(item == 'less'){
       return v.day < 0 && v.actStatus != "-55"
      }else if (item == 'great'){
       return v.day > 0 && v.actStatus != "-55"
      }
    },
    //获取活动列表
    getActiveList (type, page, count) {
      axios({
          url: '/Action.aspx',
          method: 'post',
          data: {
            Action: "ActiveList",
            type: type,
            page: page,
            count: count,
            activeType: '',
            activePlace: '',
            activeTime: ''
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
          
            if(type === 1){
              //正在进行的活动
              this.actIng = response.data
            }else if(type === 2) {
              //即将开启的活动
              this.actBegin = response.data
            }else if(type === 3) {
              //历时活动
              this.actEnd = response.data
            }
          }).catch(function (error) {
          });
    },
    //获取精选推荐列表
    getNewsList (page,count,type){
      this.isload = true
      axios({
          url: '/Action.aspx',
          method: 'post',
          data: {
            Action: "NewsList",
            datum_type: type,
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
            if(type === 2){
              //新闻
              this.newArr = response.data
            }
          }).catch(function (error) {
            this.isload = false
          });
    },
    searchClick () {
      if(this.searchVal != ''){
        window.location.href = '/CESADefault.aspx?search=1'
        localStorage.setItem('val',this.searchVal)
      }
    },
    //格式化日期
    mydate(date){
    var formatDate = date.split('T')[0];
    formatDate = formatDate.replace('-', '.');
    formatDate = formatDate.replace('-', '.');
    return formatDate += '';
  }
  },
  created() {
    
  },
  mounted () {
    //活动列表 
    this.getActiveList(1,1,10000)
    this.getActiveList(2,1,4)
    this.getActiveList(3,1,4)
    //精选列表
    this.getNewsList(1,5,2)
    setShare()
  }
})