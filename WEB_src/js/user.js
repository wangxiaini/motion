window.onload=function () {
    var userUrl = document.querySelector('#myHeadimgurl').innerHTML;
    var mynickname = document.querySelector('#mynickname').innerHTML;
    var myname = document.querySelector('#myname').innerHTML;
    document.querySelector('#user_img').setAttribute('src',userUrl)
    if(mynickname){
        document.querySelector('#user_name').innerHTML=mynickname
    }else{
        document.querySelector('#user_name').innerHTML=myname
    }
    document.querySelector('#myInfos').remove()
    setShare()
}
var vm = new Vue ({
    el: '#personal',
    data: {
        user:{
            url:window.userUrl1,
            name:window.mynickname1,
            name2:window.myname1
        },
        footIndex: 2
    },
    methods: {
        toMy(){
            window.location.href="/CESADefault.aspx?minesign=1"
        },
        toTeam(){
            window.location.href="/CESADefault.aspx?myTeam=1"
        },
    },
    mounted() { }
})