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
	<title><spring:message code='message.group.title'/></title>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/opentab.css" type="text/css" media="screen">
	<style type="text/css">
	/* active tab uses a id name ${data.groupType}. its highlight is also done by moving the background image. */
	ul.tabs a#${data.groupType}, ul.tabs a#${data.groupType}:hover, ul.tabs li#${data.groupType} a {
	background-position: -420px -62px;
	cursor:default !important;
	color:#000 !important;
	}
	</style>
	 
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
				width: '100%',
				  height: '210px'
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
<div style="margin:5px auto 0">
<ul class="tabs">
		<c:if test="${data.user.username ne 'guest'}">
		<li><a id="user" href="${pageContext.request.contextPath}/group/list.do?grouptype=user"><spring:message code='message.group.mygroup'/></a></li>
		<li><a id="myshares" href="${pageContext.request.contextPath}/group/list.do?grouptype=myshares"><spring:message code='message.group.joined'/></a></li>
		
		<!-- <li><a id="public" href="${pageContext.request.contextPath}/group/list.do?grouptype=public"><spring:message code='message.openmap.publicmaps'/></a></li> -->
		</c:if>

		<!-- <li><a href="#" class="current">user</a></li> -->

	</ul>
	
<!-- tab "panes" -->
	<div class="panes">

		<c:choose>

			<c:when test="${data.groupType eq 'user'}">
				<b><spring:message code='message.group.mygroup'/></b>
				
				<c:choose>
				<c:when test="${data.myGroups != null and fn:length(data.myGroups) > 0}">
				<div class="content" style="margin-top:10px;">
				<table cellspacing="0" cellpadding="5" style="width:450px;">
					<tr>
						<th style="width:300px;"><spring:message code='message.group.name'/></th>
						<th style="width:80px;"><spring:message code='common.policy'/></th>
						<th>&nbsp;</th>
					</tr>
					
				<c:forEach var="group" items="${data.myGroups}">
					<tr>
						<td><c:forEach begin="1" end="${group.category.depth - 1}">&nbsp;</c:forEach><a href="${pageContext.request.contextPath}/group/member/list.do?id=<c:out value="${group.id}"></c:out>"><c:out value="${group.name}"></c:out></a></td>
						<td align="center"><c:out value="${group.policy.name}"></c:out></td>	
						<td>
							<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/group/update.do?id=<c:out value="${group.id}"></c:out>';"><img src="../images/modify.png" value="<spring:message code='common.edit'/>" /></a>
							<c:if test="${group.category.leaf}"><a href="${pageContext.request.contextPath}/group/delete.do?id=<c:out value="${group.id}"></c:out>"><img src="../images/delete.png" value="<spring:message code='button.delete'/>" /></a></c:if>
						</td>
					</tr>
					
				</c:forEach>
				
				</table>
				</div>
				</c:when>
				<c:otherwise>
				<p><spring:message code='message.group.emptyjoined'/></p>
				</c:otherwise>
				</c:choose>

</div>
			
<div class="pagenum" style="text-align:center;padding-top:7px;">
				<%
				HashMap<String, Object> data = (HashMap) request.getAttribute("data") ;
				
				out.println(PagingHelper.instance.autoPaging((Integer)data.get("totalGroups"), (Integer)data.get("pagelimit"), (Integer)data.get("plPageRange"), (Integer)data.get("page")));
				%>
				</div>
					
				<div style="margin-top: 10px; text-align:center; margin-bottom:10px;">

				<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/group/new.do';"><input type="button" class="group_btn" value="<spring:message code='message.group.new'/>" /></a>
				</div>
				
				
			</c:when>
			<c:when test="${ data.groupType eq 'public'}">
			</c:when>
			
			<c:when test="${ data.groupType eq 'myshares'}">
				
				
				
				<b><spring:message code='message.group.joined'/></b>
				<c:choose>
				<c:when test="${data.joinGroups != null and fn:length(data.joinGroups) > 0}">
				<div class="content" style="margin-top:10px;">
				<table cellspacing="0" cellpadding="5" style="width:450px;">
					<tr>
						<th style="width:300px;"><spring:message code='message.group.name'/></th>
						<th style="width:80px;"><spring:message code='common.status'/></th>
						<th></th>
					</tr>
				
				<c:forEach var="group" items="${data.joinGroups}">
					<tr>
						<td><c:out value="${group.name}"></c:out></td>
						<td style="text-align:center;"><c:out value="${group.memberStatus.name}"></c:out></td>
						<td><a href="${pageContext.request.contextPath}/group/quit.do?groupid=<c:out value="${group.id}"></c:out>">
						<img src="../images/delete.png" value="<spring:message code='message.group.dropout'/>" /></a></td>
					</tr>
				</c:forEach>
				
				</table>
				</div><!-- content -->
				</c:when>
				<c:otherwise>
				<p><spring:message code='message.group.emptyjoined'/></p>
				</c:otherwise>
				</c:choose>
		</div>		
</div>

<div class="pagenum" style="text-align:center;padding-top:7px;">
				<%
				HashMap<String, Object> data = (HashMap) request.getAttribute("data") ;
				
				out.println(PagingHelper.instance.autoPaging((Integer)data.get("totalGroups"), (Integer)data.get("pagelimit"), (Integer)data.get("plPageRange"), (Integer)data.get("page")));
				%>
				</div>
				
				<div style="margin-top: 5px; text-align:center; margin-bottom:10px;">
				<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/group/join.do';"><input type="button" class="check_btn" value="<spring:message code='message.group.join'/>" /></a>
				</div>
				
			</c:when>

		</c:choose>
	
<form method=post name="searchf" onsubmit="goSearch()">
	<div class="search" align="center">
		<select name="searchfield" id="searchfield">
			<option value="groupname" ${data.searchfield == "groupname" ? "selected":""} ><spring:message code='message.group.name'/></option>
		</select><input type = "text" name="search" class="group_search_input" value="${data.search}">
	
		<input type="hidden" name="page" value="${data.page}">
		<input type="hidden" name="sort" value="${data.sort}">
		<input type="hidden" name="isAsc" value="${data.isAsc}">
		
		<input type="submit" class="search_btn" value="<spring:message code='common.search'/>">
	</div>
</form>

</body>
</html>