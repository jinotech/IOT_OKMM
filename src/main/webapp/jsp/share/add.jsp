<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">

<script type="text/javascript">
	function setShareType(type) {
		var group = document.getElementById("share_group");
		var password = document.getElementById("share_password");
		
		if( type == "open" ) {
			group.style.display = 'none';
			password.style.display = 'none';
		} else if( type == "group" ) {
			var groupSize = <c:out value="${fn:length(data.groups)}"/>;
			
			if(groupSize < 1){
				alert("Please, New Group");
				document.getElementById("group").checked=false;
				group.style.display = 'none';
			}else{
				group.style.display = '';
			}
			
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
<body >
<div class="share"><spring:message code='message.share.button.add'/></div>
<div style="padding-left:10px; padding-top:30px;">
<form id="frm_share" action="${pageContext.request.contextPath}/share/add.do" method="post">
<input type="hidden" name="confirmed" value="1" />
<table style="height:100px; width:400px;" border="0" cellpadding="0" cellspacing="0">
	<tr>
		<td class="share-add-label"><spring:message code='common.mindmap'/></td>
		<td style="padding-left:5px;">
		<c:choose>	
			<c:when test="${data.map == null}">
				<select name="map_id">
					<c:forEach var="map" items="${data.maps}">
						<option value="<c:out value="${map.id}"></c:out>"><c:out value="${map.name}"></c:out></option>
					</c:forEach>
				</select>
			</c:when><c:otherwise>
				<c:out value="${ data.map.name }"/>
				<input type="hidden" name="map_id" value="<c:out value="${ data.map.id }"/>" />
			</c:otherwise></c:choose>
			</td>
	</tr>
	<tr>
		<td class="share-add-label"><spring:message code='message.share.type'/></td>
		<td style="padding-left:5px;">
			<c:forEach var="type" items="${data.shareTypes}">
				<input type = "radio" name ="sharetype" onclick="setShareType('<c:out value="${type.shortName}"/>')" value ="<c:out value="${type.shortName}"/>" id="<c:out value="${type.shortName}"/>" /><label for="<c:out value="${type.shortName}"/>"><spring:message code = "message.share.add.type.${type.shortName}" /></label> &nbsp;&nbsp;
				
			</c:forEach>
		</td>
	</tr>
	<tr id="share_group" style="display:none">
		<td class="share-add-label"><spring:message code='message.group.name'/></td>
		<td style="padding-left:10px;"><select name="groupid">
			<c:forEach var="group" items="${data.groups}">
				<option value="<c:out value="${group.id}"></c:out>"><c:forEach begin="1" end="${group.category.depth - 1}">&nbsp;&nbsp;&nbsp;</c:forEach><c:out value="${group.name}"></c:out></option>
			</c:forEach>
		</select></td>
	</tr>
	<tr id="share_password" style="display:none"> 
		<td class="share-add-label"><spring:message code='common.password'/></td>
		<td style="padding-left:5px;"><input type="password" name="password" value=""></input></td>
	</tr>
	<tr>
		<td class="share-add-label"><spring:message code='message.share.permission'/></td>
		<td style="padding-left:5px;"><c:forEach var="permission" items="${data.permissionTypes}">
		<input type="checkbox" name="permission_<c:out value="${permission.shortName }"/>"  <c:if test="${permission.shortName eq 'view'}">
	checked onclick="this.checked=true"
</c:if> value="1"> 
		<spring:message code = "message.share.add.permission_${permission.shortName}" /></input>
		</c:forEach></td>
	</tr>
</table>
</form>
</div>

<div style="margin-top: 20px; text-align:center;">
	<a href="#" onClick="checkForm()"><input type="button" class="create_btn" value="<spring:message code='button.add'/>" /></a>
	<a href="#" onclick="document.location.href='${pageContext.request.contextPath}/share/list.do?map_id=${ data.map.id }';"><input type="button" class="create_btn" value="<spring:message code='button.cancel'/>" /></a>
</div>

</body>
</html>