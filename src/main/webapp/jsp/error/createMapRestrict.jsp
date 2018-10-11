<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Error</title>

<script type="text/javascript">

function complete(){
	parent.$("#dialog").dialog("close");
}

</script>

</head>

<body>
<h1>맵 초과</h1>
<p>허용된 맵 갯수가 초과하였습니다.</p>

<p><c:out value="${exception}"/></p>

<div>	
	<input name="complete-button" id="complete-button" type="button" value="OK" onclick="complete()">	
</div>

</body>
</html>