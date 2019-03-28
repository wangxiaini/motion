Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: '/images/timg.jpg',
    loading: '/images/timg.jpg',
    attempt: 1
})
var vm = new Vue ({
    el: '#actList',
    data(){
        var that = this
        return {
            scrolltop:0,
            navFont: ['正在进行','活动报名','历史活动'],
            allType:[
                {dict_value: -1, dict_desc: "全部类型"},
                {dict_value: 0, dict_desc: "其他"},
                {dict_value: 1, dict_desc: "足球"},
                {dict_value: 2, dict_desc: "篮球"},
                {dict_value: 3, dict_desc: "乒乓球"},
                {dict_value: 4, dict_desc: "羽毛球"},
                {dict_value: 5, dict_desc: "桥牌"},
                {dict_value: 6, dict_desc: "马拉松"}
            ],
            // allType:[1,2,3,4,5,6,7,8],
            allTime:['全部日期','一个月内','一年内','三年内'],
            str:'',
            dropDown:false,
            showtype:true,
            activeList:[],
            allAddress:provinces,
            navActive:0,
            typeIndex:0,
            typeIndex2:-1,
            getQueryString,
            timeIndex:0,
            addressIndex:0,
            match_type:[],
            counter: 1, //当前页
            num: 10, // 一页显示多少条
            splitPath,
            caseNumer,
            getScrollTop,
            getClientHeight,
            getScrollHeight,
            hasline:false, //底线
            isload:true, //加载
            isok:true, //可以请求
            datas:false,//是否数据
            noAct:false,//没有数据
            error:false,//出错
            message: 'Hello Axios!',
            source: null, //存放取消的请求方法\
            // setShare,
            showType(){
                if(this.navActive != 2){
                    this.showtype = false
                }else{
                    this.showtype = true
                }
            },
            selectDate:function (date) {
                if(date == 1){
                    return -30
                }else if(date == 2){
                    return -365
                }else if(date == 3){
                    return -365*3
                }else {
                    return date
                }
            },
            getList:function(page,count){
                const _this = this;
                this.cancelQuest(); //执行是否请求取消
                this.isload = true
                this.selectDate(this.caseNumer(this.addressIndex))
                caseNumber2(this.typeIndex2)
                axios({
                    method: 'POST',
                    url: "/Action.aspx",
                    data: {
                        'Action':'ActiveList',
                        'type':this.navActive + 1,
                        'page':page,
                        'count':count,
                        'activeType':caseNumber2(this.typeIndex2),
                        'activePlace':this.caseNumer(this.addressIndex),
                        'activeTime':this.selectDate(this.caseNumer(this.timeIndex)),
                    },
                    transformRequest: [function (data) {
                        let ret = ''
                        for (let it in data) {
                            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                        }
                        return ret
                    }],
                    cancelToken: new axios.CancelToken(function executor(c) {
                        _this.source = c
                    })  //new cancelToken
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
                        if(this.dropDown){
                            res.data.forEach((v,i) => {
                                this.activeList.push(v)
                            })
                        }else{
                            this.activeList = res.data
                        }
                        this.dropDown = false
                    }
                }).catch((error) => {
                    if (!axios.isCancel(error))  {
                        this.noAct=false
                        this.isload = false
                        this.isok = false
                        this.hasline = false//底线
                        this.error=true
                    }


                });
            },
            start:function () {
                // console.log(this.dropDown)
                that.scrolltop = that.getScrollTop()
                if(that.getScrollTop() + that.getClientHeight() +5 > that.getScrollHeight() && that.isok == true){
                    this.dropDown = true
                    that.isok = false
                    // console.log(this.dropDown)
                    // console.log(scrollTop,totalHeight)
                    if(that.activeList.length % 10 == 0 && that.datas ==false){
                        that.lineshows = 2
                        that.counter ++
                        that.getList(that.counter,that.num)
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
        //是否取消请求
        cancelQuest(){
            if(typeof this.source ==='function'){
                this.source('终止请求'); //取消请求
            }
        },
        goActiveList(index){
            let active_id = this.activeList[index].active_id
            window.location.href = ' /CESADefault.aspx?activeDetail='+active_id
        },
        activeStyle(typeIndex,index){
            this.hasline = false
            this.noAct=false
            this.counter = 1
            this.typeIndex = index
            this.typeIndex2 = typeIndex
            this.activeList = []
            if(!this.activeList){
                this.noflag = true
            }else{
                this.noflag = false
            }
            this.getList(this.counter,this.num)
        },
        activeStyle2(index){
            this.hasline = false
            this.noAct=false
            this.counter = 1
            this.timeIndex = index
            this.activeList = []
            if(!this.activeList){
                this.noflag = true
            }else{
                this.noflag = false
            }
            this.getList(this.counter,this.num)
        },
        activeStyle3(index){
            this.hasline = false
            this.noAct=false
            this.counter = 1
            this.addressIndex = index
            this.activeList = []
            if(!this.activeList){
                this.noflag = true
            }else{
                this.noflag = false
            }
            this.getList(this.counter,this.num)
        },
        navFn (i) {
            this.activeList = []
            this.hasline = false
            this.noAct=false
            this.navActive = i
            this.showType()
            if(!this.activeList){
                this.noflag = true
            }else{
                this.noflag = false
            }
            this.counter = 1
            if(i < 2){
                this.timeIndex = 0
            }
            this.getList(this.counter,this.num)
        }
    },
    mounted() {
        setShare()
        this.navActive = this.getQueryString('id')
        if(this.navActive === null) {
            this.navActive = 0
            this.activeList = []
        }else{
            this.navActive = this.navActive
            this.activeList = []
        }

        // console.log(this.navActive)
        window.addEventListener('scroll',()=>{
            this.start()
        })
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            slidesPerView: 'auto',
            paginationClickable: true,
            spaceBetween: 0
        });
        this.showType()
        let loclid  = getQueryString('id');
        if(loclid){
            this.navActive =  parseInt(loclid);
            this.getList(this.counter,this.num)
        }else{
            this.getList(this.counter,this.num)
        }
    }
})