<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/opentab.css" type="text/css" media="screen">
<title><spring:message code='menu.help.usage'/></title>

<style type="text/css">
	/* active tab uses a id name ${data.mapType}. its highlight is also done by moving the background image. */
	ul.tabs a#${data.mapType}, ul.tabs a#${data.mapType}:hover, ul.tabs li#${data.mapType} a {
		background-position: -420px -62px;		
		cursor:default !important; 
		color:#000 !important;
	}
	
	ul.tabs a { 
		width: 114px;
	}
</style>


</head>
<body>

	<h1><spring:message code='menu.help.usage'/></h1>
	
	<!-- the tabs --> 
	<ul class="tabs">
		<li><a id="map" href="${pageContext.request.contextPath}/help/usage.do?usageType=map"><spring:message code='menu.mindmap'/></a></li>
		<li><a id="edit" href="${pageContext.request.contextPath}/help/usage.do?usageType=edit"><spring:message code='menu.edit'/></a></li>
		<li><a id="view" href="${pageContext.request.contextPath}/help/usage.do?usageType=view"><spring:message code='menu.view'/></a></li>
		<li><a id="plugin" href="${pageContext.request.contextPath}/help/usage.do?usageType=plugin"><spring:message code='menu.plugin'/></a></li>
		<li><a id="setting" href="${pageContext.request.contextPath}/help/usage.do?usageType=setting"><spring:message code='menu.setting'/></a></li>
	
	 
		<!-- <li><a href="#" class="current">user</a></li> --> 
		 
	</ul> 

	<!-- tab "panes" --> 
	<div class="panes"> 
		<div>
			
		<c:choose>
	
			<c:when test="${data.mapType eq 'map'}">
			</c:when>
			
			<c:when test="${data.mapType eq 'edit'}">
			</c:when>
			
			<c:when test="${data.mapType eq 'view'}">
			</c:when>
			
			<c:when test="${data.mapType eq 'plugin'}">
			</c:when>
			
			<c:when test="${data.mapType eq 'setting'}">
			</c:when>
					
		</c:choose>
	
		</div>  
	</div> 

</body>
</html>