<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
<title>result</title>
</head>
<body>

<div class="dialog_title"><spring:message code='common.confirm'/></div>
<div style="padding-top:20px; padding-left:20px;">
<h1><c:out value="${result['message']}"/></h1>
<c:if test="${result['id'] != null}">
<p> <spring:message code='message.import.freemind.map'/>: <a href="${pageContext.request.contextPath}/map/<c:out value="${result['key'] }"/>" target="_parent"><c:out value="${result['name'] }"></c:out></a></p>
<p><spring:message code='message.import.freemind.mapurl'/>: <a href="${pageContext.request.contextPath}/map/<c:out value="${result['key'] }"/>" target="_parent">${pageContext.request.serverName}${pageContext.request.contextPath}/map/<c:out value="${result['key']}"></c:out></a></p>
</c:if>
</div>
<script type="text/javascript">	
	if("<c:out value="${result['message']}"/>" == "Success!")
		parent.document.location.href = "${pageContext.request.contextPath}/map/<c:out value="${result['key'] }"/>";
</script>

</body>
</html>