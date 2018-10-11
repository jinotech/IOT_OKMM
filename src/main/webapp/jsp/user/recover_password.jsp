<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>Login</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.2, maximum-scale=1.2, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">

<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/mobile.css" type="text/css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/simplemodal.css" type="text/css">

<script src="${pageContext.request.contextPath}/lib/http.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript">
	function checkSubmit(frm) {
		var username = frm.username.value;
		if(!validateNotEmpty(username)) {
			alert("<spring:message code='user.new.username_not_enter'/>");
			return false;
		}

		var email = frm.email.value;
		if(!validateEmail(email)) {
			alert("<spring:message code='user.new.email_not_valid'/>");
			return false;
		}

		return true; 
	}

	function validateEmail(mail) {
		//var reg = new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]­{1}[a-z0-9]+)*[\.]{1}(com|ca|net|org|fr|us|qc.ca|gouv.qc.ca)$', 'i');
		var reg = new RegExp(/^[A-Za-z0-9]([A-Za-z0-9_-]|(\.[A-Za-z0-9]))+@[A-Za-z0-9](([A-Za-z0-9]|(-[A-Za-z0-9]))+)\.([A-Za-z]{2,6})(\.([A-Za-z]{2}))?$/);

		if(!reg.test(mail) || mail == "") {
			return false;
		} else {
			return true;
		}
	}

	function validateNotEmpty( strValue ) {
		var strTemp = strValue;

		strTemp = trimAll(strTemp);
		if(strTemp.length > 0){
			return true;
		}

		return false;
	}

	function trimAll( strValue ) {
		var objRegExp = /^(\s*)$/;

		//check for all spaces
		if(objRegExp.test(strValue)) {
			strValue = strValue.replace(objRegExp, '');

			if( strValue.length == 0)
				return strValue;
		}

		//check for leading & trailing spaces
		objRegExp = /^(\s*)([\W\w]*)(\b\s*$)/;
		if(objRegExp.test(strValue)) {
			//remove leading and trailing whitespace characters
			strValue = strValue.replace(objRegExp, '$2');
		}

		return strValue;
	}
	
	function cancel(){
		parent.$("#dialog").dialog("close");
	}
</script>
</head>
<body>

<div class="dialog_title"><spring:message code='user.recover_password'/></div>

<div style="padding-left:60px; padding-top:17px;">
<table class="user-new" width="100%" border="0" cellspacing="0" cellpadding="0">
<form id="frm_recover" action="${pageContext.request.contextPath}/user/recover.do" method="post"  onSubmit="return checkSubmit(this);">
<input type="hidden" name="confirmed" value="1" />
	<tr>
		<td class="recover-label nobody"><spring:message code='message.id'/>:</td>
		<td class="user-new-input nobody"><input type="text" class="new-input" name="username" value=""/></td>
	</tr>
	<tr>
		<td class="recover-label nobody"><spring:message code='common.email'/>:</td>
		<td class="user-new-input nobody"><input type="text" class="new-input" name="email" value=""/></td>
	</tr>
</table>
<div style="text-align:center; margin-top:20px; padding-right:20px;">
	<input type="submit" class="create_btn" style="color:#3399cc;" value="<spring:message code='common.confirm'/>" />
	<input type="button" class="create_btn" style="color:#3399cc;" value="<spring:message code='common.cancel' />" onclick="cancel();" />
</div>
</form>
</div>

</body>
</html>