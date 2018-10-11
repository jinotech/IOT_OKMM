<%@page import="java.util.HashMap"%>
<%@page import="com.okmindmap.util.PagingHelper"%>
<%@page import="java.util.Hashtable"%>
<%@page import="java.util.List"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="okmm" uri="http://www.okmindmap.com/tags/okmindmap" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	
	<title>Maps</title>
		
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin/tables.css">
	<link href='http://api.mobilis.co.kr/webfonts/css/?fontface=NanumGothicWeb'  rel='stylesheet' type='text/css' />

	<script src="${pageContext.request.contextPath}/lib/jquery.min.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
	
	<script type="text/javascript">
		function confirmDelete(mapname, id) {
			if(confirm( "<spring:message code='jsp.list.areyousure'/>" + " [" + mapname +"]" )) {
				//document.location.href = "${pageContext.request.contextPath}/mindmap/delete.do?del_map=" + id + "&return_url=<c:url value="/mindmap/admin/maps/list.do"></c:url>";
				document.location.href = "${pageContext.request.contextPath}/mindmap/delete.do?del_map=" + id + "&return_url=" + document.location.href;
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
		
		function init_d() {
			$('a').each(function(index) {
			    if($(this).text() == "") $(this).text("_");
			});
		}
		
		$(document).ready(init_d);
	</script>

</head>
<body>

	<div class="panes"> 
		<div>
			
		<c:choose>
	
			<c:when test="${data.mapType eq 'all'}">
			<div class="table_box">
				<div class="table_box_title">전체맵</div>
				<div class="table_box_con">
				<table width="100%" class="all_table" >
					<tr height="23px" class="th_title">
						<!-- <th width="7%" class="tid">ID <a href="javascript:sortPage('id', 'true')" class="true">　</a><a href="javascript:sortPage('id', 'false')" class="false">　</a></th> -->
						<th width="40%"><spring:message code='common.title'/> <a href="javascript:sortPage('title', 'true')"class="true">　</a><a href="javascript:sortPage('title', 'false')" class="false">　</a></th>
						<th>User <a href="javascript:sortPage('usernamestring', 'true')" class="true">　</a><a href="javascript:sortPage('usernamestring', 'false')" class="false">　</a></th>
						<th>Queue <a href="javascript:sortPage('queuecount', 'true')" class="true">　</a><a href="javascript:sortPage('queuecount', 'false')" class="false">　</a></th>
						<th>Revision <a href="javascript:sortPage('revisioncnt', 'true')" class="true">　</a><a href="javascript:sortPage('revisioncnt', 'false')" class="false">　</a></th>
						<th>View <a href="javascript:sortPage('viewcount', 'true')" class="true">　</a><a href="javascript:sortPage('viewcount', 'false')" class="false">　</a></th>
						<th>Date <a href="javascript:sortPage('created', 'true')" class="true">　</a><a href="javascript:sortPage('created', 'false')" class="false">　</a></th>
						<th width="10%" class="tetc">기타</th>
					</tr>
					<c:if test="${fn:length(data.maps)<1}">
					 <tr height=28>
					 	<td colspan=8 align=center>
					 		<spring:message code='message.page.list.emptymap'/>
					 	</td>
					 </tr>
					</c:if>
				
				<%
				HashMap<String, Object> data = (HashMap) request.getAttribute("data") ;
					int startnum = ((Integer)data.get("startnum")); 
				%>
				<c:forEach var="map" items="${data.maps}">
					<tr height="26px">
						<!-- <td align="center"><%=startnum-- %></td> -->
						<td style="padding-left:2px;"><a href="${pageContext.request.contextPath}/map/<c:out value="${map.key}"></c:out>" target="_blank"><c:out value="${map.name}"></c:out></a></td>
						<!-- 사용자 이름을 표시하는 부분인데, 영문에서는 last하고 first의 위치가 변해야 되지 않을까 싶다. -->
						<td align="center"><c:out value="${map.owner.lastname}"/> <c:out value="${map.owner.firstname}"/></td>
						<td align="center"><c:out value="${map.queuecount}"/></td>
						<td align="center"><c:out value="${map.revisioncnt}"/></td>
						<td align="center"><c:out value="${map.viewcount}"/></td>
						<td align="center"><okmm:formatUnixTime value="${map.created}" pattern="yyyy-MM-dd HH:mm"/></td>
						<td align="center">
							<a href="javascript:confirmDelete('<c:out value="${map.name}"></c:out>', '<c:out value="${map.id}"></c:out>')"><spring:message code='common.delete'/></a>
							<a href="${pageContext.request.contextPath}/map/<c:out value="${map.id}"></c:out>/<c:out value="${map.name}"></c:out>.mm">다운로드</a>
						</td>
					</tr>
				</c:forEach>
			
				</table>
				</div>
		</div>
				
				<div class="pagenum" style="text-align:center;padding:10px">
				<%
				out.println(PagingHelper.instance.autoPaging((Integer)data.get("totalMaps"), (Integer)data.get("pagelimit"), (Integer)data.get("plPageRange"), (Integer)data.get("page")));
				%>
				</div>
				
				<div class="search"  align="center" style="text-align:center;">			
					<form method=post name="searchf"  onsubmit="goSearch()">
						<select name="searchfield"><option value="title" <c:if test="${searchfield=='title'}"> selected </c:if> >제목</option>
						<option name="usernamestring" <c:if test="${searchfield=='usernamestring'}"> selected </c:if>>이름</option></select>
						<input type = "text" name="search" value="${data.search}">
						<input type="hidden" name="page" value="${data.page}">
						<input type="hidden" name="sort" value="${data.sort}">
						<input type="hidden" name="isAsc" value="${data.isAsc}">
						<input type="hidden" name="mapType" value="${data.mapType}">
						<input type="submit" value="검색">	
					</form>
							
					
				</div>		
		</c:when>
		
		
		<c:when test="${ data.mapType eq 'guest'}">
		<div class="table_box">
				<div class="table_box_title">손님맵</div>
				<div class="table_box_con">
				<table width="100%">
					<tr class="th_title">
						<th width="15%" class="tid" ><spring:message code='common.map'/><a href="javascript:sortPage('title', 'true')" class="true">　</a><a href="javascript:sortPage('title', 'false')" class="false">　</a></th>
						<th width="45%">Email<a href="javascript:sortPage('email', 'true')" class="true">　</a><a href="javascript:sortPage('email', 'false')" class="false">　</a></th>
						<th>View<a href="javascript:sortPage('viewcount', 'true')" class="true">　</a><a href="javascript:sortPage('viewcount', 'false')" class="false">　</a></th>
						<th>Date<a href="javascript:sortPage('created', 'true')" class="true">　</a><a href="javascript:sortPage('created', 'false')" class="false">　</a></th>
						<c:if test="${data.user.username != 'guest'}">
						<th class="true">&nbsp;</th>
						</c:if>
						<th width="5%" class="tetc">기타</th>
					</tr>
			<c:if test="${fn:length(data.maps)<1}">
					 <tr height=28>
					 	<td colspan=6 align=center>
					 		<spring:message code='message.page.list.emptymap'/>
					 	</td>
					 </tr>
					</c:if>
				
				<c:forEach var="map" items="${data.maps}">
					<tr height="23px">
						<td align="center">
							<a href="${pageContext.request.contextPath}/map/<c:out value="${map.key}"></c:out>" <c:if test="${ (map.owner.email == null) && (map.owner.password == null)}">target="_parent"</c:if>><c:out value="${map.name}"></c:out></a></td>
						<td style="padding-left:2px;"><c:out value="${map.owner.email}" /></td>
						<td align="center"><c:out value="${map.viewcount}"/></td>
						<td align="center"><c:out value="${map.created}"/></td>
						<c:if test="${data.user.username != 'guest'}">
						<td align="center"><a href="${pageContext.request.contextPath}/mindmap/mine.do?id=<c:out value="${map.id}" />">This is mine.</a></td>
						<td align="center"><a href="javascript:confirmDelete('<c:out value="${map.name}"></c:out>', '<c:out value="${map.id}"></c:out>')"><spring:message code='common.delete'/></a></td>
						</c:if>
					</tr>
				</c:forEach>
			
				</table>
				</div>
				</div>
				<div class="pagenum" align="center" style="text-align:center;padding:10px">
				<%
				HashMap<String, Object> data = (HashMap) request.getAttribute("data") ;
				out.println(PagingHelper.instance.autoPaging((Integer)data.get("totalMaps"), (Integer)data.get("pagelimit"), (Integer)data.get("plPageRange"), (Integer)data.get("page")));
				%>
				</div>
				<div class="search" align="center" style="text-align:center;">			
					<form method=post name="searchf"  onsubmit="goSearch()">
						<select name="searchfield"><option value="title">제목</option><option name="username">이름</option></select><input type = "text" name="search" value="${data.search}">
						<input type="hidden" name="page" value="${data.page}">
						<input type="hidden" name="sort" value="${data.sort}">
						<input type="hidden" name="isAsc" value="${data.isAsc}">
						<input type="hidden" name="mapType" value="${data.mapType}">
						<input type="submit" value="검색">	
					</form>			
					
					
					
				</div>	
			</c:when>
			
			
			
		<c:when test="${data.mapType eq 'shares'}">
		<div class="table_box">
				<div class="table_box_title">공유맵</div>
				<div class="table_box_con">
			<table width="100%" style="border-collapse:collapse">
					<tr height="23px">
						<th rowspan="2" class="tid"><spring:message code='common.map'/></th>
						<th colspan="3"><spring:message code='common.share'/></th>
						<th rowspan="2"><spring:message code='common.owner'/></th>
						<th rowspan="2" width="5%" class="tetc">기타</th>
					</tr>
					<tr  class="th_title">
						<th><spring:message code='message.share.type'/>Type</th>
						<th><spring:message code='message.share.permission'/>Permission</th>
						<th><spring:message code='message.share.group'/>Group</th>
					</tr>
			<c:if test="${fn:length(data.maps)<1}">
					 <tr height=28>
					 	<td colspan=8 align=center>
					 		<spring:message code='message.page.list.emptymap'/>
					 	</td>
					 </tr>
					</c:if>
				
				<c:forEach var="share" items="${data.maps}">
					<tr height="23px;"> 
						<td><a href="${pageContext.request.contextPath}/map/<c:out value="${share.map.key}"/>?sid=<c:out value="${share.id }"/>" <c:if test="${ share.shareType.shortName ne 'password'}">target="_parent"</c:if>><c:out value="${share.map.name}"></c:out></a></td>
						<td><c:out value="${ share.shareType.name}"></c:out></td>
						<td><c:forEach var="permission" items="${share.permissions}"><c:if test="${permission.permited}" ><c:out value="${permission.permissionType.name}"/>&nbsp;</c:if></c:forEach></td>
						<td><c:choose><c:when test="${ share.shareType.shortName eq 'group'}"><c:out value="${ share.group.name}"></c:out></c:when><c:otherwise>&nbsp;</c:otherwise></c:choose></td>
						<td><a href="mailto:<c:out value="${share.map.user.email}"></c:out>"><c:out value="${share.map.user.lastname}"></c:out> <c:out value="${share.map.user.firstname}"></c:out></a></td>
						<td align="center"><a href="javascript:confirmDelete('<c:out value="${share.map.name}"></c:out>', '<c:out value="${share.map.id}"></c:out>')"><spring:message code='common.delete'/></a></td>
					</tr>
				</c:forEach>
			
				</table>
				</div>
				</div>
				
				<div class="pagenum" align="center" style="text-align:center;padding:10px">
				<%
				HashMap<String, Object> data = (HashMap) request.getAttribute("data") ;
				out.println(PagingHelper.instance.autoPaging((Integer)data.get("totalMaps"), (Integer)data.get("pagelimit"), (Integer)data.get("plPageRange"), (Integer)data.get("page")));
				%>
				</div>
				<div class="search"  align="center" style="text-align:center;">			
					<form method=post name="searchf"  onsubmit="goSearch()">
						<select name="searchfield"><option value="title">제목</option><option name="username">이름</option></select><input type = "text" name="search" value="${data.search}">
						<input type="hidden" name="page" value="${data.page}">
						<input type="hidden" name="sort" value="${data.sort}">
						<input type="hidden" name="isAsc" value="${data.isAsc}">
						<input type="hidden" name="mapType" value="${data.mapType}">
						<input type="submit" value="검색">	
					</form>			

				</div>	
				
			</c:when>
			
		</c:choose>
		
		</div>  
	</div> 

</body>
</html>
