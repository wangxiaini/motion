var turnplate={
    restaraunts:[],				//大转盘奖品名称
    colors:[],					//大转盘奖品区块对应背景颜色
    outsideRadius:195,			//大转盘外圆的半径
    textRadius:140,				//大转盘奖品位置距离圆心的距离
    insideRadius:0,			    //大转盘内圆的半径
    startAngle:11.8,				//开始角度
    bRotate:false				//false:停止;ture:旋转
};
var txt = '';
$(document).ready(function () {
    $("#lottery_times").text($("#lotteryTimes").text());
    $("#curr_points").text($("#points").text());
    //动态添加大转盘的奖品与奖品区域背景颜色
    turnplate.restaraunts = ['福利购','护肤套装','洗面奶','茅台酒','签名足球','补水面膜','宝骏车模','未中奖'];
    turnplate.colors = ["#fbdb00", "#faca00", "#fbdb00", "#faca00","#fbdb00", "#faca00","#fbdb00", "#faca00"];
    //页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
    drawRouletteWheel();
    var rotateTimeOut = function (){
        $('#wheelcanvas').rotate({
            angle:0,
            animateTo:2160,
            duration:8000,
            callback:function (){
                alert('网络超时，请检查您的网络设置！');
            }
        });
    };
    //旋转转盘 item:奖品位置; txt：提示语;
    var rotateFn = function (item, txt){
        var angles = (item-1) * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length*2));
        if(angles<270){
            angles = 270 - angles;
        }else{
            angles = 360 - angles + 270;
        }
        $('#wheelcanvas').stopRotate();
        $('#wheelcanvas').rotate({
            angle:-1,
            animateTo:angles+1800,
            duration:8000,
            callback:function (){
                // alert("恭喜获得：" + txt);
                if(txt.indexOf('未中奖') > -1){ //未中奖
                    vm.close_flag = true
                    vm.mask_type = 0
                    vm.bodyOverflow = !vm.bodyOverflow
                    vm.buy = 2
                }else if(txt.indexOf('福利购') > -1){ //福利购
                    vm.txt = vm.prize[turnplate.restaraunts.indexOf(txt)].prize_name
                    vm.img_src = vm.prize[turnplate.restaraunts.indexOf(txt)].prize_img
                    vm.close_flag = true
                    vm.mask_type = 0
                    vm.bodyOverflow = !vm.bodyOverflow
                    vm.buy = 0
                }else{ //免费送
                    vm.txt = vm.prize[turnplate.restaraunts.indexOf(txt)].prize_name
                    vm.img_src = vm.prize[turnplate.restaraunts.indexOf(txt)].prize_img
                    vm.close_flag = true
                    vm.mask_type = 0
                    vm.bodyOverflow = !vm.bodyOverflow
                    vm.buy = 1
                }
                turnplate.bRotate =!turnplate.bRotate;

            }
        });

    };

    $('.pointer').click(function () {
        if(vm.date.LotteryCount <= 0){
            return
        }
        if(!turnplate.bRotate){
            axios({
                method: 'POST',
                url: "/Action.aspx",
                data: {
                    'Action':'CheckActivityTime',
                    'active_id':ACTIVE_ID,
                },
                transformRequest: [function (data) {
                    let ret = ''
                    for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                }],
            }).then((res) => {
                if(res.data == 1){
                    this.tips2 = ''
                    this.active_time = true
                    //在时间范围内可以转
                    if(turnplate.bRotate)return;
                    turnplate.bRotate =!turnplate.bRotate;
                    axios({
                        method: 'POST',
                        url: "/Action.aspx",
                        data: {
                            'Action': 'awardRotate',
                            'active_id': ACTIVE_ID,
                        },
                        transformRequest: [function (data) {
                            let ret = ''
                            for (let it in data) {
                                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                            }
                            return ret
                        }],
                    }).then((res) => {
                        if(res.data.indexOf(',') > -1) {
                            var item = 8//res.data.split(',')[0];
                            rotateFn(item, turnplate.restaraunts[item-1]);
                            vm.date.LotteryCount = res.data.split(',')[1];
                            sessionStorage.setItem('prize',res.data.split(',')[2])
                        }

                    }).catch((error) => {

                    });
                    return
                }
                if(res.data == -1){
                    vm.tips2 = '程序错误'
                    vm.active_time = false
                    vm.bodyOverflow = !vm.bodyOverflow
                    return
                }
                if(res.data == -5){
                    vm.tips2 = '活动已结束'
                    vm.active_time = false
                    vm.bodyOverflow = !vm.bodyOverflow
                    return
                }
            }).catch((error) => {
                vm.tips2 = '服务器错误，请刷新'
                vm.active_time = false
                vm.bodyOverflow = !vm.bodyOverflow
                return
            });
        }
    });
});
function drawRouletteWheel() {
    var canvas = document.getElementById("wheelcanvas");
    if (canvas.getContext) {
        //根据奖品个数计算圆周角度
        var arc = Math.PI / (turnplate.restaraunts.length/2);
        var ctx = canvas.getContext("2d");
        //在给定矩形内清空一个矩形
        ctx.clearRect(0,0,475,475);
        //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
        ctx.strokeStyle = "#FFBE04";
        //font 属性设置或返回画布上文本内容的当前字体属性
        ctx.font = '24px Microsoft YaHei';
        // var clickXY = [];
        for(var i = 0; i < turnplate.restaraunts.length; i++) {
            var angle = turnplate.startAngle + i * arc;
            // console.log(turnplate.startAngle ,arc)
            ctx.fillStyle = turnplate.colors[i];
            ctx.beginPath();
            //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
            ctx.arc(238, 238, turnplate.outsideRadius, angle, angle + arc, false);
            ctx.arc(238, 238, turnplate.insideRadius, angle + arc, angle, true);
            // clickXY.push({x:angle,y:angle + arc,outsideRadius:turnplate.insideRadius,x1: angle + arc,x2:angle})
            // console.log(turnplate.outsideRadius, angle, angle + arc,)
            ctx.stroke();
            ctx.fill();
            //锁画布(为了保存之前的画布状态)
            ctx.save();
            //----绘制奖品开始----
            ctx.fillStyle = "#ff6528";
            var text = turnplate.restaraunts[i];
            var line_height = 22;
            //translate方法重新映射画布上的 (0,0) 位置
            ctx.translate(238 + Math.cos(angle + arc / 2) * turnplate.textRadius, 238 + Math.sin(angle + arc / 2) * turnplate.textRadius);
            ctx.save();
            ctx.beginPath();
            ctx.rotate((i*40)*Math.PI/180);
            ctx.fillText(text,-ctx.measureText(text).width /2 ,10);
            ctx.restore();
            ctx.restore();
        }
    }
}