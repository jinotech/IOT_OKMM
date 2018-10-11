<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title><spring:message code='message.group.update.title'/></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
<script type="text/javascript">
	function setPolicy(policy) {
		var password = document.getElementById("group_password");
		if( policy == "password" ) {
			password.style.display = '';
		} else {
			password.style.display = 'none';
		}
	}

	function initPolicy() {
		var frm = document.getElementById("frm_group");
		var policy = frm.policy.options[frm.policy.selectedIndex].value;
		setPolicy(policy);
	}
</script>
</head>
<body onload="initPolicy()">

<div class="dialog_title"><spring:message code='message.group.update.title'/></div>

<div style="padding-left:40px;">
<form id="frm_group" action="${pageContext.request.contextPath}/group/update.do" method="post">
<input type="hidden" name="id" value="<c:out value="${data.group.id}" />" />
<input type="hidden" name="confirmed" value="1" />
<input type="hidden" name="admin" value="<c:out value="${data.setAdmin}" />" />
<table width="400px;" border="0" cellspacing="0" cellpadding="0">
<tr>
	<th><spring:message code='message.group.name'/></th>
	<td style="padding-left:2px;"><input type="text" name="name" style="width:98%;" value="<c:out value="${data.group.name }" />" /></td>
</tr>
<tr>
	<th><spring:message code='message.group.parent'/></th>
	<td style="padding-left:2px;"><select name="parent">
<c:forEach items="${data.categories }" var="category">
<option value="<c:out value="${category.id}" />" <c:if test="${category.id == data.group.category.parentId }">selected</c:if>><c:forEach begin="1" end="${category.depth}">&nbsp;&nbsp;&nbsp;</c:forEach><c:out value="${category.name}" /></option>
</c:forEach>
</select></td>
</tr>
<tr>
	<th><spring:message code='message.group.policy'/></th>
	<td style="padding-left:2px;"> <select name="policy" onChange="setPolicy(this.options[this.selectedIndex].value)">
<c:forEach items="${data.policies}" var="policy">
<option value="<c:out value="${policy.shortName}" />" <c:if test="${policy.shortName == data.group.policy.shortName }">selected</c:if>><spring:message code = "message.group.new.policy.${policy.shortName}" /></option>
</c:forEach>
</select></td>
</tr>
<tr id="group_password">
	<th><spring:message code='common.password'/></th>
	<td style="padding-left:2px;"><input type="password" name="password" value="" /></td>
</tr>
<tr style="height:100px;">
	<th><spring:message code='common.explain'/></th>
	<td style="padding-left:2px;"><textarea name="summary" style="width:98%; height:100px; resize:none;" /><c:out value="${data.group.summary }" /></textarea></td>
</tr>

</table>
</form>
</div>

<div style="margin-top: 10px; text-align:center;">
	<a href="#" onClick="javascript:document.getElementById('frm_group').submit()"><input type="button" class="create_btn" value="<spring:message code='button.confirm'/>" /></a>
	<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/group/list.do';"><input type="button" class="create_btn" value="<spring:message code='button.cancel'/>" /></a>
</div>

</body>
</html>