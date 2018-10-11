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
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">

<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/jquery-ui.min.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/slimScroll.min.js" type="text/javascript" charset="utf-8"></script>

<title><spring:message code='message.group.member.registered'/></title>

<script type="text/javascript">
$(function(){
	$('.content').slimScroll({
		  width: '408px',
		  height: '180px'
	}).css({ });

	});

</script>

<script>

	function goSearch(){
	    var frm = document.searchf;
	    frm.page.value = 1;
	    frm.submit();
	}

	function goPage(v_curr_page){
	    var frm = document.searchf;
	    frm.page.value = v_curr_page;
	    frm.submit();
	}
	
	</script>
	
		
</head>
<body>

<div class="dialog_title"><spring:message code='message.group.member.registered'/></div>

<div style="width:400px; margin:40px auto">
<div class="group_member_add"><c:out value="${data.group.name }" /></div>
<c:choose>
<c:when test="${(data.members != null and fn:length(data.members) > 0) or data.search != null}">
<div class="content">
<table cellspacing="0" cellpadding="5" style="width:400px;">
	<tr>
		<th>Id</th>
		<th><spring:message code='common.name'/></th>
		<th><spring:message code='common.email'/></th>
<c:if test="${data.group.policy.shortName eq 'approval'}">
		<th><spring:message code='message.group.member.registered'/><spring:message code='common.status'/></th>
</c:if>
		<th>&nbsp;</th>
	</tr>

<c:forEach var="member" items="${data.members}">
	<tr>
		<td class="nobody"><c:out value="${member.user.password != 'not cached' ? member.user.username : '******'}"></c:out></a></td>
		<td class="nobody"><c:out value="${member.user.lastname}"></c:out> <c:out value="${member.user.firstname}"></c:out></td>
		<td class="nobody"><c:out value="${member.user.email}"></c:out></td>
<c:if test="${data.group.policy.shortName eq 'approval'}">
		<td><c:out value="${member.memberStatus.name}"></c:out></td>
</c:if>
		<td class="nobody">
			<a href="${pageContext.request.contextPath}/group/member/remove.do?id=<c:out value="${member.id }"/>"><img src="../../images/delete.png" value="<spring:message code='button.cancel'/>" /></a>
			<c:if test="${member.memberStatus.shortName eq 'waiting'}">[<a href="${pageContext.request.contextPath}/group/member/status.do?id=<c:out value="${member.id }"/>&status=approved"><spring:message code='button.approve'/></a>]</c:if>
		</td>
	</tr>
</c:forEach>

</table>
</div>
</c:when>
<c:otherwise>
<p><spring:message code='message.group.member.emptyregistered'/></p>
</c:otherwise>
</c:choose>

<form method=post name="searchf" onsubmit="goSearch()">
	<div class="search" align="center">
		<select name="searchfield" id="searchfield">
			<option value="username" ${data.searchfield == "username" ? "selected":""} >Id</option>
			<option value="fullname" ${data.searchfield == "fullname" ? "selected":""} ><spring:message code='common.name'/></option>
		</select><input type = "text" name="search" class="group_search_input" value="${data.search}">
	
		<input type="hidden" name="page" value="${data.page}">
		<input type="hidden" name="sort" value="${data.sort}">
		<input type="hidden" name="isAsc" value="${data.isAsc}">
		
		<input type="submit" class="search_btn" value="<spring:message code='common.search'/>">
	</div>
</form>

<div class="pagenum" style="text-align:center;padding-top:7px;">
				<%
				HashMap<String, Object> data = (HashMap) request.getAttribute("data") ;
				
				out.println(PagingHelper.instance.autoPaging((Integer)data.get("totalMembers"), (Integer)data.get("pagelimit"), (Integer)data.get("plPageRange"), (Integer)data.get("page")));
				%>
				</div>
<div style="margin-top: 20px; margin-left:100px;">
	<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/group/member/add.do?groupid=<c:out value="${data.group.id } "/>';" ><input type="button" class="add_btn" value="<spring:message code='message.group.member.add.short'/>" /></a>
	<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/group/list.do';"><input type="button" class="add_btn" value="<spring:message code='button.grouplist'/>" /></a>
</div>
	
</body>
</html>