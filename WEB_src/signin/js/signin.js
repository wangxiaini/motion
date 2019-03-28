// function onBridgeReady() {
//     WeixinJSBridge.call('hideOptionMenu');
// }
// if (typeof WeixinJSBridge == "undefined") {
//     if (document.addEventListener) {
//         document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
//     } else if (document.attachEvent) {
//         document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
//         document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
//     }
// } else {
//     onBridgeReady();
// }
//初始的时候请求签到的接口
function initRequest() {
    axios({
        method: 'POST',
        url: "/Action.aspx",
        data: {   
            'Action': 'Sign',
            'active_id': ACTIVE_ID,
        },
        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],
    }).then((res) => {
        if(res.data == -1){
            vm.tips2 = '程序错误'
            vm.active_time = false
            vm.bodyOverflow = true
            return
        }
        if(res.data == -2){
            vm.tips2 = '活动已结束'
            vm.active_time = false
            vm.bodyOverflow = true
            return
        }
        if(res.data == -3){
            vm.tips2 = '用户不存在'
            vm.active_time = false
            vm.bodyOverflow = true
            return
        }
        vm.date = res.data
        if(vm.date.IsFirstSign == 1){
            vm.tips2 = ''
            vm.close_flag = true
            vm.bodyOverflow = true
            vm.mask_type = 1
            return
        }
    }).catch((error) => {
        vm.tips2 = '服务器错误，请刷新'
        vm.active_time = false
        vm.bodyOverflow = true
        return
    })
}
// vue
var vm = new Vue({
    el: '#app',
    data () {
        let that = this
        return {
            date: {"LotteryCount":0,
                "list":[
                    {"record_time":"2018-11-02","record_type":0},
                    {"record_time":"2018-11-03","record_type":0},
                    {"record_time":"2018-11-04","record_type":0},
                    {"record_time":"2018-11-05","record_type":0},
                    {"record_time":"2018-11-06","record_type":0},
                    {"record_time":"2018-11-07","record_type":0},
                    {"record_time":"2018-11-08","record_type":0},
                    {"record_time":"2018-11-09","record_type":0},
                    {"record_time":"2018-11-10","record_type":0},
                    {"record_time":"2018-11-11","record_type":0}]
            },
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
            price: PRICE_ALCOGOL,
            oprice: OPRICE_ALCOGOL,
            ruleState: false,
            bodyOverflow: false,
        }
    },
    methods: {
        //关闭遮罩
        closeMask(){
            this.close_flag = false
            this.bodyOverflow = !this.bodyOverflow
        },
        isActivity(){
            this.active_time = true
            this.bodyOverflow = !this.bodyOverflow
        },
        //填写信息
        toWriteInfo(){
            window.location.href = '/CESADefault.aspx?signin=subInfo&active=0'
        },
        //去支付购买商品
        goProduct(){
            sessionStorage.setItem('lottery_id','')
            window.location.href = '/CESADefault.aspx?signin=product&active=Alcohol1'
        },
        // 关闭规则
        closeStatfn(){
            this.ruleState = !this.ruleState
            this.bodyOverflow = !this.bodyOverflow
        }
    },
    updated(){
        // alert(1)
        if(this.bodyOverflow){
            document.getElementsByTagName("body")[0].className="bodyOverflow";
        }else{
            document.getElementsByTagName("body")[0].className=" ";
        }
    },
    mounted () {
        setShare('我正在参与2018年中国足球发展基金会杯 中国足球职工联赛总决赛签到活动','签到即可抽奖赢好礼，助力中国足球事业发展')
        window.initRequest()
        setInterval(countDown,1000)
    },
})

// 倒计时
var p = null,item;
if ($('.sps_item').length > 0) {
  p = 7;
  item = setInterval(_ => {
      p -= 1;
      $('.sps_item').text(p);
      if ($('.sps_item').text() < 1) {
          $('.sps_item').text(7);
          $('.aimi').hide();
          $('.main1').show();
          clearInterval(item);
      }
  }, 1000)
}

$('.skip').click(_=>{
  $('.aimi').hide();
  $('.main1').show();
  clearInterval(item);
})

setTimeout (_=>{
  $('.aimi3').show()
},600)
setTimeout (_=>{
  $('.title').show()
},5000)
  var math = createRandom (7,1,7)
  setTimeout (_=>{
    for(var i = 1; i <= math.length; i++){
      $('.header'+ math[i-1]).show().css({"animation": "header .5s "+ i*0.5+"s","animation-fill-mode": "forwards" })
    }
  },800)
  
  function createRandom(num ,from ,to ) {
    var arr=[];
    for(var i=from;i<=to;i++)
        arr.push(i);
    arr.sort(function(){
        return 0.5-Math.random();
    });
    arr.length=num;
    return arr;
}