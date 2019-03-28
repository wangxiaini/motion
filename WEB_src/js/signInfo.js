var vm = new Vue ({
    el: '#signInfo',
    data(){
        return {
            showState:0,
            minutes:30,
            seconds:0,
            team_id: 0,
            active_id:0,
            getLS_id:0,
            infos:[],
            sliceTime,
            splitPath,
            matchNull,
            formatTime,
            active_name:'',
            sexType:['未知','男','女'],
            isRally:false //拉力赛
        }
    },
    methods: {
        num (n) {
            return n<10 ? "0" + n : "" + n
        },
        fnCancel () {
            this.showState = 1
        },
        fnPay(){
            this.showState = 2
        }
    },
    computed:{
        second () {
            return this.num(this.seconds)
        },
        minute () {
            return this.num(this.minutes)
        }
    },
    watch:{
        second:{
            handler(newVal){
                this.num(newVal)
            }
        },
        minute:{
            handler(newVal){
                this.num(newVal)
            }
        }
    },
    mounted(){
        var _this = this;
        var phone = localStorage.getItem('phone')
        var time = window.setInterval(function () {
            if (_this.seconds == 0 && _this.minutes != 0) {
                _this.seconds = 59;
                _this.minutes -= 1;
            }else if(_this.minutes == 0 && _this.seconds == 0){
                _this.seconds = 0;
                window.clearInterval(time);
            }else{
                _this.seconds -= 1
            }
        },1000);
        //从报名页跳转到报名成功页,顺带传入active_id;
        this.getLS_id =  localStorage.getItem('active_id')
        this.team_id = localStorage.getItem('team_id')
        this.showState = 2
        if(sessionStorage.getItem('rally') === '1'){
            this.isRally = true
            axios({
                method: 'POST',
                url: "/Action.aspx",
                data: {
                    'Action':'GetCarInfo',
                    'active_id':this.getLS_id,
                    'car_team_id':localStorage.getItem('carTeam')
                },
                transformRequest: [function (data) {
                    let ret = ''
                    for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                }],
            }).then((res) => {
                // console.log(res.data)
                this.active_name = res.data.active_name
                this.infos.push(res.data)
                // console.log(this.infos.active_begin_time)
            }).catch((error) => {
                // console.log(error)
            });
        }else{
            axios({
                method: 'POST',
                url: "/Action.aspx",
                data: {
                    'Action':'GetMyEnrollInfo',
                    'active_id':this.getLS_id,
                    'team_id':this.team_id,
                    'phone': phone?phone:'0'
                },
                transformRequest: [function (data) {
                    let ret = ''
                    for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                }],
            }).then((res) => {
                // console.log(res.data)
                this.active_name = res.data.active_name
                this.infos.push(res.data)
                // console.log(this.infos.active_begin_time)
            }).catch((error) => {
                // console.log(error)
            });
        }
        setShare('','', ReviseURL('user=1'))
    },
})
