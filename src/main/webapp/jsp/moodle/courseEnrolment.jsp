<%@page import="com.sun.accessibility.internal.resources.accessibility"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.okmindmap.configuration.Configuration"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="env" uri="http://www.servletsuite.com/servlets/enventry" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
<meta name="apple-mobile-web-app-capable" content="yes">

<title>Course enrolment</title>

<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/opentab.css" type="text/css" media="screen">

<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/jquery-ui.min.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/slimScroll.min.js" type="text/javascript" charset="utf-8"></script>


<script type="text/javascript">
function goSearch(page){
    var frm = document.searchf;
    frm.page.value = (page == undefined ? 0 : Math.max(0,page));
    frm.submit();
}

function doAction(action, userid){
	var frm = document.enrolAction;
    frm.action.value = action;
    frm.userid.value = userid;
    frm.submit();
}
</script>

<style>
	/* active tab uses a id name ${data.tabType}. its highlight is also done by moving the background image. */
	ul.tabs a#${data.tabType}, ul.tabs a#${data.tabType}:hover, ul.tabs li#${data.tabType} a {
	background-position: -420px -62px;
	cursor:default !important;
	color:#000 !important;
	}

	.search{
		text-align:right;
		margin-bottom:5px;
	}
	.pagenum{
		padding-top:10px; padding-bottom:10px;
	}

	th a {
		color:#ffffff;
	}
	.btn-success {
		background-color: rgb(23, 183, 13) !important;
	}
	table tr td {
		border-bottom: 1px solid #5cc4c8;
	}
</style>

</head>
<body>
<div id="waitingDialog"></div>
<c:if test="${data.message eq ''}">
	<div>${data.total_enrolled_users} enrolled users</div>
	<div class="openmapwrap">
		<ul class="tabs">
			<li><a id="okmmusers" href="${pageContext.request.contextPath}/moodle/courseEnrolment.do?mapid=${data.mapId}&tabtype=okmmusers">OKMM users</a></li>
			<li><a id="moodleusers" href="${pageContext.request.contextPath}/moodle/courseEnrolment.do?mapid=${data.mapId}&tabtype=moodleusers">Moodle users</a></li>
		</ul>
	
		<div class="panes">
			<div class="search">
				<form method="post" name="searchf" accept-charset="UTF-8" onsubmit="goSearch()">
					<input type="text" name="search" class="group_search_input" value="${data.search}">
					<input type="hidden" name="mapid" value="${data.mapId}">
					<input type="hidden" name="tabType" value="${data.tabType}">
					<input type="hidden" name="page">
					<input type="submit" class="search_btn" value="<spring:message code='common.search'/>">
				</form>
			</div>
			
			<table width="540" cellspacing="0" cellpadding="5">
				<tr>
					<th>Fullname</th>
					<th>Email</th>
					<th style="min-width: 180px;"></th>
				</tr>
			
				<c:if test="${fn:length(data.users)<1}">
					<tr height=28>
						<td colspan="3" align="center">
							<spring:message code='message.page.list.emptymap'/>
						</td>
					</tr>
				</c:if>
				<c:forEach var="user" items="${data.users}">
					<c:if test="${user.is_enrolled eq '1' && user.is_teacher eq '1'}">
					<tr>
						<td><c:out value="${user.firstname}"/> <c:out value="${user.lastname}"/></td>
						<td><c:out value="${user.email}"/></td>
						<td>
							<input type="button" value="Unenrol" onclick="doAction('unenrol', ${user.id})">
							<input type="button" value="Unset Teacher" onclick="doAction('unassign_teacher', ${user.id})">
						</td>
					</tr>
					</c:if>
				</c:forEach>
				
				<c:forEach var="user" items="${data.users}">
					<c:if test="${user.is_enrolled eq '1' && user.is_teacher eq '0'}">
					<tr>
						<td><c:out value="${user.firstname}"/> <c:out value="${user.lastname}"/></td>
						<td><c:out value="${user.email}"/></td>
						<td>
							<input type="button" value="Unenrol" onclick="doAction('unenrol', ${user.id})">
							<input type="button" value="Set Teacher" class="btn-success" onclick="doAction('assign_teacher', ${user.id})">
						</td>
					</tr>
					</c:if>
				</c:forEach>
				
				<c:forEach var="user" items="${data.users}">
					<c:if test="${user.is_enrolled eq '0'}">
					<tr>
						<td><c:out value="${user.firstname}"/> <c:out value="${user.lastname}"/></td>
						<td><c:out value="${user.email}"/></td>
						<td>
							<input type="button" value="Enrol" class="btn-success"  onclick="doAction('enrol', ${user.id})">
						</td>
					</tr>
					</c:if>
				</c:forEach>
			</table>
			<div class="pagenum" style="text-align:center;">
				<input type="button" value="Prev" onclick="goSearch(${data.page - 1})" />
				<input type="button" value="Next" onclick="goSearch(${data.page + 1})" />
			</div>
			
		</div>
	
	</div>
	
	<form method=post name="enrolAction" style="display: none;" accept-charset="UTF-8">
		<input type ="hidden" name="search" value="${data.search}">
		<input type="hidden" name="mapid" value="${data.mapId}">
		<input type="hidden" name="tabType" value="${data.tabType}">
		<input type="hidden" name="page" value="${data.page}">
		
		<input type="hidden" name="action">
		<input type="hidden" name="userid">
	</form>
	
</c:if>
	
<c:if test="${data.message ne ''}">
	<h3>${data.message}</h3>
</c:if>

</body>
</html>