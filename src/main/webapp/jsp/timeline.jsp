<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="java.util.Locale" %>
<%@ page import="org.springframework.web.servlet.support.RequestContextUtils" %>
<%@ page import="com.okmindmap.configuration.Configuration"%>
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
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
        "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8">
		<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
		<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
		<META HTTP-EQUIV="Expires" CONTENT="0">
		<META NAME="Description" CONTENT="<c:out value="${data.mapContentsText}"/>">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
		
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
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/timeline.css?v=<%=updateTime%>" type="text/css">
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/simplemodal.css?v=<%=updateTime%>" type="text/css" media="screen">
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/dialog.css?v=<%=updateTime%>" type="text/css" media="screen">
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/opentab.css?v=<%=updateTime%>" type="text/css" media="screen">
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okm-side.css?v=<%=updateTime%>" type="text/css" media="screen">		
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/splitter.css?v=<%=updateTime%>" type="text/css" media="screen">
		
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
		<script src="${pageContext.request.contextPath}/lib/vtip.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		
		<script src="${pageContext.request.contextPath}/mayonnaise-min.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>

		<script src="${pageContext.request.contextPath}/extends/ExArray.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/extends/ExRaphael.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>

		<script src="${pageContext.request.contextPath}/plugin/jino_delicious.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/plugin/jino_dwr.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/plugin/jino_facebook.js?v=<%=updateTime%>" type="text/javascript" charset="utf-8"></script>
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

				mapDiv.style.width = w + "px";
				mapDiv.style.height = h + "px";
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
				
				$('#timelineList').slimScroll({
					alwaysVisible: true,
					height: (h-90) + "px"
				});
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
			

		</script>
		
		<script type="text/javascript">
			// 선택된 타임라인을 불러온다.
			function loadTimeline(e) {
				currentTimeline.item && currentTimeline.item.removeClass('active');
				
				var timelineID = e.data.timeLineID;
				currentTimeline.id = timelineID;
				currentTimeline.item = $(this);
				currentTimeline.item.addClass('active');
				
				$.ajax({
					type: 'post',
					async: false,
					url: '${pageContext.request.contextPath}/timeline/xml.do',
					data: {'id': timelineID },
					success: function(data, textStatus, jqXHR) {
						JinoUtil.waitingDialog("Loading Map");
						jMap.loadMapFromXml(jqXHR.responseText);
					},
					error: function(data, status, err) {
						alert("loadTimeline : " + status);
					}
			    });
				
			}
		
			// 타임라인 리스트를 만든다.
			function updateTimelineList() {
				var listWnd = $('.controlNav');
				
				// Timeline 리스트
				<c:forEach var="timeline" items="${data.timelines}">
					var d = new Date(<c:out value="${timeline.saved}"/>);				
					var format = d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
					var list = $('<a href="#" class="bullet vtip" title="' + format + '">' + '<span class="timebubble">'+format+'</span>' + '</a>');
					list.bind("click", { timeLineID: <c:out value="${timeline.id}"/> }, loadTimeline);
					listWnd.append(list);
					listWnd.append('<br>');					
				</c:forEach>
				// 현재 맵
				//var d = new Date();				
				//var format = d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
				//var list = $('<a href="#">' + format + '</a>');
				var list = $('<a href="#" class="bullet vtip" title="Current">' + '<span class="timebubble">' + 'Current' + '</span>' + '</a>');
				list.click(function(){
					JinoUtil.waitingDialog("Loading Map");
					jMap.loadMap("${pageContext.request.contextPath}", <c:out value="${data.map.id}"/>, "<c:out value="${data.map.name}"/>");
					
					currentTimeline.item && currentTimeline.item.removeClass('active');					
					currentTimeline.id = -1;
					currentTimeline.item = $(this);
					currentTimeline.item.addClass('active');
					
				});
				listWnd.append(list);
				
				currentTimeline.item = list;
				currentTimeline.item.addClass('active');
	
			}
		</script>
		
		<!-- ----아코디언메뉴------- -->
		<script type="text/javascript">
		<!--//---------------------------------+
			//  Developed by Roshan Bhattarai 
			//  Visit http://roshanbh.com.np for this script and more.
			//  This notice MUST stay intact for legal use
			// --------------------------------->
			$(document).ready(
					function() {
						//slides the element with class "menu_body" when paragraph with class "menu_head" is clicked 
						$("#firstpane p.menu_head").click(
								function() {
									$(this).next("div.menu_body").slideToggle(300)
											.siblings("div.menu_body").slideUp("slow");
									$(this).siblings();
								});
						//slides the element with class "menu_body" when mouse is over the paragraph
						$("#secondpane p.menu_head").mouseover(
								function() {
									$(this).next("div.menu_body").slideDown(500)
											.siblings("div.menu_body").slideUp("slow");
									$(this).siblings();
								});
					});
		</script>
		
		<!-- Menu Function -->
		<script type="text/javascript">
		function isDuplicateMapName(mapTitle) {
			var params = {
				"mapTitle": mapTitle
			};
			var returnV = false;
			$.ajax({
					type: 'post',
					url: "${pageContext.request.contextPath}/mindmap/isDuplicateMapName.do",
					dataType: 'json',
					data: params,
					async: false,
					success: function (data) {
						if(data.status == "ok") {
							returnV = true;
							
						} else {
							returnV = false;
							
						}
					}
				}
			);
			return returnV;
		}
		
		var parseCallbackParam = function(f){
			var obj =[];
			for(i=0;i<f.length;i++){
				obj[f[i]["name"]] = f[i]["value"];
			}
			return obj;	
		}
		
			var TimelineSaveAs = function () {
				if(currentTimeline.id == -1) {
					alert("<spring:message code='timeline.menu.currentnotsave'/>");
					return;
				}
				var txt = '<form><div class="dialog_content">' +
				'<br />Name:    ' +
				'<input type="text" id="input_timeline_saveas"' +
				'name="input_timeline_saveas" value="" />' +
				'</div></form>';
				function callbackform_saveasname(v, f){
					if (v) {
						var name = encodeURIComponent(f.input_timeline_saveas);
						if(!isDuplicateMapName(f.input_timeline_saveas))
							alert("<spring:message code='message.mindmap.new.duplicate.mapName'/>");
						else
							location.href = '${pageContext.request.contextPath}/timeline/saveas.do?id=' + currentTimeline.id + '&name=' + name;
					}
				}
/*				var re = $.prompt(txt, {
					callback: callbackform_saveasname,
					persistent: false,
					focusTarget: 'input_timeline_saveas',
					top: '30%',
					prefix:'okm',
					buttons: {
						Ok: true,
						Cancel: false
					}
				});*/
				$("#dialog").append(txt);
				 
				$("#dialog").dialog({
					autoOpen:false,
					closeOnEscape: true,	//esc키로 창을 닫는다.
					modal:true,		//modal 창으로 설정
					resizable:false,	//사이즈 변경
					close: function( event, ui ) {
					  	$("#dialog .dialog_content").remove();
						$("#dialog").dialog("destroy");
						jMap.work.focus();
					},
			    });
				$("#dialog").dialog("option", "width", "none" );
				$("#dialog").dialog( "option", "buttons", [{
					text: "<spring:message code="button.confirm"/>", 
					click: function() {
						var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
						callbackform_saveasname(true, formValue); 
					} 
				}]);
				$("#dialog").dialog( "option", "dialogClass", "TimelineSaveAs" );		  
				$("#dialog").dialog( "option", "title", "<spring:message code="timeline.menu.saveasnewmap"/>" );
				$("#dialog").dialog("open"); 
			};
			var TimelineRevert = function () {
				if(currentTimeline.id == -1) {
					alert("<spring:message code='timeline.menu.currentnotsave'/>");
					return;
				}
				location.href = '${pageContext.request.contextPath}/timeline/revert.do?id=' + currentTimeline.id;
			};
			
		</script>
				
		<script type="text/javascript">
			var jMap;
			var pageId;
			var mapId = "<c:out value="${data.mapId}"/>";
			var mapName = "<c:out value="${data.map.name}"/>";
			var menu_canEdit =  "<c:out value="${data.canEdit}"/>";
			var menu_canCopyNode =  "<c:out value="${data.canCopyNode}"/>";
			var currentTimeline = {id: -1, item:null};
			
			var shouldSave = true;
			function jinoMap_init(){
				
				jMap = new JinoMap("jinomap", 5000, 3000, 0);				
				jMap.cfg.contextPath = "${pageContext.request.contextPath}";
				jMap.cfg.mapId = mapId;
				jMap.cfg.mapName = mapName;
				jMap.cfg.mapKey = "<c:out value="${data.map.key}"/>";
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
				
				jMap.loadMap("${pageContext.request.contextPath}", <c:out value="${data.map.id}"/>, mapName);
				
				updateTimelineList();
				
				vtip();
				
			}
			$(document).ready( jinoMap_init );
			
			//window.fbAsyncInit = FacebookService.initFacebook;
		</script>


		<script type="text/javascript">
		$(window).load(function() {
			jMap.resolveRendering();
		    jMap.addActionListener(ACTIONS.ACTION_NODE_IMAGELOADED, function(){
			    jMap.resolveRendering();
		    });
		});
		</script>
    </head>

    <body>
	<div id="dialog"></div>
	<div style="width:200px; float:left">
		<!-- --아코디언메뉴-- -->
		<div id="firstpane" class="menu_list">
			<!--Code for menu starts here-->
			<p class="menu_head">
				<img src="../../images/icons/savetimeline.png" ><spring:message code='timeline.menu.save'/>
			</p>
			<div class="menu_body">
				<a href="javascript:;" onclick="TimelineSaveAs()"><spring:message code='timeline.menu.saveasnewmap'/></a> 
				<a href="javascript:;" onclick="TimelineRevert()"><spring:message code='timeline.menu.savecurrentmap'/></a>
			</div>
			<p class="menu_head">
				<a href="${pageContext.request.contextPath}/map/<c:out value="${data.map.key}"></c:out>">
					<img src="../../images/icons/backtimeline.png" ><spring:message code='timeline.menu.returntomap'/>
				</a>
			</p>
		</div>
		<div id = "timelineList" class="timelineList" style="width:100%; height:100%;">
			<div class="controlNav"></div>					
		</div>
	</div>
			
	<!-- OKMindmap View 시작 -->
	<div id = "main" style="width:100%; height:90%;">
		<!-- 스크롤바 보이기 : overflow:auto 숨기기 : overflow:hidden -->
		<div id="jinomap" tabindex="-1" style="outline:none; border: none; width:100%; height:100%; position:absolute; overflow:hidden;"></div>
			
	</div>	

</body>
</html>