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
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/opentab.css" type="text/css" media="screen">
<title><spring:message code='message.openmap'/></title>

<style type="text/css">
	/* active tab uses a id name ${data.mapType}. its highlight is also done by moving the background image. */
	ul.tabs a#${data.mapType}, ul.tabs a#${data.mapType}:hover, ul.tabs li#${data.mapType} a {
	background-position: -420px -62px;
	cursor:default !important;
	color:#000 !important;
	}

	.search{
		text-align:right;
	}
	.pagenum{
		padding-top:10px; padding-bottom:10px;
	}

	th a {
		color:#ffffff;
	}
	 .<c:out value="${data.sort}"/><c:out value="${data.isAsc}"/>{
		color:yellow; font-weight:bold; font-size:1.2em;
	}
</style>

<script type="text/javascript">
function confirmDelete() {
	if(confirm( "<spring:message code='jsp.list.areyousure'/>" )) {
		//action  =
			//submit
		document.deleteForm.submit();
	//	document.location.href = "${pageContext.request.contextPath}/mindmap/delete.do?id=" + id + "&return_url=<c:url value="/mindmap/list.do"></c:url>";
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

function checkAll(){
   cBox = document.deleteForm.del_map;
   if(cBox.length) {  // 여러 개일 경우
       for(var i = 0; i<cBox.length;i++) {
           cBox[i].checked = document.deleteForm.allcheckbox.checked;
       }
   } else { // 한 개일 경우
       cBox.checked = document.deleteForm.allcheckbox;
   }
}

</script>

</head>
<body>

		<!-- the tabs -->
	<ul class="tabs">
		<c:if test="${data.user.username ne 'guest'}">
		<li><a id="user" href="${pageContext.request.contextPath}/mindmap/list.do?maptype=user"><spring:message code='message.openmap.usermaps'/></a></li>
		<li><a id="myshares" href="${pageContext.request.contextPath}/mindmap/list.do?maptype=myshares"><spring:message code='message.openmap.shares'/></a></li>
		</c:if>
		<li><a id="public" href="${pageContext.request.contextPath}/mindmap/list.do?maptype=public"><spring:message code='message.openmap.publicmaps'/></a></li>


		<!-- <li><a href="#" class="current">user</a></li> -->

	</ul>

	<!-- tab "panes" -->
	<div class="panes">
		<div>

		<c:choose>

			<c:when test="${data.mapType eq 'user'}">
				<div  style = "float:left; text-weight:bold"><a href="${pageContext.request.contextPath}/mindmap/mapofmap.do" target="_parent"><spring:message code='common.mapofmap'/></a></div>
				<div class="search">
					<form method=post name="searchf" onsubmit="goSearch()">
						<select name="searchfield"><option value="title"><spring:message code='common.title'/></option></select><input type = "text" name="search" value="${data.search}">
						<input type="hidden" name="page" value="${data.page}">
						<input type="hidden" name="sort" value="${data.sort}">
						<input type="hidden" name="isAsc" value="${data.isAsc}">
						<input type="hidden" name="mapType" value="${data.mapType}">
						<input type="submit" value="<spring:message code='common.search'/>">
					</form>



				</div>
				<form name="deleteForm" action ="${pageContext.request.contextPath}/mindmap/delete.do">
				<input type = "hidden" name ="return_url" value ='<c:url value="/mindmap/list.do"></c:url>'>
				<table width="100%" cellspacing="0" cellpadding="5" border="1">
					<tr>
						<th width=30><input type="checkbox" name="allcheckbox" onclick ="checkAll()"></th>
						<th><spring:message code='common.title'/><a href="javascript:sortPage('title', 'true')" class="titletrue">△ </a><a href="javascript:sortPage('title', 'false')" class="titlefalse">▽</a></th>
						<th width=30>View<a href="javascript:sortPage('viewcount', 'true')" class="viewcounttrue">△</a><a href="javascript:sortPage('viewcount', 'false')" class="viewcountfalse">▽</a></th>
						<th width=100>Date<a href="javascript:sortPage('created', 'true')" class="createdtrue">△</a><a href="javascript:sortPage('created', 'false')" class="createdfalse">▽</a></th>

					</tr>
					
				<!-- 데이터가 없으면 이 문구를 표시한다. -->
				<c:if test="${fn:length(data.maps)<1}">
					 <tr height=28>
					 	<td colspan=4 align=center>
					 		No maps yet. Add one!</a>
					 	</td>
					 </tr>
				</c:if>
				<c:forEach var="map" items="${data.maps}">
					<tr>
						<td><input type="checkbox" name="del_map" value="<c:out value="${map.id}"/>"></td>
						<td><a href="${pageContext.request.contextPath}/map/<c:out value="${map.key}"></c:out>" target="_parent"><c:out value="${map.name}"></c:out></a></td>
						<td><c:out value="${map.viewcount}"/></td>
						<td><c:out value="${map.created}"/></td>
					<!-- 	<td align="center"><a href="javascript:confirmDelete('<c:out value="${map.name}"></c:out>', '<c:out value="${map.id}"></c:out>')"><spring:message code='common.delete'/></a></td> -->
					</tr>
				</c:forEach>

				</table>
				</form>
				
				<div><input type="button" value="DELETE" onclick="confirmDelete();"></div>
				<div class="pagenum" style="text-align:center;">
				<%
				HashMap<String, Object> data = (HashMap) request.getAttribute("data");
				out.println(PagingHelper.instance.autoPaging((Integer)data.get("totalMaps"), (Integer)data.get("pagelimit"), (Integer)data.get("plPageRange"), (Integer)data.get("page")));
				%>
				</div>
			</c:when>

			

			
			
	
			
			<c:when test="${ data.mapType eq 'public'}">
					<!-- 전체 공개 맵 -->
					<form method=post name="searchf" onsubmit="goSearch()">
				<div style="float:right"><input onClick="goSearch()" type="checkbox" name="sharetype" id ="sharetype" value="1" <c:if test="${ data.sharetype eq '1'}">checked</c:if> /> <label for ="sharetype">Include Password Maps</label></div>
				<div class="search" style="clear:both">
					
						<select name="searchfield"><option value="title"><spring:message code='common.title'/></option><option name="email">email</option></select><input type = "text" name="search" value="${data.search}">
						<input type="hidden" name="page" value="${data.page}">
						<input type="hidden" name="sort" value="${data.sort}">
						<input type="hidden" name="isAsc" value="${data.isAsc}">
						<input type="hidden" name="mapType" value="${data.mapType}">
						<input type="submit" value="<spring:message code='common.search'/>">
				</div>
				</form>
				
				<table width="100%" cellspacing="0" cellpadding="5" border="1">
					<tr>
						<th><spring:message code='common.map'/><a href="javascript:sortPage('title', 'true')" class="titletrue">△</a><a href="javascript:sortPage('title', 'false')" class="titlefalse">▽</a></th>
						<th>User<a href="javascript:sortPage('email', 'true')" class="emailtrue">△</a><a href="javascript:sortPage('email', 'false')" class="emailfalse">▽</a></th>
						<th width=30>View<a href="javascript:sortPage('viewcount', 'true')" class="viewcounttrue">△</a><a href="javascript:sortPage('viewcount', 'false')" class="viewcountfalse">▽</a></th>
						<th width=100>Date<a href="javascript:sortPage('created', 'true')" class="createdtrue">△</a><a href="javascript:sortPage('created', 'false')" class="createdfalse">▽</a></th>
					</tr>
				<c:if test="${fn:length(data.maps)<1}">
					 <tr height=28>
					 	<td colspan=4 align=center>
					 		No maps yet. Add one!</a>
					 	</td>
					 </tr>
				</c:if>
				<c:forEach var="map" items="${data.maps}">
					<tr height=28>
						
						<td valign=bottom><a href="${pageContext.request.contextPath}/map/<c:out value="${map.key}"></c:out>" target="_parent"><c:out value="${map.name}"></c:out></a> &nbsp; <c:if test="${map.sharetype eq '2'}"><img src="${pageContext.request.contextPath}/images/icons/lock.gif" ></c:if>
							</td>
						<td><c:out value="${map.owner.lastname}"/> <c:out value="${map.owner.firstname}"/></td>
						<td><c:out value="${map.viewcount}"/></td>

						
						<td><c:out value="${map.created}"/></td>
						
					</tr>
				</c:forEach>

				</table>
				<div class="pagenum" style="text-align:center;">
				<%
				HashMap<String, Object> data = (HashMap) request.getAttribute("data") ;
				out.println(PagingHelper.instance.autoPaging((Integer)data.get("totalMaps"), (Integer)data.get("pagelimit"), (Integer)data.get("plPageRange"), (Integer)data.get("page")));
				%>
				</div>
				
			</c:when>
			
			
			
			<c:when test="${ data.mapType eq 'myshares'}">
			<!-- 나에게 공유된 맵 -->
				<div class="search">
					<form method=post name="searchf" onsubmit="goSearch()">
						<select name="searchfield"><option value="title"><spring:message code='common.title'/></option></select><input type = "text" name="search" value="${data.search}">
						<input type="hidden" name="page" value="${data.page}">
						<input type="hidden" name="sort" value="${data.sort}">
						<input type="hidden" name="isAsc" value="${data.isAsc}">
						<input type="hidden" name="mapType" value="${data.mapType}">
						<input type="submit" value="<spring:message code='common.search'/>">
					</form>



				</div>
				<table width="100%" cellspacing="0" cellpadding="5" border="1">
					<tr>
						<th rowspan="2"><spring:message code='common.map'/></th>
						<th colspan="2"><spring:message code='common.share'/></th>
						<th rowspan="2"><spring:message code='common.owner'/></th>
					</tr>
					<tr>
						
						<th><spring:message code='message.share.permission'/>Permission</th>
						<th><spring:message code='message.share.group'/>Group</th>
					</tr>
					<c:if test="${fn:length(data.maps)<1}">
					 <tr height=28>
					 	<td colspan=4 align=center>
					 		No maps yet. Add one!</a>
					 	</td>
					 </tr>
				</c:if>

				<c:forEach var="share" items="${data.maps}">
					<tr>
						<td><a href="${pageContext.request.contextPath}/map/<c:out value="${share.map.key}"/>?sid=<c:out value="${share.id }"/>" <c:if test="${ share.shareType.shortName ne 'password'}">target="_parent"</c:if>><c:out value="${share.map.name}"></c:out></a></td>
						
						<td><c:forEach var="permission" items="${share.permissions}"><c:if test="${permission.permited}" ><c:out value="${permission.permissionType.name}"/>&nbsp;</c:if></c:forEach></td>
						<td><c:out value="${ share.group.name}"></c:out></td>
						<td><a href="mailto:<c:out value="${share.map.user.email}"></c:out>"><c:out value="${share.map.user.lastname}"></c:out> <c:out value="${share.map.user.firstname}"></c:out></a>
						</td>
					</tr>
				</c:forEach>

				</table>

				<div class="pagenum" style="text-align:center;">
				<%
				HashMap<String, Object> data = (HashMap) request.getAttribute("data") ;
				out.println(PagingHelper.instance.autoPaging((Integer)data.get("totalMaps"), (Integer)data.get("pagelimit"), (Integer)data.get("plPageRange"), (Integer)data.get("page")));
				%>


				</div>
				

			</c:when>

		</c:choose>

		</div>
	</div>


</body>
</html>