<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title><spring:message code='common.password'/></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">

</head>
<body>

<div class="dialog_title"><spring:message code='common.password'/>  <spring:message code='board.common.insert'/></div>

<div style="padding-top:65px; text-align:center;">
<div class="board_password_subject"><spring:message code='common.password'/>  <spring:message code='board.common.insert'/></div>
<form id="frm_share_password" action="${pageContext.request.contextPath}<c:out value="${data.action}"/>" method="post">
<c:if test="${data.boardId != null}">
<input type="hidden" name="boardId" value="<c:out value="${data.boardId}"/>"/>
</c:if>
<c:if test="${data.memoId != null}">
<input type="hidden" name="memoId" value="<c:out value="${data.memoId}"/>"/>
</c:if>
<input type="hidden" name="boardType" value="<c:out value="${data.boardType}"/>"/>
<p>
    <label for="file"><spring:message code='common.password'/> </label>
    <input type="password" name="password" value="" />
</p>
</form>
</div>

<div style="margin-top: 10px; text-align:center;">
	<a href="#" onClick="javascript:document.getElementById('frm_share_password').submit()"><input type="button" class="create_btn" value="<spring:message code='button.confirm'/>" /></a>
	<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/board/list.do?boardType=<c:out value="${data.boardType}"/>';"><input type="button" class="create_btn" value="<spring:message code='button.cancel'/>" /></a>
</div>

</body>
</html>