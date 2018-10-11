<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>result</title>
	
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
	
	<script type="text/javascript">	
		var node = parent.jMap.getSelected();
		var imgExt = 'jpg jpeg bmp gif png'.split(' ');
		
		var isImg = false;
		for(ext in imgExt) {
			if(imgExt[ext] == '<c:out value="${data.ext}"/>') {
				isImg = true;
				break;
			}						
		}
		
		var url_prefix = document.location.protocol + '//' + document.location.host + parent.jMap.cfg.contextPath + '/map';		
		if(isImg) {
			node.setImage(url_prefix + '<c:out value="${data.url}"/>');	
		} else {
			node.setHyperlink(url_prefix + '<c:out value="${data.url}"/>');
		}		
		
		parent.jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
		parent.$.modal.close();
		location.href="image.do";
    </script>
</head>
<body>

<div class="dialog_title"><spring:message code='image_complete' /></div>

</body>
</html>