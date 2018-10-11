<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title><spring:message code='message.group.delete'/> </title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">

</head>
<body>

<div class="dialog_title"><spring:message code='message.group.delete'/></div>

<div style="text-align:center; padding-top:60px;">
<p>
<spring:message code='message.group.delete.text'/>
<p>
<b><c:out value="${ data.group.name }" /></b>
</p>
</p>
</div>

<form id="frm_delete" action="${pageContext.request.contextPath}/group/delete.do" method="post">
<input type="hidden" name="confirmed" value="1"></input>
<input type="hidden" name="id" value="<c:out value="${ data.group.id }" />">
</form>

<div style="margin-top: 20px; text-align:center;">
	<a href="#" onClick="javascript:document.getElementById('frm_delete').submit()"><input type="button" class="create_btn" value="<spring:message code='button.delete'/>" /></a>
	<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/group/list.do';"><input type="button" class="create_btn" value="<spring:message code='button.cancel'/>" /></a>
</div>


</body>
</html>