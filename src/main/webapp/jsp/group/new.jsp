<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title><spring:message code='message.group.new'/></title>
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
<body onLoad="initPolicy()">
<div id='popcontainer' style="width:400px;"> 
    <div id='pagetatle'>
        <div class="dialog_title"><spring:message code='message.group.new'/></div>
	<div>
        <!--<span class='title'>새로운 마인드맵을 만들어....설명라인</span> </div>-->
    <form id="frm_group" action="${pageContext.request.contextPath}/group/new.do" method="post">
        <input type="hidden" name="confirmed" value="1" />
        <div id='popcontent'>
            <table width="400px;" border="0" cellspacing="0" cellpadding="0">
                 <tr>
                    <th> <spring:message code='message.group.name'/></th>
                    <td style="padding-left:2px;"><input type="text" name="name" style="width:94%;" value="" />
                        </th>
                </tr>
                <tr>
                    <th><spring:message code='message.group.parent'/></th>
                    <td style="padding-left:2px;"><select name="parent">
                            <c:forEach items="${data.categories }" var="category">
                                <option value="<c:out value="${category.id}" />">
                                <c:forEach begin="1" end="${category.depth}">&nbsp;&nbsp;&nbsp;</c:forEach>
                                <c:out value="${category.name}" />
                                </option>
                            </c:forEach>
                        </select>
                        </th>
                </tr>
                <tr>
                    <th> <spring:message code='message.group.policy'/></th>
                    <td style="padding-left:2px;"><select name="policy" onChange="setPolicy(this.options[this.selectedIndex].value)">
                            <c:forEach items="${data.policies}" var="policy">
                                <option value="<c:out value="${policy.shortName}" />"><spring:message code = "message.group.new.policy.${policy.shortName}" /></option>
                            </c:forEach>
                        </select>
                        </th>
                <tr id="group_password">
                    <th><spring:message code='common.password'/></th>
                    <td style="padding-left:2px; border-bottom:1px solid #3399cc;"><input type="password" name="password" value="" /></td>
                </tr>
                <tr style="height:100px;">
                    <th> <spring:message code='common.explain'/></th>
                    <td style="padding-left:2px;"><textarea name="summary" style="width:96%; height:100px; resize:none;" />
                        </textarea>
                        </td>
                </tr>
            </table>
        </div>
  		</div>
        <br>
        <div style="text-align:center; margin-top: 10px;">
            <a href="#" onClick="javascript:document.getElementById('frm_group').submit()"><input type="button" class="create_btn" value="<spring:message code='button.create' />" /></a> 
            <a href="#" onClick="document.location.href='${pageContext.request.contextPath}/group/list.do'"><input type="button" class="create_btn" value="<spring:message code='button.cancel' />" /></a>
        </div>
    </form>
</div>
</body>
</html>