<%@page import="com.okmindmap.util.PagingHelper"%>
<%@page import="java.util.HashMap"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%pageContext.setAttribute("ctlf", "\n"); %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title><c:choose>
<c:when test="${data.boardType==1}">
	<spring:message code='menu.cs.notice'/> <spring:message code='common.view'/> 
</c:when>
<c:when test="${data.boardType==2}">
	<spring:message code='menu.cs.qna'/> <spring:message code='common.view'/> 
</c:when>
<c:otherwise>
	<spring:message code='menu.cs.require'/> <spring:message code='common.view'/> 
</c:otherwise>
</c:choose></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">

<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/jquery-ui.min.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/slimScroll.min.js" type="text/javascript" charset="utf-8"></script>
	
<script type="text/javascript">
	function saveMemo() {
		
		
		if (document.memoForm.username2.value == '') {
			alert("<spring:message code='board.view.insertusername'/>");
			document.memoForm.username2.focus();
			return;
		}
		
	<c:if test="${data.user.username eq 'guest'}">
		if (document.memoForm.password.value == '') {
			alert("<spring:message code='board.view.insertpassword'/>");
			document.memoForm.password.focus();
			return;
		}
		
		
	</c:if>		
	if (document.memoForm.content.value == '') {
		alert("<spring:message code='board.view.insertmemo'/>");
		document.memoForm.content.focus();
		return;
	}
			
		document.memoForm.action = '<c:url value="/board/memo_new.do"/>';
		document.memoForm.confirmed.value = "1";
		document.memoForm.submit();
	}
	
	
	function editMemo(memoId) {
		if (document.memoForm.content.value == '') {
			alert("<spring:message code='board.view.insertmemo'/>");
			document.memoForm.content.focus();
			return;
		}
		
		document.memoForm.action = '<c:url value="/board/memo_edit.do"/>';
		document.memoForm.memoId.value = memoId;
		document.memoForm.confirmed.value = "1";
		document.memoForm.isEditMode.value = "0";
		document.memoForm.submit();
	}
	
	
	
	function deleteMemo(memoId) {
		if(confirm("<spring:message code='board.view.deletememo'/>")) {
			document.memoForm.memoId.value = memoId;
			document.memoForm.action = '<c:url value="/board/memo_delete.do"/>';
			document.memoForm.submit();
			
		}
	}
	
/*	
	function goEditMemo(boardType, boardId, memoId) {
		document.memoForm.boardType.value = boardType;
		document.memoForm.boardId.value = boardId;
		document.memoForm.memoId.value = memoId;
		document.memoForm.confirmed.value = "0";
		document.memoForm.isEditMode.value = "1";
		document.memoForm.action = '<c:url value="/board/memo_edit.do"/>';
		document.memoForm.submit();
	}
*/
	
	
</script>
</head>
<body>
<!--
<div class="dialog_title">
<c:choose>
<c:when test="${data.boardType==1}">
	<spring:message code='menu.cs.notice'/> <spring:message code='common.view'/> 
</c:when>
<c:when test="${data.boardType==2}">
	<spring:message code='menu.cs.qna'/> <spring:message code='common.view'/> 
</c:when>
<c:otherwise>
	<spring:message code='menu.cs.require'/> <spring:message code='common.view'/> 
</c:otherwise>
</c:choose>
</div>
-->
<div>
<table border =0 style="width:98%" cellpadding="0" cellspacing="0">
	<tr>
		<th width=80 style="padding-top:10px;"><spring:message code='common.title'/></th>
		<td style="padding-left:2px;" class="nobody"><c:out value="${data.board.title}" /></td>
	</tr>
	<tr>
		<th  style="padding-top:10px;"><spring:message code='board.common.content' htmlEscape="false"/></th>
		<td style="padding-left:1px; height:100px;" class="nobody">${fn:replace(data.board.content, ctlf, '<br/>')}</td>
	</tr>
</table>
</div>

<div style="margin-top:10px; text-align:center;">

<input type="button" value="<spring:message code='common.edit'/>" class="create_btn" onclick="document.location.href='${pageContext.request.contextPath}/board/edit_view.do?boardId=<c:out value="${data.board.boardId}"/>&boardType=<c:out value="${data.boardType}"/>';" />
<!--삭제 confirm 달기-->


<input type="button" value="<spring:message code='common.delete'/>" class="create_btn" onclick="document.location.href='${pageContext.request.contextPath}/board/delete.do?boardId=<c:out value="${data.board.boardId}"/>&boardType=<c:out value="${data.boardType}"/>&page=<c:out value="${data.page}"/>&searchVal=<c:out value="${data.searchVal}"/>';"  />

<input type="button" value="<spring:message code='board.button.list'/>" class="create_btn"  onclick="document.location.href='${pageContext.request.contextPath}/board/list.do?boardType=<c:out value="${data.boardType}"/>&page=<c:out value="${data.page}"/>&searchVal=<c:out value="${data.searchVal}"/>';"/>
</div>

<div class="content">
<div style="padding-top:10px;">
<form name="memoForm" method="post">
<input type="hidden" name="confirmed" value="0">
<input type="hidden" name="isEditMode" value="0">
<input type="hidden" name="memoId">
<input type="hidden" name="boardId" value="<c:out value="${data.board.boardId}"/>">
<input type="hidden" name="boardType" value="<c:out value="${data.boardType}"/>">

<c:forEach var="memo" items="${data.boardMemoList}">
<table cellpadding="0" cellspacing="0" style="width:98%" border=1>
		<tr>
			<td class="list_content nobody" width=85% style="padding:10px">
				<c:out value="${memo.username2}"/>(<fmt:formatDate value="${memo.insertDate}" pattern="yyyy-MM-dd"/>)
			</td>
			<td rowspan=2 width=15% class="nobody" style="padding:10px">
							 
				<c:if test="${userSession.user.userId == memo.userId}">
			 <a href="<c:url value="javascript:deleteMemo(${memo.memoId})"/>"><spring:message code='common.delete'/></a> 
				</c:if>				
				<c:if test="${userSession.user.userId != memo.userId}">
				<a href="<c:url value="javascript:deleteMemo(${memo.memoId})"/>"><img src="../images/delete.png"  /><spring:message code='common.delete'/></a>
				</c:if></td>
			</tr>
			<tr><td class="nobody" style="line-height:160%; padding-left:10px; padding-right:10px">${fn:replace(memo.content, ctlf, "<br/>") }</td></tr>
		</table>
		<br>
		</c:forEach>
		
<table cellpadding="0" cellspacing="0" style="width:98%" border=1>
<tr>  
	<td bgcolor="#FFFFFF" width=85% class="nobody"  style="padding:10px">
		<c:if test="${data.user.username eq 'guest'}">
		<spring:message code='message.id'/> : <input type="text" name="username2"  size="10" maxlength="20"> &nbsp;<br>
		<spring:message code='common.password'/> : <input type="text" name="password"  size="10" maxlength="10">
		</c:if>
		<c:if test="${data.user.username ne  'guest'}">
			<input type="text" name="username2" value="<c:out value="${data.user.username }" />" size="10">
		</c:if>
	</td>
<td bgcolor="#FFFFFF" rowspan=2 width=85% class="nobody"  style="padding:10px">
	
<c:choose>
		<c:when test="${data.isEditMode=='1'}">
		 <a href="<c:url value="javascript:editMemo(${data.myMemo.memoId})"/>"><spring:message code='board.button.confirm'/></a> 
		</c:when>
		
		<c:otherwise>
		<a href="<c:url value="javascript:saveMemo()"/>"><img src="../images/confirm.png"  /> <spring:message code='board.button.confirm'/></a>
		
		</c:otherwise>
		</c:choose>
	
	</td>
</tr>
<tr>
	<td class="nobody">
		<textarea name="content" style="width:98%; resize:none;"><c:out value="${data.myMemo.content }" /></textarea>
	</td>
</tr>

</table>
</form>
</div>
</div><!-- content -->
</body>
</html>
