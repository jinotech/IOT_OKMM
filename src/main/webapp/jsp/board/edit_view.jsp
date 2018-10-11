<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title><c:choose>
<c:when test="${data.boardType==1}">
	<spring:message code='menu.cs.notice'/> <spring:message code='common.edit'/> 
</c:when>
<c:when test="${data.boardType==2}">
	<spring:message code='menu.cs.qna'/> <spring:message code='common.edit'/> 
</c:when>
<c:otherwise>
	<spring:message code='menu.cs.require'/> <spring:message code='common.edit'/> 
</c:otherwise>
</c:choose></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">

</head>
<body>
<!--
<div class="dialog_title">
<c:choose>
<c:when test="${data.boardType==1}">
	<spring:message code='menu.cs.notice'/> <spring:message code='common.edit'/> 
</c:when>
<c:when test="${data.boardType==2}">
	<spring:message code='menu.cs.qna'/> <spring:message code='common.edit'/> 
</c:when>
<c:otherwise>
	<spring:message code='menu.cs.require'/> <spring:message code='common.edit'/> 
</c:otherwise>
</c:choose>
</div>
-->
<div>
<form id="frm_board" action="${pageContext.request.contextPath}/board/edit.do" method="post">
<input type="hidden" name="confirmed" value="1" />
<input type="hidden" name="boardType" value="<c:out value="${data.boardType}"/>" />
<input type="hidden" name="boardId" value="<c:out value="${data.board.boardId }" />" />
<input type="hidden" name="password" value="<c:out value="${data.password }" />" />
<table width=400px; border=0; cellpadding="0" cellspacing="0" >
<tr>
	<th width=80><spring:message code='common.title'/></th>
	<td style="padding-left:2px;" class="nobody"> <input type="text" name="title" style="width:98%;" value="<c:out value="${data.board.title}" />" /></td>
</tr>
<tr>
	<th width=80><spring:message code='board.common.content'/></th>
	<td style="padding-left:2px; height:100px;" class="nobody"><textarea name="content" value="" style="width:98%; height:100px; resize:none;"><c:out value="${data.board.content}" /></textarea></td>
</tr>
</table>
</form> 
</div>

<div style="margin-top: 20px; text-align:center;">
	<a href="#" onClick="javascript:document.getElementById('frm_board').submit()"><input type="button" class="create_btn" value="<spring:message code='button.confirm'/>" /></a>
	<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/board/list.do';"><input type="button" class="create_btn" value="<spring:message code='button.cancel'/>" /></a>
</div>
</body>
</html>
