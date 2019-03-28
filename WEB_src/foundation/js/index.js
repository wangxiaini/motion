new Vue ({
  el: '.box',
  data: {
    hasShow: false,
    ul: null,
    ul2:null,
    ulbox: null,
    isShow: false,
    //跳转
    num: 5,
    item:null,
    list: [],
    u_name: '',
    total: PRICE_LOVE1,
    totalAll: '',
    pro_name: '',
    fund: 0,
    anmi: 0,
    totals: 0,
    selectMoney1:PRICE_LOVE1,
    selectMoney2:PRICE_LOVE2,
    selectMoney3:PRICE_LOVE3,
    allShow1: true,
    allShow2: false,
    allShow3: false,
    changeArr:['阳光足球场地建设','青少年足球训练营','青少年足球关爱计划','青少年足球危困帮扶'],
    setTips,
    tips:''
  },
  methods: {
    clickShow () {
      this.hasShow = true
    },
    totalClick (v) {
      this.total = ''
      if(v == 0){
        this.allShow1 = true
        this.allShow2 = false
        this.allShow3 = false
        this.total = this.selectMoney1
        this.totalAll = ''
      }else if(v == 1){
        this.allShow1 = false
        this.allShow2 = true
        this.allShow3 = false
        this.total = this.selectMoney2
        this.totalAll = ''
      }else if(v == 2){
        this.allShow1 = false
        this.allShow2 = false
        this.allShow3 = true
        this.total = this.selectMoney3
        this.totalAll = ''
      } else if(v=='all'){
        this.totalShow = true
        this.allShow1 = false
        this.allShow2 = false
        this.allShow3 = false
        this.total = null
      }
    },
    submint () {
      var len = this.totalAll.replace(/^\d+\./, '')
      console.log()
      if(this.anmi == true) this.anmi = 1
      else this.anmi = 0
      this.pro_name = this.changeArr[this.fund]
      if(this.total === null && (!this.totalAll)){
        this.setTips('金额不能填写非法字符或为空')    
        return
      }
      if(this.total === null && this.totalAll < 0.01){
        this.setTips('金额不能小于0.01')    
        return
      }
      if(this.total === null && len.length > 2){
        this.setTips('小数点后数字不能多于两位')    
        return
      }
      if(this.total === null && this.totalAll >= 99999999){
        this.setTips('金额不能大于8位数')    
        return
      }
      this.totals = !this.total ? this.totalAll : this.total
      this.SubmissionDonations(ACTIVE_ID,(this.totals)*100,this.pro_name,this.u_name,Number(this.fund)+1,this.anmi)
    },
    roll () {
        if(this.ul2.clientHeight - this.ulbox.scrollTop <= 0){
          this.ulbox.scrollTop-=this.ul.offsetHeight
        } else{
          this.ulbox.scrollTop++
        }
    },
    maskClick () {
      this.hasShow = false
    },
    //获取爱心流水列表
    GetDonationList (id, page, count) {
      axios({
          url: '/Action.aspx',
          method: 'post',
          data: {
            Action: "GetDonationList",
            fund_id: id,
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
          this.list = response.data
          if(this.list.length === 0 || this.list.length === 1) {
            this.ulbox.style.height = 130 + 'px'      
          }else{
            this.ulbox.style.height = 260 + 'px' 
          }
        }).catch(function (error) {
        });
    },
    // 捐款
    SubmissionDonations (ac_id, total, pro_name,u_name, fund, anmi) {
      axios({
        url: '/Action.aspx',
        method: 'post',
        data: {
          Action: "SubmissionDonations",
          active_id: ac_id,
          total_fee: total,
          product_name: pro_name,
          u_name:u_name,
          fund_id: fund,
          anonymity: anmi
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
        if(response.data == "-1")
				{
          this.setTips('支付失败')    
          return
				}
				else
				{
          // alert(JSON.stringify(response))
					callpay(response.data)
				}
      }).catch(function (error) {
      });
    },
    //跳转
  rule () {
    this.item = setInterval(_ => {
      --this.num
      if(this.num === 0){
        clearInterval(this.item)
        this.isShow = true
        setInterval (this.roll,20)
      }
    }, 1000)
  },
  ClickisShow () {
    clearInterval(this.item)
    this.isShow = true
    setInterval (this.roll,10) 
  }
  },
  created(){
    this.GetDonationList(0,1,50)
  },
  mounted () {
    this.ul = this.$refs.height
    this.ul2 = this.$refs.list2
    this.ulbox = this.$refs.listbox
    this.rule()
    setShare('我正在参与2018年中国足球发展基金会杯 中国足球职工联赛总决赛活动','参与募捐即可抽奖，邀您一起 助力中国足球基础事业发展 献一份您的爱心')
  }
})

function callpay(buyJson)
{
   if (typeof(WeixinJSBridge) == "undefined")
   {
	   if (document.addEventListener)
	   {
		   document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
	   }
	   else if (document.attachEvent)
	   {
		   document.attachEvent('WeixinJSBridgeReady', jsApiCall);
		   document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
	   }
   }
   else
   {
	   jsApiCall(buyJson);
   }
}

//调用微信JS api 支付
function jsApiCall(buyJson)
{
   WeixinJSBridge.invoke(
   'getBrandWCPayRequest',
	buyJson,//josn串
	function(res)
	{
		if(res.err_msg == "get_brand_wcpay_request:ok" )
		{
            window.location.href = '/CESADefault.aspx?foundation=SharePay&totalFee='+buyJson.totalFee
        }
	 }
	);
}
