var images = {
	index:1,   //用于产生全局图片id，绑定已选择图片和已上传图片
	selectIds: {},  //保存已经选择的图片id
	uploadIds:{}  //保存已经上传到微信服务器的图片
};
var myImgArr = [];
var uploadFlag = true;
function setShare2(active_name) {
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
					title: '邀请您加入团队，参与报名！', // 分享标题
					link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
					title: '邀请您加入团队，参与报名！', // 分享标题
					desc: '当前活动：' + active_name, // 分享描述
					link: location.href, // 'http://192.168.22.68:8060/'
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
				$("#chooseImage").on("click", function () {
					wx.chooseImage({
						sizeType: ['compressed'],	// 可以指定是原图还是压缩图，默认二者都有
						success: function (res) {
							for (var i = 0; i < res.localIds.length; i++) {
								//全局图片id，绑定微信选择图片产生的localId，将用户选择图片追加到已选择图片
								var id = '' + images.index++; 
								images.selectIds[id] = res.localIds[i];  
								$('#imgs').append('<div class="imgdiv"><div class="box"><input class="removeMe" id="' + id +'" type="checkbox"/><label for="'+id+'"></label><img width="150" height="150" src="' + res.localIds[i] + '" /></div></div>');
							}
							//console.log('已选择了 ' + Object.keys(images.selectIds).length + ' 张图片');
						}
					});
					
				});
				// 5.3 上传图片
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
					var i = 0, length = Object.keys(images.selectIds).length;
					var selectIds = [];  //需要上传的图片的全局图片id
					for(var id in images.selectIds){
						selectIds.push(id);
					}
					var myLocalID = null;
					function upload(myIndex) {
						myLocalID = images.selectIds[selectIds[i]];
						wx.uploadImage({
							localId: myLocalID,  //根据全局图片id获取已选择图片
							isShowProgressTips: 0, // 默认为1，显示进度提示
							success: function (res) {
								//上传成功，images.selectIds中移除，images.uploadIds追加
								//图片从已选择移到已上传区域
								var selectId = selectIds[i];
								localId = images.selectIds[selectId];
								removeId(selectId);
								$('#uploadImgs').append('<div class="imgdiv"><div class="box"><span id="' + selectId +'" class="checkbox"></span><img width="150" height="150" src="' + localId + '" /></div></div>');
								images.uploadIds[selectId] = res.serverId
								i++;
								if (i < length) {
									upload(i);
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
								var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
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
					upload(0);
				});
				wx.error(function (res) {
					alert(res.errMsg);
				});
			});

			$("#imgs").on('click', ':checkbox', function(){
				alert('删除')
				var id = $(this).attr('id');
				removeId(id);
			});
			function removeId(id){
				if(id in images.selectIds){
					delete images.selectIds[id]
				}else{
					delete images.uploadIds[id]
				}
				$('#' + id).parent().parent().remove();
			}
		}
	});
}
