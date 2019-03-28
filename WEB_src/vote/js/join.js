
var imgBase = '';
var imgType = '';
var loginApp = {
    numAll:2,
    flg1:true,
    flg2:true,
    flg3:true,
    testArr:[],
    testArr2:[],
    jobArr:['',"球员","球队"],
    jobArr1:['',"行业组11人制","行业组室外5人制","社会组11人制","社会组室外5人制",],
    imgUrl:'',
    init:function () {
        this.clickAll();
        this.addJob();
        this.addJob1();
        $('#work').find('option:eq(1)').attr('selected','selected');
    },
    addJob:function () {
        var htmls='';
        for(var i=1;i<this.jobArr.length;i++){
            htmls+='<option value="'+i+'">'+this.jobArr[i]+'</option>';
        }
        $('#work').html(htmls);
    },
    addJob1:function () {
      var htmls='';
      for(var i=1;i<this.jobArr1.length;i++){
          htmls+='<option value="'+i+'">'+this.jobArr1[i]+'</option>';
      }
      $('#work1').html(htmls);
  },
    clickAll:function () {
        var that = this;
        $('#Add').click(function () {
            if(that.numAll>5){
                //alert('最多填写5个亲属信息');
                return;
            }
            $('.formGroup_all2 .formGroup').last().addClass('formGroup1');
            that.addHtml(that.numAll);

            that.numAll++;
        });
        $('#submit').click(function () {
            var options=$("#work option:selected");
            var options1=$("#work1 option:selected");
            // alert(options.val()); //拿到选中项的值
            if(that.flg2==false){
                return false;
            }
            if(that.condition()==false){
                return false;
            }
            // alert(that.jobJson());
            if(that.imgUrl==''){
                $('.alertContent').attr('style','display:block');
                $('#alertContent').text('图片正在上传中');
                return false;
            }
            that.flg2=false;
            // var jsons = '{"active_id":16 ,"company":"'+$('#company').val()+'","author_name":"'+$('#author_name').val()+'","author_type":'+ options.val() +',"group_com_type":'+ options1.val() +',"remark":"'+$('#superiority').val()+'","active_imgurl":"/uploadImage/'+that.imgUrl+'"}';
            $.ajax({
                async: false, // 默认true(异步请求)
                cache: false, // 默认true,设置为 false 将不会从浏览器缓存中加载请求信息。
                type: 'POST',
                dataType: 'json',
                url: '/Action.aspx',
                data: {
                    'Action': 'AddActiveInfo',
                    // "content":jsons
                    'active_id': 16,
                    'company': $('#company').val(),
                    'author_name':$('#author_name').val(),
                    'author_type': options.val(),
                    'group_com_type': options1.val(),
                    "remark": $('#superiority').val(),
                    "active_imgurl":"/uploadImage/"+that.imgUrl+""
                },
                success: function(res) {
                    that.flg2=true;
                    if(res == '-1'){
                      $('#alertContent').text('没有上传权限');
                      $('.alertContent').show();
                    }else if(res == '-2'){
                      $('#alertContent').text('程序出错');
                      $('.alertContent').show();
                    } else {
                      $('.alertContent').hide();
                      window.location.href = '/CESADefault.aspx?vote=index';
                    } 
                },
                error:function (res) {
                    that.flg2=true;
                    $('.alertContent').attr('style','display:block');
                    $('#alertContent').text('网络出错！');
                }
            })
        });
    },
    jobJson:function () {
        var arr = [];
        for(var i=0;i<this.testArr.length;i++){
            var result = this.testArr[i].split('|');
            arr.push('{"children_name":"'+result[0]+'","children_sex":'+result[2]+',"children_age":'+result[1]+',"relationship":'+result[3]+'}')
        }
        return arr;
    },
    filechange:function (event) {
        var that = this;
        if(that.flg3==false){
            return false;
        }
        that.flg3=false;
        var files = event.target.files, file;
        var result='';
        if (files && files.length > 0) {
            // 获取目前上传的文件
            file = files[0];// 文件大小校验的动作
            imgType = file.type.split('/')[1];
            if(file.size > 1024 * 1024 * 10) {
                that.flg3=true;
                alert('图片大小不能超过 5MB!');
                return false;
            }
            if(!/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(file.type)) {
                that.flg3=true;
                alert('请选择图片');
                return false;
            }
            // 获取 window 的 URL 工具
            var URL = window.URL || window.webkitURL;
            // 通过 file 生成目标 url
            var imgURL = URL.createObjectURL(file);
            var Orientation = null;



            if (file) {
                // var URL = URL || webkitURL;
                //获取照片方向角属性，用户旋转控制
                EXIF.getData(file, function () {
                    EXIF.getAllTags(this);
                    Orientation = EXIF.getTag(this, 'Orientation');//这个Orientation 就是我们判断需不需要旋转的值了，有1、3、6、8
                });
                var reader = new FileReader();
                reader.onload = (function (file) {
                    return function (e) {
                        // console.log(this.result); //这个就是base64的数据了
                        imgBase = this.result;
                        var image = new Image();
                        image.src = e.target.result;
                        image.onload = function() {
                            var expectWidth = this.naturalWidth;
                            var expectHeight = this.naturalHeight;
                            if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {
                                expectWidth = 800;
                                expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
                            } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {
                                expectHeight = 1200;
                                expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
                            }
                            var canvas = document.createElement("canvas");
                            var ctx = canvas.getContext("2d");
                            canvas.width = expectWidth;
                            canvas.height = expectHeight;
                            ctx.drawImage(this, 0, 0, expectWidth, expectHeight);

                            //如果方向角不为1，都需要进行旋转

                            if (Orientation != "" && Orientation != 1) {
                                switch (Orientation) {
                                    case 6://需要顺时针（向左）90度旋转
                                        //alert('（向左）90度旋转');
                                        rotateImg(this, 'left', canvas);
                                        break;
                                    case 8://需要逆时针（向右）90度旋转
                                        //alert('向右）90度旋转');
                                        rotateImg(this, 'right', canvas);
                                        break;
                                    case 3://需要180度旋转
                                        //alert('需要180度旋转');
                                        rotateImg(this, 'right', canvas);//转两次
                                        rotateImg(this, 'right', canvas);
                                        break;
                                }

                            }
                            if(file.size > 1024 * 1024 * 3) {
                                var mpImg = new MegaPixImage(image);
                                mpImg.render(canvas, {
                                    maxWidth: 800,
                                    maxHeight: 1200,
                                    quality: 0.8,
                                    orientation: Orientation
                                });
                            }
                            var base64 = canvas.toDataURL("image/jpeg", 0.8);
                            $.ajax({
                                async: false, // 默认true(异步请求)
                                cache: false, // 默认true,设置为 false 将不会从浏览器缓存中加载请求信息。
                                type: 'POST',
                                dataType: 'text',
                                url: '/Action.aspx',
                                data: {
                                    'Action': 'UploadImages',
                                    "imagesCode":base64.split(',')[1], //
                                    "imgWidth":"500",
                                    "imgHight":'500',
                                    "imgType":imgType
                                },
                                success: function (res) {
                                  
                                    that.flg3=true;
                                    var datas = res;
                                    //console.log(datas)
                                    if(res!=null || res!=''){
                                        that.imgUrl = res
                                    }else {
                                        $('.alertContent').attr('style','display:block');
                                        $('#alertContent').text('上传图片错误！');
                                    }
                                },
                                error: function (res) {
                                    that.flg3=true;
                                    $('.alertContent').attr('style','display:block');
                                    $('#alertContent').text('网络出错！');
                                }
                            });
                        }
                    };
                })(event.target.files[0]);
                reader.readAsDataURL(event.target.files[0]);
                $(".uploading .uploadingImg").attr('style','background:none;border: 1px solid #2e5b0a;');
                //用attr将img的src属性改成获得的url
                $("#img-change").attr("src",imgURL);
            }
        }
    },
    condition:function () {
        var nums = $('.formGroup_all').children();
        this.testArr=[];
        this.testArr2=[];
        for(var i=0;i<nums.length;i++){
            if($('#name_'+(i+1)+'').val()!='' ){//&& $('#phone_'+(i+1)+'').val()!=''
                this.testArr.push($('#name_'+(i+1)+'').val()+'|'+$("#age_"+(i+1)+" option:selected").val()+'|'+$("#sex_"+(i+1)+" option:selected").val()+'|'+$("#relation_"+(i+1)+" option:selected").val())
                // }else if(($('#name_'+(i+1)+'').val()=='' && $('#phone_'+(i+1)+'').val()!='') || ($('#name_'+(i+1)+'').val()!='' && $('#phone_'+(i+1)+'').val()=='')){
                //     this.testArr2.push(i)
            }
        }
        $('.alertContent').attr('style','display:none');
        $('#alertContent').text('');
        if($('.uploadingImg img').attr('src')==undefined){
            $('.alertContent').attr('style','display:block');
            $('#alertContent').text('请上传图片！');
            return false
        }
        if($('#author_name').val()==''){
            $('.alertContent').attr('style','display:block');
            $('#alertContent').text('请填写个人姓名！');
            return false
        }
        if($('#company').val()==''){
            $('.alertContent').attr('style','display:block');
            $('#alertContent').text('请填写单位名称！');
            return false
        }
        if($('#superiority').val()==''){
            $('.alertContent').attr('style','display:block');
            $('#alertContent').text('请上传文字！');
            return false
        }
        if(this.Trims($('#superiority').val(),'g').length<0){
            $('.alertContent').attr('style','display:block');
            $('#alertContent').text('请填写个人介绍！');
            return false
        }
        return true
    },
    Trims:function (str,is_global){
        var result;
        result = str.replace(/(^\s+)|(\s+$)/g,"");
        if(is_global.toLowerCase()=="g")
        {
            result = result.replace(/\s/g,"");
        }
        return result;
    }
};
$(function () {
    loginApp.init();
});


function rotateImg(img, direction,canvas) {

    //最小与最大旋转方向，图片旋转4次后回到原方向
    var min_step = 0;
    var max_step = 3;
    if (img == null)return;
    //img的高度和宽度不能在img元素隐藏后获取，否则会出错
    var height = img.height;
    var width = img.width;
    var step = 2;
    if (step == null) {
        step = min_step;
    }

    if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
    } else {
        step--;
        step < min_step && (step = max_step);
    }

    //旋转角度以弧度值为参数  

    var degree = step * 90 * Math.PI / 180;
    var ctx = canvas.getContext('2d');
    switch (step) {
        case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            break;
        case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -height);
            break;
        case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height);
            break;
        case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0);
            break;
    }

}