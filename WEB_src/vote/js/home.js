var vm = {
  day: 0,
  hours: 0,
  seconds: 0,
  minutes: 0,
  active_begin_time: 0,
  active_end_time: 0,
  num:0
};
setInterval(aa,1000);
function aa() {
  countDown();
  $('.day').html(vm.day)
  $('.hour').html(vm.hours)
  $('.minute').html(vm.minutes)
  $('.second').html(vm.seconds)
};
$( document ).ready(function() {
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
  }

  let getId = getUrlParam('id');
  var title ='我正在参与2018年中国足球发展基金会杯 中国足球职工联赛总决赛投票活动';
  var imgUrl = 'https://gd.cesa.org.cn/images/share.png';
  var desc = '投票即可抽奖赢好礼，助力中国足球事业发展';
  share(title,imgUrl,desc,ACTIVE_ID);
  $('.close_btn').click(function () {
      $('.mask_rule').hide();
  });
  $('.close').click(function () {
    $('.mask').hide();
  });
  $('.rule_btn').click(function () {
      $('.mask_bg').show();
  });
  $('.mask_bg').click(function () {
      $('.mask_bg').hide();
  });
  $('.container').click(function () {
     return false;
  });
  if(getId == 1){
    $('.font').text('行业组11人制');
  }else if(getId == 2){
    $('.font').text('行业组室外5人制');
  }else if(getId == 3){
    $('.font').text('社会组11人制');
  }else if(getId == 4){
    $('.font').text('社会组室外5人制');
  }
  GetActiveList(ACTIVE_ID,1+1,getId)
  var math = Math.ceil(Math.random()*(2));
  $('.math').attr({"src":'/vote/images/img'+math+'.jpg'})
  $('.mask').show();
  // 信息列表
  function GetActiveList(id, type1 ,type2) {
      $.ajax({
          url: '/Action.aspx',
          type: 'post',
          dataType: 'json',
          data: { 'Action': 'GetActiveList', 'active_id': id, 'author_type': type1, 'group_com_type': type2},
          success: function (res) {
              if(res.length === 0){
                  $('.hint_my').show().text('暂无数据~');
              }else{
                  var lis = '';
                  for (var i = 0; i < res.length; i++) {
                      lis += `
                            <a class="center" href = "/CESADefault.aspx?vote=detail&id=${res[i].product_no}&nameId=${res[i].author_name}">
                              <figure>
                                  <img src='${res[i].active_imgurl} ' alt="${res[i].product_name}图片">
                                  <section class="bg">
                                      <p>${res[i].product_no}号</p>
                                  </section>
                              </figure>
                              <section class="bottom_title clearfix">
                                  <section class="left_title">
                                      <p>
                                          ${res[i].author_name}
                                      </p>
                                      <p>${res[i].cur_point} 票</p>
                                  </section>
                                  <section class="right_title">
                                      <section class="btn_icon">查看</section>
                                  </section>
                              </section>
                          </a>
                      `
                  }
                  $('.infos').append(lis);
              }
          }
      });
  }
  var p = null,item;
  setTimeout(_=>{
    $('.car').show();
  },1000)
  $('.item').click(_=>{
    $('.aimi').hide();
    $('.header').show();
    $('.main1').show();
    clearInterval(item);
  })
 
  if ($('.sps_item').length > 0) {
    p = 5;
    item = setInterval(_ => {
        p -= 1;
        $('.sps_item').text(p);
        if ($('.sps_item').text() < 1) {
            $('.sps_item').text(5);
            $('.aimi').hide();
            $('.header').show();
            $('.main1').show();
            clearInterval(item);
        }
    }, 1000)
}
})

