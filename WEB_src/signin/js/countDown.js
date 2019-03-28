baseAjax({
    url: "/Action.aspx",
    type: "POST",
    data: {
        "Action": "GetEndActiveTimeUniversal",
        "active_id": ACTIVE_ID
    },
    error: function() {
        vm.day = 0
        vm.hours = 0
        vm.minutes =  0
        vm.seconds =  0
    },
    success: function(res) {
        res = JSON.parse(res)
        vm.active_begin_time = res.currentTime
        vm.active_end_time = res.active_end_time
    }
})
function countDown() {
        var num2 = 1;
        vm.num = vm.num + num2
        //取设定的活动结束时间距1970年1月1日之间的毫秒数
        var end=new Date(vm.active_end_time).getTime()
        //取当前时间距1970年1月1日之间的毫秒数
        var nowTime=new Date(vm.active_begin_time).getTime()
        //结束时间与当前时间之间的毫秒差
        var difference= (end-nowTime)
        difference -= 1000 * vm.num
        var day,hours,minutes,seconds
        if (difference>0) {
            //将毫秒差换算成天数
            day=Math.floor(difference/86400000)
            difference=difference-day*86400000
            //换算成小时
            hours=Math.floor(difference/3600000)
            difference=difference-hours*3600000
            //换算成分钟
            minutes=Math.floor(difference/60000)
            difference=difference-minutes*60000
            //换算成秒数
            seconds=Math.floor(difference/1000)
            //不足10时，进行补零操作
            if(hours<10){
                hours="0"+hours
            };
            if(minutes<10){
                minutes="0"+minutes
            };
            if(seconds<10){
                seconds="0"+seconds
            };
            // console.log(day,hours,seconds,minutes)
            vm.day = day
            vm.hours = hours
            vm.minutes =  minutes
            vm.seconds =  seconds
        } else {
            //设定若是过了设置的活动结束时间，全部写成0天0时0分0秒
            vm.day = 0
            vm.hours = 0
            vm.minutes =  0
            vm.seconds =  0
        }
}