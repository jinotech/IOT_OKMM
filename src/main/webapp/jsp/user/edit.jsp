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
<title><spring:message code='user.edit_information' /></title>

<script type="text/javascript">
	function cancel(){
		parent.$("#dialog").dialog("close");
	}
	
	function leave() {
		parent.$("#dialog").dialog( "option", "title", "<spring:message code='user.membershipwithrawal' />" );
		parent.$("#dialog iframe").attr("src", "${pageContext.request.contextPath}/user/delete.do");
	}
	
// 	function updateFacebook() {		
// 		FacebookService.onLoginCompleted(function(r, FB) {
// 			FB.api('/me', function(response) {
// 				var frm = document.getElementById("frm-user-update");
// 				frm.facebook.value = response.id;
				
// 				document.getElementById("facebook-update").innerHTML = "Updated!";
// 			});
// 		});
// 		FacebookService.facebookLogin();
// 	} 
</script>

</head>
<body>

<div class="editprofile">
<c:if test = "${user.auth == 'manual'}">
<form  id="frm-user-update" action="${pageContext.request.contextPath}/user/update.do?userid=<c:out value="${user.id}"></c:out>" method="post">
<input type="hidden" name="confirmed" value="1" />
<!-- 
<input type="hidden" name="facebook" value="" />

<div style="margin-bottom:10px; margin-right:30px; text-align:right;">
	<a href="#" onclick="javascript:updateFacebook();" class="sb small text min facebook" id="facebook-update">Link my Facebook account</a>
</div>
 -->
	<table class="user-new" border="0" cellpadding="0" border="0" cellspacing="0">
		<tr>
			<td class="user-new-label nobody"><spring:message code='message.id'/>:</td>
			<td class="user-new-input nobody"><c:out value="${user.username}"></c:out></td>
		</tr>
		<tr>
			<td class="user-new-label nobody"><spring:message code='common.email' />:</td>
			<td class="user-new-input nobody"><input type="text" class="new-input" name="email" value="<c:out value="${user.email}"></c:out>" /></td>
		</tr>
		<tr>
			<td class="user-new-label nobody"><spring:message code='common.name.last' />:</td>
			<td class="user-new-input nobody"><input type="text" class="new-input" name="lastname" value="<c:out value="${user.lastname}"></c:out>" /></td>
		</tr>
		<tr>
			<td class="user-new-label nobody"><spring:message code='common.name.first' />:</td>
			<td class="user-new-input nobody"><input type="text" class="new-input" name="firstname" value="<c:out value="${user.firstname}"></c:out>" /></td>
		</tr>
		<tr>
			<td class="user-new-label nobody"><spring:message code='common.password' />:</td>
			<td class="user-new-input nobody"><input type="password" class="new-input" name="password" value="" /></td>
		</tr>
		<tr>
			<td class="user-new-label nobody"><spring:message code='common.password.confirm' />:</td>
			<td class="user-new-input nobody"><input type="password" class="new-input" name="password1" value="" /></td>
		</tr>
	</table>
<div style="margin-top:20px; text-align:center; padding-right:30px;">
	<input type="submit" value="<spring:message code='button.apply' />" class="create_btn"  />
	<input type="button" value="<spring:message code='user.membershipwithrawal'/>" class="delete_btn" onclick="javascript:leave();" />
</div>
</div>
</form>
</c:if>

<c:if test = "${user.auth != 'manual'}">
	<table class="user-new" border="0" cellpadding="0" border="0" cellspacing="0">
		<tr>
			<td class="user-new-label nobody"><spring:message code='message.id'/>:</td>
			<td class="user-new-input nobody">******</td>
		</tr>
		<tr>
			<td class="user-new-label nobody"><spring:message code='common.email' />:</td>
			<td class="user-new-input nobody"><input type="text" class="new-input" disabled value="<c:out value="${user.email}"></c:out>" /></td>
		</tr>
		<tr>
			<td class="user-new-label nobody"><spring:message code='common.name.last' />:</td>
			<td class="user-new-input nobody"><input type="text" class="new-input" disabled value="<c:out value="${user.lastname}"></c:out>" /></td>
		</tr>
		<tr>
			<td class="user-new-label nobody"><spring:message code='common.name.first' />:</td>
			<td class="user-new-input nobody"><input type="text" class="new-input" disabled value="<c:out value="${user.firstname}"></c:out>" /></td>
		</tr>
	</table>
</c:if>

</body>
</html>