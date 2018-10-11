<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>Login</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.2, maximum-scale=1.2, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">

<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/simplemodal.css" type="text/css">

</head>
<body>
<!-- 
<p>
<h3><spring:message code='user.recover_password'/></h3>
</p>
 -->


<table class="user-new" width="100%" border="0" cellspacing="0" cellpadding="0" >
	<tr>
		<td class="user-new-input nobody"><c:out value="${message}"/></td>
	</tr>
</table>
</body>
</html> 