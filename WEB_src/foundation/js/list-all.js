//获取爱心流水列表
function GetDonationList (id, page, count) {
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
      if(response.data == ''){
        list1.hasShow = true
      }else {
        list1.hasShow = false
        list1.list = response.data
      }
    }).catch(function (error) {
    });
  }
  function roll () {
    if(list1.ul2.clientHeight - list1.ulbox.scrollTop <= 0){
      list1.ulbox.scrollTop -= list1.ul.offsetHeight
    } else{
      list1.ulbox.scrollTop++
    }
}
    // 捐款
    function SubmissionDonations (ac_id, total, pro_name,u_name, fund, anmi) {
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
          list1.setTips('支付失败')    
          return
				}
				else
				{
          // alert(JSON.stringify(response))
					callpay(response.data)
				}
      }).catch(function (error) {
      });
    }
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
setShare('我正在参与2018年中国足球发展基金会杯 中国足球职工联赛总决赛活动','参与募捐即可抽奖，邀您一起 助力中国足球基础事业发展 献一份您的爱心','https://gd.cesa.org.cn/CESADefault.aspx?foundation=index')