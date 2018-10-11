<%@page import="com.okmindmap.util.PagingHelper"%>
<%@page import="java.util.HashMap"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">

<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/jquery-ui.min.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/slimScroll.min.js" type="text/javascript" charset="utf-8"></script>

<script>
	function searchBoard() {
		document.searchForm.action = '<c:url value="/board/list.do"/>';
		document.searchForm.submit();
	}
	
	$(function(){
		$('.content').slimScroll({
			  height: '265px'			
		}).css({ });

		});
</script>
</head>
<body>
<!-- 
<div class="dialog_title">
<c:choose>
<c:when test="${data.boardType==1}">
	<spring:message code='menu.cs.notice'/>
</c:when>
<c:when test="${data.boardType==2}">
	<spring:message code='menu.cs.qna'/>
</c:when>
<c:otherwise>
	<spring:message code='menu.cs.require'/>
</c:otherwise>
</c:choose>
</div>
-->
<div>
<table cellspacing="0" cellpadding="5" style="width:98%;" align=center class="board_table">
	<tr>
		<!-- <th><spring:message code='board.list.number'/></th>  -->
		<th style="width:70%;"><spring:message code='common.title'/></th>
		<th style="width:15%;"><spring:message code='common.name'/></th>
		<th style="width:15%;"><spring:message code='board.list.insertdate'/></th>
	</tr>

<c:forEach var="board" items="${data.myBoards}">
	<tr style="width:450px; height:34px;">
	<!-- 	<td align=center><c:out value="${board.boardId}"/></td> -->
	    <td style="padding : 4px 0px 4px 0px;">
	    	<a href="${pageContext.request.contextPath}/board/view.do?boardId=<c:out value="${board.boardId}"/>&boardType=<c:out value="${data.boardType}"/>&page=<c:out value="${data.page}"/>&searchVal=<c:out value="${data.searchVal}"/>">
	    		<c:out value="${board.title}"/><c:if test="${data.roleid == '1'}">&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;<c:out value="${board.lang}"></c:out></c:if>
	    	</a>
	    </td>
	    <td align=center><c:out value="${board.username2}"/></td>
	    <td align=center><c:out value="${board.insertDate}"/></td>
    
	</tr>
</c:forEach>
</table>

<!-- search -->
<table style="width:98%;" border="0" cellspacing="0" cellpadding="0" border=1 align=center>
<form name="searchForm" method="POST"  onsubmit="searchBoard()">
<tr class="list_page"> 
	<td align=center style="padding-top:10px;" class="nobody" colspan=2><c:out value="${data.pagedLink}" escapeXml="false"/></td>
</tr>
<tr class="list_menu" align=right > 
	<td style="padding-top:7px;" class="nobody">
		<select name="searchKey">
			<option value="title" <c:if test="${searchKey == 'title'}"><c:out value="selected"/></c:if>><spring:message code='common.title'/></option>
		</select>
		<input type="text" name="searchVal" class="board_search_input" <c:if test="${!data.searchVal}"> value="<c:out value="${data.searchVal}"/>"</c:if> />
		<input type="button" class="search_btn" value="<spring:message code='board.list.search'/>" onclick="searchBoard()"/>
		<input type="hidden" name="boardType" value ="${data.boardType}">
		<input type="hidden" name="lang" value ="${data.lang}">
		&nbsp;&nbsp;&nbsp;
		<a href="#" onclick="document.location.href = '${pageContext.request.contextPath}/board/new.do?boardType=<c:out value="${data.boardType}"/>&lang=<c:out value="${data.lang}"/>'">
		<input type="button" class="create_btn" value="<spring:message code='board.list.new'/>" /></a>
		
	</td>
</tr>
</form>
</table>
</div>
</body>
</html>
