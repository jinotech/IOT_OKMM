<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><spring:message code='user.membershipwithrawal' /></title>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
<script type="text/javascript">
	function confirmDelete() {
		window.parent.location.href = "${pageContext.request.contextPath}/";
		
		parent.$("#dialog").dialog("close");
	}
</script>

</head>
<body>

<div class="dropout">
	<h3 class="h_dropout"><spring:message code='user.membershipwithrawal.completed' /></h3>

	<div style="margin-top: 20px;" align="center">
		<a href="#" onClick="javascript:confirmDelete()"><input type="button" class="submit_btn" value="<spring:message code='button.confirm' />" /></a>
	</div>
</div>

</body>
</html>