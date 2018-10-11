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
<!-- saved from url=(0034)http://192.168.2.247:8080/index.do -->
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

	<%@ include file="../okmMenuCommon.js.jsp" %>
	<%@ include file="../okmMenu.js.jsp" %>
	
	
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
			
			var mapCount = 0;

			//목록
			function getMenuList(){
 				
            	$.ajax({
    				type: 'post',
    				dataType: 'html',
    				async: false,
    				url: '${pageContext.request.contextPath}/menuMngList.do',
    				data: {},
    				success: function(data) {
    					
    					$("#__menuMngList__").html(data);
    					
    				},
    				error: function(data, status, err) {
    					alert("error : " + status);
    				}
    			});
			}
			
			
			$(document).ready(function(){
				getMenuList();
			});
			
			function jsEnter(e) {
				e = e || window.event;
				if (e.keyCode == 13) {
					window.location.href="${pageContext.request.contextPath}/front.do?searchMapName="+$("#searchMapName").val();
				}
			}
			
			function saveUseyn(seq, yn){
				$.ajax({
	   				type: 'post',
	   				dataType: 'json',
	   				async: false,
	   				url: '${pageContext.request.contextPath}/menuMngUseynUpdate.do',
	   				data: {	'seq' : seq , 'useyn': yn },
	   				success: function(data) {
	   				},
	   				error: function(data, status, err) {
	   					alert("error : " + status);
	   				}
	   			});
			}
			
			function saveMenu(){
				
				var name = $("#menuName").val();
				var imgurl = $("#menuImgUrl").val();
				var message = $("#menuMessage").val();
				var script = $("#menuScript").val();
				var useyn = $("input[name=menuUseyn]:checked").val();
				
				$.ajax({
	   				type: 'post',
	   				dataType: 'json',
	   				async: false,
	   				url: '${pageContext.request.contextPath}/menuMngInsert.do',
	   				data: {	'name' : name , 'imgurl' : imgurl, 'message' : message ,'script' : script, 'useyn': useyn },
	   				success: function(data) {
	   					if(data.result == "1"){
	   						alert("등록 했습니다.");
	   						getMenuList();
	   					}else{
	   						alert("등록을 실패 했습니다.");
	   					}
	   				},
	   				error: function(data, status, err) {
	   					alert("error : " + status);
	   				}
	   			});
			}
		</script>
</head>
<!--------------------------------------------------- 오른쪽 콘텐츠 영역(05/25) ---------------------------------------------->
       <link rel="stylesheet" href="${pageContext.request.contextPath}/css/add.css" type="text/css" />
       <script src="${pageContext.request.contextPath}/pubjs/common.js" type="text/javascript" charset="utf-8"></script>
       <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
<body style="cursor: auto;">
<!------------------------------------ 왼쪽 컨텐츠 영역 html start ------------------------------------------>

<%@ include file="../frontLeft.jsp" %>

<!------------------------------------ 왼쪽 컨텐츠 영역 html start ------------------------------------------>


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
                   	<!--  마인드맵 사용하기
                    <span>(http://bit.ly/2thEOdB)</span> -->
                </span>
                <%@ include file="../frontTop.jsp" %>
            </div>
        </div>			
<!---------------------------------- 상단 헤더 -------------------------------------->
        <!-- 상단 메뉴 끝 -->
        
<!---------------------------------- 컨텐츠 영역 -------------------------------------->
<input type="hidden" name="page" id="page" value="${param.page }">
<div class="contents">
     <h1 class="ok-title">
     	사용자 메뉴 관리
    </h1>
    <div id="__menuMngList__"></div>
    
    <div class="btn-area mg-bt30">
        <input type="button" class="btn point addmenu" value="추가" />
    </div>
    
    <div class="addmenu-area">
        <table class="table">
            <thead>
                <tr>
                    <th>메뉴명</th>
                    <th>이미지 URL</th>
                    <th>메세지 코드</th>
                    <th>스크립트 함수</th>
                    <th>사용여부</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <input type="text" name="menuName" class="w100" id="menuName" />
                    </td>
                    <td>
                        <input type="text" name="menuImgUrl" class="w100" id="menuImgUrl" />
                    </td>
                    <td>
                        <input type="text" name="menuMessage" class="w100" id="menuMessage" />
                    </td>
                    <td>
                        <input type="text" name="menuScript" class="w100" id="menuScript" />
                    </td>
                    <td>
                        <label>
                            <input type="radio" name="menuUseyn" id="menuUseyn" value="Y" checked /> 사용
                        </label>
                        <label>
                            <input type="radio" name="menuUseyn" id="menuUseyn" value="N" /> 미사용
                        </label>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="btn-area">
            <input type="button" class="btn point" value="저장" onclick="saveMenu()" />
            <input type="button" class="btn gray" value="취소" />
        </div>
        
    </div>
</div>
<!---------------------------------- 컨텐츠 영역 -------------------------------------->

       
</body>
</html>