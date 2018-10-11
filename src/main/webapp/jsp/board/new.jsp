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
	<spring:message code='menu.cs.notice'/> <spring:message code='board.list.new'/> 
</c:when>
<c:when test="${data.boardType==2}">
	<spring:message code='menu.cs.qna'/> <spring:message code='board.list.new'/> 
</c:when>
<c:otherwise>
	<spring:message code='menu.cs.require'/> <spring:message code='board.list.new'/> 
</c:otherwise>
</c:choose></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">





<script type="text/javascript">
	var count = 0;
	function sleep(delay) {
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
    }
	function saveContents() {
		count++;
		if (document.frm_group.title.value == '') {
			alert("<spring:message code='board.new.inserttitle'/>");
			document.frm_group.title.focus();
			return;
		}
		
		if (document.frm_group.content.value == '') {
			alert("<spring:message code='board.new.insertcontents'/>");
			document.frm_group.content.focus();
			return;
		}
		
		
		
<c:if test="${data.userId == null}">
		if (document.frm_group.username2.value == '') {
			alert("<spring:message code='board.view.insertusername'/>");
			document.frm_group.username2.focus();
			return;
		}

		if (document.frm_group.userpassword.value == '') {
			alert("<spring:message code='board.view.insertpassword'/>");
			document.frm_group.userpassword.focus();
			return;
		}
</c:if>		
		
		if(count == 1){
			document.frm_group.action = '${pageContext.request.contextPath}/board/new.do';
			document.frm_group.confirmed.value = "1";
			document.frm_group.submit();
		}else{
			alert("<spring:message code='board.list.save'/>");
			sleep(3000);
			location.href="${pageContext.request.contextPath}/board/list.do?boardType=<c:out value="${data.boardType}"/>&lang=<c:out value="${data.lang}"/>"
		}
	}
</script>




</head>
<body>
<!--
<div class="dialog_title">
<c:choose>
<c:when test="${data.boardType==1}">
	<spring:message code='menu.cs.notice'/> <spring:message code='board.list.new'/> 
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

<div>
<form id="frm_group" name="frm_group" method="post" >
<input type="hidden" name="confirmed" value="1" />
<input type="hidden" name="boardType" value="<c:out value="${data.boardType}"/>" />
<input type="hidden" name="lang" value="<c:out value="${data.lang}"/>" />
<table style="width:98%;" border=0 cellpadding="0" cellspacing="0">
	<tr>
		<th width=80><spring:message code='common.title'/></th>
		<td style="padding-left:2px;" class="nobody"><input type="text" name="title" value="" style="width:98%" /></td>
	</tr>
	<tr>
		<th width=80><spring:message code='board.common.content'/></th>
		<td style="padding-left:2px; height:100px;" class="nobody"><textarea name="content" style="width:98%; height:100px; resize:none;"></textarea></td>
	</tr>
	<c:if test="${data.userId == null}">
	<tr>
		<th width=80><spring:message code='common.name'/></th>
		<td style="padding-left:2px;" class="nobody"><input type="text" name="username2" value="" /></td>
	</tr>
	<tr>
		<th width=80><spring:message code='common.password'/></th>
		<td style="padding-left:2px;" class="nobody"><input type="text" name="userpassword" value="" /></td>
	</tr>
	</c:if>
</table>
</form> 
</div>

<div style="margin-top:20px; text-align:center;">
	<a href="#" onClick="javascript:saveContents()"><input type="button" class="create_btn" value="<spring:message code='board.button.confirm'/>" /></a>
	<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/board/list.do?boardType=<c:out value="${data.boardType}"/>&lang=<c:out value="${data.lang}"/>';"><input type="button" class="create_btn" value="<spring:message code='board.button.list'/>" /></a>
</div>

</body>
</html>
