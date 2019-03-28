Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/images/timg.jpg',
  loading: '/images/timg.jpg',
  attempt: 1
});

new Vue ({
    el: '#newList',
    data: {
        navFont: ['新闻','图片','视频'],
        navActive: null,
        getId: null,
        vdoArr: [],
        newsArr: [],
        // 上拉加载
        // counter: 1, //当前页
        num: 10, // 一页显示多少条
        pageStart: 0, // 开始页数
        pageEnd: 0, // 结束页数
        picArr: [], // 下拉更新数据存放数组
        // noflag: false, //暂无更多数据显示
        type: null,
        dataObj: {
            list2: {
                flag: false,
                noflag: false,
                counter: 1,
                datas: {}
            },
            list3: {
                flag: false,
                noflag: false,
                counter: 1,
                datas: {}
            },
            list4:{
                flag: false,
                noflag: false,
                counter: 1,
                datas: {}
            }
        },
        isload: false,
        isNoflag: null
    },
    methods: {
      start () {
        if(getScrollTop() + getClientHeight() + 5 > getScrollHeight()){
          let pageType = this.type
            if(!this.type){
                pageType = parseInt(this.getId) + 2
            }
            this.dataObj['list'+ pageType].counter++
            if(this.dataObj['list'+ pageType].flag) {
                let pEnd = this.dataObj['list'+ pageType].counter
                this.getNewsList (pEnd, this.num, pageType)
            }
        }
    },
        navFn (i) {
            this.navActive = i
            this.type = i+ 2
            for(var j = 2; j < 5; j++){
                if(this.type === j ){
                    if(this.getObjLen(this.dataObj['list'+ j].datas) == 0) {
                        var len = this.getObjLen(this.dataObj['list'+ j].datas)
                        var cou = this.dataObj['list'+ j].counter
                        this.getNewsList(cou, 10, i + 2)
                        if(len > 9){
                            this.dataObj['list'+ j].flag = true
                        }
                    }
                }
            }
        },
        getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]); return null; //返回参数值
        },
        //格式化日期
        mydate(date){
            var formatDate = date.split('T')[0];
            formatDate = formatDate.replace('-', '.');
            formatDate = formatDate.replace('-', '.');
            return formatDate += '';
        },
        getObjLen(obj){
            let arr = Object.keys(obj);
            return arr.length;
        },
        getNewsList (page,count,type){
            if(page == 1){
                this.isload = true
            }
            axios({
                url: '/Action.aspx',
                method: 'post',
                data: {
                    Action: "NewsList",
                    datum_type: type,
                    page: page,
                    count: count
                },
                transformRequest: [function (data) {
                    let ret = ''
                    for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                }],
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => {
                this.isload = false
                this.dataObj['list'+ type].datas[page]=response.data
                //如果没有数据flag为false，如果数据少于10也为false
                this.dataObj['list'+ type].flag=(response.data.length < 10 || response.data == '')? false : true
                if(type === 2){
                    //新闻
                    if(response.data == '') {
                    }else{
                        this.dataObj['list'+ type].datas[page].forEach((v,i) => {
                            this.newsArr.push(v)
                        })
                    }
                }else if(type === 3) {
                    if(response.data == '') {
                    }else{
                        this.dataObj['list'+ type].datas[page].forEach((v,i) => {
                            this.picArr.push(v)
                        })
                    }
                }else if(type === 4) {
                    //视频
                    if(response.data == '') {
                    }else{
                        this.dataObj['list'+ type].datas[page].forEach((v,i) => {
                            this.vdoArr.push(v)
                        })
                    }
                }
                if(this.dataObj['list'+ type].datas[page].length <= 9 && page >= 2){
                    this.dataObj['list'+ type].noflag = true
                }else{
                    this.dataObj['list'+ type].noflag = false
                }
            }).catch(function (error) {
                this.isload = false
            });
        }
    },
    created () {
        // 是不是从首页进入
        this.getId = this.getUrlParam('id')
        if(this.getId === null) {
            this.navActive = 0
        }else{
            this.navActive = this.getId
        }
    },
    mounted () {
        this.getNewsList (1,10,Number(this.getId) + 2)
        setShare()
        // 上拉加载
        window.addEventListener('scroll',()=>{
          this.start()
        })
    }
})