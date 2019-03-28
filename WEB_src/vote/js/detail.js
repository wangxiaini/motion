$(function () {
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
    $('.close_btn').click(function () {
        $('.mask_rule').hide();
    });
    $('.right').click(function () {
        fabulous(ACTIVE_ID);
    });
    var lottery_id = getUrlParam('id');
    var nameId = getUrlParam('nameId');
    sessionStorage.setItem('lottery_id',lottery_id)
    sessionStorage.setItem('nameId',nameId)
    var userName = null;
    var shareFlag = true;
    GetActiveInfo(ACTIVE_ID);
    function fabulous(id) {
        $.ajax({
            url: '/Action.aspx',
            type: 'post',
            dataType: 'json',
            data: { 'Action': 'FabulousUniversal', 'product_no': lottery_id, 'active_id': id },
            success: function (res) {
              $('.num').text('');
              $('.hint').text('');
              if (res.code == '-1') {
                  $('.hint').text('投票达到上限！');
                  $('.num').text('请明日再来');
              }else if (res.code == '-3') {
                  $('.hint').text(res.message);
                  $('.num').text('明日再来！');
              } else if (res.code == '-2') {
                  $('.hint').text(res.message);
                  $('.num').text('请在时间范围内再来');
              }else if (res.code == '-4') {
                $('.hint').text(res.message);
              }else if(res.code === 1){
                $('.hint').text('投票成功！');
                  $('.num').text(res.message);
                  GetActiveInfo(ACTIVE_ID);
                  if(res.message === '剩余4次投票机会，并且获得了一次抽奖机会'){
                    initRequest();
                  }   
              }
              $('.mask_rule').show();
            }
        });
    }
    function GetActiveInfo(id) {
        $.ajax({
            url: '/Action.aspx',
            type: 'post',
            dataType: 'json',
            data: {'Action': 'GetActiveInfo', 'product_no': lottery_id, 'active_id': id},
            success: function (res) {
                $('.main_img img').attr({src: res.small_imgurl, alt: res.author_name + '的照片'});
                $('.remark').text(res.remark);
                $('.rankNo').text(res.RankNo);
                $('.cur_vote_cnt').text(res.cur_point);
                $('.family_name').text(res.company);
                $('.player').text(res.author_name);
                $('.familyId').text(res.product_no);
                userName = res.author_name;
            },
            complete: function (res) {
                var imgUrl = 'https://gd.cesa.org.cn/images/share.png';
                var desc = '2018“中国足球发展基金会杯”中国职工足球联赛总决赛，人气球队评选。';
                var title = '我是' + userName + ' 编号' + lottery_id + '正在参加 2018“中国足球发展基金会杯”中国职工足球联赛总决赛，人气球队评选，请投我一票！';
                if(shareFlag) {
                    share(title,imgUrl,desc,ACTIVE_ID);
                }
                shareFlag = false;
            }
        });
    }
});
function initRequest() {
    axios({
        method: 'POST',
        url: "/Action.aspx",
        data: {
            'Action':'GetLotteryCount',
            'active_id':ACTIVE_ID,
        },
        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],
    }).then((res) => {
        vm.date.LotteryCount = res.data
    }).catch((error) => {

    });
}
// vue
var vm = new Vue({
    el: '#app',
    data () {
        let that = this
        return {
            date:{LotteryCount:0},
            prize: [
                {"prize_name":"福利购","prize_img":'/signin/images/alcohol.png'},
                {"prize_name":"护肤套装","prize_img":'/signin/images/washALL.jpg'},
                {"prize_name":"洗面奶","prize_img":'/signin/images/washFace.jpg'},
                {"prize_name":"茅台酒","prize_img":'/signin/images/alcohol.png'},
                {"prize_name":"签名足球","prize_img":'/signin/images/football.jpg'},
                {"prize_name":"补水面膜","prize_img":'/signin/images/washMask.jpg'},
                {"prize_name":"宝骏车模","prize_img":'/signin/images/car.jpg'},
                {"prize_name":"未中奖","prize_img":'##'}
            ],
            mask_type: 0,
            txt: '',
            img_src: '',
            close_flag: false,
            buy: false,
            day: 0,
            hours: 0,
            seconds: 0,
            minutes: 0,
            active_begin_time: 0,
            active_end_time: 0,
            num:0,
            active_time:true, //是否在活动时间内
            tips2: '',
            price:PRICE_ALCOGOL,
            oprice: OPRICE_ALCOGOL,
            hasShow: false,
            img: null,
            bg: null,
            ruleState: false,
            bodyOverflow: false //body样式
        }
    },
    methods: {
        closeStatfn(){
            this.ruleState = !this.ruleState
            this.bodyOverflow = !this.bodyOverflow
        },
        closeMask(){
            this.close_flag = false
            this.bodyOverflow = !this.bodyOverflow
        },
        isActivity(){
            this.active_time = true
            this.bodyOverflow = !this.bodyOverflow
            // if(this.tips2 == '活动已结束'){
            //     window.location.href = '/CESADefault.aspx?index=1'
            // }
        },
        topayInfo(){
            window.location.href = '/CESADefault.aspx?signin=subInfo&active=1'
        },
        //去支付购买商品
        goProduct(){
            window.location.href = '/CESADefault.aspx?signin=product&active=Alcohol1'
        },
        handleClick(v) {
          this.CheckTPtime(v)
        },
        hasShowClick () {
          this.hasShow = false
        },
        CheckTPtime (v) {
          axios({
            url: '/Action.aspx',
            method: 'post',
            data: {
              Action: "CheckTPtime",
              'active_id':ACTIVE_ID
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
                this.tips2 = ''
                this.active_time = true
                if(v === 'btn1'){
                  this.hasShow = true
                  this.img = '/vote/images/bg1.png'
                  this.bg = '/CESADefault.aspx?signin=product&active=Alcohol'
                }else if(v === 'btn2'){
                  this.hasShow = true
                  this.img = '/vote/images/bg2.png'
                  this.bg = '/CESADefault.aspx?signin=product&active=Wash'
                }
            }else if (response.data == -1) {
              this.tips2 = '活动已结束'
              this.active_time = false
              this.bodyOverflow = !this.bodyOverflow
            }
            }).catch( (error)=> {
              this.tips2 = '服务器错误，请刷新'
              this.active_time = false
              this.bodyOverflow = !this.bodyOverflow
            });
        }
    },
    mounted () {
        if(!this.active_time){
            return
        }
        window.initRequest()
        var that = this
        setInterval(countDown,1000)
        this.img = this.$refs.img.src
        this.bg = this.$refs.bg.href
    },
    updated(){
        if(this.bodyOverflow){
            document.getElementsByTagName("body")[0].className="bodyOverflow";
        }else{
            document.getElementsByTagName("body")[0].className=" ";
        }
    },
})
