<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Confirm Owner</title>

	<script src="${pageContext.request.contextPath}/lib/http.js" type="text/javascript" charset="utf-8"></script>
	<script type='text/javascript' src='${pageContext.request.contextPath}/lib/json2.js'></script>
	<script type="text/javascript">
		function check() {
			var frm = document.getElementById("frm_confirm");

			var params = {
				"id": frm.id.value,
				"email": frm.email.value,
				"password": frm.password.value
			};

			postToURL("${pageContext.request.contextPath}/confirm.do", params, onCheck, true);
		}

		function onCheck(http) {
			if(http.readyState == 4) {
				if(http.status == 200) {
					var jsonData = JSON.parse(http.responseText);

					if(jsonData.status == "ok") {
						var frm = document.getElementById("frm_confirm");
						frm.submit();
					} else {
						alert("error4 : " + jsonData.message);
					}
				} else {
				}
			}
		}
	</script>
</head>

<body>
<form id="frm_confirm" action="${pageContext.request.contextPath}<c:out value="${data.action}"/>" method="post" target="_parent">
<c:if test="${data.mapId != null}">
<input type="hidden" name="id" value="<c:out value="${data.mapId}"/>"/>
</c:if>
<p>
    <label for="email"><spring:message code='common.email'/> </label>
    <input type="text" name="email" value="" />
</p>
<p>
    <label for="password"><spring:message code='common.password'/> </label>
    <input type="password" name="password" value="" />
</p>
</form>

<div style="margin-top: 20px;">
<a href="#" onClick="check();"><input type="button" class="create_btn" value="<spring:message code='button.submit'/>" /></a>
</div>


</body>
</html>