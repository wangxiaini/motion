Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: '/images/timg.jpg',
    loading: '/images/timg.jpg',
    attempt: 1
})
var imgarr = [];
$(document).ready(function () {
    setShare($("#mytit").html(),'图集类目')
    var flag = true
    $("#pic_tit").html($("#mytit").html());
    $("#pic_time").html($("#myymd").html());
    $('#pic_number').html($('label').length-6 +'张图');
    $('.num').html($('label').length-6);
    $('.pic-tit').html($('#mytit').html())
    var imgDoc = $("label[id^='myimg']");
    for(var i=0;i<imgDoc.length;i++){
        imgarr.push({'src':imgDoc[i].innerHTML.split('|')[0],'tit':imgDoc[i].innerHTML.split('|')[1]})
    }
    $("#myInfos").remove();
})
var page = 1
var vm = new Vue ({
    el: '#picture',
    data(){
        var that = this;
        return {
            index:1,
            photoList:window.imgarr,
            picFlag:true,
            page:0,
            swiperOption:{
                autoplay: false,//可选选项，自动滑动
                autoHeight: true,
                on:{
                    slideChangeTransitionEnd:function () {
                        window.page = this.activeIndex+1
                        // console.log(this.activeIndex)
                        vm.$refs.count.innerHTML = window.page
                        vm.$refs.picTit.innerHTML =vm.photoList[this.activeIndex].tit


                    }
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            },
        }
    },
    methods: {
        ishide(event){
            // console.log(event.target.className)
            if(event.target.className === 'pic-wrapper' || event.target.className === 'pic-info'){
                this.picFlag = true;
            }
        },
        seeInfo(index){
            this.picFlag = false
            // console.log(index)
            this.index = index
            window.page = index+1
            vm.$refs.picTit.innerHTML =vm.photoList[index].tit
        }
    },
    mounted(){

    },
    updated(){
        vm.$refs.count.innerHTML = window.page
        if(!this.picFlag){
            var mySwiper = new Swiper('.swiper-container', this.swiperOption)
            mySwiper.slideTo(this.index,0)
        }
    }
})