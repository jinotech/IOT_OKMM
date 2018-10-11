<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><spring:message code='message.openmap'/></title>

<link rel="stylesheet" href="${pageContext.request.contextPath}/css/mobile-list.css" type="text/css" media="screen">
<script src="${pageContext.request.contextPath}/lib/iscroll.js" type="text/javascript" charset="utf-8"></script>

<script type="text/javascript">
var myScroll;
var a = 0;
function loaded() {
	setHeight();	// Set the wrapper height. Not strictly needed, see setHeight() function below.

	// Please note that the following is the only line needed by iScroll to work. Everything else here is to make this demo fancier.
	myScroll = new iScroll('wrapper');
}

// Change wrapper height based on device orientation. Not strictly needed by iScroll, you may also use pure CSS techniques.
function setHeight() {
	var headerH = document.getElementById('header').offsetHeight,
		footerH = document.getElementById('footer').offsetHeight,
		wrapperH = window.innerHeight - headerH - footerH;
	document.getElementById('wrapper').style.height = wrapperH + 'px';
}

function go(url) {
	parent.document.location.href=url;
	parent.$("#dialog").dialog("close");
}

function changeMap(url) {
	document.location.replace(url);	
}

function cancel() {
	parent.$("#dialog").dialog("close");	
}
// Check screen size on orientation change
window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', setHeight, false);

// Prevent the whole screen to scroll when dragging elements outside of the scroller (ie:header/footer).
// If you want to use iScroll in a portion of the screen and still be able to use the native scrolling, do *not* preventDefault on touchmove.
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

// Load iScroll when DOM content is ready.
document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);
</script>

</head>
<body>


<div id="header" class="toolbar">
	<h1><c:out value="${data.mapType}"></c:out> Map</h1>
	<a class="back" onclick="cancel();">Map</a>
	
	<c:choose>
		
		<c:when test="${data.user.username ne 'guest'}">
			<c:choose>	
				<c:when test="${data.mapType eq 'user'}">
					<a class="button" id="sharemaps" onclick="changeMap('${pageContext.request.contextPath}/mindmap/list.do?maptype=myshares');">Share Maps</a>
				</c:when>
				<c:when test="${data.mapType eq 'myshares'}">
					<a class="button" id="publicmaps" onclick="changeMap('${pageContext.request.contextPath}/mindmap/list.do?maptype=public');">Public Maps</a>					
				</c:when>
				<c:when test="${data.mapType eq 'public'}">
					<a class="button" id="usermaps" onclick="changeMap('${pageContext.request.contextPath}/mindmap/list.do?maptype=user');">User Maps</a>					
				</c:when>																
			</c:choose>
		</c:when>
		
		<c:otherwise>
		<!--
			<c:choose>
				<c:when test="${data.mapType eq 'public'}">
					<a class="button" id="sharemaps" onclick="changeMap('${pageContext.request.contextPath}/mindmap/list.do?maptype=myshares');">Share Maps</a>
				</c:when>
				<c:when test="${data.mapType eq 'myshares'}">
					<a class="button" id="publicmaps" onclick="changeMap('${pageContext.request.contextPath}/mindmap/list.do?maptype=public');">Public Maps</a>
				</c:when>
				
			</c:choose>
		-->
		</c:otherwise>
		 
	</c:choose>
	
</div>

<c:if test="${data.maps != null and fn:length(data.maps) > 0}">


<div id="wrapper">
	<div id="scroller">
	
		<div id="lists">
            <ul class="rounded">
            	<c:choose>
	
					<c:when test="${data.maps != null and fn:length(data.maps) > 0 and data.mapType eq 'user'}">
						<c:forEach var="map" items="${data.maps}">
			            	<li class="arrow" onclick="go('${pageContext.request.contextPath}/map/<c:out value="${map.key}"></c:out>');"><a><c:out value="${map.name}"></c:out></a></li>
						</c:forEach>
					</c:when>
					
					<c:when test="${data.maps != null and fn:length(data.maps) > 0 and data.mapType eq 'myshares'}">
						<c:forEach var="share" items="${data.maps}">
							<li class="arrow" onclick="go('${pageContext.request.contextPath}/map/<c:out value="${share.map.key}"/>?sid=<c:out value="${share.id }"/>');"><a><c:out value="${share.map.name}"></c:out></a></li>
						</c:forEach>
					</c:when>
	
					<c:when test="${data.maps != null and fn:length(data.maps) > 0 and data.mapType eq 'public'}">
						<c:forEach var="map" items="${data.maps}">
			            	<li class="arrow" onclick="go('${pageContext.request.contextPath}/map/<c:out value="${map.key}"></c:out>');"><a><c:out value="${map.name}"></c:out></a></li>
						</c:forEach>
					</c:when>		
			
				</c:choose>                
            </ul>            
        </div>
    
	</div>
</div> 


</c:if>

<div id="footer">Total : <c:out value="${fn:length(data.maps)}"/></div>
 
</body>
</html>

