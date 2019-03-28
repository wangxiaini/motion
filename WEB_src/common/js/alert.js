function alert_h(content, ensuredCallback) {
    var myConfirmCode = '<div id="modalBody">\
                <div class="modal fade" id="alert_h" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
                  <div class="modal-dialog">\
                    <div class="modal-content">\
                      <div class="modal-header">\
                       <span type="button" id="closeAlert" class="closeAlert" data-dismiss="modal" aria-hidden="true">&times;</span>\
                        <h4 class="modal-title" id="myModalLabel"></h4>\
                      </div>\
                      <div class="modal-body">\
                        ' + content + '\
                      </div>\
                      <div class="modal-footer">\
                        <button type="button" id="btn-primary" class="btnComfirm btn-primary" data-dismiss="modal">确认<tton>\
                      </div>\
                    </div>\
                  </div>\
                </div>\
            </div>';
    // if ($("#alert_h").length != 0) {
    //     $('#alert_h').remove();
    // }
    if ($("#modalBody").length != 0) {
        $('#modalBody').remove();
    }
    $("body").append(myConfirmCode);
    $('#modalBody').show();

    $('#closeAlert').click(function () {
        $("#alert_h").animate({top: '-200px'}, "slow");
        setTimeout(function () {
            $('#modalBody').hide();
        },500)
    });
    $('#btn-primary').click(function () {
        if (ensuredCallback)
            ensuredCallback();
        $('#modalBody').hide();
        
    });
    // $('#alert_h').modal();
    //
    // $('#alert_h').off('hide.bs.modal').on('hide.bs.modal', function (e) {
    //     if (ensuredCallback)
    //         ensuredCallback();
    // });
}
function myConfirm_new(title, content, ensureText, ensuredCallback,unsuredCallback) {
    var myConfirmCode = '<div id="modalBody">\
                <div class="modal fade" id="myConfirm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
                  <div class="modal-dialog">\
                    <div class="modal-content">\
                      <div class="modal-header">\
                        <h4 class="modal-title" id="myModalLabel">' + title + '</h4>\
                      </div>\
                      <div class="modal-body">\
                        ' + content + '\
                      </div>\
                      <div class="modal-footer">\
                        <button type="button" class="btnComfirm btn-default" data-dismiss="modal">取消<tton>\
                        <button type="button" class="btnComfirm btn-danger">' + ensureText + '<tton>\
                      </div>\
                    </div>\
                  </div>\
                </div>\
            </div>';

    if ($("#modalBody").length != 0) {
        $("#modalBody").remove();
    }
    $("body").append(myConfirmCode);
    $('#modalBody').show();
    // $('#myConfirm').modal();
    $('#myConfirm button.btn-danger').unbind("click", "");
    $('#closeAlert').click(function () {
        $("#myConfirm").animate({top: '-200px'}, "slow");
        setTimeout(function () {
            $('#modalBody').hide();
        },500)
    });
    $('#myConfirm button.btn-danger').click(function (event) {
        if (ensuredCallback)
            ensuredCallback();
        $('#modalBody').hide();
    });
    $('#myConfirm button.btn-default').click(function (event) {
        if (unsuredCallback)
            unsuredCallback();
        $('#modalBody').hide();
    });
    //
    // $('#myConfirm').off('hide.bs.modal').on('hide.bs.modal', function (e) {
    //     if (unsuredCallback)
    //         unsuredCallback();
    // });
}
