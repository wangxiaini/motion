let images = {
    index:1,   //用于产生全局图片id，绑定已选择图片和已上传图片
    selectIds: {},  //保存已经选择的图片id
    uploadIds:{}  //保存已经上传到微信服务器的图片
};
let myImgArr = [];
let uploadFlag = true;

let images2 = {
    index:1,   //用于产生全局图片id，绑定已选择图片和已上传图片
    selectIds: {},  //保存已经选择的图片id
    uploadIds:{}  //保存已经上传到微信服务器的图片
};
let myImgArr2 = [];
let uploadFlag2 = true;
function setShare2(active_id) {
    let shareUrl = (window.location.href).split('?')[0] + '?activeDetail=' + active_id;
    $.ajax({
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
            let wxConfig = JSON.parse(data);

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
                    title: '2018（第三届）“一带一路•七彩云南”国际汽车拉力赛报名', // 分享标题
                    link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'http://qdhd.cesa.org.cn/active_12/share.png', // 分享图标
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
                    title: '2018（第三届）“一带一路•七彩云南”国际汽车拉力赛报名', // 分享标题
                    desc: '期待您的参与', // 分享描述
                    link: shareUrl, // 'http://192.168.22.68:8060/'
                    imgUrl: 'http://qdhd.cesa.org.cn/active_12/share.png', // 分享图标
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

                // 5 图片接口
                // 5.1 拍照、本地选图
                //主驾驶
                $("#chooseImage").on("click", function () {

                    wx.chooseImage({
                        sizeType: ['compressed'],	// 可以指定是原图还是压缩图，默认二者都有
                        success: function (res) {
                            for (let i = 0; i < res.localIds.length; i++) {
                                //全局图片id，绑定微信选择图片产生的localId，将用户选择图片追加到已选择图片
                                let id = '' + images.index++;
                                images.selectIds[id] = res.localIds[i];
                                $('#imgs').append('<div class="imgdiv img1"><div class="box"><input class="removeMe" id="1_' + id +'" type="checkbox"/><label for="1_'+id+'"></label><img width="150" height="150" src="' + res.localIds[i] + '" /></div></div>');
                            }
                            //console.log('已选择了 ' + Object.keys(images.selectIds).length + ' 张图片');
                        }
                    });

                });
                //副驾驶
                $("#chooseImage2").on("click", function () {
                    wx.chooseImage({
                        sizeType: ['compressed'],	// 可以指定是原图还是压缩图，默认二者都有
                        success: function (res) {
                            for (let i = 0; i < res.localIds.length; i++) {
                                //全局图片id，绑定微信选择图片产生的localId，将用户选择图片追加到已选择图片
                                let id = '' + images2.index++;
                                images2.selectIds[id] = res.localIds[i];
                                $('#imgs2').append('<div class="imgdiv img2"><div class="box"><input class="removeMe" id="2_' + id +'" type="checkbox"/><label for="2_'+id+'"></label><img width="150" height="150" src="' + res.localIds[i] + '" /></div></div>');
                            }
                            //console.log('已选择了 ' + Object.keys(images.selectIds).length + ' 张图片');
                        }
                    });

                });
                // 5.3 上传图片
                //主驾驶
                $("#uploadImage").on("click", function () {
                    if (Object.keys(images.selectIds).length == 0) {
                        alert('请先选择图片');
                        return;
                    }
                    if(uploadFlag){
                        uploadFlag = false;
                    } else {
                        return
                    }
                    $("#uploadImage").html('上传中...');
                    let i = 0, length = Object.keys(images.selectIds).length;
                    let selectIds = [];  //需要上传的图片的全局图片id
                    for(let id in images.selectIds){
                        selectIds.push(id);
                    }
                    let myLocalID = null;
                    function upload1(myIndex) {
                        myLocalID = images.selectIds[selectIds[i]];
                        wx.uploadImage({
                            localId: myLocalID,  //根据全局图片id获取已选择图片
                            isShowProgressTips: 0, // 默认为1，显示进度提示
                            success: function (res) {
                                //上传成功，images.selectIds中移除，images.uploadIds追加
                                //图片从已选择移到已上传区域
                                let selectId = selectIds[i];
                                localId = images.selectIds[selectId];
                                removeId(selectId);
                                $('#uploadImgs').append('<div class="imgdiv img1"><div class="box"><span id="1_' + selectId +'" class="checkbox"></span><img width="150" height="150" src="' + localId + '" /></div></div>');
                                images.uploadIds[selectId] = res.serverId
                                i++;
                                if (i < length) {
                                    upload1(i);
                                }
                            },
                            fail: function (res) {
                                uploadFlag = true;
                                $("#uploadImage").html('确认并上传');
                                alert('wx:上传失败');
                            }
                        });
                        wx.getLocalImgData({
                            localId: myLocalID, // 图片的localID
                            success: function (res) {
                                let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                                $.ajax({
                                    type: "post",
                                    async: false,
                                    url: '/Action.aspx',
                                    timeout:10000,
                                    data: {
                                        'Action': 'SubmitUserPic',
                                        'picBase64': localData
                                    },
                                    dataType: "text",
                                    success: function (res) {
                                        myImgArr.push(res);
                                        if(myIndex == length - 1){
                                            uploadFlag = true;
                                            $("#uploadImage").html('确认并上传');
                                        }
                                    },
                                    error: function (e) {
                                        uploadFlag = true;
                                        $("#uploadImage").html('确认并上传');
                                        alert('上传失败');
                                    }
                                });
                            },
                            error: function() {
                                uploadFlag = true;
                                $("#uploadImage").html('确认并上传');
                                alert('wx:上传出错');
                            }
                        });
                    }
                    upload1(0);
                });
                //副驾驶
                $("#uploadImage2").on("click", function () {
                    if (Object.keys(images2.selectIds).length == 0) {
                        alert('请先选择图片');
                        return;
                    }
                    if(uploadFlag2){
                        uploadFlag2 = false;
                    } else {
                        return
                    }
                    $("#uploadImage2").html('上传中...');
                    let i = 0, length = Object.keys(images2.selectIds).length;
                    let selectIds = [];  //需要上传的图片的全局图片id
                    for(let id in images2.selectIds){
                        selectIds.push(id);
                    }
                    let myLocalID = null;
                    function upload2(myIndex) {
                        myLocalID = images2.selectIds[selectIds[i]];
                        wx.uploadImage({
                            localId: myLocalID,  //根据全局图片id获取已选择图片
                            isShowProgressTips: 0, // 默认为1，显示进度提示
                            success: function (res) {
                                //上传成功，images.selectIds中移除，images.uploadIds追加
                                //图片从已选择移到已上传区域
                                let selectId = selectIds[i];
                                localId = images2.selectIds[selectId];
                                removeId2(selectId);
                                $('#uploadImgs2').append('<div class="imgdiv img2"><div class="box"><span id="2_' + selectId +'" class="checkbox"></span><img width="150" height="150" src="' + localId + '" /></div></div>');
                                images2.uploadIds[selectId] = res.serverId
                                i++;
                                if (i < length) {
                                    upload2(i);
                                }
                            },
                            fail: function (res) {
                                uploadFlag2 = true;
                                $("#uploadImage2").html('确认并上传');
                                alert('wx:上传失败');
                            }
                        });
                        wx.getLocalImgData({
                            localId: myLocalID, // 图片的localID
                            success: function (res) {
                                let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                                $.ajax({
                                    type: "post",
                                    async: false,
                                    url: '/Action.aspx',
                                    timeout:10000,
                                    data: {
                                        'Action': 'SubmitUserPic',
                                        'picBase64': localData
                                    },
                                    dataType: "text",
                                    success: function (res) {
                                        myImgArr2.push(res);
                                        if(myIndex == length - 1){
                                            uploadFlag2 = true;
                                            $("#uploadImage2").html('确认并上传');
                                        }
                                    },
                                    error: function (e) {
                                        uploadFlag2 = true;
                                        $("#uploadImage2").html('确认并上传');
                                        alert('上传失败');
                                    }
                                });
                            },
                            error: function() {
                                uploadFlag2 = true;
                                $("#uploadImage2").html('确认并上传');
                                alert('wx:上传出错');
                            }
                        });
                    }
                    upload2(0);
                });
                //
                wx.error(function (res) {
                    alert(res.errMsg);
                });
            });

            $("#imgs").on('click', ':checkbox', function(){
                alert('删除')
                let id = $(this).attr('id').split('_')[1];
                removeId(id);
            });
            function removeId(id){
                if(id in images.selectIds){
                    delete images.selectIds[id]
                }else{
                    delete images.uploadIds[id]
                }
                $('#1_' + id).parent().parent().remove();
            }
            $("#imgs2").on('click', ':checkbox', function(){
                alert('删除')
                let id = $(this).attr('id').split('_')[1];
                removeId2(id);
            });
            function removeId2(id){
                if(id in images2.selectIds){
                    delete images2.selectIds[id]
                }else{
                    delete images2.uploadIds[id]
                }
                $('#2_' + id).parent().parent().remove();
            }
        }
    });
}
