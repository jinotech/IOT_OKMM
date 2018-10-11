<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
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
		
	<title>Manager</title>
	
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin/tables.css">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin/admin.css">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/simplemodal.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/impromptu.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
	
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery.simplemodal.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery-impromptu.4.0.4.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
	
	<script type="text/javascript">
		function editProfile(userid) {		
			$.modal('<iframe src="${pageContext.request.contextPath}/user/update.do?userid='+userid+'" frameborder="0" allowtransparency="true" width="390"  height="290" scrolling="no"></iframe>', {
					overlayId: 'okm-overlay',
					containerId: 'editProfile-container',
					dataId: 'editProfile-data'});
		}
		
		function addAdmin() {
			var s1html = '<div class="dialog_title">Admin 추가</div>' +
				'<div class="dialog_content">' +
				'<br />' +
				'아이디 검색 :&nbsp;&nbsp;' +
				'<input type="text" id="username" name="username" value="" />' +
				'<br />' +
				'</div>';
			var s2html = '<div class="dialog_title">Admin 확인</div>' +
				'<div class="dialog_content">' +				
				'</div>';
			var s3html = '<div class="dialog_title">Admin 완료</div>' +
				'<div class="dialog_content">' +				
				'</div>';
			
			function callbackform_usersearch(e,v,m,f){
				if (v) {
					$.ajax({
						type: 'post',
						dataType: 'json',
						async: false,
						url: '${pageContext.request.contextPath}/mindmap/admin/setting/adminManager.do',
						data: {'func': 'search',
									'username': f.username
									},
						success: function(data, textStatus, jqXHR) {
							if(data.length > 0) {
								var $nextState = $.prompt.getStateContent('state1');
								var $content = $nextState.find('.dialog_content');
								
								for(var i = 0; i < data.length; i++) {
									$content.append('<input type="checkbox" id="user'+i+'" name="user'+i+'" value="'+data[i].userid+'" />'+data[i].username+'<br>');
								}

								$.prompt.goToState('state1');
							} else {
								var $nextState = $.prompt.getStateContent('state0');
								$nextState.find('.dialog_content').prepend('<div>사용자를 찾을수 없습니다.</div>');
							}
						},
						error: function(data, status, err) {
							alert("adminadd error: " + status);
						}
					});
				}
				return false;
			}
			
			function callbackform_selecte(e,v,m,f){
				if (v) {
					for(var u in f) {
						if(u == 'username') continue;
						
						$.ajax({
							type: 'post',
							async: false,
							url: '${pageContext.request.contextPath}/mindmap/admin/setting/adminManager.do',
							data: {'func': 'authadmin',
										'userid': f[u],
										'auth': 1
										},
							success: function(data, textStatus, jqXHR) {
							},
							error: function(data, status, err) {
								alert("adminadd error: " + status);
							}
						});
					}
					$.prompt.goToState('state2');
				}
				return false;
			}
			
			var states = {
					state0: {
						html: s1html,
						persistent : false,
						focusTarget : 'username',
						top : '30%',
						prefix:'okm',
						buttons: { '다음': true, '취소': false },
						submit: callbackform_usersearch
					},
					state1: {
						html: s2html,
						persistent : false,						
						top : '30%',
						prefix:'okm',
						buttons: { '다음': true, '취소': false },
						submit: callbackform_selecte
					},
					state2: {
						html: s3html,
						persistent : false,
						top : '30%',
						prefix:'okm',
						buttons: { '완료': true },						
						submit: function (e,v,m,f){
							if(v) {
								$.prompt.close();
								document.location.reload();
							}
						}
					},
			};

			$.prompt(states);
			
		}
		
		function kickAdmin(userid) {
			$.ajax({
				type: 'post',
				async: false,
				url: '${pageContext.request.contextPath}/mindmap/admin/setting/adminManager.do',
				data: {'func': 'authadmin',
							'userid': userid,
							'auth': 0
							},
				success: function(data, textStatus, jqXHR) {
					document.location.reload();
				},
				error: function(data, status, err) {
					alert("adminadd error: " + status);
				}
			});
		}
		
		function init_d(){
			
		}
		$(document).ready( init_d );
	</script>

</head>
<body>
<div class="table_box">
	<div class="table_box_title">관리자 정보관리</div>
	<div class="table_box_con">
	
	<div id="content">
	<div class="cur_map">관리자 수 : <c:out value="${data.adminCount}"/></div>
	
	<table width="100%">
		<tr>
			<th width="25%">아이디</th><th width="25%">이름</th><th width="25%">이메일</th><th width="25%">권한</th>
		</tr>
		
		<tr>
			<td><c:out value="${data.superuser.username}"/></td>
			<td><a onclick="editProfile(<c:out value="${data.superuser.id}"/>);"><c:out value="${data.superuser.lastname}"/><c:out value="${data.superuser.firstname}"/></a></td>
			<td><c:out value="${data.superuser.email}"/></td>
			<td></td>
		</tr>
		<tr>
			<td><c:out value="${data.adminme.username}"/></td>
			<td><a onclick="editProfile(<c:out value="${data.adminme.id}"/>);"><c:out value="${data.adminme.lastname}"/><c:out value="${data.adminme.firstname}"/></a></td>
			<td><c:out value="${data.adminme.email}"/></td>
			<td></td>
		</tr>
		
		<c:forEach var="admin" items="${data.admins}">
		<tr>
			<td><c:out value="${admin.username}"/></td>
			<td><a onclick="editProfile(<c:out value="${admin.id}"/>);"><c:out value="${admin.lastname}"/><c:out value="${admin.firstname}"/></a></td>
			<td><c:out value="${admin.email}"/></td>
			<td><a href="#" onclick="kickAdmin(<c:out value="${admin.id}"/>);">권한 삭제</a></td>
		</tr>
		</c:forEach>
		
	</table>
	
		<div align="center" class="center_btn"><button onclick="addAdmin();">추가</button></div>
	
	</div>
	
	</div>
	</div>
</body>
</html>
