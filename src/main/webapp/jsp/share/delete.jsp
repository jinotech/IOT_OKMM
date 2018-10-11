<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title><spring:message code='message.share.delete'/></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/simplemodal.css" type="text/css" />

</head>
<body>

<div class="share"><spring:message code='message.share.delete'/></div>
<div style="padding-top:55px;">
<p>
<div class="map_delete"><spring:message code='message.share.delete.text'/></div>
<p>
<b><div style="text-align:center;"><c:out value="${ data.map.name }" /></div></b>
</p>
</p>

<form id="frm_delete" action="${pageContext.request.contextPath}/share/delete.do" method="post">
<input type="hidden" name="confirmed" value="1"></input>
<input type="hidden" name="id" value="<c:out value="${ data.share.id }" />">
<input type="hidden" name="map_id" value="<c:out value="${ data.map.id }" />">
</form>
</div>

<div style="margin-top: 20px; text-align:center;">
	<a href="#" onClick="javascript:document.getElementById('frm_delete').submit()"><input type="button" class="create_btn" value="<spring:message code='button.delete'/>" /></a>
	<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/share/list.do?map_id=<c:out value="${ data.map.id }" />';" ><input type="button" class="create_btn" value="<spring:message code='button.cancel'/>"/></a>
</div>


</body>
</html>