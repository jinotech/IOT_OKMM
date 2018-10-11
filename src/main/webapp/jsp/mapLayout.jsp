<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="java.util.Locale" %>
<%@ page import="org.springframework.web.servlet.support.RequestContextUtils" %>
<%@ page import="com.okmindmap.configuration.Configuration"%>
<%@ page import="java.net.*" %>

<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="bitly" uri="http://www.servletsuite.com/servlets/bitlytag" %>
<%@ taglib prefix="env" uri="http://www.servletsuite.com/servlets/enventry" %>

<%
String menu = request.getParameter("m");
String google = request.getParameter("g");
String useragent = (String)request.getAttribute("agent");

if(request.getAttribute("menu") != null)
	menu = request.getAttribute("menu").toString();

if(menu == null) menu = "on";
if(google == null) google = "off";

request.setAttribute("menu", menu);
request.setAttribute("user", session.getAttribute("user"));

Locale locale = RequestContextUtils.getLocale(request);
request.setAttribute("locale", locale);

String facebook_appid = Configuration.getString("facebook.appid");

long updateTime = 0l;
if(request.getServerName().indexOf("okmindmap") == -1) {
	updateTime = System.currentTimeMillis() / 1000;
} else {
	updateTime = Configuration.getLong("okmindmap.update.version");
}



StringBuffer url = request.getRequestURL();
String uri = request.getRequestURI();
String ctx = request.getContextPath();
String base = url.substring(0, url.length() - uri.length() + ctx.length()) + "/";

//서버 ip
InetAddress inet= InetAddress.getLocalHost();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html class="yui3-js-enabled"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="Cache-Control" content="no-cache">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

	<meta property="og:type" content="website">
	<meta property="og:title" content="OKMindmap">
	<meta property="og:description" content="Design Your Mind!">
	<meta property="og:url" content="http://open.jinotech.com:8088/">
	<meta property="og:image" content="http://open.jinotech.com:8088/okmmkakao.JPG">

	<% if(useragent != null){ %>
		<!-- 아이폰 META -->
		<meta name="apple-mobile-web-app-capable" content="yes">
		<link rel="apple-touch-icon" href="${pageContext.request.contextPath}/images/mobile/appicon.png">
		<link rel="apple-touch-startup-image" href="${pageContext.request.contextPath}/images/mobile/startup.jpg">
	<% } %>
	
	<title><c:out value="${data.map.name}"/></title>

	<link rel="shortcut icon" href="${pageContext.request.contextPath}/favicon.ico" />
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/jquery-ui/jquery-ui.custom.css?v=<%=updateTime%>" type="text/css" media="screen">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css?v=<%=updateTime%>" type="text/css" media="screen">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/main.css?v=<%=updateTime%>" type="text/css">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/impromptu.css?v=<%=updateTime%>" type="text/css" media="screen">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/simplemodal.css?v=<%=updateTime%>" type="text/css" media="screen">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/dialog.css?v=<%=updateTime%>" type="text/css" media="screen">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/opentab.css?v=<%=updateTime%>" type="text/css" media="screen">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okm-side.css?v=<%=updateTime%>" type="text/css" media="screen">		
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/splitter.css?v=<%=updateTime%>" type="text/css" media="screen">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/lib/farbtastic/farbtastic.css?v=<%=updateTime%>" type="text/css" media="screen">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/plugin/presentation/presentation.css?v=<%=updateTime%>" type="text/css" media="screen">
	
	 <!-- 리본메뉴 CSS -->
       <link rel="stylesheet" href="${pageContext.request.contextPath}/ribbonmenu/ribbon/ribbon.css?v=<%=updateTime%>" type="text/css" media="screen">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/ribbonmenu/ribbon/soft_button.css?v=<%=updateTime%>" type="text/css" media="screen">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/ribbonmenu/ribbon/user.css?v=<%=updateTime%>" type="text/css" media="screen">

	<script src="http://www.google.com/jsapi" type="text/javascript"></script>
			
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script> 	
	<script src="${pageContext.request.contextPath}/lib/jquery-bug.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery.mobile.custom.min.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery-ui.min.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery.caret.1.02.min.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/yui-3.2.0-min.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/raphael.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/i18n.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/browser.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/json2.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery-impromptu.3.1.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/hahms-textgrow.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/luasog-0.3.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery.simplemodal.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery.insertatcaret.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/Base64.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/conversionfunctions.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/http.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jscolor/jscolor.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/timeline.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/slimScroll.min.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/popup_expiredays.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/splitter.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/farbtastic/farbtastic.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery.cookie.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/rgbcolor.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/StackBlur.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/canvg.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<!-- 모바일 디바이스에서 플로팅메뉴 드로그 기능 추가 20180810 cho -->
	<script src="${pageContext.request.contextPath}/lib/jquery.ui.touch-punch.min.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<%-- <script src="${pageContext.request.contextPath}/mayonnaise.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script> --%>
	<%-- <script src="${pageContext.request.contextPath}/mayonnaise-min.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script> --%>




	<script src="${pageContext.request.contextPath}/JinoMap.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/JinoMapCfg.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/JinoUtil.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/jSaveActions.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/jLoadManager.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/JinoController.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/JinoControllerGuest.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/jNodeController.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/jNodeControllerGuest.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>

	<script src="${pageContext.request.contextPath}/layout/jBrainLayout.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/layout/jFishboneLayout.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/layout/jMindMapLayout.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/layout/jPadletLayout.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/layout/jRotateLayout.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>	
	<script src="${pageContext.request.contextPath}/layout/jSunburstLayout.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>	
	<script src="${pageContext.request.contextPath}/layout/jTableLayout.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/layout/jTreeLayout.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/layout/jZoomableTreemapLayout.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	
	<script src="${pageContext.request.contextPath}/node/jNode.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/node/jMindMapNode.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/node/jCustom.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/node/jRect.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/node/jBrainNode.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/node/jConnectorNode.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/node/jEllipse.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/node/jFishNode.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/node/jPadletNode.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/node/jSunburstNode.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/node/jZoomableTreemapNode.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	
	<script src="${pageContext.request.contextPath}/line/jLine.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/line/ArrowLink.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/line/CurveArrowLink.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/line/jLineBezier.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/line/jLineFish.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/line/jLinePolygonal.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/line/jLineStraight.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/line/RightAngleArrowLink.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>

	
	
	
	

	<script src="${pageContext.request.contextPath}/extends/ExArray.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/extends/ExRaphael.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/extends/javascript-chat.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>		

	<script src="${pageContext.request.contextPath}/plugin/jino_delicious.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/plugin/jino_dwr.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/plugin/jino_facebook.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/plugin/jino_google_searcher.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/plugin/jino_node_color_mix.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/plugin/jino_twitter.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/plugin/jino_wiki.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/plugin/NodeColorUtil.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/plugin/TestRobot.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/plugin/animate-min.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/plugin/slideshare-service.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/plugin/map_of_delicious.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/plugin/collabDocument.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>		
	<script src="${pageContext.request.contextPath}/plugin/testcode.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/plugin/presentation/jmpress/jmpress.all.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/plugin/presentation/presentation.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/plugin/presentation/editorManager.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/plugin/jino_nodeTheme.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>		
	<script src="${pageContext.request.contextPath}/plugin/okm-chat.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/plugin/okm-adsense.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
	
	<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/engine.js?v=<%=updateTime%>'></script>
	<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/interface/JavascriptChat.js?v=<%=updateTime%>'></script>		
	<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/util.js?v=<%=updateTime%>'></script>
	
	<!-- 리본메뉴 script -->
	<script type="text/javascript" src='${pageContext.request.contextPath}/ribbonmenu/ribbon/ribbon.js?v=<%=updateTime%>'></script>
	<script type="text/javascript" src='${pageContext.request.contextPath}/ribbonmenu/ribbon/jquery.tooltip.min.js?v=<%=updateTime%>'></script>
	<script type="text/javascript" src='${pageContext.request.contextPath}/ribbonmenu/okmMenuRibbon.js?v=<%=updateTime%>'></script>
	<script type="text/javascript" src='${pageContext.request.contextPath}/ribbonmenu/okmMenuRibbonEnable.js?v=<%=updateTime%>'></script>
	<!-- 리본메뉴 script 끝 -->
	
	<!-- Tinymce for webpage node -->
	<script src="${pageContext.request.contextPath}/lib/tinymce/tinymce.min.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/webpage.css?v=<%=updateTime%>" type="text/css" media="screen">

	<!-- Context menu -->
	<link rel="stylesheet" href="${pageContext.request.contextPath}/lib/contextmenu/jquery.contextmenu.css" type="text/css" media="screen">
	<script src="${pageContext.request.contextPath}/lib/contextmenu/jquery.contextmenu.js" type="text/javascript"></script>

	<!-- Color picker -->
	<link rel="stylesheet" href="${pageContext.request.contextPath}/lib/bgrins-spectrum/spectrum.css?v=<%=updateTime%>" type="text/css" media="screen">
	<script src="${pageContext.request.contextPath}/lib/bgrins-spectrum/spectrum.js?v=<%=updateTime%>" type="text/javascript"></script>
	
	<!-- D3js -->
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/style_popover.css?v=<%=updateTime%>" type="text/css" media="screen">
	<script src="${pageContext.request.contextPath}/lib/d3js/d3.js?v=<%=updateTime%>" type="text/javascript"></script>
	<script src="${pageContext.request.contextPath}/lib/html2canvas.js?v=<%=updateTime%>" type="text/javascript"></script>

	<!-- Jquery form -->
	<script src="${pageContext.request.contextPath}/lib/jquery.form.js?v=<%=updateTime%>" type="text/javascript"></script>

	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/add.css?v=<%=updateTime%>" type="text/css" />
	<%@ include file="../okmMenuCommon.js.jsp" %>
	<%@ include file="../okmMenu.js.jsp" %>
		
<!--------------------------------------------------- 오른쪽 콘텐츠 영역(05/25) ---------------------------------------------->
	<script type="text/javascript">
            //콘텐츠 영역 이벤트
            $(document).ready(function(){
            	/* $(".ok-floating-menu").click(function(){
            		alert("clicked");
            	
            	}) */
            	
            	
            	getUserMenu();
            	getMenuList();
            	
            	//마인드맵 링크 클릭
            	/* $(document).on("click","a",function(){
            		//탭 타이틀
            		addTab($(this).attr("href"), $(this).prev().prev().find("tspan").text());
            		//탭 열기
            		$(".ok-cont-area").removeClass("hide");
            		return false;
            	}); */
            	
                //영역 show hide                
                $(".show-btn").click(function(){
                	/* 
                	TODO mapLayout.jsp에서만 특정 jquery 함수가 다 먹통임.. 확인필요
                	기존코드는 $(".ok-cont-area").toggleClass("hide"); 이나.. 동작을 안하는 문제가 생김..
                	원인을 못찾음.. 20180810에 .prev()로 추가하여 변경함                	
                	*/
                	console.log(".show btn click");
                	$(this).prev().toggleClass("hide"); 
                	                    
                });
                //탭클릭 이벤트
                $(".ok-tab").on("click", "a", function(){
                    var url = $(this).attr("link");
                    var thisLi = $(this).closest("li");
                    $(".ok-iframe iframe").attr("src", url);
                    thisLi.addClass("on");
                    thisLi.siblings().removeClass("on");
                    return false;
                });
                //탭 닫기 이벤트
                $(".ok-tab").on("click","span",function(){
                    var thisLi = $(this).closest("li");
                    var nextLi = thisLi.next();
                    var prevLi = thisLi.prev();
                        if (thisLi.hasClass("on")){
                            if (thisLi.index() != 0 && nextLi.length != 0 || thisLi.index() == 0){
                                nextLi.find("a").click();
                            } else{
                                prevLi.find("a").click();
                            }
                    }
                    if ($(".ok-tab li").length == 1){
                        $(".ok-iframe iframe").attr("src", "");
                    } 
                    thisLi.remove();
                });
                
                //즐겨찾는 메뉴 dragg
                $(".ok-floating-menu").draggable();//jqueryui사용  
                
                // @author "Donghwi (pari0130@gmail.com)" 2018. 9. 4.     
                // click 이벤트 이용 플로팅 메뉴의 서브  메뉴 동작 (+버튼, close버튼, 팝업이외영역)
                $(document).click(function(e){
                	var plusBtn = $(".plus-btn");
                	var rightBtn = $(".right-btn");
                	var plusSquare = $(".fa-plus-square");
                                	
                	var subMenu = $(".ft-sub-menu");                	                	
                	var closeBtn = $(".close-btn");	
                	
                	// 플러스 버튼 토글
                	if(plusBtn.is(e.target)){             	
                		$(".ft-sub-menu").toggle();	
                		return false;
                	// 닫기 버튼 동작
                	}else if(closeBtn.is(e.target)){       
                		// closeBtn 눌렀을때 submenu의 체크되어 있는 값을 초기화 시키기 위해 기존 값을 remove 후 다시 불러옴
                		$(".ft-scroll-div").find("li").remove();
                		getMenuList();
                		subMenu.css("display","none");
                		return false;                	
                	// 팝업 이외 영역 선택 동작
                	}else if(!subMenu.is(e.target) && !plusBtn.is(e.target) && !closeBtn.is(e.target) && !rightBtn.is(e.target) && !plusSquare.is(e.target)){
                		if($(e.target).parents(".ft-sub-menu").length == 0){
                			subMenu.css("display","none");
                		}
                	}
                	
                });
                
              // 공유, 맵스타일 숨기기 펼치기 
              // 20180813 조동휘
              // $this.toggleClass("on"); 로 반응이 없는 증상으로 수정 
                $(".ok-share, .ok-map-style").click(function(e){
                    /* var $this = $(this); */                    
                	if($(e.target).parents(".hide-group").length == 0){
                        /* console.log("토글 length 0");
                        console.log("this : " + this); */                
                		 if($(this).hasClass() == ".ok-share"){
                         	$(".ok-share").toggleClass("on");
                         }else if($(this).hasClass() == ".ok-map-style"){
                         	$(".ok-map-style").toggleClass("on");
                         }
                    	/* $this.toggleClass("on"); */
                    }
                });
              //lnb 열기/닫기
                if($("#ok-lnb").hasClass("hide")){
                	
                    $(".lnb-more").text("더보기");
                }else{
                	
                    $(".lnb-more").text("숨기기");
                };
              
                $(".lnb-more").click(function(){
                	// hasClass. addClass. removeClass 동작 안되어 수정함 20180810 조동휘 
                    /* if($("#ok-lnb").hasClass("hide")){ */
                    if($(".lnb-more").children().first().hasClass("hide")){                    	
                    	$(".lnb-more").children().first().removeClass("hide");
                        /* $("#ok-lnb").removeClass("hide"); */
                        $(".lnb-more").text("숨기기");
                    }else{                    	
                       	$(".lnb-more").children().first().addClass("hide");
                    	/* $("#ok-lnb").addClass("hide"); */
                        $(".lnb-more").text("더보기");
                    }                    
                });
            });//  $(document).ready(function(){ 종료
            
            function addTab(url, title){
            	var li = "<li>";
                    li += "<a href=\"#\" link=\""+url+"\">"+title+"</a>";
                    li += "<span class=\"ok-close\">x</span>";
                    li += "</li>";
            	
            	$(".ok-cont-area ul").append(li);
            	$(".ok-cont-area ul li:last a").click();
            }
            
            function getUserMenu(){
            	var  id = '<c:out value="${user.id}"/>';
            	$.ajax({
    				type: 'post',
    				dataType: 'json',
    				async: false,
    				url: '${pageContext.request.contextPath}/mindmap/userMenu.do',
    				data: {	'id': id },
    				success: function(data) {
    					//console.log(data);
    					
    					if(data.menuList != null){
    						
    						//사용자 메뉴 초기화
    						$(".ok-floating-menu #userMenuList").empty();
    						
    						for (var i = 0; i < data.menuList.length; i++) {
    							var appendMenu = getFtMenu(data.menuList[i].seq);
    		            		$(".ok-floating-menu #userMenuList").append(appendMenu);
    						}
    					}
    					
    				},
    				error: function(data, status, err) {
    					alert("error : " + status);
    				}
    			});
            }
            
            function getMenuList(){
            	var  id = '<c:out value="${user.id}"/>';
            	
            	$.ajax({
    				type: 'post',
    				dataType: 'json',
    				async: false,
    				url: '${pageContext.request.contextPath}/mindmap/menuList.do',
    				data: {	'id': id },
    				success: function(data) {
    					//console.log(data);
    					
    					if(data.menuList != null){
    						for (var i = 0; i < data.menuList.length; i++) {
    							
    							var html = "";
    							
								html += "<li><label>";
								if(data.menuList[i].id != null && data.menuList[i].id != "0"){
									html += "<input type=\"checkbox\" name=\"check\" checked=\"checked\" value=\""+data.menuList[i].seq+"\">";
								}else{
									html += "<input type=\"checkbox\" name=\"check\" value=\""+data.menuList[i].seq+"\">";	
								}
								
								html += data.menuList[i].name+"</label></li>";
								
								if(data.menuList[i].bgroup == "1"){
									$("#__menuList1__").append(html);
    							}else if(data.menuList[i].bgroup == "2"){
    								$("#__menuList2__").append(html);
    							}else if(data.menuList[i].bgroup == "3"){
    								$("#__menuList3__").append(html);
    							}else{
    								$("#__menuList4__").append(html);
    							}
								
    						}
    					}
    					
    				},
    				error: function(data, status, err) {
    					alert("error : " + status);
    				}
    			});
            }
            
            //메뉴 저장
            function ftSave(){
            	
            	$(".ok-floating-menu #userMenuList").empty();
            	
            	var checkedVals = "";
            	
            	$("input[name=check]:checked").each(function(){
            		var appendMenu = getFtMenu($(this).val());
            		$(".ok-floating-menu #userMenuList").append(appendMenu);
            		
            		checkedVals += "," + $(this).val();
            	});
            		
            	//저장
            	//if(checkedVals != ""){
            		var  id = '<c:out value="${user.id}"/>';
            		
            		$.ajax({
        				type: 'post',
        				dataType: 'json',
        				async: false,
        				url: '${pageContext.request.contextPath}/mindmap/userMenuSave.do',
        				data: {	'id': id ,  'checkedVals' : checkedVals},
        				success: function(data) {
        					//console.log(data);
        				},
        				error: function(data, status, err) {
        					alert("error : " + status);
        				}
        			});
            	//}
            }
            
            function getFtMenu(id){
            	//새마인드맵
            	if(id == "1"){
            		var toakdlsemaoq = "<span class=\"ok-menu\" title=\"<spring:message code='menu.mindmap.new'/>\">";
	        		toakdlsemaoq += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/file_new.png\" onclick=\"newMap();\">";
	        		toakdlsemaoq += "</span>";
	        		return toakdlsemaoq;
            	}
            	
            	//열기
            	if(id == "3"){
            		var dufrl = "<span class=\"ok-menu\" title=\"<spring:message code='menu.mindmap.open'/>\">";
	        		dufrl += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/share_file.png\" onclick=\"openMap();\">";
	        		dufrl += "</span>";
	        		return dufrl;
            	}
	        	
            	//새이름저장
            	if(id == "4"){
            		var todlfmawjwkd = "<span class=\"ok-menu\" title=\"<spring:message code='message.saveas'/>\">";
	        		todlfmawjwkd += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/file_saveas.png\" onclick=\"saveAsMap();\">";
	        		todlfmawjwkd += "</span>";
	        		return todlfmawjwkd;
            	}
	        	
	        	//타임라인
            	if(id == "5"){
            		var xkdlafkdls = "<span class=\"ok-menu\" title=\"<spring:message code='menu.mindmap.timelinemode'/>\">";
	        		xkdlafkdls += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/file_timeline.png\" onclick=\"timelineMode();\">";
	        		xkdlafkdls += "</span>";
	        		return xkdlafkdls;
            	}
	        	
	        	//새맵분리
            	if(id == "6"){
            		var toaoqqnsfl = "<span class=\"ok-menu\" title=\"<spring:message code='menu.mindmap.newnodemap'/>\">";
	        		toaoqqnsfl += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/file_separate.png\" onclick=\"splitMap();\">";
	        		toaoqqnsfl += "</span>";
	        		return toaoqqnsfl;
            	}
	        	
	        	//맵삭제
            	if(id == "7"){
            		var aoqtkrwp = "<span class=\"ok-menu\" title=\"<spring:message code='menu.mindmap.delete'/>\">";
	        		aoqtkrwp += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/file_del.png\" onclick=\"delMap();\">";
	        		aoqtkrwp += "</span>";
	        		return aoqtkrwp;
            	}
	        	
	        	//맵 이름 변경
            	if(id == "8"){
            		var aoqdlfmaqusrud = "<span class=\"ok-menu\" title=\"<spring:message code='message.changntitle'/>\">";
	        		aoqdlfmaqusrud += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/file_name.png\" onclick=\"changeMapName();\">";
	        		aoqdlfmaqusrud += "</span>";
	        		return aoqdlfmaqusrud;
            	}
	        	
	        	//설정
            	if(id == "9"){
            		var tjfwjd = "<span class=\"ok-menu\" title=\"<spring:message code='menu.okmpreference'/>\">";
	        		tjfwjd += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/file_setting.png\" onclick=\"okmPreference();\">";
	        		tjfwjd += "</span>";
	        		return tjfwjd;
            	}
	        	
	        	//More1
            	if(id == "17"){
            		var more1 = "<span class=\"ok-menu\" title=\"<spring:message code='menu.edit.more_add'/>\">";
	        		more1 += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/more.png\" onclick=\"moreAddAction();\">";
	        		more1 += "</span>";
	        		return more1;
            	}
            	
	        	//글자 색상
            	if(id == "18"){
            		var rmfwktortkd = "<span class=\"ok-menu\" title=\"<spring:message code='menu.format.nodetextcolor'/>\">";
	        		rmfwktortkd += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/edit_fontcolor.png\" onclick=\"nodeTextColorAction();\">";
	        		rmfwktortkd += "</span>";
	        		return rmfwktortkd;
            	}
	        		
	        	//배경 색상
            	if(id == "19"){
            		var qorudtortkd = "<span class=\"ok-menu\" title=\"<spring:message code='menu.format.nodebgcolor'/>\">";
	        		qorudtortkd += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/edit_color.png\" onclick=\"nodeBGColorAction();\">";
	        		qorudtortkd += "</span>";
	        		return qorudtortkd;
            	}
	        		
	        	//접기/펴기
            	if(id == "20"){
            		var wjqrlvurl = "<span class=\"ok-menu\" title=\"<spring:message code='menu.view.folding'/>\">";
	        		wjqrlvurl += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/edit_expand.png\" onclick=\"foldingAction();\">";
	        		wjqrlvurl += "</span>";
	        		return wjqrlvurl;
            	}
            	
	        	//줄바꿈
            	if(id == "21"){
            	var wnfqkRna = "<span class=\"ok-menu\" title=\"<spring:message code='menu.view.shiftenter'/>\">";
	        		wnfqkRna += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/linefed_icon.png\" onclick=\"ShiftenterAction();\">";
	        		wnfqkRna += "</span>";
	        		return wnfqkRna;
            	}
	        	
	        	//노드정렬
            	if(id == "22"){
            		var shemwjdfuf = "<span class=\"ok-menu\" title=\"<spring:message code='menu.view.rangenode'/>\">";
	        		shemwjdfuf += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/noalige_icon.png\" onclick=\"CtrlRAction();\">";
	        		shemwjdfuf += "</span>";
	        		return shemwjdfuf;
            	}
	        	
	        	//마디수정
            	if(id == "23"){
            		var akeltnwjd = "<span class=\"ok-menu\" title=\"<spring:message code='menu.edit'/>\">";
	        		akeltnwjd += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/edit_editnode.png\" onclick=\"editNodeAction();\">";
	        		akeltnwjd += "</span>";
	        		return akeltnwjd;
            	}
	        	
	        	//잘라내기
            	if(id == "26"){
            		var wkffksorl = "<span class=\"ok-menu\" title=\"<spring:message code='menu.edit.cut'/>\">";
	        		wkffksorl += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/edit_cut.png\" onclick=\"cutAction();\">";
	        		wkffksorl += "</span>";
	        		return wkffksorl;
            	}
	        	
	        	//복사
            	if(id == "28"){
            		var qhrtk = "<span class=\"ok-menu\" title=\"<spring:message code='menu.edit.copy'/>\">";
	        		qhrtk += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/edit_copy.png\" onclick=\"copyAction();\">";
	        		qhrtk += "</span>";
	        		return qhrtk;
            	}
	        	
	        	//붙여넣기
            	if(id == "24"){
            		var qnxdusjgrl = "<span class=\"ok-menu\" title=\"<spring:message code='menu.edit.paste'/>\">";
	        		qnxdusjgrl += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/edit_paste.png\" onclick=\"pasteAction();\">";
	        		qnxdusjgrl += "</span>";
	        		return qnxdusjgrl;
            	}
	        	
	        	//마디삭제
            	if(id == "27"){
            		var akeltkrwp = "<span class=\"ok-menu\" title=\"<spring:message code='menu.edit.delete'/>\">";
	        		akeltkrwp += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/edit_delete.png\" onclick=\"deleteAction();\">";
	        		akeltkrwp += "</span>";
            		return akeltkrwp;
            	}
	        	
	        	//색상변경
            	if(id == "29"){
            		var tortkdqusrud = "<span class=\"ok-menu\" title=\"<spring:message code='menu.plugin.colorchange'/>\">";
	        		tortkdqusrud += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/edit_changecolor.png\" onclick=\"nodeColorMix();\">";
	        		tortkdqusrud += "</span>";	
	        		return tortkdqusrud;
            	}
	        	
	        	//맵 배경
            	if(id == "25"){
            		var aoqqorud = "<span class=\"ok-menu\" title=\"<spring:message code='menu.plugin.mapbackgroundchange'/>\">";
	        		aoqqorud += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/edit_changecolor.png\" onclick=\"changeMapBackgroundAction();\">";
	        		aoqqorud += "</span>";
	        		return aoqqorud;
            	}
	        	
	        	//그룹관리
            	if(id == "30"){
            		var rmfnqrhksfl = "<span class=\"ok-menu\" title=\"<spring:message code='menu.setting.group'/>\">";
	        		rmfnqrhksfl += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/share_group.png\" onclick=\"groupManage();\">";
	        		rmfnqrhksfl += "</span>";
	        		return rmfnqrhksfl;
            	}
	        	
	        	//공유설정
            	if(id == "31"){
            		var rhddbtjfwjd = "<span class=\"ok-menu\" title=\"<spring:message code='menu.setting.share'/>\">";
	        		rhddbtjfwjd += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/share_share.png\" onclick=\"shareManage();\">";
	        		rhddbtjfwjd += "</span>";
	        		return rhddbtjfwjd;
            	}
	        		
	        	//Course enrolment
            	if(id == "32"){
            		var courseenrolment = "<span class=\"ok-menu\" title=\"Course enrolment\">";
	        		courseenrolment += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/share_group.png\" onclick=\"courseEnrolment();\">";
	        		courseenrolment += "</span>";
	        		return courseenrolment;
            	}
	        		
	        	//임베드
            	if(id == "33"){
            		var dlaqpem = "<span class=\"ok-menu\" title=\"<spring:message code='video.tabs.embed'/>\">";
	        		dlaqpem += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/share_embed.png\" onclick=\"createEmbedTag();\">";
	        		dlaqpem += "</span>";
	        		return dlaqpem;
            	}
	        		
	        	//내보내기
            	if(id == "34"){
            		var soqhsorl = "<span class=\"ok-menu\" title=\"<spring:message code='menu.export'/>\">";
	        		soqhsorl += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/share_export.png\" onclick=\"exportFile();\">";
	        		soqhsorl += "</span>";
	        		return soqhsorl
            	}
            	
	        	//가져오기
            	if(id == "35"){
            		var rkwudhrl = "<span class=\"ok-menu\" title=\"<spring:message code='menu.import'/>\">";
	        		rkwudhrl += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/share_import.png\" onclick=\"clipBoard();\">";
	        		rkwudhrl += "</span>";
	        		return rkwudhrl;
            	}
	        	
	        	//페이스북
            	if(id == "36"){
            		var vpdltmqnr = "<span class=\"ok-menu\" title=\"<spring:message code='menu.plugin.facebook'/>\">";
	        		vpdltmqnr += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/share_facebook.png\" onclick=\"FacebookGetFeedAction();\">";
	        		vpdltmqnr += "</span>";
	        		return vpdltmqnr;
            	}
	        	
	        	//쇼보기
            	if(id == "39"){
            		var tyqhrl = "<span class=\"ok-menu\" title=\"<spring:message code='menu.advanced.pt.show.view'/>\">";
	        		tyqhrl += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/show_show.png\" onclick=\"presentationStartMode();\">";
	        		tyqhrl += "</span>";
	        		return tyqhrl;
            	}
	        	
	        	//편집
            	if(id == "40"){
            		var vuswlq = "<span class=\"ok-menu\" title=\"<spring:message code='common.edit'/>\">";
	        		vuswlq += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/show_edit.png\" onclick=\"presentationEditMode();\">";
	        		vuswlq += "</span>";
	        		return vuswlq;
            	}
	        	
	        	//모두 접기/펴기
            	if(id == "41"){
            		var ahenwjqrlvurl = "<span class=\"ok-menu\" title=\"<spring:message code='menu.view.afolding'/>\">";
	        		ahenwjqrlvurl += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/edit_expand.png\" onclick=\"foldingall();\">";
	        		ahenwjqrlvurl += "</span>";
	        		return ahenwjqrlvurl;
            	}
	        	
	        	//확대
            	if(id == "42"){
            		var ghkreo = "<span class=\"ok-menu\" title=\"<spring:message code='menu.view.zoomin'/>\">";
	        		ghkreo += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/show_plus.png\" onclick=\"zoominAction();\">";
	        		ghkreo += "</span>";
	        		return ghkreo;
            	}
	        	
	        	//축소
            	if(id == "43"){
            		var cnrth = "<span class=\"ok-menu\" title=\"<spring:message code='menu.view.zoomout'/>\">";
	        		cnrth += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/show_minus.png\" onclick=\"zoomoutAction();\">";
	        		cnrth += "</span>";
	        		return cnrth;
            	}
	        	
	        	//실제크기
            	if(id == "44"){
            		var tlfwpzmrl = "<span class=\"ok-menu\" title=\"<spring:message code='menu.view.zoomnot'/>\">";
	        		tlfwpzmrl += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/show_fit.png\" onclick=\"zoomnotAction();\">";
	        		tlfwpzmrl += "</span>";
	        		return tlfwpzmrl;
            	}
	        	
	        	//마인드맵
            	if(id == "45"){
            		var akdlsemaoq = "<span class=\"ok-menu\" title=\"<spring:message code='common.mapstyle.mindmap'/>\">";
	        		akdlsemaoq += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/show_mindmap.png\" onclick=\"changeToMindmap();\">";
	        		akdlsemaoq += "</span>";	
	        		return akdlsemaoq;
            	}
	        	
	        	//트리맵
            	if(id == "46"){
            		var xmflaoq = "<span class=\"ok-menu\" title=\"<spring:message code='common.mapstyle.tree'/>\">";
	        		xmflaoq += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/show_treemap.png\" onclick=\"changeToTree();\">";
	        		xmflaoq += "</span>";
	        		return xmflaoq;
            	}
	        	
	        	//More
            	if(id == "47"){
            		var more2 = "<span class=\"ok-menu\" title=\"<spring:message code='menu.view.more_map_style'/>\">";
	        		more2 += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/more.png\" onclick=\"moreMapStyleAction();\">";
	        		more2 += "</span>";	
	        		return more2;
            	}
	        	
	        	//채팅
            	if(id == "48"){
            		var coxld = "<span class=\"ok-menu\" title=\"<spring:message code='chatting.expanding'/>\">";
	        		coxld += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/show_chat.png\" onclick=\"rightPanelFolding();\">";
	        		coxld += "</span>";
	        		return coxld;
            	}
	        	
	        	//구글 검색
            	if(id == "49"){
            		var rnrmfrjator = "<span class=\"ok-menu\" title=\"<spring:message code='menu.advanced.googlesearch'/>\">";
	        		rnrmfrjator += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/show_google.png\" onclick=\"googleSearch();\">";
	        		rnrmfrjator += "</span>";
	        		return rnrmfrjator;
            	}
	        	
	        	//활동기록보기
            	if(id == "50"){
            		var ghkfehdrlfhrqhrl = "<span class=\"ok-menu\" title=\"<spring:message code='menu.advanced.activity'/>\">";
	        		ghkfehdrlfhrqhrl += "<img class=\"ribbon-icon ribbon-normal\" src=\"/ribbonmenu/ribbonicons/activity_icon.png\" onclick=\"activityMonitoring();\">";
	        		ghkfehdrlfhrqhrl += "</span>";	
	        		return ghkfehdrlfhrqhrl;
            	}
            }
        </script>
<!--------------------------------------------------- 오른쪽 콘텐츠 영역(05/25) ---------------------------------------------->

<% if(useragent != null){ %>
			<link rel="stylesheet" href="${pageContext.request.contextPath}/css/mobile.css?v=<%=updateTime%>" type="text/css">
			<link rel="stylesheet" href="${pageContext.request.contextPath}/css/showLoading.css?v=<%=updateTime%>" type="text/css" media="screen">
			<script src="${pageContext.request.contextPath}/lib/floaty.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
			<script src="${pageContext.request.contextPath}/lib/jquery.showLoading.min.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<% } %>
		
		<%
			request.setAttribute("servername", request.getServerName());
		%>
		 
		
			<c:choose>
				<c:when test="${servername != 'localhost'}">
					<c:set var="short_url" scope="page" value="${data.map.short_url}"/>
				</c:when>
				<c:otherwise>
					<c:set var="short_url" scope="page" value=""/>
				</c:otherwise>
			</c:choose>

		
		<script type="text/javascript">
			var FACEBOOK_APP_ID = '<%=facebook_appid%>';
			
			// javascript 언어설정
			var opts = {
				language : "${locale.language}",
				dataUrl: "${pageContext.request.contextPath}/AcceptLanguage",
				supportLocale: false,
				contextPath: "${pageContext.request.contextPath}"
			};
			i18n.init(opts);
						
			// 창 사이즈 변경시 이벤트
			function getSize() {
				var myWidth = 0;
				var myHeight = 0;

				if( typeof( window.innerWidth ) == 'number' ) {
					//Non-IE
					myWidth = window.innerWidth;
					myHeight = window.innerHeight;
				} else if( document.documentElement &&
							( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
					//IE 6+ in 'standards compliant mode'
					myWidth = document.documentElement.clientWidth;
					myHeight = document.documentElement.clientHeight;
				} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
					//IE 4 compatible
					myWidth = document.body.clientWidth;
					myHeight = document.body.clientHeight;
				}

				return {"width": myWidth, "height": myHeight}
			}

			function resize() {
// 				// 모바일 경우 화면 회전시 노드를 중앙에 놓는다.
// 				if(ISMOBILE || supportsTouch) {
// 					if(jMap != null && jMap !== undefined) {
// 						screenFocusAction();
// 						// Hack!!
// 						this.work.scrollTop += 1;
// 					}
// 				}
				
				var size = getSize();
				var w = size.width;
				var h = size.height;

// 				var topDiv = document.getElementById("ribbon");
// 				if(!topDiv) topDiv = 0;
// 				var bottomDiv = document.getElementById("bottom");
// 				if(!bottomDiv) bottomDiv = 0;

				var mapDiv = document.getElementById("main");
// 				var topDiv = document.getElementById("top");

// 				mapDiv.style.width = w + "px";
				<%if( "on".equals(menu) ) {%>
				//mapDiv.style.height = h + "px";
				<%} else {%>
					//mapDiv.style.height = h + "px";
				<%}%>
		//			mapDiv.style.overflow = 'auto';
		
// 				topDiv.style.width = w + "px";
				
				// 사이드 메뉴
				var rightpanel = document.getElementById("rightpanel");
				if(rightpanel) rightpanel.style.height = (h-177)+"px";
		
				<% if(useragent != null){ %>
					$('.simplemodal-container').width('100%');
					$('.simplemodal-container').height('100%');
					$('iframe').width('100%');
					$('iframe').height('100%');
				<% } %>
			}
			
			if(ISMOBILE || supportsTouch){
				window.addEventListener("resize", resize, false);
				window.addEventListener("orientationchange", resize, false);
				// (optional) Android doesn't always fire orientationChange on 180 degree turns
// 				setInterval(resize, 2000);
			}else{
				window.onresize = resize;				
			}
			$(document).ready( resize );
			
			// Google analytics
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-30732410-1']);
			_gaq.push(['_trackPageview']);			
			(function() {
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();

			//DWR 3.0 RC2. "A server error has occurred." 메시지 무시
			dwr.engine.setErrorHandler (function (msg, err) {
				if (err.name == 'dwr.engine.http.0') {
					//console.log(err);
					//alert(msg);
				} else {
					alert ( msg );
				}
			});
			// 페이지가 unload 될 때 서버에 destroy를 하도록 설정
			dwr.engine.setNotifyServerOnPageUnload(true, false);
			  
			/////// Funtions ///////
			var inputPasswordP = function() {
				/* $.modal('<iframe src="${pageContext.request.contextPath}/share/password.do?type=popup&mapId=<c:out value="${data.mapId}"/>&hasPasswordEditGrant=<c:out value="${data.hasPasswordEditGrant}"/>&message=<c:out value="${data.message}"/>&action=<c:out value="${data.action}"/>" frameborder="0" allowtransparency="true" width="430"  height="205" scrolling="no"></iframe>', {
					overlayId: 'okm-overlay',
					containerId: 'passwordpopup-container',
					dataId: 'passwordpopup-data'}); */
				$("#dialog_c").append('<iframe src="${pageContext.request.contextPath}/share/password.do?type=popup&mapId=<c:out value="${data.mapId}"/>&hasPasswordEditGrant=<c:out value="${data.hasPasswordEditGrant}"/>&message=<c:out value="${data.message}"/>&action=<c:out value="${data.action}"/>" frameborder="0" allowtransparency="true" width="430"  height="205" scrolling="no"></iframe>');
				var iframeWidth = $("#dialog_c iframe").width();
				 
				  $("#dialog_c").dialog({
					  autoOpen:false,
				      closeOnEscape: true,	//esc키로 창을 닫는다.
				      modal:true,		//modal 창으로 설정
				      resizable:false,	//사이즈 변경
				      close: function( event, ui ) {
				    	  	$("#dialog_c iframe").remove();
				    		$("#dialog_c").dialog("destroy");
				    		jMap.work.focus();
				      	},
					  });
				  $("#dialog_c").dialog("option", "width", "none" );
				  $("#dialog_c").dialog( "option", "dialogClass", "inputPasswordP" );
				  $("#dialog_c").dialog("open");
			}
			
			var rightPanelFolding = function(val) {
				var rp = $('#rightpanel-wrap');
				var panel = $('#rightpanel');
				var rpc = $('#rightpanel-close');
				var chatbutton = $('#chat-button');
				
				
				/* if($('#folding-RB').attr('folding-stat')){ // 오른쪽 패널을 눌렀을때 리본메뉴가 펼쳐져있으면
					rp.css("top","176px");
				} */
				
				//KHANG: store chat panel status

				if (panel.css('display') == 'block' || val) {
					chatbutton.html("<spring:message code='chatting.turnon'/>");
					$.cookie('rightPanelFolding', null); //remove cookie
					$.cookie('rightPanelFolding', 0, {path: '/'});
					
					panel.animate({
						right : -250
					}, 1000, function() {
						$(this).hide();
					});
					
					rpc.animate({
						right : 0
					}, 1000, function() {
						$(this).css("background-position-y", 0);
					});
			    	
				} else {
					chatbutton.html("<spring:message code='chatting.turnoff'/>");
					$.cookie('rightPanelFolding', null);
					$.cookie('rightPanelFolding', 1, {path: '/'});
					
					panel.show();
					panel.animate({
						right : 0
					}, 1000, function() {						
					});
					
					rpc.animate({
						right : 250
					}, 1000, function() {
						$(this).css("background-position-y", -30);
					});
					
					/*
					rp.animate({
						right : 0
					}, 1000, function() {
						rpc.css("background-position-y", -30);
					});
					var rp = $('#chat-button');
					rp.css('background-color', '#4B89A9');
					*/
				}				
			}
			

		</script>
				
		<script type="text/javascript">
			var jMap;
			var pageId;
			var mapId = "<c:out value="${data.mapId}"/>";
			var mapName = "<c:out value="${data.map.name}"/>";
			var menu_isOwner = "<c:out value="${data.isOwner}"/>";
			var menu_canEdit =  "<c:out value="${data.canEdit}"/>";
			var menu_canCopyNode =  "<c:out value="${data.canCopyNode}"/>";
			
			var shouldSave = true;
			function jinoMap_init() {				
				jMap = new JinoMap("jinomap", 5000, 3000, <c:choose><c:when test="${data.canEdit}">1</c:when><c:otherwise>0</c:otherwise></c:choose>);				
				jMap.cfg.lazyLoading = (<c:out value="${data.lazyloading}"/> == "0")? false : true;
				jMap.cfg.contextPath = "${pageContext.request.contextPath}";
				jMap.cfg.mapId = mapId;
				jMap.cfg.mapName = mapName;
				jMap.cfg.mapKey = "<c:out value="${data.map.key}"/>";
				jMap.cfg.mapOwner = <c:out value="${data.isOwner}"/>;
				jMap.cfg.canEdit = <c:out value="${data.canEdit}"/>
				<c:choose>
				<c:when test="${user.guest}">
			    jMap.cfg.userId = "<c:out value="0"/>";
				</c:when>
				<c:otherwise>
				jMap.cfg.userId = "<c:out value="${user.id}"/>";
				</c:otherwise>
				</c:choose>
				jMap.cfg.userLastAccess = "<c:out value="${user.lastaccess}"/>";
				
				JinoUtil.waitingDialog("Loading Map");
				
				<c:if test="${servername != 'localhost'}">
					jMap.cfg.shortUrl = "${short_url}";
					jMap.cfg.QRCode = "${short_url}"+".qrcode";
				</c:if>
				
				<% if("off".equals(menu) ) { %>
				<% if(useragent == null){%>
					jMap.setWaterMark();
				<% }} %>
				
				jMap.setUserConfig(<c:out value="${user.id}"/>);
				jMap.loadMap("${pageContext.request.contextPath}", <c:out value="${data.map.id}"/>, mapName);
				jMap.loaded = function() {
					<% if("on".equals(menu) ) { %>
					<% if(useragent == null){ %>
						// 알림창
						okmNoticeAction();
					<% }} %>
					
					//KHANG: restore background
					var root = jMap.getRootNode();
					if (root.attributes == undefined)
						root.attributes = {};
					
					jMap.cfg.mapBackgroundImage = root.attributes['mapBackgroundImage'] || '';
					jMap.cfg.mapBackgroundColor = root.attributes['mapBackgroundColor'] || "#ffffff";
					
					$(jMap.work).css("background-color", jMap.cfg.mapBackgroundColor);
					$(jMap.work).css("background-image", 'url("' + jMap.cfg.mapBackgroundImage + '")');

					
					$(jMap.work).contextPopup({
						title: null,
						items: [
							{label:"<spring:message code='menu.gotoLink'/>",  icon:'../ribbonmenu/ribbonicons/external-icon.png', action: function() { gotoLinkAction(); }, mount: gotoLinkMount },
							{mount: gotoLinkMount, divider: true}, // divider
							{label:"<spring:message code='menu.media.image'/>",  icon:'../ribbonmenu/ribbonicons/edit_image.png',      action:function() {imageProviderAction();} },
					        {label:"<spring:message code='menu.media.video'/>",  icon:'../ribbonmenu/ribbonicons/edit_video.png',      action:function() {videoProviderAction();} },
					        {label:i18n.msgStore["menu_edit_hyperlink"],  icon:'../ribbonmenu/ribbonicons/edit_link.png',      action:function() {insertHyperAction();} },
						    {label:i18n.msgStore["iframe"],  icon:'../ribbonmenu/ribbonicons/edit_iframe.png',      action:function() {insertIFrameAction();} },
						    {label:i18n.msgStore["webpage"],     icon:'../ribbonmenu/ribbonicons/edit_webpage.png', action:function() {insertWebPageAction();} },
						    {label:i18n.msgStore["lti"],     icon:'../ribbonmenu/ribbonicons/edit_lti.png',         action:function() {insertLTIAction();} },
						    null, // divider
						    {label:"<spring:message code='menu.edit.nodeedit'/>", icon:'../ribbonmenu/ribbonicons/edit_editnode.png',  action:function() {editNodeAction();} },
						    {label:"<spring:message code='menu.edit.cut'/>", icon:'../ribbonmenu/ribbonicons/edit_cut.png',  action:function() {cutAction();} },
						    {label:"<spring:message code='menu.edit.copy'/>", icon:'../ribbonmenu/ribbonicons/edit_copy.png',  action:function() {copyAction();} },
						    {label:"<spring:message code='menu.edit.paste'/>", icon:'../ribbonmenu/ribbonicons/edit_paste.png',  action:function() {pasteAction();} },
						    {label:"<spring:message code='menu.edit.delete'/>", icon:'../ribbonmenu/ribbonicons/edit_delete.png',  action:function() {deleteAction();} },
						    null, // divider
						    {label:"<spring:message code='menu.format.nodetextcolor'/>", icon:'../ribbonmenu/ribbonicons/edit_fontcolor.png',  action:function() {nodeTextColorAction();} },
						    {label:"<spring:message code='menu.format.nodebgcolor'/>", icon:'../ribbonmenu/ribbonicons/edit_color.png',  action:function() {nodeBGColorAction();} },
						    {label:"Edit Text on branch", icon:'../ribbonmenu/ribbonicons/edit_color.png',  action:function() {insertTextOnBranchAction();} }
						  ],
						  event: 'jinocontextmenu'
					});
					//KHANG: restore chatting panel status
					var panel = $('#rightpanel');
					if ($.cookie('rightPanelFolding') == 1) {
						if (panel.css('display') != 'block')
							rightPanelFolding();
					} else {
						if (panel.css('display') == 'block')
							rightPanelFolding();
					}
					
					
					//paste image
					function retrieveImageFromClipboardAsBlob(pasteEvent, callback) {
						if(pasteEvent.clipboardData == false){
					        if(typeof(callback) == "function"){
					            callback(undefined);
					        }
					    };

					    var items = pasteEvent.clipboardData.items;

					    if(items == undefined){
					        if(typeof(callback) == "function"){
					            callback(undefined);
					        }
					    };
					    for (var i = 0; i < items.length; i++) {
					        // Skip content if not image
					        if (items[i].type.indexOf("image") == -1) continue;
					        
					        // Retrieve image on clipboard as blob
					        var blob = items[i].getAsFile();

					        if(typeof(callback) == "function"){
					            callback(blob);
					        }
					        break;
					    }
					}

					window.addEventListener("paste", function(e) {
					    // Handle the event
					    retrieveImageFromClipboardAsBlob(e, function(imageBlob) {
					        // If there's an image, display it in the canvas
					        if (!imageBlob)
					        	return;
			            	var selected = jMap.getSelected();
			                if (!selected || !jMap.isAllowNodeEdit(selected))
			                	return;
							
			                var NodeWidth;
					    	if (selected.img != undefined){
								NodeWidth = selected.img.attr().width;
							} else {
								NodeWidth = jMap.cfg.default_img_size;
							}
					    	
				            var canvas = document.createElement('canvas');
				            canvas.id = "temp_canvas";
				            document.body.appendChild(canvas);
				            
				            var ctx = canvas.getContext('2d');
				            
				            // Create an image to render the blob on the canvas
				            var img = new Image();

				            // Once the image loads, render the img on the canvas
				            img.onload = function() {
				                // Update dimensions of the canvas with the dimensions of the image
				                canvas.width = NodeWidth; //this.width;
				                canvas.height = NodeWidth*this.height/this.width;

				                // Draw the image
				                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			        			selected.setImage(canvas.toDataURL('image/png'), canvas.width, canvas.height);
			        			document.body.removeChild(canvas);
				            };

				            // Crossbrowser support for URL
				            var URLObj = window.URL || window.webkitURL;

				            // Creates a DOMString containing a URL representing the object given in the parameter
				            // namely the original Blob
				           	img.src = URLObj.createObjectURL(imageBlob);
						});
					}, false);
					
					//KHANG: prevent Browser context menu on map
					$(jMap.work).on('contextmenu', function() {return false;});

					<c:if test="${data.show}">
						//presentation mode
						var typeName = "<c:out value="${data.type}"/>";
						var theme    = "<c:out value="${data.style}"/>";
						
						var types = {dynamic: 'Dynamic',
									 box: 'Box',
									 aero: 'Aero',
									 linear: 'Linear'};
						
						var themes = {blacklabel: 'BlackLabel',
									  basic: 'Basic',
									  sunshine: 'Sunshine',
									  sky: 'Sky',
									  bluelabel: 'BlueLabel'};

						typeName = typeName.toLowerCase();
						theme    = theme.toLowerCase();
						
						if (typeName == 'mindmap-zoom') {
							EditorManager.show();
							EditorManager.hide();
							ScaleAnimate.showStyle = ScaleAnimate.scaleToScreenFitWithZoomInOut;
							ScaleAnimate.startShowMode(30, 20, true);
						} else if (typeName == 'mindmap-basic'){
							EditorManager.show();
							EditorManager.hide();
							ScaleAnimate.showStyle = ScaleAnimate.scaleToScreenFit;
							ScaleAnimate.startShowMode(30, 20, true);
						} else if (types[typeName] && themes[theme]) {
							Presentation.setEffect(types[typeName]);
							Presentation.setStyle(themes[theme]);
							Presentation.start(true); //auto start for Dynamic type.
						} else {
							//unknown typeName or theme
						}
					</c:if>
				}
				
				init();
				SET_DWR(true);
				
				<% if("on".equals(menu) ) { %>
				<% if(useragent == null){ %>
					//OKMAdsense('okm-adsense');
					OKMChat('okm-chat', '<c:out value="${user.lastname}"/> <c:out value="${user.firstname}"/>');						
					
					$("#rightpanel").splitter({
						type: "h",
						//outline: true,
						maxTop: 1,
						minTop: 0,
						minBottom: 0,
						//sizeTop: 0,
						//resizeToWidth: true,
						//cookie: "docksplitter",
						dock: "top",
						dockSpeed: 200,
						//barNormalClass: "splitter-default",
						//barHoverClass:  "splitter-hover",
						//barActiveClass: "splitter-highlight",
						//barLimitClass:  "splitter-limit"
					}); 
					
					// 오른쪽 패널 상태 초기화 (숨김)
					$('#chat-button').html("<spring:message code='chatting.turnon'/>");
					$('#rightpanel-wrap').css('top', 176);
					//$('#rightpanel').css('right', -250).hide();
					$('#rightpanel-close').css("background-position-y", -30);
				<% }} %>

				<% if(useragent != null){ %>
					$('#mobile_menu').makeFloaty({
	                    spacing: 20,
	                    time: '1s'
	                });

					setTimeout(function(){
						$('#mobile_menu').hideFloaty();
					}, 5000);
				<% } %>


				<c:choose>
					<c:when test="${data.google eq \"on\"}">
								SET_GOOGLE_SEARCHER(true);
					</c:when>
					<c:otherwise>
								SET_GOOGLE_SEARCHER(false);
					</c:otherwise>
				</c:choose>
								
			}
			$(document).ready( jinoMap_init );
			

			//window.fbAsyncInit = FacebookService.initFacebook;
		</script>


	


		
		
	<!-- 리본 메뉴 활성화/비활성화 -->
		<script type="text/javascript">
			$(document).ready(function() {
				
				//맵 작성자 일때 활성화/비활성화 매뉴
				isOwnerMenu(menu_isOwner);
								
				//수정 권한 있을 때 활성화/비활성화 매뉴
				canEditMenu(menu_canEdit);
				canCopyNode(menu_canCopyNode);

				if(menu_canEdit == "true"){
					//노드 선택 되었을 때 메뉴 활성화
					jMap.addActionListener("action_NodeSelected", function(){		
						selectedNodeMenu(true);
					});					
						//노드 선택이 해제 되었을 때 비활성화
					jMap.addActionListener("action_NodeUnSelected", function(){			
						selectedNodeMenu(false);
					});					
				}
				
				if(jMap.cfg.default_menu_opacity == true || jMap.cfg.default_menu_opacity == "true" ){					
					$("#top #ribbon").css("opacity", "0.8");
				}else{
					$("#top #ribbon").css("opacity", "1");
				}


			});
		</script>


		<c:if test="${ user != null && user.username != 'guest'}">
		<!-- /////////////////// ContextMenu ///////////////////////////// -->
		<!-- 기존메뉴의 마우스 오른쪽 버튼 있던 부분 -->	
		<!-- /////////////////// ContextMenu 끝 ///////////////////////////// -->
		</c:if>
		<!-- Place this tag after the last +1 button tag. -->
		<script type="text/javascript">
		<c:if test="${locale.language eq 'ko'}">
		  window.___gcfg = {lang: 'ko'};	
		  </c:if>
		  (function() {
		    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
		    po.src = 'https://apis.google.com/js/plusone.js';
		    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
		  })();
		</script>
		
		<script type="text/javascript">
		$(window).load(function() {
			jMap.resolveRendering();
		    jMap.addActionListener(ACTIONS.ACTION_NODE_IMAGELOADED, function(){
			    jMap.resolveRendering();
		    });
		});
		
		
		/**[S]토론 **/
		$(document).ready(function(){
			getDiscussMasterList();
			
			 /* $(document).mouseup(function(e) {
           	  var container = $(".ft-sub-menu");          		  
          			if($(".ok-floating-menu").children().last().css("display") == "block"){
                       $(".ft-sub-menu").css("display", "none");
                    }         			
             });  */
		});
				
		
		//토론 마스터 목록
		function getDiscussMasterList(){
			
			var mapid = "${data.mapId}";
			var keyword = $("#discussKeyword").val();
			
			$.ajax({
   				type: 'post',
   				dataType: 'html',
   				async: false,
   				url: '${pageContext.request.contextPath}/mindmap/discussMasterList.do',
   				data: {	'mapid': mapid , 'keyword' : keyword },
   				success: function(data) {
   					$("#__discuss__").html(data);
   				},
   				error: function(data, status, err) {
   					alert("error : " + status);
   				}
   			});
		}
		
		//토론 만들기
		function saveDiscussMaster(){
			
			var mapid = "${data.mapId}";
			var title = $("#discussTitle").val();
			
			if(mapid == ""){
				alert("마인드맵을 생성 후 토론을 개설할 수 있습니다.");
				return;
			}
			
			if(title == ""){
				alert("토론명을 입력해 주세요.");
				return;
			}
			
			$.ajax({
   				type: 'post',
   				dataType: 'json',
   				async: false,
   				url: '${pageContext.request.contextPath}/mindmap/discussMasterInsert.do',
   				data: {	'mapid': mapid , 'title' : title },
   				success: function(data) {
   					if(Number(data.result) > 0){
   						alert("토론을 개설 했습니다.");
   						getDiscussMasterList();
   					}else{
   						alert("토론을 개설을 실패 했습니다.");
   					}
   				},
   				error: function(data, status, err) {
   					alert("error : " + status);
   				}
   			});
		}
		
		//토론 콘텐츠 목록
		function getDiscussContentList(discuss_seq, title){
			var mapid = "${data.mapId}";
			
			$.ajax({
   				type: 'post',
   				dataType: 'html',
   				async: false,
   				url: '${pageContext.request.contextPath}/mindmap/discussContentList.do',
   				data: {	'discuss_seq': discuss_seq , 'title' : title , 'mapid':mapid},
   				success: function(data) {
   					$("#__discuss__").html(data);
   				},
   				error: function(data, status, err) {
   					alert("error : " + status);
   				}
   			});
		}
		
		//토론 콘텐츠 만들기
		function saveDiscussContent(){
			var discuss_seq = $("#contentDiscussSeq").val();
			var title = $("#contentDiscussTitle").val();
			var content = $("#discusscontent").val();
			
			if(content == ""){
				alert("내용을 입력해 주세요.");
				return;
			}
			
			$.ajax({
   				type: 'post',
   				dataType: 'json',
   				async: false,
   				url: '${pageContext.request.contextPath}/mindmap/discussContentInsert.do',
   				data: {	'content': content , 'discuss_seq' : discuss_seq },
   				success: function(data) {
   					if(data.result == "1"){
   						alert("등록 했습니다.");
   						getDiscussContentList(discuss_seq, title);
   					}else{
   						alert("등록을 실패 했습니다.");
   					}
   				},
   				error: function(data, status, err) {
   					alert("error : " + status);
   				}
   			});
		}
		
		//토론 사용자 추가
		function addDiscussUser(gb, id){
			var mapid = "${data.mapId}";
			var email = $("#discussAddUserEmail").val();
			
			if(id == "" && email == ""){
				alert("이메일을 입력해 주세요.");
				return;
			}
			
			$.ajax({
   				type: 'post',
   				dataType: 'json',
   				async: false,
   				url: '${pageContext.request.contextPath}/mindmap/discussMapUserInsert.do',
   				data: {	'mapid': mapid , 'email' : email , 'userid':id},
   				success: function(data) {
   					if(Number(data.result) == 99){
   						alert("이미 초대된 사용자 입니다.");
   					}else if(Number(data.result) == 88){
   						alert("해당 이메일의 사용자가 없습니다.");
   					}else if(Number(data.result) > 0){
   						alert("초대를 성공 했습니다.");
   						if(gb == "searchUser"){
   							getDiscussUserList();
   							$("#__discussUserCount__").text($(".__userCnt__").length+1);
   						}else if(gb == "searchUserKeyword"){
   							var keyword = $('#discussUserSearchKeyword').val();
   							getDiscussUserList(keyword);
   							$("#__discussUserCount__").text($(".__userCnt__").length+1);
   						}else{
   							getDiscussMasterList();
   						}
   						
   					}else{
   						alert("초대를 실패 했습니다.");
   					}
   				},
   				error: function(data, status, err) {
   					alert("error : " + status);
   				}
   			});
		}
		
		//토론 그룹원 목록
		function getDiscussUserList(keyword){
			var mapid = "${data.mapId}";
			
			$.ajax({
   				type: 'post',
   				dataType: 'html',
   				async: false,
   				url: '${pageContext.request.contextPath}/mindmap/discussUserList.do',
   				data: {	'mapid': mapid , 'keyword' : keyword },
   				success: function(data) {
   					$("#__discuss__").html(data);
   				},
   				error: function(data, status, err) {
   					alert("error : " + status);
   				}
   			});
		}
		
		//토론 그룹원 삭제
		function deleteDiscussUser(userid){
			var mapid = "${data.mapId}";
			if(confirm("해당 그룹원을 삭제 하시겠습니까?")){
				$.ajax({
	   				type: 'post',
	   				dataType: 'json',
	   				async: false,
	   				url: '${pageContext.request.contextPath}/mindmap/discussUserDelete.do',
	   				data: {	'mapid': mapid , 'userid' : userid },
	   				success: function(data) {
	   					if(Number(data.result) > 0){
	   						alert("삭제를 성공 했습니다.");
	   						var keyword = $('#discussUserSearchKeyword').val();
	   						
	   						if(keyword != ""){
	   							getDiscussUserList(keyword);
	   						}else{
	   							getDiscussUserList();
	   						}
	   						
	   						$("#__discussUserCount__").text($(".__userCnt__").length+1);
	   					}else{
	   						alert("삭제를 실패 했습니다.");
	   					}
	   				},
	   				error: function(data, status, err) {
	   					alert("error : " + status);
	   				}
	   			});
			}
		}
		
		//토론 사용자 검색
		function getDiscussUserSearchList(){
			var keyword = $("#discussUserSearchKeyword").val();
			var type = $("#discussUserSearchType").val();
			var mapid = "${data.mapId}";
			
			$.ajax({
   				type: 'post',
   				dataType: 'html',
   				async: false,
   				url: '${pageContext.request.contextPath}/mindmap/discussUserSearchList.do',
   				data: {	'mapid': mapid , 'keyword':keyword , 'type':type },
   				success: function(data) {
   					$("#__discussUserSearchList__").html(data);
   				},
   				error: function(data, status, err) {
   					alert("error : " + status);
   				}
   			});
			
		}
		
		/**[E]토론 **/
		
		//오른쪽 패널 열기
		function showRight(gb){
			if($(".ok-cont-area.hide").length > 0){
				
				$(".show-btn").click();
			}
			viewRight(gb);
		}
		
		//오른쪽 패널 > 토론 및 채팅 창 보이기
		function viewRight(gb){
			if(gb == "disc"){
				$("#__disc__").addClass("on");
				$("#__chat__").removeClass("on");
				$("#__discuss__").show();
				$("#__member__").show();
				$("#okm-chat").hide();
			}else{
				$("#__chat__").addClass("on");
				$("#__disc__").removeClass("on");
				$("#__discuss__").hide();
				$("#__member__").hide();
				$("#okm-chat").show();
				$("#chatlog").scrollTop($(document).height());
			}
		}
		
		</script>
		
</head>
<body style="cursor: auto;">
<!------------------------------------ 왼쪽 컨텐츠 영역 html start ------------------------------------------>
<div id="ok-lnb" class="ok-lnb">
    <div class="lnb-more"></div>
    <div class="lnb-logo">
        <a href="${pageContext.request.contextPath}/front.do"><img src="${pageContext.request.contextPath}/ribbonmenu/ribbonicons/logo.png" alt="logo" /></a>
    </div>
    <ul>
        <li class="on">
            <a href="#">새로운 마인드맵</a>
            <ul>
                <li>
                    <a href="#" onclick="openMap()">마인드맵 열기</a>
                </li>
                <li>
                    <a href="#" onclick="saveAsMap()">새이름으로 저장</a>
                </li>
                <li class="tp-br">
                    <a href="#" onclick="timelineMode()">타임라인 및 편집</a>
                </li>
                <li>
                    <a href="#" onclick="splitMap()">맵 분리하기</a>
                </li>
                <li>
                    <a href="#" onclick="delMap()">맵 삭제하기</a>
                </li>
                <li>
                    <a href="#">편집제한</a>
                </li>
                <li>
                    <a href="#" onclick="exportFile()">내보내기</a>
                </li>
                <li>
                    <a href="#" onclick="clipBoard()">가져오기</a>
                </li>
            </ul>
        </li>
    </ul>
    
    <div class="board-list">
        <p>
            <a href="#" onclick="okmNoticeAction(true);">공지사항</a>
        </p>
        <p>
            <a href="#" onclick="requestFunction();">Q&amp;A</a>
        </p>
        <p>
            <a href="#">FAQ</a>
        </p>
    </div>
    <div class="lnb-footer">
        <a href="${pageContext.request.contextPath}/guide.do" class="gd">사용가이드</a>
    </div>
</div>
<!------------------------------------ 왼쪽 컨텐츠 영역 html start ------------------------------------------>

<!------------------------------- 오른쪽 컨텐츠 영역(18.06.25) html start ------------------------------------>
		<%-- <link rel="stylesheet" href="${pageContext.request.contextPath}/css/add.css" type="text/css" /> --%>
		<script src="${pageContext.request.contextPath}/pubjs/common.js" type="text/javascript" charset="utf-8"></script>
        <!--  토론 등록전 -->
        <div id="ok-cont-area" class="ok-cont-area hide">
            <div class="show-btn"></div>
            <div class="ok-toolbar">
                <div class="tool-group">
                    <i class="fas fa-plus" onclick="zoominAction();"></i>
                    <i class="fas fa-minus" onclick="zoomoutAction();"></i>
                </div>
                <i class="fas fa-crosshairs" onclick="zoomnotAction();"></i>
                <i class="far fa-comment-dots" onclick="showRight('chat');"></i>
                <i class="far fa-edit" onclick="showRight('disc');"></i>
            </div>
            
            
            <!-- 공유 및 맵스타일 설정 -->
            <div class="ok-shar-area">
                <div class="ok-share">
                    <div class="hide-group">
                        <span class="ev" onclick="SendEmail();">
                            <i class="fas fa-envelope"></i>
                        </span>
                        <span class="kakao" id="kakao">
                            <i class="fas fa-comment"></i>
                            <strong>TALK</strong>
                        </span>
                        <span class="facebook" onclick="shareFacebook();">
                            <i class="fab fa-facebook-f"></i>
                        </span>
                        <span class="setting" onclick="shareManage()">
                            <i class="fas fa-cog"></i>
                        </span>
                    </div>
                    <span class="sh first">
                        <i class="fas fa-share-alt"></i>
                    </span>
                </div>
                <div class="ok-map-style">
                    <span class="st first">
                        <i class="fas fa-sitemap"></i>
                    </span>
                    <div class="hide-group">
                        <span onclick="close_dialog(changeToPadlet)">
                            <i class="far fa-map"></i>
                        </span>
                        <span onclick="close_dialog(changeToSunburst)">
                            <i class="far fa-map"></i>
                        </span>
                        <span onclick="changeToMindmap()">
                            <i class="far fa-map"></i>
                        </span>
                        <span onclick="changeToTree()">
                            <i class="far fa-map"></i>
                        </span>
                    </div>
                </div>
            </div>
            <!-- 공유 및 맵스타일 설정 -->
            
            
            
            
            <div class="ok-cont-header">
                <ul>
                    <li id="__disc__" class="on" onclick="viewRight('disc');">토론</li>
                    <li id="__chat__" onclick="viewRight('chat');">채팅</li>
                </ul>
                <p id="__member__" class="r-b" onclick="getDiscussUserList();">
                    그룹원
                    <span id="__discussUserCount__">0</span>
                </p>
            </div>
            <div class="ok-cont" id="__discuss__">
                <div class="search-area">
                    <input type="text" name="txt01" />
                    <input type="submit" name="sbm01" value="검색" />
                </div>
                <div class="cont-list">
                    <h4 class="cont-header">등록된 토론이 없습니다.</h4>
                    토론주제를 등록하고 의견을 나누세요.
                </div>
                
                <div class="cont-group">
                    <h5>토론만들기</h5>
                    <textarea style="resize: none;"></textarea>
                    <input type="submit" value="만들기" />
                </div>
            </div>
            
            <div class="ok-cont no-pd">
                <div class="chat-area" id="okm-chat" style="display: none;">
                </div>
            </div>
        </div>

    <!------------------------------- floating menu ------------------------------------>
        <!-- 메뉴 아이콘 플러그인(fontawesome) -->
        
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
        <div class="ok-floating-menu"> 
	            <span class="ok-menu" title="<spring:message code='menu.edit.childnode'/>">
	                <img class="ribbon-icon ribbon-normal" src="/ribbonmenu/ribbonicons/edit_childnode.png" onclick="insertAction();">
	            </span>
	            <span class="ok-menu" title="<spring:message code='menu.edit.siblingnode'/>">
	                <img class="ribbon-icon ribbon-normal" src="/ribbonmenu/ribbonicons/edit_bronode.png" onclick="insertSiblingAction();">
	            </span>
	            <span class="ok-menu" title="<spring:message code='menu.edit.imageurl'/>">
	                <img class="ribbon-icon ribbon-normal" src="/ribbonmenu/ribbonicons/edit_image.png" onclick="imageProviderAction();">
	            </span>
	            <span class="ok-menu" title="<spring:message code='video.video_upload'/>">
	                <img class="ribbon-icon ribbon-normal" src="/ribbonmenu/ribbonicons/edit_video.png" onclick="videoProviderAction();">
	            </span>
	            <span class="ok-menu" title="<spring:message code='menu.edit.hyperlink'/>">
	                <img class="ribbon-icon ribbon-normal" src="/ribbonmenu/ribbonicons/edit_link.png" onclick="insertHyperAction();">
	            </span>
	        	<span id="userMenuList"></span>
            <div class="right-btn">
                <!-- <span class="btn moodle-btn" onclick="createMoodle();">무들</span> -->
                <span class="btn plus-btn">
                    <i class="fas fa-plus-square"></i>
                </span>
            </div>
            
            <div class="ft-sub-menu">
                <div class="ft-scroll-div">
                <h5>파일</h5>
                <ul id="__menuList1__"></ul>
                <h5>편집</h5>
                <ul id="__menuList2__"></ul>
                <h5>공유</h5>
                <ul id="__menuList3__"></ul>
                <h5>보기</h5>
                <ul id="__menuList4__"></ul>
                </div>
                <div class="btn-area">
                    <input type="button" value="저장" class="btn save-btn" onclick="ftSave();">
                    <input type="button" value="닫기" class="btn close-btn">
                </div>
            </div>
        </div>
        <!------------------------------- floating menu ------------------------------------>
       
        
<!--------------------------------------------------- 오른쪽 콘텐츠 영역(18.06.25) ---------------------------------------------->


        <!-- 상단 메뉴 시작 -->

        <div id="waitingDialog" class="" style=""></div><div id="dialog"></div>
        <div id="dialog_c"></div>
<!---------------------------------- 상단 헤더 -------------------------------------->
        <div id="top">
            <div class="top-header" >
                <div class="tp-left-block">
                    <div class="top-logo">
                        <img src="${pageContext.request.contextPath}/ribbonmenu/ribbonicons/toplogoV2.png" alt="okmindmap" />
                    </div>
                    <script type="text/javascript">
						function changeLanguage(lang) {
							document.location.href = "${pageContext.request.contextPath}/language.do?locale=" + lang + "&page=" + document.location.href;
						}
					</script>
					
                    <select class="lang" onchange="changeLanguage(this.value);">
						<option value="en" <c:if test="${locale.language eq 'en'}">selected</c:if>><spring:message code='menu.select.lang.en'/></option>
						<option value="ko" <c:if test="${locale.language eq 'ko'}">selected</c:if>><spring:message code='menu.select.lang.ko'/></option>
						<!-- <option value="ja" <c:if test="${locale.language eq 'ja'}">selected</c:if>><spring:message code='menu.select.lang.ja'/></option> -->
						<option value="vi" <c:if test="${locale.language eq 'vi'}">selected</c:if>><spring:message code='menu.select.lang.vi'/></option>
					</select>
                </div>
                <span class="top-title">
                	<span style="cursor:pointer;"id="shorturl" onclick="shorturlFunction()"><c:out value="${data.map.name}(${data.map.short_url})"/></span>
                    <!-- <span>(http://bit.ly/2thEOdB)</span> -->
                </span>
                <div class="tp-right-block">
                    <!-- <a href="#" class="arrow-back">맵으로 돌아가기</a> -->
	
	                <p><i class="fas fa-user-circle"></i></p>
	                <div class="user-block">
	                    <p class="user-img">
	                        <img src="${pageContext.request.contextPath}/css/images/user.png" alt="">
	                    </p>
	                    <p class="user-nm">
	                        <strong>${user.username }</strong>
	                        <span>${user.email }</span>
	                    </p>
	                    <ul>
	                        <li>
	                            <a href="${pageContext.request.contextPath}/profile.do?returnPage=${pageContext.request.contextPath}/map/${data.map.key}">
	                                <i class="far fa-address-card"></i>
	                                프로필관리
	                            </a>
	                        </li>
	                        <li>
	                            <a href="${pageContext.request.contextPath}/front.do">
	                                <i class="fas fa-sitemap"></i>
	                                내마인드맵
	                            </a>
	                        </li>
	                    </ul>
	                    <input type="button" class="btn point w100" value="로그아웃" onclick="okmLogout()">
	                </div>
                </div>
            </div>
        </div>			
<!---------------------------------- 상단 헤더 -------------------------------------->
        <!-- 상단 메뉴 끝 -->

        <!-- OKMindmap View 시작 -->
        <div id="main" style="width:100%; height:90%;">
            <!-- 스크롤바 보이기 : overflow:auto 숨기기 : overflow:hidden -->
            <div id="jinomap" tabindex="-1" style="outline:none; border: none; width:100%; height:100%; position:relative; overflow:hidden;"></div>
		</div>
		
		<!-- 탭 시작 -->
		<div>
        </div>
		
		<!--
		
		 우패널 시작 -->
		<div id="rightpanel-wrap">
			<span id="rightpanel-close" class="close_btn" onclick="javascript:rightPanelFolding();" style="right: 0px; background-position-y: 0px;"></span>
			<div id="rightpanel" class="splitter ui-widget ui-widget-content" style="height: 940px; right: -250px; display: none;">
				<div id="okm-adsense" class="splitter-pane" style="position: absolute; z-index: 1; top: 0px; height: 254px; width: 250px;">
				<div id="okm-chat" class="splitter-pane" style="position: absolute; z-index: 1; top: 266px; height: 723px; width: 250px;"><div id="titlepanel"><span id="people" width="49%">채팅</span>	<input type="hidden" id="username" value="Guest User"></div>	<div id="chatpanel"><div id="chatlog" style="height: 635px;"><div class="user_name" style="text-align:right"><span class="user_messages">dkssudgktyd</span></div><div class="user_name" style="text-align:right"><span class="user_messages">hello guys</span></div><div class="user_name_others" style="text-align:left"><strong>조 경현</strong><span class="user_messages">111</span></div><div class="user_name_others" style="text-align:left"><strong>김 구</strong><span class="user_messages">dkgkgkgk</span></div><div class="user_name_others" style="text-align:left"><strong>김 구</strong><span class="user_messages">아하하하</span></div><div class="user_name_others" style="text-align:left"><strong>김 구</strong><span class="user_messages">나는 김솔지다</span></div><div class="user_name_others" style="text-align:left"><strong>김 구</strong><span class="user_messages">저는 김솔지 입니다</span></div><div class="user_name_others" style="text-align:left"><strong>김 구</strong><span class="user_messages">ㅋㅋㅋㅋ</span></div><div class="user_name_others" style="text-align:left"><strong>김 구</strong><span class="user_messages">hello</span></div><div class="user_name_others" style="text-align:left"><strong>강 동혁</strong><span class="user_messages">fdh</span></div></div><div class="input_text_bar"><input id="text" onkeypress="dwr.util.onReturn(event, OKMChat.sendMessage)"><input type="button" class="send_btn" value="보내기" onclick="OKMChat.sendMessage()"></div></div></div>
			</div>
		</div>
		<!--  우패널 끝 
		
		 -->
			
		<!-- OKMindmap View 끝 -->

		<!--
			 하단 시작 -->
			<!-- StatCounter Code -->

			<div id="bottom" style="width:0px; height:0px;">
					
			</div>
			<!-- 하단 종료 
		-->

		<!-- Mobile 메뉴 -->
		
		<!-- -->

<!-- Start of StatCounter Code for Default Guide -->
<script type="text/javascript">
    var sc_project = 6062101;
    var sc_invisible = 1;
    var sc_security = "c2f34a18";</script>
<script type="text/javascript"
src="http://www.statcounter.com/counter/counter.js"></script>
<noscript><div class="statcounter"><a title="free hit
counters" href="http://statcounter.com/"
target="_blank"><img class="statcounter"
src="http://c.statcounter.com/6062101/0/c2f34a18/1/"
alt="free hit counters"></a></div></noscript>
<!-- End of StatCounter Code for Default Guide -->






<!-- 탭 -->
<script type="text/javascript">
    $(function() {
    var tabTitle = $("#tab_title"),
            tabContent = $("#tab_content"),
            tabCounter = 2;
    var tabs = $("#tabs").tabs();
    // AddTab button: just opens the dialog
    $("#add_tab")
            .button()
            .on("click", function() {
            dialog.dialog("open");
            });
    // Close icon: removing the tab on click
    tabs.on("click", "span.ui-icon-close", function() {
    var panelId = $(this).closest("li").remove().attr("aria-controls");
    $("#" + panelId).remove();
    tabs.tabs("refresh");
    });
    tabs.on("keyup", function(event) {
    if (event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE) {
    var panelId = tabs.find(".ui-tabs-active").remove().attr("aria-controls");
    $("#" + panelId).remove();
    tabs.tabs("refresh");
    }
    });
    });
//Actual addTab function: adds new tab using the input from the form above
    var tabCounter = 1;
    function addTab(url) {
    var label = "Tab " + tabCounter,
            id = "tabs-" + tabCounter,
            li = "<li><a href='" + id + "'>" + label + "</li>",
            tabContentHtml = "<iframe src=\"" + url + "\"></iframe>";
    $("#tabs").find(".ui-tabs-nav").append(li);
    $("#tabs").append("<div id='" + id + "'><p>" + tabContentHtml + "</p></div>");
    $("#tabs").tabs("refresh");
    tabCounter++;
    }
</script>


<script src="http://developers.kakao.com/sdk/js/kakao.min.js"></script>
<script type='text/javascript'>
	$("#kakao").click(function(){
		console.log("pathname --------");
		console.log("http://localhost:8080"+window.location.pathname);
	});
	function shareFacebook(){
		var url = "http://open.jinotech.com:8088"+window.location.pathname;
		window.open("https://www.facebook.com/sharer/sharer.php?u="+url);
	}


  //<![CDATA[
    // // 사용할 앱의 JavaScript 키를 설정해 주세요.
    Kakao.init('d3ea4ee7923f2fa5ae7c58c6048a28b4');
    // // 카카오링크 버튼을 생성합니다. 처음 한번만 호출하면 됩니다.
    Kakao.Link.createDefaultButton({
      container: '#kakao',
      objectType: 'feed',
      content: {
        title: '<spring:message code="message.share"/>',
        imageUrl: 'http://open.jinotech.com:8088/okmmkakao.JPG',
        link: {
          mobileWebUrl: "http://open.jinotech.com:8088"+window.location.pathname,
          webUrl: "http://open.jinotech.com:8088"+window.location.pathname 
        	/* mobileWebUrl: "http://localhost:8080"+window.location.pathname,
            webUrl: "http://localhost:8080"+window.location.pathname   */
        }
      },
      social: {
        likeCount: 286,
        commentCount: 45,
        sharedCount: 845
      },
      buttons: [
        {
          title: '<spring:message code="message.kakao.webview"/>',
          link: {
        	  mobileWebUrl: "http://open.jinotech.com:8088"+window.location.pathname,
              webUrl: "http://open.jinotech.com:8088"+window.location.pathname 
            	/* mobileWebUrl: "http://localhost:8080"+window.location.pathname,
                webUrl: "http://localhost:8080"+window.location.pathname   */ 
          }
        },
        {
          title: '<spring:message code="message.kakao.appview"/>',
          link: {
        	  mobileWebUrl: "http://open.jinotech.com:8088"+window.location.pathname,
              webUrl: "http://open.jinotech.com:8088"+window.location.pathname 
            	/* mobileWebUrl: "http://localhost:8080"+window.location.pathname,
                webUrl: "http://localhost:8080"+window.location.pathname   */ 
          }
        }
      ]
    });
  //]]>
</script>


</body>
</html>
