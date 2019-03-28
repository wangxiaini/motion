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
            user_name: '',
            phone: '',
            address: '',
            tips:'',
            isokey:false,
            setTips:function (tips) {
                this.$set(this, 'tips', tips);
                setTimeout(() => {
                    this.$set(this, 'tips', '');
                }, 2000)
            }
        }
    },
    methods: {
        subInfo(){
            const MATCH_PHONE = /^1(3|4|5|6|7|8|9)\d{9}$/
            const MATCH_VAL = /(select|insert|delete|from|drop table|update|truncate|exec master|netlocalgroup administrators|:|net user|or|and|=|!|')/g
            if(this.tips){
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
            if(!this.user_name){
                this.setTips('请填写姓名')
                return
            }
            if(MATCH_VAL.test(this.user_name)) {
                this.setTips('姓名输入含有非法字符')
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
                url: "/Action.aspx",
                data: {
                    'Action': 'Updtuser_active_win',
                    'win_id': sessionStorage.getItem('prize'),
                    'user_name': this.user_name,
                    'phone': this.phone,
                    'address': this.address,
                    'remark': ''
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
                    this.isokey = true
                    return
                }else{
                    this.setTips('程序错误')
                    return
                }
            }).catch((error) => {
                this.setTips('服务器错误')
            });
        },
        closeMask() {
            if(getQueryString('active') === '1'){
                history.replaceState({}, null, '/CESADefault.aspx?vote=detail&id='+ sessionStorage.getItem('lottery_id')+'&nameId='+ sessionStorage.getItem('nameId'));
                window.location.href = '/CESADefault.aspx?vote=detail&id='+ sessionStorage.getItem('lottery_id')+'&nameId='+ sessionStorage.getItem('nameId')
            }else{
                history.replaceState({}, null, "/CESADefault.aspx?signin=index");
                window.location.href = '/CESADefault.aspx?signin=index'
            }
        }
    },
    mounted(){

    }
})