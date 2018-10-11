
//콘텐츠 영역 이벤트
$(document).ready(function () {
    //lnb 모바일 숨기기
    if (window.innerWidth < 768) {
        if (!$(".ok-lnb").hasClass("hide")) {
            $(".ok-lnb").addClass("hide");
        }
    }
    //영역 show hide
    $(".show-btn").click(function () {
        $(".ok-cont-area").toggleClass("hide");
    });
    //탭클릭 이벤트
    $(".ok-tab li a").click(function () {
        var url = $(this).attr("href");
        var thisLi = $(this).closest("li");
        $(".ok-iframe iframe").attr("src", url);
        thisLi.addClass("on");
        thisLi.siblings().removeClass("on");
        return false;
    });
    //탭 닫기 이벤트
    $(".ok-tab li .ok-close").click(function () {
        var thisLi = $(this).closest("li");
        var nextLi = thisLi.next();
        var prevLi = thisLi.prev();
        if (thisLi.hasClass("on")) {
            if (nextLi.length != 0) {
                nextLi.find("a").click();
            } else {
                prevLi.find("a").click();
            }
        } 
        if ($(".ok-tab li").length == 1) {
            $(".ok-iframe iframe").attr("src", "");
        }
        thisLi.remove();
    });
    //즐겨찾는 메뉴 dragg
    $(".ok-floating-menu").draggable();//jqueryui사용
    //즐겨찾는 메뉴 +버튼 이벤트
    $(".plus-btn").click(function () {
        $(".ft-sub-menu").toggle();
    });
    $(".ft-sub-menu .close-btn").click(function () {
        $(".ft-sub-menu").hide();
    });

    //사용자초대 사용자검색후/이메일입력 초대 토글 (18.06.25)
    $(".radio-group input").click(function () {
        var index = $(this).closest("label").index();
        $(".toggle-cont > div").removeClass("on");
        $(".toggle-cont > div").eq(index).addClass("on");
    });
    //공유, 맵스타일 숨기기 펼치기
    $(".ok-share, .ok-map-style").click(function (e) {
        if ($(e.target).parents(".hide-group").length == 0) {
            $(this).toggleClass("on");
        }
    });
    //lnb 열기/닫기
    if ($(".ok-lnb").hasClass("hide")) {
        $(".lnb-more").text("더보기");
    } else {
        $(".lnb-more").text("숨기기");
    }
    $(".lnb-more").click(function () {
        if ($(".ok-lnb").hasClass("hide")) {
            $(".ok-lnb").removeClass("hide");
            $(".lnb-more").text("숨기기");
        } else {
            $(".ok-lnb").addClass("hide")
            $(".lnb-more").text("더보기");
        }
        setTimeout(more_txt, 550);
    });
    //나의마인드맵 검색창 활성화
    $(".ok-title .global-search .search-btn").click(function () {
        $(".ok-title .global-search").addClass("show");
    });
    try {
        //나의 마인드맵 슬라이더
        $('.map-slider').slick({
            dots: false,
            infinite: true,
            slidesToScroll: 1,
            slidesToShow: 3,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    }
                }
            ]
        });
    } catch (e) {
    }
    //마인드맵 사용가이드 더보기
    $(".guide-list li .txt-area").wrapInner("<div class='txt-wrap'></div>");
    more_txt();
    //사용자메뉴관리 메뉴 추가
    $(".btn.addmenu").click(function(){
        $(".addmenu-area").addClass("on");
    });
    $(".addmenu-area .btn.gray").click(function(){
        $(".addmenu-area").removeClass("on");
    });
});
function more_txt() {
    $(".guide-list li .txt-area").each(function () {
        var this_h = 100;
        var contents_h = $(this).find(".txt-wrap").height();
        if (this_h < contents_h && $(this).find(".txt-wrap .more").length == 0) {
            $(this).find(".txt-wrap").append('<a href="#" class="more">더보기</a>');
            $(this).find(".txt-wrap .more").click(function () {
                $(this).closest("li").toggleClass("autoh");
            });
        } else if (this_h >= contents_h) {
            $(this).closest("li").removeClass("autoh");
            $(this).find(".txt-wrap").find(".more").remove();
        }
    });
    //우측 상단 개인정포 팝업 이벤트
    $(".top-header .tp-right-block > p").click(function(){
        if(!$(".user-block").hasClass("on")){
            $(".user-block").addClass("on");
            $(document).on("mouseup touchstart", function (e) {
                if ($(e.target).parents(".tp-right-block").length == 0) {
                    $(".user-block").removeClass("on");
                    $(document).off("mouseup");
                }
            });
        }else{
            $(".user-block").removeClass("on");
            $(document).off("mouseup");
        }

    });
    //탭이벤트
    $(".tab-event > *").click(function(){
        var target = $(this).attr("data-target");
        $(this).addClass("on");
        $(this).siblings().removeClass("on");
        $(target).addClass("on");
        $(target).siblings().removeClass("on");
    });
}
//화면리사이즈 이벤트
$(window).resize(function () {
    if (window.innerWidth < 768) {
        if (!$(".ok-lnb").hasClass("hide")) {
            $(".ok-lnb").addClass("hide");
        }
    }
    more_txt();
});
