var vm = new Vue ({
    el: '#enroll',
    data(){
        let that = this
        return {
            tips:'',
            group_type:['行业组','社会组'],
            competition_type:['11人制','室外五人制'],
            group_type1:'',
            competition_type1:'',
            setTips,
            //phone:'',
            create_man:'',
            team_name:'',
            isend:false,
            teamFlag:false,
            nameFlag:false,
            tips:'',
            createFlag:true,
            repeatTips:'',
            isRegistered:false,
            active_id: getQueryString('id'),
            counter: 1, //当前页
            num: 10, // 一页显示多少条
            infos:[],
            index:0,
            enroll_status:['未交费','交费完成'],
            team_id:0,
            cloth_size:[1,2,3,4,5],
            sliceTime,
            matchNull,
            splitPath,
            getScrollTop,
            getClientHeight,
            getScrollHeight,
            str:'',
            // getQueryString,
            error:false, //出错
            datas:false, //暂无团队
            hasline:false, //底线
            isload:false, //加载
            isok:true, //可以请求
            noAct:false,//没有数据
            Trim: function (str,is_global){
                var result = str.replace(/(^\s+)|(\s+$)/g,"");
                if(is_global.toLowerCase()=="g") {
                    result = result.replace(/\s/g,"");
                }
                return result;
            },
            //获取团队列表
            getTeamList: function (page,count) {
                this.isload = true;
                axios({
                    method: 'POST',
                    url: "/Action.aspx",
                    data: {
                        'Action':'GetTeamByUserID',
                        'active_id':this.active_id,
                        'page':page,
                        'count':count,
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
                });
            },
            start:function () {
                if(that.getScrollTop() + that.getClientHeight() +5 > that.getScrollHeight() && that.isok == true){
                    that.isok = false
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
    watch:{
        create_man:function (n,o) {
            this.create_man = this.Trim(n,'g')
        },
        team_name:function (n,o) {
            this.team_name = this.Trim(n,'g')
        }
    },
    methods: {
        closeMask(){
          this.isend = false
          window.location.href = '/CESADefault.aspx?index=1'
        },
        //检测信息是否为空
        selectText(f,n){
            if(f){
                this[n] = false
            }else{
                this[n] = true
            }
        },
        // 点击团队信息进入到对应的报名列表
        toWrietInfo(acId, teamId){
            localStorage.setItem('team_id', teamId)
            localStorage.setItem('active_id', acId)
            window.location.href = '/CESADefault.aspx?writeInfo=1&id=' + teamId +'&active_id=' + acId
        },
        //创建团队
        creatTeam() {
            if(this.createFlag){
                this.createFlag = false
            } else {
                return
            }
            if(this.team_name === ''){
                this.createFlag = true
                this.setTips('请填写团队名称')
                return
            }
            if(this.create_man === ''){
                this.createFlag = true
                this.setTips('填写姓名')
                return
            }
            if(this.group_type1 === ''){
                this.createFlag = true
                this.setTips('请选择组别')
                return
            }
            if(this.competition_type1 === '' ){
                this.createFlag = true
                this.setTips('请选择赛制')
                return
            }
           
            axios({
                method: 'POST',
                url: "/Action.aspx",
                data: {
                    'Action':'CreateTeam',
                    'team_name':this.team_name,
                    'create_man':this.create_man,
                    'group_type':(this.group_type1) +1,
                    'competition_type':(this.competition_type1) +1,
                    'active_id':this.active_id,
                },
                transformRequest: [function (data) {
                    let ret = ''
                    for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                }],
            }).then((res) => {
                this.createFlag = true
                if(res.data > 0){
                    this.team_id = res.data
                    sessionStorage.setItem('created',true)
                    window.location.href = '/CESADefault.aspx?writeInfo=1&id=' + this.team_id +'&active_id=' + this.active_id
                }else if(res.data == 0){
                    this.setTips('团队已创建,请勿重复创建')
                }else if(res.data == -1){
                    this.setTips('服务器错误,请重试')
                }else if(res.data == -5){
                    this.isend = true
                }
            }).catch((error) => {
                this.createFlag = true
                this.setTips('网络异常')
            });
            
        },
    },
    mounted() {
        setShare(sessionStorage.getItem('actit'),sessionStorage.getItem('acsubtit'),ReviseURL('activeDetail=' + this.active_id))
        //检查活动报名是否在可报名时间内
        axios({
            method: 'POST',
            url: "/Action.aspx",
            data: {
                'Action':'CheckEnrollTime',
                'active_id':this.active_id,
            },
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
        }).then((res) => {
            if(res.data == -1){
                return
            }else if(res.data == -5){
                this.isend = true
            }else if(res.data == 1){
                this.isend = false
            }
        }).catch((error) => {
            this.setTips('出错啦~')
        });
        // 获取团队列表
        this.getTeamList(this.counter, this.num)
        // 上拉加载
        window.addEventListener('scroll',()=>{
            this.start()
        })
        localStorage.setItem('active_id',this.active_id)
    }

})
