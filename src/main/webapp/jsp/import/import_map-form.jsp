<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<html>
<head>
	<title><spring:message code='message.import.freemind.upload'/></title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/main.css" type="text/css">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/impromptu.css" type="text/css" media="screen">
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery-impromptu.3.1.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript">
	    function importMMFile() {
			var frm = document.getElementById("frm_confirm");
			$.prompt('<table border="0"><tr><td class="nobody" rowspan="2" style="vertical-align: top; padding-top: 2px;padding-right: 10px;"><img src="${pageContext.request.contextPath}/images/wait16trans.gif"></td><td class="nobody">Import FreeMind</td><tr><td class="nobody">Please wait...</td></tr></table>', { buttons: {}, prefix:'jqismooth2', top : '40%' });
			//frm.action = "${pageContext.request.contextPath}/mindmap/importMap.do";
			frm.submit();
		}
	    function cancel(){
	    	parent.$("#dialog").dialog("close");
		}
    </script>
</head>
<body>
	
	<div style= "padding-top:30px; padding-left:25px;">
		<form id="frm_confirm" action="${pageContext.request.contextPath}/mindmap/importMap.do" method="post" enctype="multipart/form-data">
		<input type="hidden" name="confirm" value="1"/>
     
		<table width="100%" border="0" cellspacing="0" cellpadding="0" class="jinotable">
			<tr>
				<td style="width:130px;" class="nobody"><span class="freemind_subject"><spring:message code='message.import.freemind.default'/></span></td>
				<td class="nobody"><!-- <input type="text" id="fileName" class="file_input_textbox" readonly="readonly"> -->
					<div class="file_input_div">
						<input type="file" name="file" class="file_input_hidden" onchange="javascript: document.getElementById('fileName').value = this.value" />
					</div>
				</td>
			</tr>  
		</table>
		
		<br/>
		
		<c:if test="${user.username eq 'guest'}">
		<table width="100%" border="0" cellspacing="0" cellpadding="0" class="jinotable">
			<tr>
				<td class="nobody"><spring:message code='common.email'/>:</td>
				<td class="nobody"><input type="text" name="email" value="" /></td>
			</tr>
			<tr>
				<td class="nobody"> <spring:message code='common.password'/>:</td>
				<td class="nobody"> <input type="text" name="password" value="" /></td>
			</tr>
		</table>
		</c:if>
            
    	</form>
	</div>
    
    <div style="text-align:center;">
		<a href="#" onClick="importMMFile();"><input type="button" class="check_btn" value="<spring:message code='button.apply'/>" /></a>
	</div>
	
</body>
</html>