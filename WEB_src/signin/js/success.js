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
var timer;
var vm = new Vue({
    el: '#app',
    data () {
        let that = this
        return {
            product_img:'',
            product_desc:'',
            price:0,
            num:0,
            active_type: sessionStorage.getItem('active_type'), // 商品类型 洗面奶，酒
            product_no:sessionStorage.getItem('lottery_id'),
            product_type : 2,  // 0：洗面奶，1可以投票的酒 2 福利购的酒
            out_trade_no:sessionStorage.getItem('product_no'), //out_trade_no 订单号
            out_trade_no2:0, // 返回的订单号
            trade_pay_status:0,
            code:0,
            count:0,  //最大值为3的时候取消请求返回请求失败
            pay_active: true,
            product_tips:'',
            //请求信息
            requestInfo(){
                if(that.code === 1 || that.count === 3){
                    clearTimeout(window.timer)
                    // this.order_active = !this.order_active
                    if(that.count === 3 && this.code != 1){
                        this.order_active = !this.order_active
                    }
                    return
                }
                axios({
                    method: 'POST',
                    url: "/Action.aspx",
                    data: {
                        'Action': 'GetOrderInfo',
                        'out_trade_no': that.out_trade_no//
                    },
                    transformRequest: [function (data) {
                        let ret = ''
                        for (let it in data) {
                            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                        }
                        return ret
                    }],
                }).then((res) => {
                    that.code = res.data.code
                    // console.log(res.data.list[0].trade_pay_status )
                    if(res.data.list[0].trade_pay_status == 1){
                        this.product_tips = '申请退款'
                    }else if(res.data.list[0].trade_pay_status == 2){
                        this.product_tips = '退款中'
                    }else if(res.data.list[0].trade_pay_status == 2){
                        this.product_tips = '退款完成'
                    }
                    if (res.data.code === 1) {
                        that.product_desc = res.data.list[0].product_name
                        that.price = res.data.list[0].total_fee / 100
                        that.out_trade_no2 = res.data.list[0].out_trade_no
                        that.trade_pay_status = res.data.list[0].trade_pay_status
                        if (that.active_type == 'Wash') {
                            that.product_img = '/signin/images/1.png'
                            that.num = OPRICE_WASH
                        } else {
                            that.product_img = '/signin/images/product.jpg'
                            // console.log(that.active_type)
                            if(that.active_type === 'Alcohol1'){
                                that.num = 0
                            }else{
                                that.num = OPRICE_ALCOGOL
                            }
                        }
                    }else{
                        that.count++
                    }
                }).catch((error) => {
                    that.count++
                });

            },
            order_active: true,
            tips2: '支付可能有延迟,请稍后在我的订单里查看'
        }
    },
    methods: {
        orderCancel(){
            // sessionStorage.setItem('')
            sessionStorage.setItem('price',this.price)
            if(this.product_tips == '申请退款'){
                window.location.href = '/CESADefault.aspx?signin=orderCancel'
            }
        },
        confirm(){
            this.order_active = !this.order_active
            window.location.href = '/CESADefault.aspx?signin=product&active=' + this.active_type
        }

    },
    mounted(){
        //判断商品类型是否为可加投票或不可加投票
        // this.product_type = this.active_type.indexOf('Alcohol1') == -1 ? ['Wash','Alcohol'].indexOf(this.active_type)  : 2
        //请求信息的定时器 判断提交成功
        timer =  setInterval(()=>{ this.requestInfo() }, 1000)
        this.pay_active = sessionStorage.getItem('pay_active')
    }
})