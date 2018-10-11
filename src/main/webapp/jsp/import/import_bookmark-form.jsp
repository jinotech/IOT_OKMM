<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<html>
<head>
	<title><spring:message code='message.import.bookmark.upload'/></title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/main.css" type="text/css">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/jquery-ui/jquery-ui.custom.css" type="text/css" media="screen">
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery-ui.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery.form.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript">
	    function init_d(){
	    	$('#frm_confirm').ajaxForm({
			    beforeSend: function() {
			    	var txt = '<table borde="0"><tr><td class="nobody" rowspan="2" style="vertical-align: top; padding-top: 2px;padding-right: 10px;"><img src="${pageContext.request.contextPath}/images/wait16trans.gif"></td><td class="nobody">Import Bookmark</td><tr><td class="nobody">Please wait...</td></tr></table>';
			    	$("#waitingDialog").append(txt);
					
					$("#waitingDialog").dialog({
						  autoOpen:false,
					      modal:true,		//modal 창으로 설정
					      resizable:false,	//사이즈 변경
					      close: function( event, ui ) {
					    	  	$("#waitingDialog table").remove();
					    		$("#waitingDialog").dialog("destroy"); 
							},
					});
					$("#waitingDialog").dialog("option", "width", "none" );
					    //open
					$("#waitingDialog").dialog("open");
			    },
			    success: function(response, status, xhr) {
			    	parent.JinoUtil.BookmarkCallback(response);
			    	$("#waitingDialog").dialog("close");
			    }
			});
	    }
	    
	    $(document).ready( init_d );
    </script>
</head>
<body>
	<div style= "padding-top:30px; padding-left:25px;">
		<div id="waitingDialog"></div>
		<form id="frm_confirm" name="frm_confirm" action="${pageContext.request.contextPath}/mindmap/importBookmark.do" method="post" enctype="multipart/form-data">
		<input type="hidden" name="confirm" value="1"/>
		<input type="hidden" name="format" value="json"/>
     
		<table width="100%" border="0" cellspacing="0" cellpadding="0" class="jinotable">
			<tr>
				<td style="width:130px;" class="nobody"><span class="bookmark_subject"><spring:message code='message.import.bookmark.default'/></span></td>
				<td class="nobody"><!-- <input type="text" id="fileName" class="file_input_textbox" readonly="readonly"> -->
					<div class="file_input_div">
						<input type="file" name="file" class="file_input_hidden" />
					</div>
				</td>
			</tr>  
		</table>
		
		<div style="text-align:center;">
			<input type="submit" value="<spring:message code='button.apply'/>" />
		</div>
    	</form>
	</div>
	
</body>
</html>