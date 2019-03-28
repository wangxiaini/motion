var vm = new Vue({
    el: '#app',
    data () {
        return {
            productType:true,
            active: getQueryString('active'),
            price: 0,
            oprice: 0,
            user_id: sessionStorage.getItem('lottery_id'),
            name_id: sessionStorage.getItem('nameId'),
            title:'我正在参与2018年中国足球发展基金会杯 中国足球职工联赛总决赛投票活动',
            imgUrl: 'http://qdhd.cesa.org.cn/vote/images/share.png',
            desc: '投票即可抽奖赢好礼，助力中国足球事业发展'
        }
    },
    methods: {
        goPay(){
                window.location.href = '/CESADefault.aspx?signin=Settlement'
        }
    },
    mounted(){
        if(this.active === 'Alcohol1'){
            setShare('我正在参与2018年中国足球发展基金会杯 中国足球职工联赛总决赛签到活动','签到即可抽奖赢好礼，助力中国足球事业发展', ReviseURL('signin=index'))
        }else{
            setShare(this.title,this.desc, ReviseURL('vote=detail&id='+ this.user_id+'&nameId=' +this.name_id))
        }
        if(this.active.indexOf('Alcohol') > -1){
            this.productType = true
            this.price = PRICE_ALCOGOL
            this.oprice = OPRICE_ALCOGOL
        }else{
            this.productType = false
            this.price = PRICE_WASH
            this.oprice = OPRICE_WASH
        }
        sessionStorage.setItem('active_type', this.active)
    }
})