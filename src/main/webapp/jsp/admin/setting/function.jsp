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
		
	<title>Group</title>
	
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin/tables.css">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin/admin.css">
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
	
	<script type="text/javascript">
	
		var retGuestMap = false;
		var retMaxMap = false;
		var retMoodleUrl = false;
		var retMoodleSecret = false;
		var retMoodleCourseCreatorGroup = false;
	
		function setGuestMap(el) {
			var checked = ($(el).is(':checked'))?1:0;
			retGuestMap = false;
			
			$.ajax({
				type: 'post',
				dataType: 'json',
				async: false,
				url: '${pageContext.request.contextPath}/mindmap/admin/setting/function.do',
				data: {	'func': 'set',
							'key': 'guest_map_allow',
							'value': checked
				},
				success: function(data) {
					retGuestMap = true;
					//console.log(data)
				},
				error: function(data, status, err) {
					alert("setGuestMap error : " + status);
				}
			});
		}
		
		function setMaxMap() {
			var maxmap = $('#setting_max_map').val();
			retMaxMap = false;
			
			$.ajax({
				type: 'post',
				dataType: 'json',
				async: false,
				url: '${pageContext.request.contextPath}/mindmap/admin/setting/function.do',
				data: {	'func': 'set',
							'key': 'create_max_map',
							'value': maxmap
				},
				success: function(data) {
					retMaxMap = true;
					//console.log(data)
				},
				error: function(data, status, err) {
					alert("setGuestMap error : " + status);
				}
			});
		}
		
		function setMoodleUrl() {
			var moodle_url = $('#setting_moodle_url').val();
			retMoodleUrl = false;
			
			$.ajax({
				type: 'post',
				dataType: 'json',
				async: false,
				url: '${pageContext.request.contextPath}/mindmap/admin/setting/function.do',
				data: {	'func': 'set',
							'key': 'moodle_url',
							'value': moodle_url
				},
				success: function(data) {
					retMoodleUrl = true;
					//console.log(data)
				},
				error: function(data, status, err) {
					alert("setMoodleUrl error : " + status);
				}
			});
		}
		
		function setMoodleSecret() {
			var moodle_secret = $('#setting_moodle_secret').val();
			retMoodleSecret = false;
			
			$.ajax({
				type: 'post',
				dataType: 'json',
				async: false,
				url: '${pageContext.request.contextPath}/mindmap/admin/setting/function.do',
				data: {	'func': 'set',
							'key': 'moodle_secret',
							'value': moodle_secret
				},
				success: function(data) {
					retMoodleSecret = true;
					//console.log(data)
				},
				error: function(data, status, err) {
					alert("setMoodleSecret error : " + status);
				}
			});
		}
		
		function setMoodleCourseCreatorGroup() {
			var moodle_course_creator_group = $('#setting_moodle_course_creator_group').val();
			retMoodleCourseCreatorGroup = false;
			
			$.ajax({
				type: 'post',
				dataType: 'json',
				async: false,
				url: '${pageContext.request.contextPath}/mindmap/admin/setting/function.do',
				data: {	'func': 'set',
							'key': 'moodle_course_creator_group',
							'value': moodle_course_creator_group
				},
				success: function(data) {
					retMoodleCourseCreatorGroup = true;
					//console.log(data)
				},
				error: function(data, status, err) {
					alert("setMoodleCourseCreatorGroup error : " + status);
				}
			});
		}
		
		function apply() {
			setGuestMap();
			setMaxMap();
			setMoodleUrl();
			setMoodleSecret();
			setMoodleCourseCreatorGroup()
			
			if(retMaxMap && retMaxMap && retMoodleUrl && retMoodleSecret && retMoodleCourseCreatorGroup) {
				alert("적용 되었습니다.");
			}
		}
		
		function init_d(){
			
		}
		$(document).ready( init_d );
	</script>

</head>
<body>
<div class="table_box">
	<div class="table_box_title">기능설정</div>
	<div class="table_box_con">
	<div id="content">
	
	
	<table width="100%">
	<tr>
		<th width="50%">기능</th><th width="50%">설정값</th>
	</tr>
	<tr>
		<td>손님맵 생성 허용</td>
		<td><input type="checkbox" id="setting_guestmap" name="setting_guestmap" <c:if test="${data.guest_map_allow == 1}">checked</c:if>/></td>
	</tr>
	<tr>
		<td>맵 갯수 제한</td>
		<td><input type="text" id="setting_max_map" name="setting_max_map" value="<c:out value="${data.create_max_map}"/>"/></td>
	</tr>
	<tr>
		<td>Moodle URL</td>
		<td><input type="text" id="setting_moodle_url" name="setting_moodle_url" value="<c:out value="${data.moodle_url}"/>"/></td>
	</tr>
	<tr>
		<td>Moodle secret</td>
		<td><input type="text" id="setting_moodle_secret" name="setting_moodle_secret" value="<c:out value="${data.moodle_secret}"/>"/></td>
	</tr>
	<tr>
		<td>Moodle course creator group ID</td>
		<td><input type="number" min="0" id="setting_moodle_course_creator_group" name="setting_moodle_course_creator_group" value="<c:out value="${data.moodle_course_creator_group}"/>"/></td>
	</tr>
	</table>
	
	<div align="center" class="center_btn">
		<button onclick="apply();">적용</button>
	</div>
	
	</div>
	
	</div>
	</div>
</body>
</html>
