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
var vm = new Vue({
    el:"#app",
    data () {
        return {
            blood_type: ['A型','B型','AB型','O型','其他'],
            default_blood: '0',
            sex_type: ['男','女'],
            default_sex: '0',
            default_blood2: '0',
            default_sex2: '0',
            driver:{
                //司机
                name: '',
                blood_type: '1',
                sex: '1',
                date_of_birth: '',
                place_of_birth: '',
                healthy: '',
                id_card_no: '',
                occupation: '',
                passport_no: '',
                nationalitry: '',
                driver_license: '',
                racing_license: '',
                mobile: '',
                email: '',
                address: '',
            },
            copilot: {
                //副驾驶
                name: '',
                blood_type: '1',
                sex: '1',
                date_of_birth: '',
                place_of_birth: '',
                healthy: '',
                id_card_no: '',
                occupation: '',
                passport_no: '',
                nationalitry: '',
                driver_license: '',
                racing_license: '',
                mobile: '',
                email: '',
                address: ''
            },
            enrolment: {
                //报名者
                name: "",
                car_team: "",
                telephone: "",
                email: "",
                address: ""
            },
            car: {
                //车辆
                manufacturer: '',  //厂牌
                type: '',  //车型
                color: '', //颜色
                engine_no: '', //发动机型号
                insurance_of_car_no: '', //车保险
                drive_no: '', //行驶证号
                exhaust_capability: '', //排气量
                group: '', //组别
                chassis_No: '', //底盘号
                insurance_of_erson_no: '' //第三者责任保险单号
            },
            concat: {
                //紧急联系方式
                name: '',
                relationship: '',
                telephone: '',
                mobile: ''
            },
            closeStat: false,
            switchFlag: '',
            tips: '',
            isend: false,
            setTips: function (tips) {
                this.$set(this, 'tips', tips);
                setTimeout(() => {
                    this.$set(this, 'tips', '');
                }, 2000)
            },
            getQueryString: function (name){
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
        }
    },
    watch:{
        default_blood:function (oldVal) {
            this.driver.blood_type = oldVal + 1
        },
        default_sex:function (oldVal) {
            this.driver.sex = oldVal + 1
        },
        default_blood2:function (oldVal) {
            this.copilot.blood_type = oldVal + 1
        },
        default_sex2:function (oldVal) {
            this.copilot.sex = oldVal + 1
        },
    },
    methods: {
        //禁止弹出手机输入法
        blur(){
            document.activeElement.blur();
        },
        closeStatfn(){
            this.closeStat = !this.closeStat
        },
        toPayInfo(){
            this.driver.date_of_birth = sessionStorage.getItem('time1')
            this.copilot.date_of_birth = sessionStorage.getItem('time2')
            const MATCH_ID = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
            const MATCH_MAIL = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            const MATCH_PHONE = /^1(3|4|5|6|7|8|9)\d{9}$/
            const MATCH_VAL = /(select|insert|delete|from|drop table|update|truncate|exec master|netlocalgroup administrators|:|net user|or|and|=|!|')/g
            if(this.tips){
                return
            }
            // //车手
            if(!this.driver.name) {
                this.setTips('请填写车手姓名')
                return
            }
            if(MATCH_VAL.test(this.driver.name)) {
                this.setTips('车手姓名输入含有非法字符')
                return
            }
            if(!this.driver.blood_type) {
                this.setTips('请填写车手血型')
                return
            }
            if(!this.driver.sex) {
                this.setTips('请填写车手性别')
                return
            }
            if(!this.driver.date_of_birth) {
                this.setTips('请填写车手出生日期')
                return
            }
            if(!this.driver.place_of_birth) {
                this.setTips('请填写车手出生地址')
                return
            }
            if(MATCH_VAL.test(this.driver.place_of_birth)) {
                this.setTips('车手出生地址输入含有非法字符')
                return
            }
            if(!this.driver.healthy) {
                this.setTips('请填写车手健康状态')
                return
            }
            if(MATCH_VAL.test(this.driver.healthy)) {
                this.setTips('车手健康状态输入含有非法字符')
                return
            }
            if(!this.driver.id_card_no) {
                this.setTips('请填写车手身份证号')
                return
            }
            if(!MATCH_ID.test(this.driver.id_card_no)) {
                this.setTips('车手身份证号格式错误')
                return
            }
            if(!this.driver.occupation) {
                this.setTips('请填写车手职业')
                return
            }
            if(MATCH_VAL.test(this.driver.occupation)) {
                this.setTips('车手职业输入含有非法字符')
                return
            }
            if(!this.driver.passport_no) {
                this.setTips('请填写车手护照号码')
                return
            }
            if(MATCH_VAL.test(this.driver.passport_no)) {
                this.setTips('车手护照号码输入含有非法字符')
                return
            }
            if(!this.driver.nationalitry) {
                this.setTips('请填写车手国籍')
                return
            }
            if(MATCH_VAL.test(this.driver.nationalitry)) {
                this.setTips('车手国籍输入含有非法字符')
                return
            }
            if(!this.driver.driver_license) {
                this.setTips('请填写车手驾驶证号码')
                return
            }
            if(MATCH_VAL.test(this.driver.driver_license)) {
                this.setTips('车手驾驶证号码输入含有非法字符')
                return
            }
            if(!this.driver.racing_license) {
                this.setTips('请填写车手参赛执照')
                return
            }
            if(MATCH_VAL.test(this.driver.racing_license)) {
                this.setTips('车手参赛执照输入含有非法字符')
                return
            }
            if(!this.driver.mobile) {
                this.setTips('请填写车手手机号')
                return
            }
            if(!MATCH_PHONE.test(this.driver.mobile)) {
                this.setTips('车手手机号格式错误')
                return
            }
            if(!this.driver.email) {
                this.setTips('请填写车手邮箱')
                return
            }
            if(!MATCH_MAIL.test(this.driver.email)) {
                this.setTips('车手邮箱格式错误')
                return
            }
            if(MATCH_VAL.test(this.driver.email)) {
                this.setTips('车手邮箱输入含有非法字符')
                return
            }
            if(!this.driver.address) {
                this.setTips('请填写车手居住地址')
                return
            }
            if(MATCH_VAL.test(this.driver.address)) {
                this.setTips('车手居住地址输入含有非法字符')
                return
            }

            // 副驾驶
            if(!this.copilot.name) {
                this.setTips('请填副驾驶手姓名')
                return
            }
            if(MATCH_VAL.test(this.copilot.name)) {
                this.setTips('副驾驶姓名输入含有非法字符')
                return
            }
            if(!this.copilot.blood_type) {
                this.setTips('请填写副驾驶血型')
                return
            }
            if(!this.copilot.sex) {
                this.setTips('请填写副驾驶性别')
                return
            }
            if(!this.copilot.date_of_birth) {
                this.setTips('请填写副驾驶出生日期')
                return
            }
            if(!this.copilot.place_of_birth) {
                this.setTips('请填写副驾驶出生地址')
                return
            }
            if(MATCH_VAL.test(this.copilot.place_of_birth)) {
                this.setTips('车手副驾驶地址输入含有非法字符')
                return
            }
            if(!this.copilot.healthy) {
                this.setTips('请填写副驾驶健康状态')
                return
            }
            if(MATCH_VAL.test(this.copilot.healthy)) {
                this.setTips('副驾驶健康状态输入含有非法字符')
                return
            }
            if(!this.copilot.id_card_no) {
                this.setTips('请填写副驾驶身份证号')
                return
            }
            if(!MATCH_ID.test(this.copilot.id_card_no)) {
                this.setTips('副驾驶身份证号格式错误')
                return
            }
            if(!this.copilot.occupation) {
                this.setTips('请填写副驾驶职业')
                return
            }
            if(MATCH_VAL.test(this.copilot.occupation)) {
                this.setTips('副驾驶职业输入含有非法字符')
                return
            }
            if(!this.copilot.passport_no) {
                this.setTips('请填写副驾驶护照号码')
                return
            }
            if(MATCH_VAL.test(this.copilot.passport_no)) {
                this.setTips('副驾驶护照号码输入含有非法字符')
                return
            }
            if(!this.copilot.nationalitry) {
                this.setTips('请填写副驾驶国籍')
                return
            }
            if(MATCH_VAL.test(this.copilot.nationalitry)) {
                this.setTips('副驾驶国籍输入含有非法字符')
                return
            }
            if(!this.copilot.driver_license) {
                this.setTips('请填写副驾驶驾驶证号码')
                return
            }
            if(MATCH_VAL.test(this.copilot.driver_license)) {
                this.setTips('副驾驶驾驶证号码输入含有非法字符')
                return
            }
            if(!this.copilot.racing_license) {
                this.setTips('请填写副驾驶参赛执照')
                return
            }
            if(MATCH_VAL.test(this.copilot.racing_license)) {
                this.setTips('副驾驶参赛执照输入含有非法字符')
                return
            }
            if(!this.copilot.mobile) {
                this.setTips('请填写副驾驶手机号')
                return
            }
            if(!MATCH_PHONE.test(this.copilot.mobile)) {
                this.setTips('副驾驶手机号格式错误')
                return
            }
            if(!this.copilot.email) {
                this.setTips('请填写副驾驶邮箱')
                return
            }
            if(!MATCH_MAIL.test(this.copilot.email)) {
                this.setTips('副驾驶邮箱格式错误')
                return
            }
            if(MATCH_VAL.test(this.copilot.email)) {
                this.setTips('副驾驶邮箱输入含有非法字符')
                return
            }
            if(!this.copilot.address) {
                this.setTips('请填写副驾驶居住地址')
                return
            }
            if(MATCH_VAL.test(this.copilot.address)) {
                this.setTips('副驾驶居住地址输入含有非法字符')
                return
            }
            // 报名信息
            if(MATCH_VAL.test(this.enrolment.name)) {
                this.setTips('报名者输入含有非法字符')
                return
            }
            if(MATCH_VAL.test(this.enrolment.car_team)) {
                this.setTips('所属车队输入含有非法字符')
                return
            }
            if(this.enrolment.telephone){
                if(!MATCH_PHONE.test(this.enrolment.telephone)) {
                    this.setTips('报名者手机号格式错误')
                    return
                }
            }
            if(MATCH_VAL.test(this.enrolment.telephone)) {
                this.setTips('报名者联系电话入含有非法字符')
                return
            }
            if(this.enrolment.email){
                if(!MATCH_MAIL.test(this.enrolment.email)) {
                    this.setTips('报名者邮箱格式错误')
                    return
                }
            }
            if(MATCH_VAL.test(this.enrolment.email)) {
                this.setTips('报名者电子邮件输入含有非法字符')
                return
            }
            if(MATCH_VAL.test(this.enrolment.address)) {
                this.setTips('报名者地址输入含有非法字符')
                return
            }
            // 车辆信息
            if(!this.car.manufacturer) {
                this.setTips('请填写厂牌')
                return
            }
            if(MATCH_VAL.test(this.car.manufacturer)) {
                this.setTips('厂牌输入含有非法字符')
                return
            }
            if(!this.car.type) {
                this.setTips('请填写车型')
                return
            }
            if(MATCH_VAL.test(this.car.type)) {
                this.setTips('车型输入含有非法字符')
                return
            }
            if(!this.car.color) {
                this.setTips('请填写车的颜色')
                return
            }
            if(MATCH_VAL.test(this.car.color)) {
                this.setTips('车的颜色输入含有非法字符')
                return
            }
            if(!this.car.engine_no) {
                this.setTips('请填写发动机号码')
                return
            }
            if(MATCH_VAL.test(this.car.engine_no)) {
                this.setTips('发动机号码输入含有非法字符')
                return
            }
            if(!this.car.insurance_of_car_no) {
                this.setTips('请填写车损险，保险单号')
                return
            }
            if(MATCH_VAL.test(this.car.insurance_of_car_no)) {
                this.setTips('车损险，保险单号输入含有非法字符')
                return
            }
            if(!this.car.drive_no) {
                this.setTips('请填写行驶证号')
                return
            }
            if(MATCH_VAL.test(this.car.drive_no)) {
                this.setTips('行驶证号输入含有非法字符')
                return
            }
            if(!this.car.exhaust_capability) {
                this.setTips('请填写排气量')
                return
            }
            if(MATCH_VAL.test(this.car.exhaust_capability)) {
                this.setTips('排气量输入含有非法字符')
                return
            }
            if(!this.car.group) {
                this.setTips('请填写组别')
                return
            }
            if(MATCH_VAL.test(this.car.group)) {
                this.setTips('组别输入含有非法字符')
                return
            }
            if(!this.car.chassis_No) {
                this.setTips('请填写底牌号码')
                return
            }
            if(MATCH_VAL.test(this.car.chassis_No)) {
                this.setTips('底牌号码输入含有非法字符')
                return
            }
            if(!this.car.insurance_of_erson_no) {
                this.setTips('请填写第三者责任保险单号')
                return
            }
            if(MATCH_VAL.test(this.car.insurance_of_erson_no)) {
                this.setTips('第三者责任保险单号输入含有非法字符')
                return
            }
            // 紧急联系人
            if(!this.concat.name) {
                this.setTips('请填写紧急联系人姓名')
                return
            }
            if(MATCH_VAL.test(this.concat.name)) {
                this.setTips('紧急联系人姓名输入含有非法字符')
                return
            }
            if(!this.concat.relationship) {
                this.setTips('请填写紧急联系人与本人关系')
                return
            }
            if(MATCH_VAL.test(this.concat.relationship)) {
                this.setTips('紧急联系人与本人关系输入含有非法字符')
                return
            }
            if(!this.concat.telephone) {
                this.setTips('请填写紧急联系人联系电话')
                return
            }
            if(MATCH_VAL.test(this.concat.telephone)) {
                this.setTips('紧急联系人联系电话输入含有非法字符')
                return
            }
            if(!this.concat.mobile) {
                this.setTips('请填写紧急联系人联系手机')
                return
            }
            if(MATCH_VAL.test(this.concat.mobile)) {
                this.setTips('紧急联系人手机号输入含有非法字符')
                return
            }
            if(!this.switchFlag) {
                this.setTips('请先勾选免责声明')
                return
            }
            axios({
                method: 'POST',
                url: "/Action.aspx",
                data: {
                    'Action':'AddCarteamEnroll',
                    'active_id': this.getQueryString('id'),
                    'user_name':this.enrolment.name,
                    'team_name': this.enrolment.car_team,
                    'telephone': this.enrolment.telephone,
                    'mail': this.enrolment.email,
                    'address': this.enrolment.address,
                    'name1': this.driver.name,
                    'blood_type1': this.driver.blood_type,
                    'sex1': this.driver.sex,
                    'date_birth1': this.driver.date_of_birth,
                    'place_birth1':this.driver.place_of_birth,
                    'healthy1':this.driver.healthy,
                    'id_card_no1':this.driver.id_card_no,
                    'occupation1': this.driver.occupation,
                    'passport_no1': this.driver.passport_no,
                    'nationality1': this.driver.nationalitry,
                    'driver_license1': this.driver.driver_license,
                    'racing_license1': this.driver.racing_license,
                    'mobile1': this.driver.mobile,
                    'mail1': this.driver.email,
                    'address1': this.driver.address,
                    'image1': myImgArr.join(';'),
                    'name2': this.copilot.name,
                    'blood_type2': this.copilot.blood_type,
                    'sex2': this.copilot.sex,
                    'date_birth2': this.copilot.date_of_birth,
                    'place_birth2': this.copilot.place_of_birth,
                    'healthy2': this.copilot.healthy,
                    'id_card_no2': this.copilot.id_card_no,
                    'occupation2': this.copilot.occupation,
                    'passport_no2': this.copilot.passport_no,
                    'nationality2': this.copilot.nationalitry,
                    'driver_license2': this.copilot.driver_license,
                    'racing_license2': this.copilot.racing_license,
                    'mobile2': this.copilot.mobile,
                    'mail2': this.copilot.email,
                    'address2': this.copilot.address,
                    'image2': myImgArr2.join(';'),
                    'manufacturer': this.car.manufacturer,
                    'car_type': this.car.type,
                    'color': this.car.color,
                    'engine_no': this.car.engine_no,
                    'insurance_no': this.car.insurance_of_car_no,
                    'drive_no': this.car.drive_no,
                    'exhaust': this.car.exhaust_capability,
                    'groups': this.car.group,
                    'chassis_no': this.car.chassis_No,
                    'person_no': this.car.insurance_of_erson_no,
                    'name3': this.concat.name,
                    'relation': this.concat.relationship,
                    'telephone3': this.concat.telephone,
                    'mobile3': this.concat.mobile
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
                    this.setTips('程序错误，请刷新')
                }else if(res.data == -2){
                    this.setTips('未验证手机号')
                }else if(res.data > 0){
                    sessionStorage.setItem('rally','1')
                    localStorage.setItem('carTeam',res.data)
                    window.location.href = "/CESADefault.aspx?signInfo=1"
                }else if(res.data == -4){
                    this.setTips('已报名，请勿重复报名')
                }
            }).catch((error) => {
                this.setTips('网络异常')
            });
        },
        closeMask(){
            this.isend = !this.isend
        }
    },
    mounted () {
        this.heartBeat()
        localStorage.setItem('active_id',this.getQueryString('id'))
        setShare2(this.getQueryString('id'))
        // console.log(this.getQueryString('id'))
        new Mdate("dateShowBtn", {
            //"dateShowBtn"为你点击触发Mdate的id，必填项
            acceptId: "dateSelectorTwo",
            //此项为你要显示选择后的日期的input，不填写默认为上一行的"dateShowBtn"
            beginYear: "1930",
            //此项为Mdate的初始年份，不填写默认为2000
            beginMonth: "",
            //此项为Mdate的初始月份，不填写默认为1
            beginDay: "",
            //此项为Mdate的初始日期，不填写默认为1
            endYear: "",
            //此项为Mdate的结束年份，不填写默认为当年
            endMonth: "",
            //此项为Mdate的结束月份，不填写默认为当月
            endDay: "",
            //此项为Mdate的结束日期，不填写默认为当天
            format: "-"
            //此项为Mdate需要显示的格式，可填写"/"或"-"或".",不填写默认为年月日
        })
        new Mdate("dateShowBtn2", {
            //"dateShowBtn"为你点击触发Mdate的id，必填项
            acceptId: "dateSelectorTwo2",
            //此项为你要显示选择后的日期的input，不填写默认为上一行的"dateShowBtn"
            beginYear: "1930",
            //此项为Mdate的初始年份，不填写默认为2000
            beginMonth: "",
            //此项为Mdate的初始月份，不填写默认为1
            beginDay: "",
            //此项为Mdate的初始日期，不填写默认为1
            endYear: "",
            //此项为Mdate的结束年份，不填写默认为当年
            endMonth: "",
            //此项为Mdate的结束月份，不填写默认为当月
            endDay: "",
            //此项为Mdate的结束日期，不填写默认为当天
            format: "-"
            //此项为Mdate需要显示的格式，可填写"/"或"-"或".",不填写默认为年月日
        })
    }
})