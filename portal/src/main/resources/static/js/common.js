/* JS Document
- Created by cyj
- 2018/7/30
*/

//下拉条滚动事件
function navChange(){
    //设置窗口大小
    var windowHeight = $(window).height();
    $(".bgDiv,.divContainer").css("height",windowHeight);

    $(".divContainer").scroll(function(){
        scrollTop = $(this).scrollTop();
        if(scrollTop > 100){
            //$("#header").addClass("menuBg");
            $(".navbar-inverse").css({"background":"rgba(255,255,255,.95)","transition":"opacity 0.5s,background-color 0.9s,transform 0.5s"});
            $(".navbar-nav>li>a").css("color","#444d50");
            $(".navbar-brand img").attr("src","/static/images/logo.png");
            $(".nav-phone img").attr("src","/static/images/icon_phone_change.png");
            $(".nav-phone span").css("color","#444d50");
        }else{
            //$("#header").removeClass("menuBg");
            $(".navbar-inverse").css("background","transparent");
            $(".navbar-nav>li>a").css("color","#fff");
            $(".navbar-brand img").attr("src","/static/images/transparent_logo.png");
            $(".nav-phone img").attr("src","/static/images/icon_phone.png");
            $(".nav-phone span").css("color","rgb(247,241,230)");
        }
    });
}

//移动端导航
$(function(){
    //一级导航
    $(".navbtn").click(function() {
        $(this).toggleClass('act');
        $("body").toggleClass("act");
        $(".headerm").toggleClass("act");
        $(".navdiv").toggleClass("act");
    });
    //体验优化：点击左侧空白处任意位置隐藏一级导航
    $(".mainPart").click(function () {
        if($(".navbtn").hasClass('act')){
            $(".navbtn").removeClass('act');
            $("body").removeClass("act");
            $(".headerm").removeClass("act");
            $(".navdiv").removeClass("act");
        }
    });

    //二级导航
    $(".divContainer").scroll(function() {
        if ($(".divContainer").width() <= 991) {
            if ($(".divContainer").scrollTop() > 65) {
                $(".secnavm").addClass("act");
                $(".headerm").hide();
                $(".secnavm h4").css("margin-top",0);
                $(".secnavm ul").css("top","59px");
            } else {
                $(".secnavm").removeClass("act");
                $(".headerm").show();
                $(".secnavm h4").css("margin-top","10px")
                $(".secnavm ul").css("top","69px");
            }
        }
    });
    $(".secnavm h4").click(function() {
        $(this).next().slideToggle();
        $(this).find("img").toggleClass('act');
    });
    $(".secnavm ul li a").click(function() {
        $(this).parent().parent().slideToggle();
        $(".secnavm h4>span").text($(this).text());

        //切换二级菜单后，tab页同步回到最顶部
        $(".divContainer").animate({
            scrollTop: 0
        }, 0);
    });
})