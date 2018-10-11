<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title><spring:message code='message.group.join'/></title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
</head>
<body>

<p>
<h1><spring:message code='message.group.join'/></h1>
</p>

<c:if test="${data.wrongPassword}">
<span class="">Wrong Password</span>
</c:if>
<form action="${pageContext.request.contextPath}/group/join.do" method="post">
<input type="hidden" name="groupid" value="<c:out value="${data.group.id }" />">
<spring:message code='common.password'/>: <input type="password" name="password" value=""></input>
<p>
<input type="submit"></input>
</p>
</form>

<div style="margin-top: 20px;">
<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/group/join.do';"><input type="button" class="create_btn" value="<spring:message code='button.cancel'/>" /></a>
</div>

</body>
</html>