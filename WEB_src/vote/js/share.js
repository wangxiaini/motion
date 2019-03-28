// 分享成功获取积分
function ShareUniversal(id) {
    $.ajax({
        url: '/Action.aspx',
        type: 'post',
        dataType: 'json',
        data: { 'Action': 'ShareUniversal', 'active_id': id},
        success: function (res) {
            $('.mask_rule').show();
            $('.mask').hide();
            $('.hint').text('分享成功！');
            if (res.code === -3){
                $('.num').text('');
            } else {
              $('.num').text(res.message);
            }
        },
        error () {
            $('.mask_rule').show();
            $('.hint').text('分享成功！');
            $('.num').text('投票次数获取失败');
        }
    });
}
function share (title,imgUrl,desc,id) {
    $.ajax({
        beforeSend: function () { },
        url: "/Action.aspx",
        type: "POST",
        dataType: "text",
        data: {
            "Action": "JsapiTicket",
            url: location.href.split('#')[0]
        },
        error: function () { },
        success: function (data) {
            var wxConfig = JSON.parse(data);
            wx.config({
                debug: false,
                appId: wxConfig.appId, // 必填，公众号的唯一标识
                timestamp: wxConfig.timestamp, // 必填，生成签名的时间戳
                nonceStr: wxConfig.nonceStr, // 必填，生成签名的随机串
                signature: wxConfig.signature,// 必填，签名
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
            });
            wx.ready(function () {
                wx.onMenuShareTimeline({
                    title, // 分享标题
                    link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        // alert('分享朋友圈success');
                        ShareUniversal(id);
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        // alert('分享朋友圈cancel');
                    },
                    fail: function (res) {
                        // alert('分享朋友圈' + JSON.stringify(res));

                    }
                });

                //分享给朋友
                wx.onMenuShareAppMessage({
                    title, // 分享标题
                    desc, // 分享描述
                    link: location.href,
                    imgUrl, // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        // alert('分享好友success');
                        ShareUniversal(id);
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        // alert('分享好友cancel');
                    },
                    fail: function (res) {
                        // alert('分享好友' + JSON.stringify(res));
                    }
                });
                wx.error(function (res) {
                    // alert('JsapiTicket获取失败');
                });
            });
        }
    });
}
