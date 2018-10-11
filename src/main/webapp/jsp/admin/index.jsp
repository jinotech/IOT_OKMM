<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="java.util.Locale" %>
<%@ page import="org.springframework.web.servlet.support.RequestContextUtils" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="bitly" uri="http://www.servletsuite.com/servlets/bitlytag" %>
<%@ taglib prefix="env" uri="http://www.servletsuite.com/servlets/enventry" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
        "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8">
		<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
		<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
		<META HTTP-EQUIV="Expires" CONTENT="0">

		<title>Admin Page</title>

    </head>
    

<frameset rows="105,*,80" border="1px">
	<frame src="${pageContext.request.contextPath}/jsp/admin/top.jsp" name="indexTop" />
	
    <frameset cols="200,*" cols="*" border="1px">
    	<frame src="${pageContext.request.contextPath}/jsp/admin/treeMenu.jsp" name="treeMenu" />
    	<frame src="${pageContext.request.contextPath}/mindmap/admin/maps/list.do?maptype=all" name="adminContent" />
   		
	</frameset>
	
	
	<frame src="${pageContext.request.contextPath}/jsp/admin/footer.jsp" name="adminContent" />
	
	
</frameset>



</html>

