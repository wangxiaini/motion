var vm = new Vue({
    el: '#app',
    data () {
        return {
            product_List:[],
            caseTips:function (v) {
                console.log(v)
                if(v == 2){
                    return '退款中'
                }else if(v == 3){
                    return '已退款'
                }else if(v == 1){
                    return '申请退款'
                }else if(v == 0){
                    return '未支付'
                }
            }
        }
    },
    methods: {
        refundOrOrder(no,url,status){
            // alert(1)
            if(status != 1){
                return
            }
            sessionStorage.setItem('product_no',no)
            sessionStorage.setItem('pay_active','false')
            window.location.href = url
        }
    },
    mounted () {
        setShare('','', ReviseURL('user=1'))
        axios({
            method: 'POST',
            url: "/Action.aspx",
            data: {
                'Action': 'GetOrdersList',
            },
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
        }).then((res) => {
            this.product_List = res.data.list
        }).catch((error) => {

        });
    }
})