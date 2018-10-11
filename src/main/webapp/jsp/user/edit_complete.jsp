<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>사용자 정보 수정</title>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
<script type="text/javascript">
	function confirmEdit() {
		window.parent.location.reload();
	}
</script>

</head>
<body>

<div class="dialog_title"><spring:message code='user.edit_information' /></div>

<div style="text-align:center; margin-top:100px">
	<spring:message code='user.edit_ok' />
</div>

<div style="margin-top: 20px;" align="center">
	<a href="#" onClick="javascript:confirmEdit()"><input type="button" class="submit_btn" value="<spring:message code='button.confirm' />" /></a>
</div>

</body>
</html>