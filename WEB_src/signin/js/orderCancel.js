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
    el: '#app',
    data () {
        return {
            product_img: '/signin/images/product.jpg',
            product_desc: '贵州茅台集团白金酒业白金酒53°白金御酿酒品酒V9酱香型',
            price:0,
            active: sessionStorage.getItem('active_type'),
            isActivity:false, //提交成功,
            out_trade_no:sessionStorage.getItem('product_no'),
            user:'',
            phone:'',
            tips:'',
            tips2: '',
            setTips:function (tips) {
                this.$set(this, 'tips', tips);
                setTimeout(() => {
                    this.$set(this, 'tips', '');
                }, 2000)
            }
        }
    },
    methods: {
        submit(){
            const MATCH_PHONE = /^1(3|4|5|6|7|8|9)\d{9}$/
            const MATCH_VAL = /(select|insert|delete|from|drop table|update|truncate|exec master|netlocalgroup administrators|:|net user|or|and|=|!|')/g
            if(this.tips){
                return
            }
            if(!this.user){
                    this.setTips('请填写您的姓名')
                    return
                }
            if(MATCH_VAL.test(this.user)) {
                this.setTips('您的姓名输入含有非法字符')
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
            // if(!this.selectProv){
            //     this.setTips('请填写地址')
            //     return
            // }
            // if(!this.address){
            //     this.setTips('请填写地址')
            //     return
            // }
            // alert('支付成功')
            axios({
                method: 'POST',
                url: "/Action.aspx",
                data: {
                    'Action': 'ReturnGoods',
                    'out_trade_no': this.out_trade_no,// || '151551578120181109121640397',
                    'phone': this.phone,
                    'u_name': this.user
                },
                transformRequest: [function (data) {
                    let ret = ''
                    for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                }],
            }).then((res) => {
                if(res.data == 1){
                    this.tips2 = '售后专员可能与您电话沟通，请保持手机畅通'
                    this.isActivity = true
                }else if(res.data == -1){
                    this.tips2 = '程序错误'
                    this.isActivity = true
                }else if(res.data == 2){
                    this.tips2 = '已申请退款,请勿重复申请'
                    this.isActivity = true
                }else{
                    this.tips2 = '订单号错误'
                    this.isActivity = true
                }
            }).catch((error) => {
                this.tips2 = '服务器错误，请刷新'
                this.isActivity = true
            });
            // window.location.href = '/CESADefault.aspx?signin=success'
        },
        closeMask(){
            if(this.tips2 == '售后专员可能与您电话沟通，请保持手机畅通'){
                history.replaceState({}, null, "/CESADefault.aspx?signin=orderList");
                window.location.href='/CESADefault.aspx?signin=orderList'
            }
            this.isActivity = !this.isActivity
        }
    },
    mounted(){
        axios({
            method: 'POST',
            url: "/Action.aspx",
            data: {
                'Action': 'GetOrderInfo',
                'out_trade_no': this.out_trade_no,//'151551578120181112164715202'  , //|| '151551578120181109121640397',
            },
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
        }).then((res) => {
            this.product_desc = res.data.list[0].product_desc
            this.price = res.data.list[0].total_fee / 100
            if(this.active.indexOf('Alcohol') > -1){
                this.product_img = '/signin/images/product.jpg'
            }else{
                this.product_img = '/signin/images/1.png'
            }
        }).catch((error) => {

        });

    }

})