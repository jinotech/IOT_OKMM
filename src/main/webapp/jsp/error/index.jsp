<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Error</title>

<script type="text/javascript">
function moveTo(url) {
	if(parent) {
		parent.document.location.href = url;
	} else {
		document.location.href = url;
	}
}
</script>

<link rel="stylesheet" href="${pageContext.request.contextPath}/css/error.css" type="text/css" media="screen">

</head>

<body>

<div class="errorwrap">

	<div class="header"><h1 class="logo"><img src="../../images/error/errorlogo.png"></h1></div>
	
	<div class="erroricon">
	<img src="../../images/error/error.png">
	<p class="errornotice"><spring:message code='error.msg'/></p>
	<p class="errorinfo"><c:out value="${data.message}"/></p>
	<button onclick="moveTo('${pageContext.request.contextPath}<c:out value="${data.url}" escapeXml="false"/>')"><spring:message code='button.confirm'/></button>
	</div>

</div>


<!-- --원래내용-- -->
<!-- --
<h1><spring:message code='common.error'/></h1>
<p><c:out value="${data.message}"/></p>

<button onclick="moveTo('${pageContext.request.contextPath}<c:out value="${data.url}" escapeXml="false"/>')"><spring:message code='button.confirm'/></button>- -->


</body>
</html>