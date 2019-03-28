var vm = new Vue ({
    el: '#minesign',
    data () {
        let that = this
        return {
            selectFlag:false,
            deletFlag:false,
            infos:[],
            index:0,
            page:1,
            count:10,
            activeType:['其他','足球','篮球','乒乓球','羽毛球','桥牌','马拉松'],
            enroll_status:['未交费','交费完成'],
            team_id:0,
            sliceTime,
            matchNull,
            splitPath,
            getScrollTop,
            getClientHeight,
            getScrollHeight,
            counter: 1, //当前页
            num: 10, // 一页显示多少条
            lineshows:1,
            hasline:false, //底线
            isload:false, //加载
            isok:true, //可以请求
            datas:false,
            noAct:false,
            error:false,//报错
            getTeamList: function (page,count) {
                this.isload = true;
                axios({
                    method: 'POST',
                    url: "/Action.aspx",
                    data: {
                        'Action':'GetMyTeamList',
                        'page':page,
                        'count':count
                    },
                    transformRequest: [function (data) {
                        let ret = ''
                        for (let it in data) {
                            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                        }
                        return ret
                    }],
                    // headers: {
                    //     'Content-Type': 'application/x-www-form-urlencoded'
                    // }
                }).then((res) => {
                    this.isload = false
                    if(res.data == ''){
                        this.hasline = false
                        this.isok = false
                        this.isload = false
                        this.noAct = true
                        if(this.counter > 1){
                            this.hasline = true
                        }
                    }else{
                        if(res.data.length == 10){
                            this.hasline = false
                            this.isok = true
                            this.isload = true
                            this.noAct = false
                        }else{
                            if(this.counter > 1){
                                this.hasline = true
                            }
                            this.isok = false
                            this.isload = false
                            this.noAct = false
                        }
                        res.data.forEach((v,i) => {
                            this.infos.push(v)
                        })
                    }
                }).catch((error) => {
                    this.isload = false
                    this.isok = false
                    this.hasline = false, //底线
                        this.noAct = false, //底线
                        this.error = true
                    // console.log(error)
                });
            },
            start:function () {
                if(that.getScrollTop() + that.getClientHeight() +5 > that.getScrollHeight() && that.isok == true){
                    that.isok = false
                    // console.log(scrollTop,totalHeight)
                    // console.log(that.infos)
                    if(that.infos.length % 10 == 0 && that.datas ==false){
                        that.lineshows = 2
                        that.counter ++
                        that.getTeamList(that.counter,that.num)
                    }else{
                        if(that.lineshows == 1){
                            that.hasline = false
                        }else{
                            that.hasline = true
                        }
                    }
                }
            },
        }
    },
    methods: {
        toTeamInfo(index){
            this.team_id = this.infos[index].team_id
            // console.log(this.infos[index])
            window.location.href='/CESADefault.aspx?teamInfo=1&id='+this.team_id
        },
        // toshow() {
        //     this.selectFlag = true
        //
        // },
        // tohide() {
        //     this.selectFlag = false
        //
        // },
        // deletInfo(index){
        //     this.index = index;
        //     this.deletFlag = true;
        // },
        // popupCancel(){
        //     this.deletFlag = false;
        // },
        // popupDelete(){
        //     this.deletFlag = false;
        //     this.infos.splice(this.index,1)
        // },
    },
    mounted() {
        setShare('','', ReviseURL('user=1'))
        window.addEventListener('scroll',()=>{
            this.start()
        })
        this.counter = 1
        this.getTeamList(this.counter,this.num)
    }
})
