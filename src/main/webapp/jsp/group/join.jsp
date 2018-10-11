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
	<title><spring:message code='message.group.join'/></title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
	
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery-ui.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/slimScroll.min.js" type="text/javascript" charset="utf-8"></script>
	
	<script type="text/javascript">
	$(document).ready( function() {

		$('.content').slimScroll({
			width: '410px',  
			height: '200px'
		});

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
<div style="margin:38px auto; width:400px" >
<div class="dialog_title"><spring:message code='message.group.join'/></div>
<div style="text-align:center; margin-top:24px">
<c:choose>
<c:when test="${data.groups != null and fn:length(data.groups) > 0}">
<div class="content">
<table cellspacing="0" cellpadding="5" style="width:400px;">
	<tr>
		<th style="width:200px;"><spring:message code='common.name'/></th>
		<th style="width:80px;"><spring:message code='common.policy'/></th>
		<th>&nbsp;</th>
	</tr>

<c:forEach var="group" items="${data.groups}">
	<tr>
		
		<c:choose>
		<c:when test="${user.id == group.user.id}">
			<td class="nobody"><a href="${pageContext.request.contextPath}/group/member/list.do?id=<c:out value="${group.id}"></c:out>"><c:out value="${group.name}"></c:out></a></td>
		</c:when>
		<c:otherwise>
			<td class="nobody"><c:out value="${group.name}" /></td>
		</c:otherwise>
		</c:choose>

		
		<td class="nobody" style="text-align:center;"><c:out value="${group.policy.name}"/></td>
		<td class="nobody" style="text-align:center;"><a href="${pageContext.request.contextPath}/group/join.do?groupid=<c:out value="${group.id}"></c:out>">
		<input type="button" class="check_btn" value="<spring:message code='message.group.join'/>" /></a></td>
	</tr>
</c:forEach>

</table>
</div>
</c:when>
<c:otherwise>
<p><spring:message code='message.group.nogroup'/></p>
</c:otherwise>
</c:choose>
</div>

<form method=post name="searchf" onsubmit="goSearch()">
<div class="search" align="center">
					
						<select name="searchfield">
							<option value="groupname"><spring:message code='message.group.name'/></option>
							
						</select><input type = "text" name="search" class="group_search_input" value="${data.search}">
						
						<input type="hidden" name="page" value="${data.page}">
						<input type="hidden" name="sort" value="${data.sort}">
						<input type="hidden" name="isAsc" value="${data.isAsc}">
						<input type="hidden" name="mapType" value="${data.mapType}">
						<input type="submit" class="search_btn" value="<spring:message code='common.search'/>">
					
					
				
				<span style="text-align:right;">
	<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/group/list.do';"><input type="button" class="create_btn" value="<spring:message code='button.cancel'/>" /></a>
	</span>
</div>
</form>	


<div class="pagenum" style="text-align:center;padding-top:7px;">
				<%
				HashMap<String, Object> data = (HashMap) request.getAttribute("data");
				out.println(PagingHelper.instance.autoPaging((Integer)data.get("totalGroups"), (Integer)data.get("pagelimit"), (Integer)data.get("plPageRange"), (Integer)data.get("page")));
				%>
				</div>
				

</div>
</body>
</html>