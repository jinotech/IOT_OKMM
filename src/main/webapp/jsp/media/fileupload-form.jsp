<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<html>
<head>
	<title><spring:message code='message.import.freemind.upload'/></title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/main.css" type="text/css">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/impromptu.css" type="text/css" media="screen">
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery-impromptu.3.1.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript">
	    function uploadFile() {
			var frm = document.getElementById("frm_confirm");
			$.prompt('<table border="0"><tr><td class="nobody" rowspan="2" style="vertical-align: top; padding-top: 2px;padding-right: 10px;"><img src="${pageContext.request.contextPath}/images/wait16trans.gif"></td><td class="nobody">Import FreeMind</td><tr><td class="nobody">Please wait...</td></tr></table>', { buttons: {}, prefix:'jqismooth2', top : '40%' });
			frm.mapid.value = parent.jMap.cfg.mapId;
			frm.submit();
		}
    </script>
</head>
<body>
<div id='popcontainer'>
    <div id='pagetatle'>
       <form id="frm_confirm" action="${pageContext.request.contextPath}/media/fileupload.do" method="post" enctype="multipart/form-data">
			<input type="hidden" name="confirm" value="1"/>
			<input type="hidden" name="mapid"/>
			<div id='popcontent'>
				<input type="file" name="file"/>
    		</div>
			<br>
			<div style="margin-top: 20px;">
				<a href="#" onClick="uploadFile();"><input type="button" class="check_btn" value="<spring:message code='image.image_upload' />" /></a>
			</div>
		</form>
	</div>
</div>

</body>
</html>