<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Test</title>
</head>

<body>

ID: <c:out value="${ data.id }" /><br/>
Color: <c:out value="${ data.color }" /><br/>
Style: <c:out value="${ data.style }" /><br/>
Width: <c:out value="${ data.width }" /><br/>
Node ID: <c:out value="${ data.nodeId }" /><br/>


</body>
</html>