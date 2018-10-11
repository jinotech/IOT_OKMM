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
	
	<script type="text/javascript">
		function cancelClk() {
			parent.$("#dialog").dialog("close");
		}
		
		$(function(){
			$('.content').slimScroll({
				  width: '430px',
				  height: '150px'
			}).css({ });

			});
	</script>
</head>
<body>

<!-- 
<p>
<b><spring:message code='message.share.sharedmap'/></b>		//공유된 마인드맵
</p>
 -->

<c:choose>
<c:when test="${data.sharedMaps != null and fn:length(data.sharedMaps) > 0}">
 <div style="padding-top:10px; padding-left:10px;">
 <div class="content">
<table cellspacing="0" cellpadding="2" style="width:420px; text-align:center">
	<tr>
		<th rowspan="2"><spring:message code='common.mindmap'/></th>
		<th colspan="3"></th>
		<th rowspan="2"></th>
	</tr>
	<tr>
		<th><spring:message code='message.share.type'/></th>
		<th><spring:message code='message.share.permission'/></th>
		<th><spring:message code='message.group.name'/></th>
	</tr>

<c:forEach var="map" items="${data.sharedMaps}">
	<c:set var="rowspan" value="${fn:length(map.shares)}"/>
	<% java.util.ArrayList types = new java.util.ArrayList(); %>
	<c:forEach var="permission" items="${map.shares[0].permissions}">
		<c:if test="${permission.permited}">
		<c:set var="permissionType"><spring:message code="message.share.add.permission_${permission.permissionType.shortName}" /></c:set>
		<% types.add(pageContext.getAttribute("permissionType")); %>
		</c:if>
	</c:forEach>
	<% request.setAttribute("permissionTypes", types.toArray(new String[types.size()])); %>
	<tr style="border-bottom:1px dotted #999999;">
		<td rowspan="<c:out value="${rowspan }" />"><c:out value="${map.name}"></c:out></td>
		<td><c:out value="${map.shares[0].shareType.name}"></c:out></td>
		<td><c:out value="${fn:join(permissionTypes, ', ')}"/></td>
		<td><c:choose><c:when test="${map.shares[0].group.name != null}"><a href="#"><c:out value="${map.shares[0].group.name}"></c:out></a></c:when><c:otherwise>&nbsp;</c:otherwise></c:choose></td>
		<td><a href="${pageContext.request.contextPath}/share/update.do?id=<c:out value="${map.shares[0].id }"/>"><img src="../images/modify.png" value="<spring:message code='button.edit'/>"  /></a>
		&nbsp;&nbsp;&nbsp;<a href="${pageContext.request.contextPath}/share/delete.do?id=<c:out value="${map.shares[0].id }"/>&map_id=<c:out value="${data.map_id }"/>"><img src="../images/delete.png" value="<spring:message code='button.delete'/>" /></a></td>
	</tr>
	<c:forEach var="i" begin="1" end="${fn:length(map.shares) - 1}">
	<% types = new java.util.ArrayList(); %>
	<c:forEach var="permission" items="${map.shares[0].permissions}">
		<c:if test="${permission.permited}">
		<c:set var="permissionType"><spring:message code="message.share.add.permission_${permission.permissionType.shortName}" /></c:set>
		<%
		types.add(pageContext.getAttribute("permissionType"));
		%>
		</c:if>
	</c:forEach>
	<% request.setAttribute("permissionTypes", types.toArray(new String[types.size()])); %>
	<tr style="border-bottom:1px dotted #999999;">
		<td><c:out value="${map.shares[i].shareType.name}"></c:out></td>
		<td><c:out value="${fn:join(permissionTypes, ', ')}"/></td>
		<td><c:choose><c:when test="${map.shares[i].group.name != null}"><a href="#"><c:out value="${map.shares[i].group.name}"></c:out></a></c:when><c:otherwise>&nbsp;</c:otherwise></c:choose></td>
		<td><a href="${pageContext.request.contextPath}/share/update.do?id=<c:out value="${map.shares[i].id }"/>"><img src="../images/modify.png" value="<spring:message code='button.edit'/>"  /></a>
			  &nbsp;&nbsp;&nbsp;<a href="${pageContext.request.contextPath}/share/delete.do?id=<c:out value="${map.shares[i].id }"/>&map_id=<c:out value="${data.map_id }"/>"><img src="../images/delete.png" value="<spring:message code='button.delete'/>" /></a></td>
	</tr>
	</c:forEach>
</c:forEach>

</table>
</div>
</div>
</c:when>
<c:otherwise>
<p><div class="noshare_map"><spring:message code='message.share.emptysharedlist'/></div></p>
</c:otherwise>
</c:choose>

<div style="margin-top: 20px; text-align:center;">
	<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/share/add.do?map_id=${data.map_id}'; return false;"><input type="button" class="add_btn" value="<spring:message code='message.share.button.add'/>" /></a>
	<a href="#" onClick="cancelClk(); return false;"><input type="button" class="submit_btn" value="<spring:message code='button.confirm'/>" /></a>
</div>


</body>
</html>