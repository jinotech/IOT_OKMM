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
<title><spring:message code='message.group.member.add'/></title>

<script type="text/javascript">
/*
$(document).ready( function() {

	$('.content').slimScroll({
		  height: '200px'
	});

});*/
</script>
</head>
<body>

<div class="dialog_title"><spring:message code='message.group.member.add'/></div>



				
<div style="padding-left:15px;">
<div class="group_member_add"><c:out value="${data.group.name }" /></div>
<c:choose>
<c:when test="${(data.notMembers != null and fn:length(data.notMembers) > 0) or data.search != null}">
<div class="content" style="overflow-x:hidden; overflow-y:auto; height:280px">
<table cellspacing="2" cellpadding="5" style="width:430px; table-layout:fixed; text-align:center">
	<tr>
		<th>Id</th>
		<th><spring:message code='common.name'/></th>
		<th width=150><spring:message code='common.email'/></th>
		<th>&nbsp;</th>
	</tr>

<c:forEach var="user" items="${data.notMembers}">
	<tr>
		<td class="nobody"><c:out value="${user.password != 'not cached' ? user.username : '******'}"></c:out></td>
		<td class="nobody"><c:out value="${user.lastname}"></c:out> <c:out value="${user.firstname}"></c:out></td>
		<td class="nobody"><c:out value="${fn:substring(user.email, 0, 5)}"></c:out>***</td>
		<td class="nobody">
			<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/group/member/add.do?groupid=<c:out value="${data.group.id }"/>&userid=<c:out value="${user.id}" />';">
			<spring:message code='button.add'/></a>
		</td>
	</tr>
</c:forEach>

</table>
</div>
<form method=post name="searchf" onsubmit="goSearch()">
<div class="search" align="center">
					
						<select name="searchfield" id="searchfield">
							<option value="username" ${data.searchfield == "username" ? "selected":""} >Id</option>
							<option value="fullname" ${data.searchfield == "fullname" ? "selected":""} ><spring:message code='common.name'/></option>
						</select><input type = "text" name="search" class="group_search_input" value="${data.search}">
						
						<input type="hidden" name="page" value="${data.page}">
						<input type="hidden" name="sort" value="${data.sort}">
						<input type="hidden" name="isAsc" value="${data.isAsc}">
						<input type="hidden" name="mapType" value="${data.mapType}">
						<input type="submit" class="search_btn" value="<spring:message code='common.search'/>">
					
					
				<!-- </div>
				<div style="margin-top: 20px; margin-left:15px;float:right"> -->
				<span style="text-align:right; ">
	<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/group/member/list.do?id=<c:out value="${data.group.id }" />';" >
	<input type="button" class="create_btn" value="<spring:message code='button.cancel'/>"/></a>
	</span>
</div>
</form>				
				
<div class="pagenum" style="text-align:center;padding-top:7px;">
				<%
				HashMap<String, Object> data = (HashMap) request.getAttribute("data") ;
				out.println(PagingHelper.instance.autoPaging((Integer)data.get("totalMembers"), (Integer)data.get("pagelimit"), (Integer)data.get("plPageRange"), (Integer)data.get("page")));
				%>
				</div>
				

</div>
</c:when>
<c:otherwise>

<p><spring:message code='message.group.member.emptyregistered'/></p>
<div style="margin-top: 20px; text-align:center">
	<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/group/member/list.do?id=<c:out value="${data.group.id }" />';" >
	<input type="button" class="create_btn" value="<spring:message code='button.cancel'/>"/></a>
</div>
</c:otherwise>
</c:choose>


</body>
</html>