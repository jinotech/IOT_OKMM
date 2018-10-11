<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title><spring:message code='message.share.edit'/></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/simplemodal.css" type="text/css" />

<script type="text/javascript">
	function setShareType(type) {
		var group = document.getElementById("share_group");
		var password = document.getElementById("share_password");
		
		if( type == "open" ) {
			group.style.display = 'none';
			password.style.display = 'none';
		} else if( type == "group" ) {
			group.style.display = '';
			password.style.display = 'none';
		} else if( type == "password" ) {
			group.style.display = 'none';
			password.style.display = '';
		}
	}

	function initShareType() {
		var frm = document.getElementById("frm_share");
		var shareType = frm.sharetype.options[frm.sharetype.selectedIndex].value;
		setShareType(shareType);
	}
	
	function checkForm(){
		var isCheck = false;
		var chks = document.getElementsByName("sharetype");
		var passwords = document.getElementsByName("password")[0].value;
		
		
		var isEmptyPass = false;
		for(var i = 0; i < chks.length; i++) {
			if(chks[i].value =='password'){
				if(chks[i].checked && passwords==""){
					isEmptyPass = true;
				}
			}
			
			if(chks[i].value =='password'){
				//alert(chks[i].checked);
				if(chks[i].checked && passwords==""){
					isEmptyPass = true;
				}
			}
			
			
			if(chks[i].checked){
				
				isCheck = true;
			}
		}

		
		if(!isCheck) {
			alert("<spring:message code='message.share.add.type.empty'/>");
		} else if(isEmptyPass){
			alert("<spring:message code='message.share.add.password.empty'/>");
		}else {
			document.getElementById('frm_share').submit();
		}
	}
</script>
</head>
<body>

<div class="share"><spring:message code='message.share.edit'/></div>

<div style="padding-left:30px; padding-top:30px;">
<form id="frm_share" action="${pageContext.request.contextPath}/share/update.do" method="post">
<input type="hidden" name="confirmed" value="1" />
<input type="hidden" name="id" value="<c:out value="${ data.share.id }"/>" />
<table style="height:100px; width:400px;" border="0" cellpadding="0" cellspacing="0">
	<tr>
		<td class="share-add-label"><spring:message code='common.mindmap'/></td>
		<td style="padding-left:5px;">
			<c:out value="${ data.share.map.name }"/>
			<input type="hidden" name="map_id" value="<c:out value="${ data.share.map.id }"/>" />
		</td>
	</tr>
	<tr>
		<td class="share-add-label"><spring:message code='message.share.type'/></td>
		<td style="padding-left:4px;">
			<c:forEach var="type" items="${data.shareTypes}">
					<input type = "radio" name ="sharetype" <c:if test="${type.shortName == data.share.shareType.shortName}">checked</c:if> onChange="setShareType('<c:out value="${type.shortName}"/>')" value ="<c:out value="${type.shortName}"/>" id="<c:out value="${type.shortName}"/>" /><label for="<c:out value="${type.shortName}"/>"><spring:message code = "message.share.add.type.${type.shortName}" /></label> &nbsp;&nbsp;	
			</c:forEach>	
		</td>
	</tr>
	<tr id="share_group" <c:if test="${'group' != data.share.shareType.shortName}">style="display:none"</c:if>>
		<td class="share-add-label"><spring:message code='message.group.name'/></td>
		<td><select name="groupid">
			<c:forEach var="group" items="${data.groups}">
				<option value="<c:out value="${group.id}"></c:out>" <c:if test="${group.id == data.share.group.id}">selected</c:if>><c:forEach begin="1" end="${group.category.depth - 1}">&nbsp;&nbsp;&nbsp;</c:forEach><c:out value="${group.name}"></c:out></option>
			</c:forEach>
		</select></td>
	</tr>
	<tr id="share_password" <c:if test="${'password' != data.share.shareType.shortName}">style="display:none"</c:if>>
		<td class="share-add-label"><spring:message code='common.password'/></td>
		<td><input type="password" name="password" value=""></input></td>
	</tr>
	<tr>
		<td class="share-add-label"><spring:message code='message.share.permission'/></td>
		<td style="padding-left:5px;">
		<c:forEach var="permission" items="${data.share.permissions}">
		<input type="checkbox" name="permission_<c:out value="${permission.permissionType.shortName }"></c:out>" 
		       value="1"
		       <c:if test="${permission.permissionType.shortName eq 'view'}"> checked onclick="this.checked=true"</c:if>
		       <c:if test="${permission.permissionType.shortName != 'view' and permission.permited}">checked</c:if>>
		       <spring:message code = "message.share.add.permission_${permission.permissionType.shortName}" />
		</input>
		</c:forEach>
		</td>
		
		 
	</tr>
</table>
</form>
</div>

<div style="margin-top: 20px; text-align:center;"">
	<a href="#" onClick="checkForm()"><input type="button" class="create_btn" value="<spring:message code='button.save'/>" /></a>
	<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/share/list.do?map_id=<c:out value="${data.share.map.id }" />';"><input type="button" class="create_btn" value="<spring:message code='button.cancel'/>" /></a>
</div>
</body>
</html>