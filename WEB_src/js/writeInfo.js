// 750px
var DEFAULT_WIDTH = 750, // 页面的默认宽度
ua = navigator.userAgent.toLowerCase(), // 根据 user agent 的信息获取浏览器信息
deviceWidth = window.screen.width, // 设备的宽度
devicePixelRatio = window.devicePixelRatio || 1, // 物理像素和设备独立像素的比例，默认为1
targetDensitydpi;
if (ua.indexOf("android") !== -1 && parseFloat(ua.slice(ua.indexOf("android") + 8)) < 4) {
targetDensitydpi = DEFAULT_WIDTH / deviceWidth * devicePixelRatio * 160;
$('meta[name="viewport"]').attr('content', 'target-densitydpi=' + targetDensitydpi +
    ', width=device-width, user-scalable=no');
}
var vm = new Vue ({
    el: '#perInfo',
    data: {
        group_type:['行业组','社会组'],
        group_type1:'',
        competition_type:['11人制','室外五人制'],
        competition_type1:'',
        team_id:0,
        active_id:0,
        active_name:'',
        team_name:'',
        user_name: '',
        sexType:['男','女'],
        sex: 0,
        identityType:['身份证','港澳台通行证','军人证'],
        identity_type:0,
        identity_no:'',
        phone:'',
        email:'',
        country:'中国',
        provs:[],
        selectProv:'北京',
        selectCity:'北京',
        address:'',
        cloth_size:['XS','S','M','L','XL','XXL','XXXL'],
        clothSize:'XS',
        select: false,
        select2: false,
        add_service:0,
        created:true,
        matchNull:function(n) {
            return (n ? n : '-');
        },
        switchFlag:false,
        tips:'',
        isend:false,
        closeStat:false,
        signFlag:true,
        Trim: function (str,is_global) {
            var result;
            result = str.replace(/(^\s+)|(\s+$)/g,"");
            if(is_global.toLowerCase()=="g")
            {
                result = result.replace(/\s/g,"");
            }
            return result;
        },
        getQueryString:function (name) {
            var reg =new RegExp('(^|&)'+name+'=([^&]*)(&|$)','i');
            var r = window.location.search.substr(1).match(reg);
            if(r !=null){
                return unescape(r[2]);
            }
            return null;
        },
        heartBeat : function () {
            setInterval(function() {
                axios({
                    method: 'POST',
                    url: "/Action.aspx",
                    data: {
                        'Action':'HeartBeat'
                    },
                    transformRequest: [function (data) {
                        let ret = ''
                        for (let it in data) {
                            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                        }
                        return ret
                    }],
                }).then((res) => {

                }).catch((error) => {

                });
            },300000)
        },
        setTips:function (tips) {
            this.$set(this, 'tips', tips);
            setTimeout(() => {
                this.$set(this, 'tips', '');
            }, 2000)
        }
    },
    watch:{
        user_name:function (arg) {
            this.user_name = this.Trim(arg,'g')
        },
        email:function (arg) {
            this.email = this.Trim(arg,'g')
        },
        phone:function (arg) {
            this.phone = this.Trim(arg,'g')
        },
        address:function (arg) {
            this.address = this.Trim(arg,'g')
        },
        identity_no:function (arg) {
            this.identity_no = this.Trim(arg,'g')
        },
    },
    methods: {
        closeMask(){
            this.isend = false
            window.location.href = '/CESADefault.aspx?index=1'
        },
        selectSex(index){
            this.sex = index
        },
        closeStatfn(){
            this.closeStat = !this.closeStat
        },
        selectService(){
            this.select = !this.select
        },
        selectService2(){
            this.select2 = !this.select2
        },
        
        toPayInfo(){
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
                this.setTips('时间获取出错了')
            });
            if(this.isend){
                return
            }
            if(this.signFlag && uploadFlag){
                this.signFlag = false
            }else {
                return
            }
            let mobile = /^1(3|4|5|6|7|8|9)\d{9}$/
            let idenReg = [/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, /^([A-Z]\d{6,10}(\w1\w1)?)$/, /^[a-zA-Z0-9]{7,21}$/]
            let arr1 = [this.user_name, this.identity_no, this.phone,]
            let tip1 = ['请输入姓名', '请输入证件号', '请输入手机号']
            let arr2 = [idenReg[this.identity_type].test(this.identity_no), mobile.test(this.phone)]
            let tip2 = ['请输入正确证件号', '请正确的手机号']
            let emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            for(let i in arr1) {
                if (arr1[i] == '') {
                    this.signFlag = true
                    this.setTips(tip1[i])
                    return
                }
            }
            for (let i in arr2) {
                if (!arr2[i]) {
                    this.signFlag = true
                    this.setTips(tip2[i])
                    return
                }
            }
            if(this.select && this.select2){
                this.add_service = 3
            }else if(this.select){
                this.add_service = 1
            }else if(this.select2){
                this.add_service  = 2
            }else{
                this.add_service = 0
            }
            if(!this.switchFlag) {
                this.signFlag = true
                this.setTips('请先勾选免责声明')
                return
            }
            axios({
                method: 'POST',
                url: "/Action.aspx",
                data: {
                    'Action': 'AddEnroll',
                    'active_id': this.active_id,
                    'phone': this.phone,
                    'team_id': this.team_id,
                    'user_name': this.user_name,
                    'sex': this.sex + 1,
                    'identity_type': this.identity_type + 1,
                    'identity_no': this.identity_no,
                    'email': '',
                    'country': this.country,
                    'province': this.selectProv,
                    'city': '',
                    'img_path': myImgArr.join(';'),
                    'cloth_size': this.clothSize,
                    'add_service': this.add_service,
                    'team_name':this.team_name,
                    'active_name':this.active_name
                },
                transformRequest: [function (data) {
                    let ret = ''
                    for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                }],
            }).then((res) => {
                if (res.data == 1) {
                    this.signFlag = true
                    localStorage.setItem('phone',this.phone)
                    history.replaceState({}, null, "/CESADefault.aspx?sign=1&id="+this.active_id);
                    window.location.href = "/CESADefault.aspx?signInfo=1"
                    console.log(res)
                }else if(res.data == -1){
                    this.signFlag = true
                    this.setTips('程序错误,请刷新再报名')
                }else if(res.data == -2){
                    this.signFlag = true
                    this.setTips('请填写预留手机号')
                }else if(res.data == -3){
                    this.signFlag = true
                    this.setTips('您还没有绑定手机号')
                }else if(res.data == -4){
                    this.signFlag = true
                    this.setTips('不可重复报名本活动')
                }else if(res.data == -5){
                    this.signFlag = true
                    this.isend = true
                }
            }).catch((error) => {
                this.signFlag = true
                this.setTips('网络异常')
            });
                     
        }
    },
    mounted() {
        if(sessionStorage.getItem('created')){
            this.created = true
        }else{
            this.created = false
        }
        sessionStorage.removeItem('created')
        this.team_id = this.getQueryString('id');
        this.active_id = this.getQueryString('active_id');
        localStorage.setItem('active_id',this.active_id)
        localStorage.setItem('team_id',this.team_id)
        
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
            this.setTips('时间获取出错了')
        });
        // 补全赛事信息
        axios({
            method: 'POST',
            url: "/Action.aspx",
            data: {
                'Action':'GetInfo',
                'team_id':parseInt(this.team_id),
                'active_id':parseInt(this.active_id)
            },
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
        }).then((res) => {
            this.active_name = res.data.active_name
            this.team_name = res.data.team_name
            this.group_type1 = this.group_type[res.data.group_type -1]
            this.competition_type1 = this.competition_type[res.data.competition_type -1]
            // console.log(this.group_type1,this.competition_type1)
            setShare2(this.active_name)
        }).catch((error) => {
            this.setTips('赛事信息获取出错了')
        });
        //获取地区
        axios({
            method: 'POST',
            url: "/Action.aspx",
            data: {
                'Action':'ActiveTypeAndPlace',
            },
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
        }).then((res) =>{
            res = res.data.place
            for(let i in res){
                this.provs.push(res[i].dict_desc);
            }
        }).catch((error) => {
            this.setTips('获取地区数据出错')
        });
        this.heartBeat()
    }
})