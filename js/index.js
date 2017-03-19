/**
 * Created by Administrator on 2017/3/14 0014.
 **/
$(function () {
    //$("#matte").slideDown(1);
    //$("#map").slideDown(1);
    //
    var map = new AMap.Map('container',{
        resizeEnable: true,
        zoom: 10,
    });

    AMap.plugin(['AMap.ToolBar','AMap.Scale','AMap.OverView'], function(){
        map.addControl(new AMap.ToolBar());
        map.addControl(new AMap.Scale());
        map.addControl(new AMap.OverView({isOpen:false}));
    });

    //初始化 123456789的1的样式
    $(".page>span:nth-child(3)").css({
        "backgroundColor": "darkorange",
        "color": "whitesmoke",
        "border": "solid 1px darkorange",
        "fontSize": "16px"
    });

    $("header>section>nav,.mainContent,footer,#chaCity button").on("click", function (e) {
        $("#chaCity").slideUp(100);
    });
    //$("a").on("click", function (e) {
    //    e.preventDefault();
    //});

    //[城市按钮]
    $(".chaCity").on("click", function (e) {
        e.preventDefault();
        $("#chaCity").slideDown(100);
        $("#hotCity").html("");
        var arr = ["北京","上海","广州","天津","西安","深圳","武汉","成都","重庆","南京","沈阳","杭州","济南","郑州","青岛","苏州"];
        $(arr).each(function (index) {
            $("#hotCity").html( $("#hotCity").html() + "<span>" + $(arr).eq(index)[0] + "<span>");
        });
        e.stopImmediatePropagation();
    });

    //获取ajax数据
    var shopData = null;
    $.ajax({
        url:"/shop/json/1",
        dataType:"json",
        type:"get",
        success: function (data) {
            shopData = data["shop_data"];
            var num = 1;
            ajaxMin(num);
        }
    });
    //有5条可以写入的信息栏
    var ajaxLi = $("#ajaxLi>li").length;
    $(".page>span").each(function(){
    // --------记录我是几----------
        $(this).on("click", function (index) {
            var num =$(this).html();
            $(".page span").css({"backgroundColor":"","color":"","border":"","fontWeight":""});
            $(".page>span").each(function (index) {
                if( $(this).html() == num ){
                    $(this).css({
                        "backgroundColor":"darkorange",
                        "color": "whitesmoke",
                        "border": "solid 1px darkorange",
                        "fontWeight":"600"
                    });
                }
            });

            //以下：ajax
            $.ajax({
                url:"/shop/json/"+(num),
                dataType:"json",
                type:"get",
                success: function (data) {
                    shopData = data["shop_data"];
                    ajaxMin(num);
                    for( var i = 0 ; i < ajaxLi ; i++ ){

                    }
                }
            });
        })
    });


    //ajax主函数
    var n = 0;
    var marker = {};
    function ajaxMin(num){
        $("#ajaxLi>li").each(function (index) {
            //清空以前的marker
            if( n > 0 ){
                marker[index].setMap(null);
            }
            //以下----------------------每一个对象--------------------
            //console.log (   $("#ajaxLi>li:nth-child(" + ( index+ 1 ) + ") .mainInfo>p>span")   );
            var obj = $("#ajaxLi>li:nth-child(" + ( index+ 1 ) + ") .clear");

            //以下-------------主营-------------------
            var mainJob = $(obj).find( ".mainInfo>p:nth-child(2)");
            $(mainJob).html( "<span>主营:</span>" + $(shopData).eq(index)[0]["main"]);
            //以下-------------地址------------------
            var addr = $(obj).find( ".mainInfo>p:nth-child(3)");
            addr.html( "<span>地址:</span>" + $(shopData).eq(index)[0]["addr"]);

            //以下--------------观看人数------------------------------
            var visited = $(obj).find( ".slideInfo>p:nth-child(3)>span");
            visited.html("");
            visited.html( visited.html() + $(shopData).eq(index)[0]["shop_visit"]);

            //以下------------设置---------跳转店铺----------------
            var jumpShop = $(obj).find( $("button>a"));
            $(jumpShop).attr("href","http://172.18.32.184:2333/html/shopInfo.html?index=" + index +"&page=" + num);

            //以下--------------店名那一行---------------
            var levelP = $(obj).find( ".mainInfo>p:nth-child(1)");
            //清空点名那一行
            $(levelP).html("");
            //获取等级
            var level = $(shopData).eq(index)[0]["level"];
            levelImg(index,level,levelP);

            //加载等级
            //第几个ajax / 第几个新西兰------ajax返回等级---------等级存放位置-------
            //  --0    -17    -35   -56     -78   -97 -117    -137
            function levelImg(index,level,levelP){
                //以下---------------level-----------------------
                var str = "";
                if( level < 6 ){
                    for( var i = 0 ; i < level ; i++ ){
                        str += "<b title='等级:"+level+ "' style='background-position: center -17px'></b>";
                    }
                } else if( level < 20 ){
                    for( var i = 0 ; i < parseInt(level/3) ; i++ ){
                        str += "<b title='等级:"+level+ "' style='background-position: center -35px'></b>";
                    }
                } else {
                    for( var i = 0 ; i < parseInt(level/10) ; i++ ){
                        str += "<b title='等级:"+level+ "' style='background-position: center -78px'></b>";
                    }
                };
                $(levelP).html("<span>" + $(shopData).eq(index)[0]["shop_name"]+"</span>店铺等级"+str)

            }




            //------------------------

            //以下-------------地图-------------------------------------
            var wei = $(shopData).eq(index)[0]["map_latitude"];
            var jing = $(shopData).eq(index)[0]["map_longitude"];

            var infoWindow = new AMap.InfoWindow({offset:new AMap.Pixel(0,-30)});
            marker[index] = new AMap.Marker({
                position: [jing, wei],
                map:map
            });
            marker[index].setMap(map);
                marker[index].content = "<div class='pop1-window'><h3><b>众诚365数据恢复中心</b><a>×</a></h3>" +
                    "<p><span>主营:</span>"+$(shopData).eq(index)[0]['main']+"</p>" +
                    "<p><span>地址:</span>"+$(shopData).eq(index)[0]['addr']+"</p>" +
                    "<a href=''><b></b>进入店铺>></a></div>";
                marker[index].on('click',markerClick);
            function markerClick(e){
                infoWindow.setContent(e.target.content);
                infoWindow.open(map, e.target.getPosition());
            }
            map.setFitView();
        });
        n++;
    };








//    --------------以下-----------点击----出现--地图-----------------------
    $("#getMap").on("click", function (e) {
        $("#matte").slideDown(200);
        setTimeout(function () {
            $("#map").slideDown(500);
        },500)
    });

    $("#map h5 span").on("click", function (e) {
        $("#map").slideUp(1000);
        setTimeout(function () {
            $("#matte").slideUp(200)
        },1000)
    })
});