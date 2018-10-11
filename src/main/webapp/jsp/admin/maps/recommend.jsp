<%@page import="java.util.HashMap"%>
<%@page import="com.okmindmap.util.PagingHelper"%>
<%@page import="java.util.Hashtable"%>
<%@page import="java.util.List"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="okmm" uri="http://www.okmindmap.com/tags/okmindmap" %>
<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	
	<title>Maps</title>
		
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin/tables.css">
	<link href='http://api.mobilis.co.kr/webfonts/css/?fontface=NanumGothicWeb'  rel='stylesheet' type='text/css' />
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/jquery-ui/jquery-ui.custom.css" type="text/css" media="screen">
	
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery-ui.min.js" type="text/javascript" charset="utf-8"></script>
	
	<script type="text/javascript">
		function confirmDelete(mapname, id) {
			if(confirm( "<spring:message code='jsp.list.recommend.delete'/>" + " [" + mapname +"]" )) {
				document.location.href = "${pageContext.request.contextPath}/mindmap/admin/maps/recommend.do?type=del&del_map=" + id + "&return_url=" + document.location.href;
			}
			
			
		}
		
		function confirmAdd(mapname, id) {
			/* if(confirm( "<spring:message code='jsp.list.recommend.add'/>" + " [" + mapname +"]" )) { */
			
			var url = "${pageContext.request.contextPath}/mindmap/admin/maps/recommend.do?type=add&add_map=" + id + "&return_url=" + document.location.href;
						
			var txt = '<form id="imageform" class="dialog_content" action="'+url+'" method="post" enctype="multipart/form-data"><input type="file" name="imagefile"></form>';
			
			$("#dialog").append(txt);
			 
			$("#dialog").dialog({
				autoOpen:false,
				closeOnEscape: true,	//esc키로 창을 닫는다.
				modal:true,		//modal 창으로 설정
				resizable:false,	//사이즈 변경
				close: function( event, ui ) {
				  	$("#dialog .dialog_content").remove();
					$("#dialog").dialog("destroy");
				},
		    });
			$("#dialog").dialog("option", "width", "auto" );
			$("#dialog").dialog( "option", "buttons", [{
				text: "<spring:message code="image.image_upload"/>",
				click : function() {
					$('#imageform').submit();
				}
			}]);
			$("#dialog").dialog( "option", "dialogClass", "createEmbedTag" );		  
			$("#dialog").dialog( "option", "title", "<spring:message code="menu.edit.imageurl"/>" );
			$("#dialog").dialog("open"); 
			/* document.location.href = "${pageContext.request.contextPath}/mindmap/admin/maps/recommend.do?type=add&add_map=" + id + "&return_url=" + document.location.href; */
			/* } */
		}
		
		function goPage(v_curr_page){
		    var frm = document.searchf;
		    frm.page.value = v_curr_page;
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
		<div class="table_box">
				<div class="table_box_title">추천맵</div>
				<div class="table_box_con">
				<table width="100%" class="all_table" >
					<tr height="23px" class="th_title">
						<!-- <th width="7%" class="tid">ID <a href="javascript:sortPage('id', 'true')" class="true">　</a><a href="javascript:sortPage('id', 'false')" class="false">　</a></th> -->
						<th width="40%"><spring:message code='common.title'/></th>
						<th>User </th>
						<th>Queue</th>
						<th>Recommend Point</th>
						<th>View Count</th>
						<th>Date</th>
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
						<td align="center"><c:out value="${map.recommend_point}"/></td>
						<td align="center"><c:out value="${map.viewcount}"/></td>
						<td align="center"><okmm:formatUnixTime value="${map.created}" pattern="yyyy-MM-dd HH:mm"/></td>
						<td align="center">
							<a href="javascript:confirmDelete('<c:out value="${map.name}"></c:out>', '<c:out value="${map.id}"></c:out>')">삭제</a>
							<a href="javascript:confirmAdd('<c:out value="${map.name}"></c:out>', '<c:out value="${map.id}"></c:out>')">이동</a>
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
						<input type="hidden" name="mapType" value="${data.mapType}">
						<input type="submit" value="검색">	
					</form>
							
					
				</div>	
				<div id="dialog"></div>
		</div>  
	</div> 
</body>
</html>