<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ProductPage.aspx.cs" Inherits="WxPayAPI.ProductPage" %>

<!DOCTYPE html>


<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/> 
    <script type="text/javascript" src="/Scripts/jquery-1.7.1.min.js"></script>
    <title>微信支付样例-JSAPI支付</title>
</head>

       <script type="text/javascript">

           function buy()
           {
               $.ajax({
                   async: true, // 默认true(异步请求)
                   cache: false, // 默认true,设置为 false 将不会从浏览器缓存中加载请求信息。
                   url: "/WxPayPages/ProductPageAjax.aspx?dt=" + new Date(),
                   type: "POST",
                   data: {
                       "total_fee": "2",
                       "productName":"CESA-2222"
                   },
                   success: function (res) {
                       if(res == "-1")
                       {
                           alert("JsApiPayPage下单失败")
                       }
                       else
                       {
                           alert("res=" + res);
                           callpay(res)
                       }
                   },
                   complete: function () {}
               });
           }

           

               function callpay(buyJson)
               {
                   if (typeof(WeixinJSBridge) == "undefined")
                   {
                       if (document.addEventListener)
                       {
                           document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
                       }
                       else if (document.attachEvent)
                       {
                           document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                           document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
                       }
                   }
                   else
                   {
                       jsApiCall(buyJson);
                   }
               }

                //调用微信JS api 支付
               function jsApiCall(buyJson)
               {
                   WeixinJSBridge.invoke(
                   'getBrandWCPayRequest',
                    buyJson,//josn串
                    function(res)
                    {
                        if(res.err_msg == "get_brand_wcpay_request:ok" )
                        {
                            alert("支付成功！");
                        } 
                     }
                    );
               }


          //获取共享地址
          <%--function editAddress()
          {
             WeixinJSBridge.invoke(
                 'editAddress',
                 <%=wxEditAddrParam%>,//josn串
                   function (res)
                   {
                       var addr1 = res.proviceFirstStageName;
                       var addr2 = res.addressCitySecondStageName;
                       var addr3 = res.addressCountiesThirdStageName;
                       var addr4 = res.addressDetailInfo;
                       var tel = res.telNumber;
                       var addr = addr1 + addr2 + addr3 + addr4;
                       alert(addr + ":" + tel);
                   }
               );
         }--%>

           //window.onload = function ()
           //{
           //    if (typeof WeixinJSBridge == "undefined")
           //    {
           //        if (document.addEventListener)
           //        {
           //            document.addEventListener('WeixinJSBridgeReady', editAddress, false);
           //        }
           //        else if (document.attachEvent)
           //        {
           //            document.attachEvent('WeixinJSBridgeReady', editAddress);
           //            document.attachEvent('onWeixinJSBridgeReady', editAddress);
           //        }
           //    }
           //    else
           //    {
           //        //editAddress();
           //    }
           //};

	    </script>

<body>
    <form runat="server">
        <br/>
        <div>
            <asp:Label ID="Label1" runat="server" style="color:#00CD00;"><b>商品一：价格为<span style="color:#f00;font-size:50px">1分</span>钱</b></asp:Label><br/><br/>
        </div>
	    <div align="center">
            <input type="button" id="Button1" value="立即购买" style="width:210px; height:50px; border-radius: 15px;background-color:#00CD00; border:0px #FE6714 solid; cursor: pointer;  color:white;  font-size:16px;" onclick="buy()"/>
	    </div>
        <br/><br/><br/>
        <div>
            <asp:Label ID="Label2" runat="server" style="color:#00CD00;"><b>商品二：价格为<span style="color:#f00;font-size:50px">2分</span>钱</b></asp:Label><br/><br/>
	    </div>
        <div align="center">
            <asp:Button ID="Button2" runat="server" Text="立即购买" style="width:210px; height:50px; border-radius: 15px;background-color:#00CD00; border:0px #FE6714 solid; cursor: pointer;  color:white;  font-size:16px;" OnClick="Button2_Click" />
	    </div>
    </form>
</body>
</html>
