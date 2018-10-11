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
		
	<title>User Add</title>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin/admin.css">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin/tables.css">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/impromptu.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
		
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery-impromptu.3.1.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery.form.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
	
	<script type="text/javascript">
		var addUser = function() {
			
			var txt = '<div class="dialog_title">사용자 추가</div>' +
				'<div class="dialog_content">' +
				'<br />' +
				'아이디 :&nbsp;&nbsp;' +
				'<input type="text" id="username" name="username" value="" />' +
				'<br />' +
				'성 :&nbsp;&nbsp;'+
				'<input type="text" id="lastname" name="lastname" value="" />' +
				'<br />' +
				'이름 :&nbsp;&nbsp;'+
				'<input type="text" id="firstname" name="firstname" value="" />' +
				'<br />' +
				'이메일 :&nbsp;&nbsp;'+
				'<input type="text" id="email" name="email" value="" />' +
				'<br />' +
				'비밀번호 :&nbsp;&nbsp;'+
				'<input type="text" id="password" name="password" value="" />' +
				'</div>';
			
			function callbackform_adduser(v,m,f){
				if (v) {
					$.ajax({
						type: 'post',
						async: false,
						url: '${pageContext.request.contextPath}/mindmap/admin/users/useradd.do',
						data: {'adduser': '1',
									'username': f.username,
									'email': f.email,
									'firstname': f.firstname,
									'lastname': f.lastname,
									'password': f.password
									},
						success: function(data, textStatus, jqXHR) {
							if(jqXHR.responseText != "") {
								try {
									var user = JSON.parse(jqXHR.responseText);
									$.prompt.getStateContent('state1').find('.jqimessage').append(
											'<div class="dialog_title">사용자 추가 완료</div>' +
											'<div class="dialog_content">' +
											user[0].username +
											'</div>'
									);
									$.prompt.goToState('state1');
								} catch(e) {
									$.prompt.getStateContent('state2').find('.jqimessage').append(
											'<div class="dialog_title">사용자 추가 오류</div>' +
											'<div class="dialog_content">' +
											jqXHR.responseText +
											'</div>'
									);
									$.prompt.goToState('state2');
								}								
							}
						},
						error: function(data, status, err) {
							alert("useradd error: " + status);
						}
					});
				}
				return false;
			}
			
			
			var states = {
					state0: {
						html:txt,
						persistent : false,
						focusTarget : 'username',
						top : '30%',
						prefix:'okm',
						buttons: { '추가': true, '취소': false },						
						submit: callbackform_adduser
					},
					state1: {
						//html:'사용자 추가 완료',
						persistent : false,						
						top : '30%',
						prefix:'okm',
						buttons: { '완료': true },						
						submit: function (v,m,f){
							if(v) $.prompt.close();
						}
					},
					state2: {
						//html:'오류',
						persistent : false,
						top : '30%',
						prefix:'okm',
						buttons: { '닫기': true },						
						submit: function (v,m,f){
							if(v) $.prompt.close();
						}
					},
			};

			$.prompt(states);
			
		}
		
		function compileUser(data) {			
			var userdata = data.split(',');			
			var username = (userdata[0] == null || userdata[0] == "")? "" : "&username="+userdata[0]; 
			var lastname = (userdata[1] == null || userdata[1] == "")? "" : "&lastname="+userdata[1];
			var firstname = (userdata[2] == null || userdata[2] == "")? "" : "&firstname="+userdata[2];
			var email = (userdata[3] == null || userdata[3] == "")? "" : "&email="+userdata[3];
			
			$.ajax({
				type: 'post',
				async: false,
				url: '${pageContext.request.contextPath}/mindmap/admin/users/useradd.do?adduser=1' +
						username + lastname + firstname + email,				
				success: function(data, textStatus, jqXHR) {
					if(jqXHR.responseText != "") {
						try {
							var user = JSON.parse(jqXHR.responseText);
							$('#user-ret').append('<div>'+userdata[0]+' : 성공'+'</div>');
						} catch(e) {
							$('#user-ret').append('<div>'+userdata[0]+' : 실패 - '+jqXHR.responseText+'</div>');
						}								
					}
				},
				error: function(data, status, err) {					
				}
			});
		}
	
		function init_d(){
			
			$('#frm_usersadd').ajaxForm({
			    beforeSend: function() {
			    },
			    success: function(response, status, xhr) {
			    	var dbs = response.split('\n');
			    	for(var i=0; i < dbs.length; i++) {
			    		compileUser(dbs[i]);
			    	}
			    },
				complete: function(xhr) {					
				}
			});
			
			$('#frm_adduser').ajaxForm({
			    beforeSend: function() {
			    },
			    success: function(response, status, xhr) {
			    	try {
			    		var data = JSON.parse(response);
			    		alert("추가 완료");
			    	} catch(e) {
			    		alert("error : " + response);
			    	}
			    	
			    },
				complete: function(xhr) {					
				}
			});
			
		}
		$(document).ready( init_d );
	</script>

</head>
<body>
	<div id="content">
		<div class="adduser">
			<div class="table_box_title">개인사용자</div>
			
			<div class="table_box_con">
			
			<br>			
			<form id="frm_adduser" name="frm_adduser" action="${pageContext.request.contextPath}/mindmap/admin/users/useradd.do" method="post">
				<input type="hidden" id="adduser" name="adduser" value="1" />
				<table class="useraddtable">
				<tr>
					<td class="r1" align="right">아이디</td>
					<td><input type="text" id="username" name="username" value="" /></td>
				</tr>
				<tr>
					<td align="right" class="r1">성</td>
					<td><input type="text" id="lastname" name="lastname" value="" /></td>
				</tr>
				<tr>
					<td align="right" class="r1">이름</td>
					<td><input type="text" id="firstname" name="firstname" value="" /></td>
				</tr>
				<tr>
					<td align="right" class="r1">이메일</td>
					<td><input type="text" id="email" name="email" value="" /></td>
				</tr>
				<tr>
					<td align="right" class="r1">비밀번호</td>
					<td><input type="text" id="password" name="password" value="" /></td>
				</tr>
				</table>
				<div class="addbtndiv"><input type="submit" value="추가"></div>
			</form>			
			<br>
			
			</div>
			
		</div>		
		<br>
		<br>
		<div class="adduser">
			<div class="table_box_title">일괄 사용자 추가</div>
			<div class="table_box_con">
			
			<br>
			<div id='frm_content'>
				<a href="${pageContext.request.contextPath}/useradds_example.txt">예제파일</a>
				<br>
				<br>
				<form id="frm_usersadd" name="frm_usersadd" action="${pageContext.request.contextPath}/mindmap/admin/users/importUser.do" method="post" enctype="multipart/form-data">
					<input type="hidden" name="confirm" value="1"/>
		        	<input type="file" name="file"><br>
		        	<input type="submit" value="Upload File to Server">
		    	</form>
			</div>
			<div id="user-ret">
			</div>
			<br>
			
			</div>
		</div>
	</div>
</body>
</html>
