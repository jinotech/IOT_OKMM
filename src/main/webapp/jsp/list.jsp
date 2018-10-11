<%@ page import="java.util.Locale" %>
<%@ page import="org.springframework.web.servlet.support.RequestContextUtils" %>

<%@page import="com.okmindmap.util.PagingHelper"%>
<%@page import="java.util.HashMap"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<%
Locale locale = RequestContextUtils.getLocale(request);
request.setAttribute("locale", locale);
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/opentab.css" type="text/css" media="screen">

<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/jquery-ui.min.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/slimScroll.min.js" type="text/javascript" charset="utf-8"></script>

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
		margin-bottom:5px;
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

function mapOfMap() {
	var frm = document.getElementById("mapofmap");
	frm.submit();
}

function list_init() {
	// 시간포멧 변경
	var created = $('.created');
	for(var i =0; i < created.length; i++) {
		var c = created[i];
		var date = new Date(parseInt(c.innerHTML));
		var format = "";
		<c:choose>
		<c:when test="${locale.language eq 'ko'}">
			format = date.format("yyyy-MM-dd");//date.getFullYear() + "-" + (date.getMonth() + 1).zf(2) + "-" + date.getDate().zf(2); 
		</c:when>
		<c:otherwise>
			format = date.format("dd-MM-yyyy");//date.getDate().zf(2) + "-" + (date.getMonth() + 1).zf(2) + "-" + date.getFullYear(); 
		</c:otherwise>
	</c:choose>
		c.innerHTML = format;
	}
}

Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
 
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

$(document).ready( list_init );

$(function(){
$('.content').slimScroll({
	start: 'top'
}).css({marginRight: '10px' });

});
</script>
</head>
<body>
<div class="openmapwrap">
		<!-- the tabs -->
	<ul class="tabs">
		<c:if test="${data.user.username ne 'guest'}">
		<li><a id="user" href="${pageContext.request.contextPath}/mindmap/list.do?maptype=user"><spring:message code='message.openmap.usermaps'/></a></li>
		<li><a id="myshares" href="${pageContext.request.contextPath}/mindmap/list.do?maptype=myshares"><spring:message code='message.groupmaps'/></a></li>
		</c:if>
		<li><a id="public" href="${pageContext.request.contextPath}/mindmap/list.do?maptype=public&sharetype=1"><spring:message code='message.openmap.publicmaps'/></a></li>


		<!-- <li><a href="#" class="current">user</a></li> -->

	</ul>

	<!-- tab "panes" -->
	<div class="panes">
<!--  <div class="content">-->
		<c:choose>

			<c:when test="${data.mapType eq 'user'}">
			<!-- 나의 맵 -->
				<div  style = "float:left; text-weight:bold"><a href="#" onclick="mapOfMap()"><input type="button" value="<spring:message code='common.mapofmap'/>"/></a></div>
				<div class="search">
					<form method=post name="searchf" onsubmit="goSearch()">
						<select name="searchfield">
							<option value="title"><spring:message code='common.title'/></option>
						</select><input type = "text" name="search" class="group_search_input" value="${data.search}">
						<input type="hidden" name="page" value="${data.page}">
						<input type="hidden" name="sort" value="${data.sort}">
						<input type="hidden" name="isAsc" value="${data.isAsc}">
						<input type="hidden" name="mapType" value="${data.mapType}">
						<input type="submit" class="search_btn" value="<spring:message code='common.search'/>">
					</form>
					
				</div>
				<form name="deleteForm" action ="${pageContext.request.contextPath}/mindmap/delete.do">
				<input type = "hidden" name ="return_url" value ='<c:url value="/mindmap/list.do"></c:url>'>
				<table width="540" cellspacing="0" cellpadding="5">
					<tr>
						<th><spring:message code='board.list.number'/></th>
						<th width=350><spring:message code='common.title'/><a href="javascript:sortPage('title', 'true')" class="titletrue"  style="color:#3399cc;">△ </a><a href="javascript:sortPage('title', 'false')" class="titlefalse"  style="color:#3399cc;">▽</a></th>
						<th><spring:message code='common.viewcount.shortname'/><a href="javascript:sortPage('viewcount', 'true')" class="viewcounttrue"  style="color:#3399cc;">△</a><a href="javascript:sortPage('viewcount', 'false')" class="viewcountfalse"  style="color:#3399cc;">▽</a></th>
						<th><spring:message code='common.createdate'/><a href="javascript:sortPage('created', 'true')" class="createdtrue" style="color:#3399cc;">△</a><a href="javascript:sortPage('created', 'false')" class="createdfalse" style="color:#3399cc;">▽</a></th>

					</tr>
					
				<!-- 데이터가 없으면 이 문구를 표시한다. -->
				<c:if test="${fn:length(data.maps)<1}">
					 <tr height=28>
					 	<td colspan=4 align=center>
					 		<spring:message code='message.page.list.emptymap'/>
					 	</td>
					 </tr>
				</c:if>
				<c:forEach var="map" items="${data.maps}" end="${data.startnum}" step="1"  varStatus="loop"	>
					<tr>
						<td align=center><c:out value="${loop.end - loop.index}"/></td>
						<td><a href="${pageContext.request.contextPath}/map/<c:out value="${map.key}"></c:out>" target="_parent" title="<c:out value="${map.name}" />"><c:choose><c:when test="${fn:length(map.name) > 30}"><c:out value="${fn:substring(map.name, 0, 28)}" />...</c:when><c:otherwise><c:out value="${map.name}"></c:out></c:otherwise></c:choose></a></td>
						<td align=center><c:out value="${map.viewcount}"/></td>
						<td class="created" align=center><c:out value="${map.created}"/></td>
					<!-- 	<td align="center"><a href="javascript:confirmDelete('<c:out value="${map.name}"></c:out>', '<c:out value="${map.id}"></c:out>')"><spring:message code='common.delete'/></a></td> -->
					</tr>
				</c:forEach>

				</table>
				</form>
				
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
				<div class="search">
						<select name="searchfield"><option value="title" <c:if test="${data.searchfield eq 'title'}">selected</c:if>><spring:message code='common.title'/></option><option value="usernamestring" <c:if test="${data.searchfield eq 'usernamestring'}">selected</c:if>><spring:message code='common.name'/></option></select><input type = "text" name="search" class="group_search_input" value="${data.search}">
						<input type="hidden" name="page" value="${data.page}">
						<input type="hidden" name="sort" value="${data.sort}">
						<input type="hidden" name="isAsc" value="${data.isAsc}">
						<input type="hidden" name="mapType" value="${data.mapType}">
						<input type="submit" class="search_btn" value="<spring:message code='common.search'/>">
				</div>
				</form>
				
				<table class="openmap" width="540" cellspacing="0" cellpadding="5">
					<tr>
						<th width=147><spring:message code='common.map'/><a href="javascript:sortPage('title', 'true')" class="titletrue" style="color:#3399cc;">△</a><a href="javascript:sortPage('title', 'false')" class="titlefalse" style="color:#3399cc;">▽</a></th>
						<th><spring:message code='common.owner'/><a href="javascript:sortPage('usernamestring', 'true')" class="usernamestringtrue" style="color:#3399cc;">△</a><a href="javascript:sortPage('usernamestring', 'false')" class="usernamestringfalse" style="color:#3399cc;">▽</a></th>
						<th><spring:message code='common.viewcount.shortname'/><a href="javascript:sortPage('viewcount', 'true')" class="viewcounttrue"  style="color:#3399cc;">△</a><a href="javascript:sortPage('viewcount', 'false')" class="viewcountfalse" style="color:#3399cc;">▽</a></th>
						<th><spring:message code='common.createdate'/><a href="javascript:sortPage('created', 'true')" class="createdtrue" style="color:#3399cc;">△</a><a href="javascript:sortPage('created', 'false')" class="createdfalse" style="color:#3399cc;">▽</a></th>
					</tr>
				<c:if test="${fn:length(data.maps)<1}">
					 <tr height=28>
					 	<td colspan=4 align=center>
					 		<spring:message code='message.page.list.emptymap'/>"
					 	</td>
					 </tr>
				</c:if>
				<c:forEach var="map" items="${data.maps}">
					<c:set var="fullname" value="${map.owner.lastname} ${map.owner.firstname}" />
					<tr>
						<td class="middleimg">
							<a href="${pageContext.request.contextPath}/map/<c:out value="${map.key}"></c:out>" title="<c:out value="${map.name}"></c:out>" target="_parent">
								<c:choose>
									<c:when test="${fn:length(map.name) > 10}">
									
										<c:out value="${fn:substring(map.name, 0,10)}" />...
									</c:when>
									<c:otherwise>
										<c:out value="${map.name}"></c:out>
									</c:otherwise>
								</c:choose>
							</a> &nbsp; 
							<c:if test="${map.sharetype ne '1'}"><img src="${pageContext.request.contextPath}/images/icons/lock.gif" ></c:if>
						</td>
						<td align=center>
							<c:choose>
								<c:when test="${fn:length(fullname) > 10}">
									<span title="<c:out value="${fullname}"/>"><c:out value="${fn:substring(fullname, 0, 7)}" />...</span>
								</c:when>
								<c:otherwise>
									<c:out value="${fullname}"/>
								</c:otherwise>
							</c:choose>
						</td>
						<td align=center><c:out value="${map.viewcount}"/></td>
						<td class="created" align=center><c:out value="${map.created}"/></td>
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
						<select name="searchfield"><option value="title"><spring:message code='common.title'/></option></select><input type = "text" name="search" class="group_search_input" value="${data.search}">
						<input type="hidden" name="page" value="${data.page}">
						<input type="hidden" name="sort" value="${data.sort}">
						<input type="hidden" name="isAsc" value="${data.isAsc}">
						<input type="hidden" name="mapType" value="${data.mapType}">
						<input type="submit" class="search_btn" value="<spring:message code='common.search'/>">
					</form>
				</div>
				
				<table width="540" cellspacing="0" cellpadding="5">
					<tr>
						<th rowspan="2" width=250><spring:message code='common.map'/></th>
						<th colspan="2" width=130><spring:message code='common.share'/></th>
						<th rowspan="2" width=100><spring:message code='common.owner'/></th>
					</tr>
					<tr>
						
						<th><spring:message code='message.share.permission'/></th>
						<th><spring:message code='message.share.group'/></th>
					</tr>
					<c:if test="${fn:length(data.maps)<1}">
					 <tr height=28>
					 	<td colspan=4 align=center>
					 		<spring:message code='message.page.list.emptymap'/>
					 	</td>
					 </tr>
					</c:if>

				<c:forEach var="share" items="${data.maps}">
					<c:set var="fullname" value="${share.map.user.lastname} ${share.map.user.firstname}" />
					<tr>
						<td><a href="${pageContext.request.contextPath}/map/<c:out value="${share.map.key}"/>?sid=<c:out value="${share.id }"/>" <c:if test="${ share.shareType.shortName ne 'password'}">target="_parent"</c:if> title="<c:out value="${share.map.name}" />"><c:choose><c:when test="${fn:length(share.map.name) > 24}"><c:out value="${fn:substring(share.map.name, 0, 20)}" />...</c:when><c:otherwise><c:out value="${share.map.name}"></c:out></c:otherwise></c:choose></a></td>
						
						<td align=center><c:forEach var="permission" items="${share.permissions}"><c:if test="${permission.permited}" ><c:out value="${permission.permissionType.name}"/>&nbsp;</c:if></c:forEach></td>
						<td align=center><c:choose><c:when test="${fn:length(share.group.name) > 10}"><span title="<c:out value="${share.group.name}"/>"><c:out value="${fn:substring(share.group.name, 0, 8)}" />...</span></c:when><c:otherwise><c:out value="${share.group.name}"/></c:otherwise></c:choose></td>
						<td align=center><a href="mailto:<c:out value="${share.map.user.email}"></c:out>"><c:choose><c:when test="${fn:length(fullname) > 10}"><span title="<c:out value="${fullname}"/>"><c:out value="${fn:substring(fullname, 0, 8)}" />...</span></c:when><c:otherwise><c:out value="${fullname}"/></c:otherwise></c:choose></a>
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
			</div>
			</c:when>

		</c:choose>

		</div>
	<!--  </div>-->

</div><!-- div style -->

	<div>
		<form id="mapofmap" action="${pageContext.request.contextPath}/mindmap/mapofmap.do" method="post" target="_parent">
		</form>
	</div>

</body>
</html>