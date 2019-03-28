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
const ACTIVE_ID = 16;
const PRICE_ALCOGOL = 300;
const PRICE_WASH = 238;
const OPRICE_ALCOGOL = 816;
const OPRICE_WASH = 298;
const PRICE_LOVE1 = 1;
const PRICE_LOVE2 = 10;
const PRICE_LOVE3 = 100;
function baseAjax(options){
    options = options || {};                                //默认对象;
    options.method = (options.method || "GET").toUpperCase();   //默认为GET请求;
    options.dataType = options.dataType || 'json';          //默认返回类型为JSON；
    options.async = options.async || true;                  //默认为异步请求;

    var params = getParams(options.data); //数据;
    var xhr = (window.XMLHttpRequest)? new XMLHttpRequest(): new ActiveXObject("Microsoft.XMLHTTP");

    xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
            var status = xhr.status;
            if(status>=200 && status <300)  //发送成功
                options.success && options.success(xhr.responseText,xhr.responseXML);
            else{                           //执行成功;
                options.fail && options.fail(status);
            }
        }
    };
    //数据发送;
    xhr.open('POST',options.url,options.async);
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    xhr.send(params);
}
function getParams(data){
    var arr=[];
    for(var param in data){
        arr.push(encodeURIComponent(param)+'='+encodeURIComponent(data[param]));
    }
    arr.push(('randomNumber='+Math.random()).replace('.'));
    return arr.join('&');
}
function setShare(myTit, myDesc, myUrl) {
    var sTitle = myTit || '中企体育平台';
    var sDesc = myDesc || '团结全国企业力量，弘扬体育精神，积极开展企业体育运动，增强广大职工身体素质，推动全民健身活动，促进经济发展和社会文明进步';
    var sUrl = myUrl || location.href;
    baseAjax({
        beforeSend: function(){},
        url: "/Action.aspx",
        type: "POST",
        dataType: "text",
        data: {
            "Action": "JsapiTicket",
            url: location.href.split('#')[0]
        },
        error: function() {},
        success: function(data) {
            var wxConfig = JSON.parse(data);
            wx.config({
                debug: false,
                appId: wxConfig.appId, // 必填，公众号的唯一标识
                timestamp: wxConfig.timestamp, // 必填，生成签名的时间戳
                nonceStr: wxConfig.nonceStr, // 必填，生成签名的随机串
                signature: wxConfig.signature,// 必填，签名
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage','chooseImage', 'uploadImage'] // 必填，需要使用的JS接口列表
            });
            wx.ready(function(){
                wx.onMenuShareTimeline({
                    title: sTitle, // 分享标题
                    link: sUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'https://gd.cesa.org.cn/images/share.png', // 分享图标
                    success: function() {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    },
                    fail: function(res) {
                        // alert(JSON.stringify(res));
                    }
                });

                //分享给朋友
                wx.onMenuShareAppMessage({
                    title: sTitle, // 分享标题
                    desc: sDesc, // 分享描述
                    link: sUrl, // 'http://192.168.22.68:8060/'
                    imgUrl: 'https://gd.cesa.org.cn/images/share.png', // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function() {
                        // 用户确认分享后执行的回调函数
                        // alert('已分享');
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                        // alert('已取消');
                    }
                });
                wx.error(function (res) {
                    // alert(res.errMsg);
                });
            });
        }
    });
}
let provinces = ['全部地区','福建', '广东', '贵州', '河南', '湖南', '陕西', '山西', '云南', '安徽', '澳门', '北京', '重庆', '甘肃', '广西', '海南', '河北', '黑龙江', '湖北', '江苏', '江西', '吉林', '辽宁', '内蒙古', '宁夏', '青海', '山东', '上海', '四川', '台湾', '天津', '香港', '新疆', '西藏', '浙江'];
function matchNull(n) {
    return (n ? n : '-');
};
function sliceTime(time) {
    return (time ? (time.toString().slice(0,time.indexOf('T')).replace(/\-/g, '.')) : '-');
}
function formatTime(time) {
   return (time.split('T')[0]).split('-')[0] + '年' + (time.split('T')[0]).split('-')[1] + '月' + (time.split('T')[0]).split('-')[1] + '日'
}
function sliceTime2(time) {
    return (time ? time.toString().replace('T',' ') : '-');
}
function getQueryString(name){
    var reg =new RegExp('(^|&)'+name+'=([^&]*)(&|$)','i');
    var r = window.location.search.substr(1).match(reg);
    if(r !=null){
        return unescape(r[2]);
    }
    return null;
}
function splitPath(n,num) {
    return (n ? n.split(';')[num] : '');
}
function caseNumer(n){
    return (n > 0 ? n : this.str);
}
function caseNumber2(n) {
    return (n < 0 ?  '' : n);
}
function getScrollTop() {
    var scrollTop = 0;
    if(document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if(document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}
function getClientHeight() {
    var clientHeight = 0;
    if(document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
    } else {
        clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
    }
    return clientHeight;
}
function getScrollHeight () {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}
function setTips(tips) {
    this.$set(this, 'tips', tips);
    setTimeout(() => {
      this.$set(this, 'tips', '');
    }, 2000)
}
function ReviseURL(str) {
    var url = window.location.href;
    return url.split('?')[0] + '?' + str;
}
setInterval(function () {
    baseAjax({
        url: "/Action.aspx",
        type: "POST",
        data: {
            "Action": "HeartBeat",
        },
        error: function() {},
        success: function() {}
    })
},300000)
