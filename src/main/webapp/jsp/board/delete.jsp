<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>
<c:choose>
<c:when test="${data.boardType==1}">
	<spring:message code='menu.cs.notice'/> <spring:message code='common.delete'/> 
</c:when>
<c:when test="${data.boardType==2}">
	<spring:message code='menu.cs.qna'/> <spring:message code='board.list.new'/> 
</c:when>
<c:otherwise>
	<spring:message code='menu.cs.require'/> <spring:message code='board.list.new'/> 
</c:otherwise>
</c:choose>
</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">

</head>
<body>
<!--
<div class="dialog_title">
<c:choose>
<c:when test="${data.boardType==1}">
	<spring:message code='menu.cs.notice'/> <spring:message code='common.delete'/> 
</c:when>
<c:when test="${data.boardType==2}">
	<spring:message code='menu.cs.qna'/> <spring:message code='board.list.new'/> 
</c:when>
<c:otherwise>
	<spring:message code='menu.cs.require'/> <spring:message code='board.list.new'/> 
</c:otherwise>
</c:choose>
</div>
-->
<div style="padding-top:40px; text-align:center;">
<spring:message code='board.delete.ask'/> 

<p>
<b><c:out value="${ data.board.title }" /></b>
</p>


<form id="frm_delete" action="${pageContext.request.contextPath}/board/delete.do" method="post">
<input type="hidden" name="confirmed" value="1"></input>
<input type="hidden" name="boardType" value="<c:out value="${data.boardType}"/>" />
<input type="hidden" name="boardId" value="<c:out value="${ data.board.boardId }" />">
<input type="hidden" name="password" value="<c:out value="${ data.password }" />">
<input type="hidden" name="page" value="<c:out value="${ data.page }" />">
<input type="hidden" name="searchVal" value="<c:out value="${ data.searchVal }" />">
</form>
</div>

<div style="margin-top: 20px; text-align:center;">
<a href="#" onClick="javascript:document.getElementById('frm_delete').submit()"><input type="button" class="create_btn" value="<spring:message code='button.delete'/>" /></a>
<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/board/list.do?boardType=<c:out value="${data.boardType}"/>';" ><input type="button" class="create_btn" value="<spring:message code='button.cancel'/>" /></a>
</div>


</body>
</html>
