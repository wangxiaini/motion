$(document).ready(function () {
    $('#main-tit').html($("#mytit").html())
    $("#vice-tit").html($("#mysubtit").html());
    $("#name").html($("#myname").html());
    $("#ymd").html($("#myymd").html());
    $("#text").html($("#mytext").html());
    setShare($("#mytit").html(),'新闻类目');
    $("#myInfos").remove();
})
