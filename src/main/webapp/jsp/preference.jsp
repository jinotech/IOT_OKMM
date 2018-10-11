<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title>Preference</title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/opentab.css" type="text/css" media="screen">
	<style type="text/css">
		/* active tab uses a id name ${data.preference_type}. its highlight is also done by moving the background image. */
		ul.tabs a#${data.preference_type}, ul.tabs a#${data.preference_type}:hover, ul.tabs li#${data.preference_type} a {
		background-position: -420px -62px;
		cursor:default !important;
		color:#000 !important;
		}
	</style>
	
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>	
	<script type="text/javascript">
		function userComplete(){
			var userid = parent.jMap.cfg.userId;
			var menuChk = true;
				if(!$('input[name=default_menu_opacity]').is(':checked')) {
					menuChk = false;
				}
			 
			var configs = {
					'default_img_size': $('#default-img-size').val(),
					'default_video_size': $('#default-video-size').val(),
					'default_menu_opacity': menuChk
					};
			
			// 현재 상태에서 환경설정 저장
			for(config in configs) {
				parent.jMap.cfg[config] = configs[config];
			}
			
			// 서버에 환경설정 저장
			params =	'userid=' + userid + '&';
			for(var config in configs) {
				params += 'fields=' + config + '&';
				if(configs[config] == undefined) configs[config] = ''; 
				params += 'data=' + configs[config] + '&';
			}
			params += 'confirmed=' + 1;
			$.ajax({
				type: 'post',
				async: false,
				url: parent.jMap.cfg.contextPath+'/user/userconfig.do',
				data: params,
				error: function(data, status, err) {
					alert("userConfig : " + status);
				}
			});
			parent.$("#dialog").dialog("close");
		}
		
		function mapComplete(){
			parent.window.location.reload(true);
			parent.$("#dialog").dialog("close");
		}
		
		function changePreference(type) {
			if(type == "map")
				document.location.href = "${pageContext.request.contextPath}/mindmap/mappreference.do?mapid="+parent.jMap.cfg.mapId;
			else if(type == "user")
				document.location.href = "${pageContext.request.contextPath}/user/userconfig.do?userid="+parent.jMap.cfg.userId;
		}
	
		function init(){
			<c:choose>
			<c:when test="${data.preference_type eq 'map_preference'}">
			
				// lazyloading 체크박스
				$('input[name=lazyloading-check]').change(function() {
					var lazyLoadingChk = 0;
					if($('input[name=lazyloading-check]').is(':checked')) {
						lazyLoadingChk = 1;
					}
					
					
					$.ajax({
						type: 'post',
						async: false,
						url: parent.jMap.cfg.contextPath+'/mindmap/changeMap.do',
						data: {'mapId': parent.mapId,
									'lazyloading': lazyLoadingChk },
						error: function(data, status, err) {
							alert("setLazyloading : " + status);
						}
					});
					
				});
				
				$('input[name=queue-check]').click(function() {
					var queueCkecked = 0;
					if($('input[name=queue-check]').is(':checked')) {
						queueCkecked = 1;
					}
					
					$.ajax({
						type: 'post',
						async: false,
						url: parent.jMap.cfg.contextPath+'/mindmap/changeMap.do',
						data: {'mapId': parent.mapId,
									'queueing': queueCkecked },
						error: function(data, status, err) {
							alert("Stack Action Error: " + status);
						}
					});
					
				});
			</c:when>
			<c:when test="${data.preference_type eq 'user_preference'}">
			
			/////////////////////////////////////////////////////////////////////////////////
			//
			//
			//
			// 다음 개발시에 고려할것.
			// 지금은 필요한 환경 변수들을 직접 html로 필드 만들고 js로 부르고 있는데, 
			// 이렇게 하지 말고, 디비에 추가만 하면 알아서 필드 만들게끔 만들것.
			// js에서 값 불러오는것도 전부
			//
			//
			//
			//
			//
			
				// 환경변수 불러오기
				if('<c:out value="${data.default_img_size.data}"/>' == null || '<c:out value="${data.default_img_size.data}"/>' == '') {
					$('#default-img-size').val(parent.jMap.cfg.default_img_size);
				} else {
					$('#default-img-size').val(<c:out value="${data.default_img_size.data}"/>);
				}
				
				if('<c:out value="${data.default_video_size.data}"/>' == null || '<c:out value="${data.default_video_size.data}"/>' == '') {
					$('#default-video-size').val(parent.jMap.cfg.default_video_size);
				} else {
					$('#default-video-size').val(<c:out value="${data.default_video_size.data}"/>);
				}
				if('<c:out value="${data.default_menu_opacity.data}"/>' == null || '<c:out value="${data.default_menu_opacity.data}"/>' == '') {
					if(parent.jMap.cfg.default_menu_opacity){
						$('#default_menu_opacity').attr("checked", "checked");
					}else{
						$('#default_menu_opacity').removeAttr("checked")
					}
				} else {
					if('<c:out value="${data.default_menu_opacity.data}"/>' == "true"){
						$('#default_menu_opacity').attr("checked", "checked");
					}else{
						$('#default_menu_opacity').removeAttr("checked")
					}
				}
				

				$('input[name=default_menu_opacity]').click(function() {
					if($('input[name=default_menu_opacity]').is(':checked')){
						parent.$("#ribbon").css("opacity","0.8");						
					}else{
						parent.$("#ribbon").css("opacity","1");						
					}
				});
				
			</c:when>
		</c:choose>
		}
		
		$(document).ready( init );
		
		function cancel(){
			parent.$("#dialog").dialog("close");
		}
		
</script>
</head>
<body>
	<div style="padding-top:10px; text-align:center;">
	<ul class="tabs">
		<li><a id='map_preference' onclick='changePreference("map")'><spring:message code='setting.map' /></a></li>
		<li><a id='user_preference' onclick='changePreference("user")'><spring:message code='setting.user' /></a></li>
	</ul>
	
	<!-- tab "panes" -->
	<div class="panes">
		
		<div>
		<c:choose>
			<c:when test="${data.preference_type eq 'map_preference'}">
				<label class="label_check" for="lazyloading-check"><spring:message code='setting.lazy_loading' /></label>
				<input name="lazyloading-check" id="lazyloading-check" type="checkbox"<c:if test="${data.lazyloading eq '1'}"> checked="checked"</c:if>/>		
				<br>
				<label class="label_check" for="queue-check"><spring:message code='preference.stackqueue' /></label>
				<input name="queue-check" id="queue-check" type="checkbox"<c:if test="${data.queueing}"> checked="checked"</c:if>/>
				<br><br>
			</c:when>
			<c:when test="${data.preference_type eq 'user_preference'}">
				<div style="padding-left:12px;"><label class="config-input" for="default-img-size"><spring:message code='setting.image_size' /></label>
				<input name="default-img-size" id="default-img-size" size="10" type="text" value="" /></div>
				<div style="padding-left:12px;"><label class="config-input" for="default-video-size"><spring:message code='setting.video_size' /></label>
				<input name="default-video-size" id="default-video-size" size="10" type="text" value="" /></div>
				<div style="padding-left:12px;"><label class="config-input" for="default_menu_opacity"><spring:message code='setting.menu_opacity' /></label>
				<input name="default_menu_opacity" id="default_menu_opacity" type="checkbox" /></div>
				<br><br>
			</c:when>
		</c:choose>
		</div>
	</div>
	</div>
	<div style="margin-top:20px; text-align:center;">
		<c:choose>
			<c:when test="${data.preference_type eq 'map_preference'}">
			<input name="mapconfig-button" id="mapconfig-button" type="button" class="create_btn" value="<spring:message code='button.apply' />" onclick="mapComplete()">
			</c:when>
			<c:when test="${data.preference_type eq 'user_preference'}">
			<input name="userconfig-button" id="userconfig-button" type="button" class="create_btn" value="<spring:message code='button.apply' />" onclick="userComplete()">
			</c:when>
		</c:choose>
	</div>
</body>
</html>