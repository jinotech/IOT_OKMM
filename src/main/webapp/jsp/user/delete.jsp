<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/simplemodal.css" type="text/css">
<title><spring:message code='user.membershipwithrawal' /></title>

<script type="text/javascript">
	function cancel(){
		parent.$("#dialog").dialog("close");
	}
</script>

</head>
<body>

<div class="dropout">
<h3 class="h_dropout"><spring:message code='user.membershipwithrawal.profiledeleted' /></h3>
<h3 class="h_dropout"><spring:message code='user.membershipwithrawal.mapsremain' /></h3>
<h3 class="h_dropout"><spring:message code='user.membershipwithrawal.mapcantrestoredeleted' /></h3>

<form  id="frm-user-update" action="${pageContext.request.contextPath}/user/delete.do" method="post">
	<div class="dropout_agree_area">
		<input type="checkbox" id="dropoutAgree" name="confirmed" value="1">
		<label for="dropoutAgree"><spring:message code='user.membershipwithrawal.readandagrees' /></label>
		<br/>
		<spring:message code='common.password' />&nbsp;&nbsp;
		<input type="password" class="new-input" id="password" name="password" value="" />
	</div>
	<c:if test="${data.error != ''}">
	<p class="dropout_error">* <c:out value="${data.error}"/></p>
	</c:if>
	<div style="margin-top:20px; text-align:center; padding-right:30px;">
		<input type="submit" value="<spring:message code='user.membershipwithrawal' />" class="create_btn"  />
	</div>
</form>
</div>

</body>
</html>