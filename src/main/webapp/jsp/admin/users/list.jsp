<%@page import="java.util.HashMap"%>
<%@page import="com.okmindmap.util.PagingHelper"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="env" uri="http://www.servletsuite.com/servlets/enventry" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		
	<title>Users</title>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin/tables.css">
	<link href='http://api.mobilis.co.kr/webfonts/css/?fontface=NanumGothicWeb'  rel='stylesheet' type='text/css' />
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/simplemodal.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
	
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery.simplemodal.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>

	<script type="text/javascript">
		function confirmDelete(mapname, id) {
			if(confirm( "<spring:message code='jsp.list.areyousure'/>" + " [" + mapname +"]" )) {
				document.location.href = "${pageContext.request.contextPath}/mindmap/delete.do?id=" + id + "&return_url=<c:url value="/mindmap/admin/maps/list.do"></c:url>";
			}
		}
		
		function goPage(v_curr_page){
		    var frm = document.searchf;
		    frm.page.value = v_curr_page;
		    frm.submit();
		}
		
		function sortPage(csort, cisAsc){
		    var frm = document.searchf;
		    frm.sort.value = csort;
		    frm.isAsc.value = cisAsc;
		    frm.submit();
		}
		
		function goSearch(){
		    var frm = document.searchf;
		    frm.page.value = 1;
		    frm.submit();
		}
		
		var editProfile = function(userid) {
			$.modal('<iframe src="${pageContext.request.contextPath}/user/update.do?userid='+userid+'" frameborder="0" allowtransparency="true" width="390"  height="290" scrolling="no"></iframe>', {
					overlayId: 'okm-overlay',
					containerId: 'editProfile-container',
					dataId: 'editProfile-data'});
		}
	</script>

</head>
<body>

	<div class="panes"> 
		<div>
			<%
				HashMap<String, Object> data = (HashMap) request.getAttribute("data") ;
				int startnum = ((Integer)data.get("startnum")); 
			%>
			<div class="table_box">
				<div class="table_box_title">사용자 조회</div>
				<div class="table_box_con">
				<table width="100%">
					<tr class="th_title">
						<th class="tno">번호</th>
						<th class="tid"><a href="javascript:sortPage('username', '${!data.isAsc}')" style="color:#333">아이디</a> <a href="javascript:sortPage('username', 'true')"  class="true">　</a><a href="javascript:sortPage('username', 'false')"  class="false">　</a></th>
						<th><a href="javascript:sortPage('usernamestring', '${!data.isAsc}')" style="color:#333">이름</a> <a href="javascript:sortPage('usernamestring', 'true')" class="true">　</a><a href="javascript:sortPage('usernamestring', 'false')" class="false">　</a></th>
						<th><a href="javascript:sortPage('rolename', '${!data.isAsc}')" style="color:#333">등급</a> <a href="javascript:sortPage('rolename', 'true')"  class="true">　</a><a href="javascript:sortPage('rolename', 'false')" class="false">　</a></th>
						<th><a href="javascript:sortPage('maptotalcnt', '${!data.isAsc}')" style="color:#333">맵</a> <a href="javascript:sortPage('maptotalcnt', 'true')"  class="true">　</a><a href="javascript:sortPage('maptotalcnt', 'false')" class="false">　</a></th>
						<th class="tetc">이메일</th>
					</tr>
			
				<c:forEach var="user" items="${data.users}">
					<tr>
						<td><%=startnum-- %></td>
						<td align="center"><c:out value="${user.username}"/></td>
						<td align="center"><a onclick="editProfile(<c:out value="${user.id}"/>);"><c:out value="${user.lastname}"/><c:out value="${user.firstname}"/></a></td>
						<td align="center"><c:out value="${user.roleName}"/></td>
						<td align="center"><c:out value="${user.maptotalcnt}"/></td>
						<td align="center"><c:out value="${user.email}"/></td>
						
					</tr>
				</c:forEach>
			
				</table>
				</div>
				</div>
				<div align="center" ><a href="${pageContext.request.contextPath}/mindmap/admin/users/download.do" class="excel_down" >Excel 다운로드</a></div>
				
				<div class="pagenum" style="text-align:center; padding:10px;">
				<%
				out.println(PagingHelper.instance.autoPaging((Integer)data.get("usertotalcnt"), (Integer)data.get("pagelimit"), (Integer)data.get("plPageRange"), (Integer)data.get("page")));
				%>
				</div>
				<div class="search" align="center">			
					<form method=post name="searchf"  onsubmit="goSearch()">
						<select name="searchfield">
						<option value="usernamestring">이름</option>
						<option value="username"<c:if test="${data.searchfield == 'username'}"> selected</c:if>>아이디</option>
						</select>
						<input type = "text" name="search" value="${data.search}">
						<input type="hidden" name="page" value="${data.page}">
						<input type="hidden" name="sort" value="${data.sort}">
						<input type="hidden" name="isAsc" value="${data.isAsc}">
						<input type="submit" value="검색">
					</form>			
					
					
					
				</div>
				
	
		</div>  
	</div> 

</body>
</html>
