<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.HashMap"%>
<%@ page import="com.okmindmap.util.PagingHelper"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="env" uri="http://www.servletsuite.com/servlets/enventry" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8">
	<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
	<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
	<META HTTP-EQUIV="Expires" CONTENT="0">
		
	<title>Group</title>
	
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin/tables.css">
	
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery.qtip-1.0.0-rc3.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
	
	<script type="text/javascript">
	
		function updateGroup(groupid) {
			document.location.href='${pageContext.request.contextPath}/group/update.do?admin=1&id='+groupid;
		}
		
		function deleteGroup(groupid) {
			
			if(confirm('그룹을 삭제 하시겠습니까?')) {
				document.location.href='${pageContext.request.contextPath}/group/delete.do?admin=1&confirmed=1&id='+groupid;				
			}			
			
		}
		
		function members(groupid) {
			document.location.href='${pageContext.request.contextPath}/group/member/list.do?id='+groupid;
		}
		
		function goPage(v_curr_page){
			//document.location.href = '${pageContext.request.contextPath}/mindmap/admin/users/group.do?page='+v_curr_page;
			var frm = document.searchf;
		    frm.page.value = v_curr_page;
		    frm.submit();
		}
		
		function goSearch(){
		    var frm = document.searchf;
		    frm.page.value = 1;
		    frm.submit();
		}
		
		function init_d(){
			
			var memberTip = null;
			
			var getMembers = function() {
				var that = this;				
				$.ajax({
					type: 'post',
					dataType: 'json',
					async: false,
					url: '${pageContext.request.contextPath}/mindmap/admin/users/group.do',
					data: {	'type': 'members',
								'groupid' : that.options.groupid
					},
					success: function(data) {
						var content = "";
						for(var i in data) {
							content += '<div>'+data[i].username+'</div>';							
						}
						if(content == "") content = "no members";
						
						that.updateContent(content);
					},
					error: function(data, status, err) {
						alert("group load error : " + status);
					}
				});
				
			}
			
			/*
			$.ajax({
				type: 'post',
				dataType: 'json',
				async: false,
				url: '${pageContext.request.contextPath}/mindmap/admin/users/group.do',
				data: {	'type': 'groups'},
				success: function(data) {
					for(var i = 0; i < data.length; i++) {
						var group = data[i];
						var container = $('<div></div>');
						var g = $('<a>'+group.name+'</a>');
						g.data('groupid', group.id);
						g.click(function(){
							 // Destroy currrent tooltip if present
							 if(memberTip && $(memberTip).data("qtip")) $(memberTip).qtip("destroy");
							 
							 memberTip = $(this).qtip({
								 content: "Loading...", // Set the tooltip content to the current corner
								 position: {
									 corner: {
										 tooltip: 'leftMiddle', // Use the corner...
										 target: 'rightMiddle' // ...and opposite corner
									}
								},
								show: {
									when: false,
									ready: true
								},
								hide: false, // Don't specify a hide event
								style: {
									border: {
										width: 5,
										radius: 10
									},
									padding: 10, 
									textAlign: 'center',
									tip: true, // Give it a speech bubble tip with automatic corner detection
									name: 'cream' // Style it according to the preset 'cream' style
								},
								groupid: $(this).data('groupid'),
								api: {
						            onRender: getMembers,
						            onHide: function(){}
						         }
							});
							 
							
						});
						
						
						container.append(g);
						
						$('#content').append(container);
					}					
				},
				error: function(data, status, err) {
					alert("group load error : " + status);
				}
			});
			*/
			
		}
		$(document).ready( init_d );
	</script>

</head>
<body>
	<div id="content">
		<div id="tiptip" style="display: none; position: absolute; padding: 10px; border: 1px solid black; background-color: white;">I'm target's hover content</div>
		
		<div class="table_box">
				<div class="table_box_title">그룹 관리</div>
				<div class="table_box_con">
				<div class="groupcounter">현재 그룹 수 : <c:out value="${data.groupcount}"/></div>
		
		<table width="100%">
			<tr>
				<th width="5%">ID</th><th width="30%">그룹명</th><th width="10%">생성자</th><th width="15%">생성일</th><th width="10%">회원수</th><th width="20%">가입정책</th><th width="10%"></th>
			</tr>
			
			<c:forEach var="group" items="${data.groups}">
			<tr>
				<td><c:out value="${group.id}"/></td>
				<td>
					<a href="#" onclick="members(<c:out value="${group.id}" />);"><c:out value="${group.name}"/></a>
				</td>
				<td><c:out value="${group.creator}"/></td>
				<td><c:out value="${group.created}"/></td>
				<td><c:out value="${group.usercount}"/></td>
				<td><c:out value="${group.policy}"/></td>
				<td>
					<a href="#" onclick="updateGroup(<c:out value="${group.id}" />);">수정</a>
					<a href="#" onclick="deleteGroup(<c:out value="${group.id}" />);">삭제</a>
				</td>
			</tr>
			</c:forEach>
			
			
		</table>
		
		<div class="pagenum" style="text-align:center; padding:10px;">
		<%
		HashMap<String, Object> data = (HashMap) request.getAttribute("data") ;
		
		out.println(PagingHelper.instance.autoPaging((Integer)data.get("groupcount"), (Integer)data.get("pagelimit"), (Integer)data.get("plPageRange"), (Integer)data.get("page")));
		%>
		</div>
		
		<div class="search"  align="center" style="text-align:center;">			
			<form method=post name="searchf"  onsubmit="goSearch()">
				<select name="searchfield" id="searchfield">
					<option value="groupname" ${data.searchfield == "groupname" ? "selected":""} >그룹명</option>
					<option value="username" ${data.searchfield == "username" ? "selected":""} >생성자</option>
				</select>
				<input type = "text" name="search" value="${data.search}">
				<input type="hidden" name="page" value="${data.page}">
				<input type="submit" value="검색">	
			</form>
		</div>
				
			</div></div>	
	</div>
</body>
</html>
