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
	
		function backup() {
			document.location.href = "${pageContext.request.contextPath}/mindmap/admin/setting/backup.do?func=backup";
		}
	
		function init_d(){
			
		}
		$(document).ready( init_d );
	</script>

</head>
<body>
<div class="table_box">
	<div class="table_box_title">백업/복구</div>
	<div class="table_box_con">
	
	<div id="content">
		<button onclick="backup();">백업</button>
		
		
		
		
		<form id="frm_confirm" action="${pageContext.request.contextPath}/mindmap/admin/setting/backup.do?func=restore" method="post" enctype="multipart/form-data">
			<input type="file" name="file"/>
			<input type="submit" value="submit" />
		</form>
		
		
	</div>
	
	</div>
	</div>
</body>
</html>
