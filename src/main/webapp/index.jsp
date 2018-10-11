<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="java.util.Locale" %>
<%@ page import="org.springframework.web.servlet.support.RequestContextUtils" %>
<%@ page import="com.okmindmap.configuration.Configuration"%>
<%@ page import="java.net.*" %>

<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="env" uri="http://www.servletsuite.com/servlets/enventry" %>

<%
String menu = request.getParameter("m");
String google = request.getParameter("g");
String useragent = (String)request.getAttribute("agent");

if(request.getAttribute("menu") != null)
	menu = request.getAttribute("menu").toString();

if(menu == null) menu = "on";
if(google == null) google = "off";

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

//서버 ip
InetAddress inet= InetAddress.getLocalHost();
%>

<!DOCTYPE HTML>
<html>
	<head>
		<meta charset="utf-8">
		<META HTTP-EQUIV="Content-Type" CONTENT="text/html;">
		<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
		<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
		<META HTTP-EQUIV="Expires" CONTENT="0">
	    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

		<!--<c:if test="${data.mobile != null}">
			 아이폰 META
			<meta name="apple-mobile-web-app-capable" content="yes">
			<link rel="apple-touch-icon" href="${pageContext.request.contextPath}/images/mobile/appicon.png">
			<link rel="apple-touch-startup-image" href="${pageContext.request.contextPath}/images/mobile/startup.jpg">
		</c:if> -->

	<!-- 	<meta property="og:type" content="website">
		<meta property="og:title" content="OKMindmap">
		<meta property="og:description" content="Design Your Mind!">
		<meta property="og:url" content="http://localhost:8080">
		<meta property="og:image" content="http://file.shareat.me/Upload/img/shareatme/images/main_top.jpg"> -->


		<title>OKMindmap :: Design Your Mind!</title>
		
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/jquery-ui/jquery-ui.custom.css?v=<%=updateTime%>" type="text/css" media="screen">
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css?v=<%=updateTime%>" type="text/css" media="screen">
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/main.css?v=<%=updateTime%>" type="text/css">
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/impromptu.css?v=<%=updateTime%>" type="text/css" media="screen">
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/simplemodal.css?v=<%=updateTime%>" type="text/css" media="screen">
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/dialog.css?v=<%=updateTime%>" type="text/css" media="screen">
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/opentab.css?v=<%=updateTime%>" type="text/css" media="screen">
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/showLoading.css?v=<%=updateTime%>" type="text/css" media="screen">
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okm-side.css?v=<%=updateTime%>" type="text/css" media="screen">
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/splitter.css?v=<%=updateTime%>" type="text/css" media="screen">
        
        <!-- 리본메뉴 CSS -->
        <link rel="stylesheet" href="${pageContext.request.contextPath}/ribbonmenu/ribbon/ribbon.css?v=<%=updateTime%>" type="text/css" media="screen">
	    <link rel="stylesheet" href="${pageContext.request.contextPath}/ribbonmenu/ribbon/soft_button.css?v=<%=updateTime%>" type="text/css" media="screen">
	    <link rel="stylesheet" href="${pageContext.request.contextPath}/ribbonmenu/ribbon/user.css?v=<%=updateTime%>" type="text/css" media="screen">
	    
		<script src="http://www.google.com/jsapi" type="text/javascript"></script>

		<script src="${pageContext.request.contextPath}/lib/jquery.min.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/jquery-bug.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/jquery.mobile.custom.min.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/jquery-ui.min.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/yui-3.2.0-min.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>		
		<script src="${pageContext.request.contextPath}/lib/raphael.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/i18n.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>		
		<script src="${pageContext.request.contextPath}/lib/browser.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/json2.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/jquery-impromptu.3.1.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/hahms-textgrow.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/luasog-0.3.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/jquery.simplemodal.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/Base64.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/conversionfunctions.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/http.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/jscolor/jscolor.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>		
		<script src="${pageContext.request.contextPath}/lib/popup_expiredays.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/jquery.showLoading.min.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/splitter.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/jquery.cookie.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>

		<%-- <script src="${pageContext.request.contextPath}/mayonnaise-min.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script> --%>
		<script src="${pageContext.request.contextPath}/mayonnaise.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>

		<script src="${pageContext.request.contextPath}/extends/ExArray.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/extends/ExRaphael.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/extends/javascript-chat.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>

		<script src="${pageContext.request.contextPath}/plugin/jino_dwr.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/plugin/jino_node_color_mix.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/plugin/NodeColorUtil.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/plugin/jino_facebook.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/plugin/okm-chat.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/plugin/okm-adsense.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>

		<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/engine.js?v=<%=updateTime%>'></script>
		<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/interface/JavascriptChat.js?v=<%=updateTime%>'></script>		
		<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/util.js?v=<%=updateTime%>'></script>
		<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/util.js?v=<%=updateTime%>'></script>
		
		<!-- 리본메뉴 script -->
		<script type="text/javascript" src='${pageContext.request.contextPath}/ribbonmenu/ribbon/ribbon.js?v=<%=updateTime%>'></script>
		<script type="text/javascript" src='${pageContext.request.contextPath}/ribbonmenu/ribbon/jquery.tooltip.min.js?v=<%=updateTime%>'></script>
		<script type="text/javascript" src='${pageContext.request.contextPath}/ribbonmenu/okmMenuRibbon.js?v=<%=updateTime%>'></script>
		<!-- 리본메뉴 script 끝 -->
		
		<%@ include file="../okmMenuCommon.js.jsp" %>
		<%@ include file="../okmMenu.js.jsp" %>
		
		<!--<c:if test="${data.mobile != null}">
			<link rel="stylesheet" href="${pageContext.request.contextPath}/css/mobile.css?v=<env:getEntry name="versioning"/>" type="text/css">
			<link rel="stylesheet" href="${pageContext.request.contextPath}/css/showLoading.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
			<script src="${pageContext.request.contextPath}/lib/jquery.showLoading.min.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
			<script src="${pageContext.request.contextPath}/lib/iscroll.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
		</c:if>-->


<!--------------------------------------------------- 오른쪽 콘텐츠 영역(05/25) ---------------------------------------------->
        <style>
            span .statcounter {
                margin-top: 13px;
            }
             /** 콘텐츠 스타일 **/
            .ok-cont-area{
                position: fixed;
                right: 0;
                top: 178px;
                background: #fff;
                width: 1024px;
                height: calc(100% - 178px);
                box-sizing: border-box;
                border-left: 1px solid #c0c0c0;
                border-top: 1px solid #c0c0c0;
                box-shadow: 1px 1px 1px 4px rgba(202, 196, 196, 0.15);
                transition: right 0.6s ease-in-out;
                z-index: 99999;
            }
            .ok-cont-area.hide{
                right: -1024px;
            }
            .ok-tab{
                height: 45px;
                width: 100%;
                list-style: none;
                box-sizing: border-box;
                padding-top: 2px;
                border-bottom: 1px solid #ddd;
                overflow: hidden;
                white-space: nowrap;
            }
            .ok-tab > li{
                list-style: none;
                width: 115px;
                height: 100%;
                line-height: 43px;
                float: left;
                background: #fff;
                border-bottom: 0;
                box-sizing: border-box;
                font-size: 14px;
                border-radius: 0 15px 0 0;
                position: relative;
                border: 1px solid #ddd;
                margin-right: 1px;
            }
            .ok-tab > li:first-child{
                border-left: 0;;
            }
            .ok-tab > li.on{
                background: #eaedf1;
                border-bottom: 1px solid #eaedf1;
            }
            .ok-tab > li a{
                display: inline-block;
                width: 100%;
                height: 100%;
                font-size: 14px;
                color: #a0a0a0;
                padding: 0 23px 0 10px;
                box-sizing: border-box;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .ok-tab > li.on a{
                color: #5e6e87;
                font-weight: bold;
            }
            .ok-tab > li .ok-close{
                position: absolute;
                right: 4px;
                top: 3px;
                color: #a0a0a0;
                display: inline-block;
                line-height: normal;
                font-size: 17px;
                cursor: pointer;
                padding: 5px;
                width: 10px;
                height: 10px;
                line-height: 10px;
                font-family: "고딕";
                font-weight: normal;
            }
            .ok-tab > li.on .ok-close{
                color: #5e6e87;
            }
            .ok-iframe{
                height: calc(100% - 45px);
                background: #eaedf1;
                padding: 5px;
                margin-top: -1px;
            }
            .ok-iframe iframe{
                background: #fff;
                width: 100%;
                height: 100%;
                border: 0;
            }
            .show-btn{
                cursor: pointer;
                height: 50px;
                width: 20px;
                border: 1px solid #d0d0d0;
                border-right: 0;
                line-height: 50px;
                text-align: center;
                font-size: 14px;
                font-weight: bold;
                border-radius: 2px 0 0 2px;
                position: absolute;
                margin-left: -21px;
                top: 50%;
                z-index: 14;
                background: #eaedf1;
                color: #5e6e87;
                cursor: pointer;
                box-shadow: 1px 1px 1px 2px rgba(202, 196, 196, 0.15)
            }
            .show-btn:after{
                content: ">";
                display: inline;
            }
            .ok-cont-area.hide .show-btn:after{
                content: "<";
                display: inline;
            }
            
            /** floating menu **/
            .ok-floating-menu{
                cursor: move;/*추가*/
                position: fixed;
                left: 20px;
                bottom: 20px;
                background: #eaedf1;
                min-width: 360px;
                height: 45px !important;/* 변경 */
                z-index: 99999;/* 변경 */
                border: 1px solid #d0d0d0;
                box-shadow: 0 3px 10px rgba(0,0,0,.1);
                padding: 5px 75px 5px 5px;
                box-sizing: border-box;
                border-radius: 2px;
            }
            .ok-floating-menu .ok-menu{
                cursor: pointer;
                background: #fff;
                display: inline-block;
                height: 33px;
                line-height: 28px;
                width: 40px;
                text-align: center;
                border: 1px solid #d0d0d0;
                box-sizing: border-box;
                color: #777;
                float: left;
                margin-right: 4px;
            }
            .ok-floating-menu .right-btn{
                display: inline-block;
                position: absolute;
                right: 10px;
                top: 5px;
            }
            .plus-btn{
                cursor: pointer;
                display: inline-block;
                vertical-align: middle;
                line-height: 28px;
            }
            .plus-btn i{
                font-size: 22px;
                width: 100%;
                line-height: 28px;
                color: #5e6e87
            }
            .moodle-btn{
                cursor: pointer;/*추가*/
                font-size: 11px;
                border: 1px solid #d0d0d0;
                background: #f7f7f7;
                display: inline-block;
                height: 21px;
                line-height: 20px;
                padding: 0 5px;
                border-radius: 2px;
                vertical-align: middle;
                box-sizing: border-box;
                color: #777777;
                font-weight: 800;
                margin-top: -1px;
            }
            
            /** floating menu **/
        </style>
        <script type="text/javascript">
            //콘텐츠 영역 이벤트
            $(document).ready(function(){
            	
            	//마인드맵 링크 클릭
            	$(document).on("click","a",function(){
            		//탭 타이틀
            		addTab($(this).attr("href"), $(this).prev().prev().find("tspan").text());
            		//탭 열기
            		$(".ok-cont-area").removeClass("hide");
            		return false;
            	});
            	
            	
                //영역 show hide
                $(".show-btn").click(function(){
                   $(".ok-cont-area").toggleClass("hide"); 
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
            });
            
            function addTab(url, title){
            	var li = "<li>";
                    li += "<a href=\"#\" link=\""+url+"\">"+title+"</a>";
                    li += "<span class=\"ok-close\">x</span>";
                    li += "</li>";
            	
            	$(".ok-cont-area ul").append(li);
            	$(".ok-cont-area ul li:last a").click();
            }
            
        </script>
<!--------------------------------------------------- 오른쪽 콘텐츠 영역(05/25) ---------------------------------------------->




        
		<script type="text/javascript">
			var FACEBOOK_APP_ID = '<%=facebook_appid%>';
			
			var opts = {
				language : "${locale.language}",
				dataUrl: "${pageContext.request.contextPath}/AcceptLanguage",
				supportLocale: false,
				contextPath: "${pageContext.request.contextPath}"
			};
			i18n.init(opts);
		</script>

		<script type="text/javascript">
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
				mapDiv.style.height = h + "px";
				<%} else {%>
					mapDiv.style.height = h + "px";
				<%}%>
		//			mapDiv.style.overflow = 'auto';
		
// 				topDiv.style.width = w + "px";

				// 사이드 메뉴
				var rightpanel = document.getElementById("rightpanel");
				if(rightpanel) rightpanel.style.height = mapDiv.style.height;
				
				<% if(useragent != null){%>
					$('.simplemodal-container').width('100%');
					$('.simplemodal-container').height('100%');
					$('iframe').width('100%');
					$('iframe').height('100%');
				<%}%>
			}

			if(ISMOBILE || supportsTouch) {
				window.addEventListener("resize", resize, false);
				window.addEventListener("orientationchange", resize, false);
				// (optional) Android doesn't always fire orientationChange on 180 degree turns
// 				setInterval(resize, 2000);
			}else{
				window.onresize = resize;				
			}
			$(document).ready( resize );

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
			
			var rightPanelFolding = function(val) {
				var rp = $('#rightpanel-wrap');
				var panel = $('#rightpanel');
				var rpc = $('#rightpanel-close');
				var chatbutton = $('#chat-button');
				
				if($('#folding-RB').attr('folding-stat')){ // 오른쪽 패널을 눌렀을때 리본메뉴가 펼쳐져있으면
					rp.css("top","176px");
				} else {									// 리본메뉴가 올라가 있을때
					
				}
				
				if(panel.css('display') == 'block' || val) {
					chatbutton.html("<spring:message code='chatting.turnon'/>");
					
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
			var mapId = <spring:message code='index.loadmap.id'/>;
			
			function jinoMap_init(){

				PopupExpiredays.showPopupNotice("2012/04/30 23:00:00");

				if(Raphael.vml){
					var downloadCenter = function(v, m, f) {
						if(v == 'chrome') {
							window.open('http://www.google.com/chrome/');
						} else if(v == 'ff') {
							window.open('http://www.mozilla.com/');
						}
					}

					var txt = '<center><font color="#ff0000">CAUTION</font></center><br />' +
					'Internet Explorer를 사용하고 계십니다.<br />' +
					'Chrome 또는 FireFox를 사용하시면 10배이상 빠르게<br />' +
					'서비스를 이용할 수 있습니다. <br />' +
					'<br />' +
					'You are using Internet Explorer.<br />' +
					'Chrome or FireFox can provide 10 times faster<br />' +
					'service. Install...<br />' +
					'<br />';

					var re = $.prompt(txt, {
						callback: downloadCenter,
						persistent: false,
						top: '10%',
						buttons: {
							'Chrome': 'chrome',
							'FireFox': 'ff',
							'Later': true
						}
					});

				}

				jMap = new JinoMap("jinomap", 5000, 3000, 0);
				jMap.cfg.contextPath = "${pageContext.request.contextPath}";
				jMap.cfg.mapId = <spring:message code='index.loadmap.id'/>;
				
				<% if("off".equals(menu) ) { %>
				<% if(useragent == null){%>
					jMap.setWaterMark();
				<% }} %>
				
				JinoUtil.waitingDialog("Loading Map");
				jMap.loadMap("${pageContext.request.contextPath}", "<spring:message code='index.loadmap.id'/>", "index.mm");
				jMap.loaded = function() {
					<% if("on".equals(menu) ) { %>
						<% if(useragent != null){%>
						// 알림창
						okmNoticeAction();
						<%}%>
					<% } %>
				}
				
				init();
				SET_DWR(true);
				
				
					//OKMAdsense('okm-adsense');
					OKMChat('okm-chat', '<c:out value="${user.lastname}"/> <c:out value="${user.firstname}"/>');						
					
					$("#rightpanel").splitter({
						type: "h",
						//outline: true,
						maxTop: 254,
						minTop: 100,
						minBottom: 200,
						//sizeTop: 0,
						//resizeToWidth: true,
						//cookie: "docksplitter",
						dock: "top",
						dockSpeed: 200,
						barNormalClass: "splitter-default",
						barHoverClass:  "splitter-hover",
						barActiveClass: "splitter-highlight",
						barLimitClass:  "splitter-limit"
					});
					
					// 오른쪽 패널 상태 초기화 (숨김)
					$('#chat-button').html("<spring:message code='chatting.turnon'/>");
					$('#rightpanel').css('right', -250).hide();
					$('#rightpanel-close').css('right', 0).css("background-position-y", 0);
					
				
				
				<% if("on".equals(google)) { %>
					SET_GOOGLE_SEARCHER(true);
				<%}%>
				
				
				<% if(useragent != null){%>
					new iScroll('quick_buttons', {
						snap: true,
						momentum: false,
						hScrollbar: false,
						onScrollEnd: function () {
							document.querySelector('#indicator > li.active').className = '';
							document.querySelector('#indicator > li:nth-child(' + (this.currPageX+1) + ')').className = 'active';
						}
					 });
				<%}%>
				
				
			}
			$(document).ready( jinoMap_init );
		</script>

<!-- 리본 메뉴 활성화/비활성화 -->
		<script type="text/javascript">
			$(document).ready(function() {
				if(jMap.cfg.default_menu_opacity == true || jMap.cfg.default_menu_opacity == "true" ){					
					$("#top #ribbon").css("opacity", "0.8");
				}else{
					$("#top #ribbon").css("opacity", "1");
				}

			});
		</script>
		
		<script type="text/javascript">
		$(window).load(function() {
			jMap.resolveRendering();
		  jMap.addActionListener(ACTIONS.ACTION_NODE_IMAGELOADED, function(){
			  jMap.resolveRendering();
		  });
		});
		</script>
		
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-30732410-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>



<style>
	span .statcounter {
		margin-top: 13px;
	}
</style>


	</head>
	<body>


  <!------------------------------- 오른쪽 컨텐츠 영역 html start ------------------------------------>
        <div class="ok-cont-area hide"><!-- hide 클래스 추가시 숨겨짐-->
            <div class="show-btn"></div>
            <ul class="ok-tab">
                <!-- <li class="on">
                    <a href="#" link="https://www.melon.com">멜론멜론멜론멜론멜론멜론멜론</a>
                    <span class="ok-close">x</span>
                </li>
                <li>
                    <a href="#" link="http://www.genie.co.kr/buy/recommend?keywd=8EWgr627&source=adwords&gclid=EAIaIQobChMIxfKMit-f2wIVFx4rCh27Uw-iEAAYASAAEgIHnPD_BwE">지니</a>
                    <span class="ok-close">x</span>
                </li>
                <li>
                    <a href="#" link="http://www.mnet.com/chart/TOP100/">엠넷</a>
                    <span class="ok-close">x</span>
                </li> -->
            </ul>
            <div class="ok-iframe">
                <iframe src=""></iframe>
            </div>
        </div>

        <!------------------------------- 오른쪽 컨텐츠 영역 end ------------------------------------>
        
        <!------------------------------- floating menu ------------------------------------>
        <!-- 메뉴 아이콘 플러그인(fontawesome) -->
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
        <div class="ok-floating-menu">
            <span class="ok-menu" title="자식마디 추가">
                <img class="ribbon-icon ribbon-normal" src="/ribbonmenu/ribbonicons/edit_childnode.png">
            </span>
            <span class="ok-menu" title="형제마디 추가">
                <img class="ribbon-icon ribbon-normal" src="/ribbonmenu/ribbonicons/edit_bronode.png">
            </span>
            <span class="ok-menu" title="이미지">
                <img class="ribbon-icon ribbon-normal" src="/ribbonmenu/ribbonicons/edit_image.png">
            </span>
            <span class="ok-menu" title="비디오">
                <img class="ribbon-icon ribbon-normal" src="/ribbonmenu/ribbonicons/edit_video.png">
            </span>
            <span class="ok-menu" title="하이퍼링크">
                <img class="ribbon-icon ribbon-normal" src="/ribbonmenu/ribbonicons/edit_link.png">
            </span>
            
            <div class="right-btn">
                <span class="btn moodle-btn">무들</span>
                <!-- <span class="btn plus-btn">
                    <i class="fas fa-plus-square"></i>
                </span> -->
            </div>
        </div>
        <!------------------------------- floating menu ------------------------------------>
<!--------------------------------------------------- 오른쪽 콘텐츠 영역(05/25) ---------------------------------------------->


			<!-- 상단 메뉴 시작 -->
			<div id="waitingDialog"></div>
			<div id="dialog" ></div>
			<div id="dialog_c"></div>
			<div id="top">
				<div id="okmenubar"><%@ include file="./ribbonmenu/okmMenuRibbonStuctureGuest.html" %></div> <!-- 리본메뉴 include -->
				<!--
				<div id="userinfo"> 
				<c:choose>
					<c:when test="${ user == null || user.username == 'guest'}">
						<input type="button" class="btn1" onclick="okmLogin()" value="<spring:message code='message.login'/>">
						<input type="button" class="btn2" onclick="joinmember()" value="<spring:message code='message.join'/>">
					</c:when>
					<c:otherwise>
						<span class="userfont"><c:out value="${user.lastname}"/> <c:out value="${user.firstname}"/>(<c:out value="${user.username}"/>)</span>
						<input type="button" class="btn2" onclick="editProfile()" value="<spring:message code='message.editprofile'/>" />
						<a href="#" onclick="okmLogout()"><input type="button" class="btn2" value="<spring:message code='message.logout'/>" /></a>

						<c:if test="${user.roleId == 1}">
							<a href="${pageContext.request.contextPath}/mindmap/admin/index.do">
								<input type="button" class="btn2" value="<spring:message code='message.admin'/>" />
							</a>
						</c:if>
					</c:otherwise>
				</c:choose>
				<script type="text/javascript">
					function changeLanguage(lang) {
						document.location.href = "${pageContext.request.contextPath}/language.do?locale=" + lang + "&page=" + document.location.href;
					}
				</script>
				&nbsp;<span class="bar">|</span>&nbsp;
				<select id="selectLang" onchange="changeLanguage(this.value);" style="height:21px;">
					<option value="en" <c:if test="${locale.language eq 'en'}">selected</c:if>>English</option>
					<option value="ko" <c:if test="${locale.language eq 'ko'}">selected</c:if>>한국어</option>
				</select>
				</div> -->
				
			</div>			
			
			<!-- 상단 메뉴 끝 -->

		<!-- OKMindmap View 시작 -->
		<div id = "main" style="width:100%; height:100%; float: left;">
			<!-- 스크롤바 보이기 : overflow:auto 숨기기 : overflow:hidden -->
			<div id="jinomap" tabindex="-1" style="outline:none; border: none; width:100%; height:100%; position:relative; overflow:hidden;"></div>
		</div>
		
		<!--
		<c:if test="${data.mobile == null}">
		 우패널 시작 -->
		<div id="rightpanel-wrap">
			<span id="rightpanel-close" class="close_btn" onclick="javascript:rightPanelFolding();"></span>
			<div id="rightpanel">
				<div id = "okm-adsense">
					<script type="text/javascript"><!--
						google_ad_client = "ca-pub-9335493349192720";
						/* OKMindmap */
						google_ad_slot = "3687235057";
						google_ad_width = 250;
						google_ad_height = 250;
						//-->
						</script>
						<script type="text/javascript"
						src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
					</script>
				</div>
				<div id = "okm-chat"></div>
			</div>
		</div>
		<!--  우패널 끝 
		</c:if>
		 -->
			
		<!-- OKMindmap View 끝 -->

		<!--
			 하단 시작 -->
			<!-- StatCounter Code -->

			<div id = "bottom" style="width:0px; height:0px;">
					
			</div>
			<!-- 하단 종료 
		-->

		<!-- Mobile 메뉴 -->
		
		<!--<c:if test="${data.mobile != null}">-->
			<!-- 
			<div id="nav"> 
				<ul id="indicator"> 
					<li class="active">1</li> 
					<li>2</li>
				</ul> 
			</div>
			 
			<div id="waitingDialog"></div>
			<div id="dialog" ></div>
			<div id="dialog_c"></div>
			<div id="quick_buttons">-->
				<!-- <div style="width:300px"> 
				
				<div style="display: inline-block; width: 32px; height: 32px; margin: 5px 7px 5px 7px; background-image: url('${pageContext.request.contextPath}/images/mobile/new.png')" onclick="newMap();"></div>
				<div style="display: inline-block; width: 32px; height: 32px; margin: 5px 5px 5px 5px; background-image: url('${pageContext.request.contextPath}/images/mobile/open.png')" onclick="openMap();"></div>
				<c:choose>
					<c:when test="${ user == null || user.username == 'guest'}">
						<div style="display: inline-block; width: 32px; height: 32px; margin: 5px 7px 5px 7px; background-image: url('${pageContext.request.contextPath}/images/mobile/login.png')" onclick="okmLogin()"></div>
					</c:when>
					<c:otherwise>
						<div style="display: inline-block; width: 32px; height: 32px; margin: 5px 7px 5px 7px; background-image: url('${pageContext.request.contextPath}/images/mobile/logout.png')" onclick="okmLogout()"></div>
					</c:otherwise>
				</c:choose>-->
				
				<!-- </div>
			</div>

		</c:if> -->

<!-- Start of StatCounter Code for Default Guide -->
<script type="text/javascript">
var sc_project=6062101; 
var sc_invisible=1; 
var sc_security="c2f34a18"; 
</script>
<script type="text/javascript"
src="http://www.statcounter.com/counter/counter.js"></script>
<noscript><div class="statcounter"><a title="free hit
counters" href="http://statcounter.com/"
target="_blank"><img class="statcounter"
src="http://c.statcounter.com/6062101/0/c2f34a18/1/"
alt="free hit counters"></a></div></noscript>
<!-- End of StatCounter Code for Default Guide -->

</body>
</html>
