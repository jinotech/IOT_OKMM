<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><spring:message code='error.accessdeny'/></title>
<style type="text/css">
p.title{font-family:"나눔고딕","맑은 고딕","Dotum"; color:#C30; font-size:20px; font-weight:bold}
p.text{font-family:"나눔고딕","맑은 고딕","Dotum" font-size:10pt;}


input.btn {background:url('${pageContext.request.contextPath}/images/error/btn.gif') no-repeat left top;	color:#6B78A9;	letter-spacing:-1px;  height:21px;	width:112px;	display:inline-block;	margin:0; 	padding:2px 4px 2px 4px;   border:none; font-family:"Dotum"}
input.btn:hover {background-position:right top; color:#5a77c2; font-family:"Dotum"; cursor:pointer}

input.btn2 {background:url('${pageContext.request.contextPath}/btn2.gif') no-repeat left top;	color:#6B78A9;	letter-spacing:-1px;  height:21px;	width:132px;	display:inline-block;	margin:0; 	padding:2px 4px 2px 4px;   border:none; font-family:"Dotum" }
input.btn2:hover {background-position:right top; color:#5a77c2; font-family:"Dotum"; cursor:pointer}



</style>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/impromptu.css" type="text/css" media="screen">
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/simplemodal.css" type="text/css" media="screen">
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/jquery-bug.js" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/jquery.simplemodal.js" type="text/javascript" charset="utf-8"></script>
<script>
var okmLogin = function() { 
	
	$("#dialog").append('<iframe src="${pageContext.request.contextPath}/user/login.do" frameborder="0" allowtransparency="true" width="430"  height="230" scrolling="no"></iframe>');	
	
	var iframeWidth = $("#dialog iframe").width();
	 
	  $("#dialog").dialog({
		  autoOpen:false,
	      closeOnEscape: true,	//esc키로 창을 닫는다.
	      width:iframeWidth+30,	//iframe 크기보다 30px 더 필요하다.
	      modal:true,		//modal 창으로 설정
	      resizable:false,	//사이즈 변경
	      close: function( event, ui ) {
	    	  	$("#dialog iframe").remove();
	    		$("#dialog").dialog("destroy"); 
	      	},
		  });
	  $("#dialog").dialog("option", "width", "none" );
	  $("#dialog").dialog( "option", "title", "<spring:message code='message.login' />" );
	  $("#dialog").dialog("open");	
	
}
</script>

<script type="text/javascript">
function moveTo(url) {
	document.location.href = url;
}
</script>

</head>

<body align=center style="padding-top:100px">
<div id="dialog"></div>
<p align="center" ><img src="${pageContext.request.contextPath}/images/error/stop.png" width="142" height="142" border="0"/></p>
<p class="title" align="center">
	<spring:message code='error.accessdeny'/>
</p>
<p class="text" align="center"><spring:message code='error.accessdenylong'/></p>
<c:if test="${user.username eq 'guest'}">
	<p class="text" align="center"><spring:message code='common.pleaselogin'/></p>
</c:if>


<hr size="1" noshade width="200" align="center" color="#cccccc">
<p align="center">
<c:if test="${user.username eq 'guest'}">
	<input  type="button" class="btn" value="<spring:message code='message.login'/>" onclick="okmLogin()">
</c:if>
  <input type="button" class="btn" onclick="history.back(-1)" value="<spring:message code='error.gobackpage'/>"/>&nbsp;
  <input type="button" class="btn" onclick="moveTo('${pageContext.request.contextPath}/')" value="<spring:message code='error.gomain'/>"/></p>
  
  

</body>
</html>