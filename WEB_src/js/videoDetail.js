$(document).ready(function () {
    setShare($("#mytit").html(), '视频类目');
    $("#video_tit").html($("#mytit").html());
    $("#video_time").html($("#myymd").html());
    $("#video").html($("#mytext").html());
    $("#myInfos").remove();
})
