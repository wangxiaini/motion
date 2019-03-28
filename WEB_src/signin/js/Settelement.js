function onBridgeReady() {
    WeixinJSBridge.call('hideOptionMenu');
}
if (typeof WeixinJSBridge == "undefined") {
    if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
} else {
    onBridgeReady();
}
var vm = new Vue({
    el: "#app",
    data () {
        let that = this
        return {
            product_img:'/signin/images/product.jpg',
            product_desc:'贵州茅台集团白金酒业白金酒53°白金御酿酒品酒V9酱香型',
            productName:'贵州茅台酒',
            price: 0,
            count : '1',
            unitPrice:0, //单价
            active_type: sessionStorage.getItem('active_type'), // 商品类型 洗面奶，酒
            product_no:sessionStorage.getItem('lottery_id') || '',
            provs:[],
            user:'',
            phone:'',
            address:'',
            selectProv:'北京',
            tips:'',
            setTips:function (tips) {
                this.$set(this, 'tips', tips);
                setTimeout(() => {
                    this.$set(this, 'tips', '');
                }, 2000)
            },
            tips2:'支付价格异常,请核对后支付',
            price_default: false
        }
    },
    computed :{
    },
    watch:{
        count:function (arg) {
            this.count = arg.toString().replace(/[^\d]/g,'')
            this.count = arg.toString().replace(/\b(0+)/gi,'')
            if(this.count > 999){
                this.count = 999
            }
        }
    },
    methods :{
        //检测单价
        checkCount(){ 
            this.count = this.count.toString().replace(/[^\d]/g,'')
            this.count = this.count.toString().replace(/\b(0+)/gi,'')
            if(this.count <=0 ){
                this.count = 1
            }
            this.price = this.count * this.unitPrice
            // console.log(this.count)

        },
        // 添加删减商品价格
        add(){
            this.count ++
            this.price = this.count * this.unitPrice
        },
        // 添加删减商品价格
        reduce(){
            if(this.count > 1){
                this.count--
                this.price = this.count * this.unitPrice
            }
        },
        closeMask(){
            this.price_default = false
        },
        //支付
        payProduct(){
            const MATCH_PHONE = /^1(3|4|5|6|7|8|9)\d{9}$/
            const MATCH_VAL = /(select|insert|delete|from|drop table|update|truncate|exec master|netlocalgroup administrators|:|net user|or|and|=|!|')/g
            if(this.tips){
                return
            }
            if(!this.user){
                this.setTips('请填写收件人')
                return
            }
            if(MATCH_VAL.test(this.user)) {
                this.setTips('收件人输入含有非法字符')
                return
            }
            if(!this.phone){
                this.setTips('请填写手机号')
                return
            }
            if(!MATCH_PHONE.test(this.phone)){
                this.setTips('请填写正确手机号')
                return
            }
            if(MATCH_VAL.test(this.phone)) {
                this.setTips('手机号输入含有非法字符')
                return
            }
            if(!this.selectProv){
                this.setTips('请填写省份')
                return
            }
            if(!this.address){
                this.setTips('请填写地址')
                return
            }
            if(MATCH_VAL.test(this.address)) {
                this.setTips('地址输入含有非法字符')
                return
            }
            axios({
                method: 'POST',
                url: "/Action.aspx?" + new Date() ,
                data: {
                    'Action': 'BuyProduct',
                    'name': this.user,
                    'tel': this.phone,
                    'address': this.selectProv + this.address,
                    'productName': this.productName,
                    'total_fee':this.price*100,
                    'product_desc': this.product_desc,
                    'product_no': this.product_no,
                    'voteType': this.product_type,
                    'active_id': ACTIVE_ID
                },
                transformRequest: [function (data) {
                    let ret = ''
                    for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                }],
            }).then((res) => {
				if(res.data == "-1")
				{
                    // sessionStorage.setItem('product_no',res.data.outTradeNo)
                    this.setTips('支付失败')
                }
				else if(res.data == '-2'){
                    this.price_default = true
                }
                else
				{
					//alert(res.data.outTradeNo)
                    sessionStorage.setItem('pay_active','true')
                    sessionStorage.setItem('product_no',res.data.outTradeNo)
					callpay(res.data)
				}
            }).catch((error) => {

            });
        }
    },
    mounted(){
        // console.log(this.count)
        this.product_type = this.active_type.indexOf('Alcohol1') == -1 ? ['Wash','Alcohol'].indexOf(this.active_type)  : 2
        // 获取active,判断商品类型
        if(this.active_type.indexOf('Alcohol') > -1){
            this.product_img = '/signin/images/product.jpg'
            this.product_desc = '贵州茅台集团白金酒业白金酒53°白金御酿酒品酒V9酱香型'
            this.productName = '贵州茅台酒'
            this.unitPrice = PRICE_ALCOGOL//单价
        }else{
            this.product_img = '/signin/images/1.png'
            this.product_desc = 'CoCoFAVES小分子玻尿酸洁面乳 洗面奶 温和不刺激 泡沫丰富细腻 补水清新柔滑不紧绷'
            this.productName = 'CoCoFAVES洁面乳'
            this.unitPrice = PRICE_WASH//单价
        }
        this.price = this.unitPrice
        //获取地区
        axios({
            method: 'POST',
            url: "/Action.aspx",
            data: {
                'Action':'ActiveTypeAndPlace',
            },
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
        }).then((res) =>{
            res = res.data.place
            for(let i in res){
                this.provs.push(res[i].dict_desc);
            }
        }).catch((error) => {
            this.setTips('获取地区数据出错')
        });
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
            window.location.href = '/CESADefault.aspx?signin=success'
        }
	 }
	);
}
