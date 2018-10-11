<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title><spring:message code='message.share.openmap'/></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/jquery-ui/jquery-ui.custom.css" type="text/css" media="screen">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
	<script src="${pageContext.request.contextPath}/lib/http.js" type="text/javascript" charset="utf-8"></script>
	<script type='text/javascript' src='${pageContext.request.contextPath}/lib/json2.js'></script>
	<script type="text/javascript">
	
/*	function handleKeyPress(e){
		var key=e.keyCode || e.which;
		if (key==13){
		check();
		}
		}
		onkeypress="handleKeyPress(event)"
		*/

	
	
		function check() {
			
			var frm = document.getElementById("frm_share_password");

			var params = {
				"id": frm.id.value,
				"password": frm.password.value
			};
			
			return postToURL("${pageContext.request.contextPath}/confirm.do", params, onCheck, true);
		}

		function onCheck(http) {
			if(http.readyState == 4) {
				if(http.status == 200) {
					var jsonData = JSON.parse(http.responseText);
					if(jsonData.status == "ok") {
						var frm = document.getElementById("frm_share_password");
						frm.submit();
					} else {
						alert("error1 : " + jsonData.message);
					}
				} else {
				}
			}
		}
		
		function close2(){
			parent.$("#dialog_c").dialog("close");
		}
		
		
		function directView(){
			var frm = document.getElementById("frm_share_password");
			frm.password.value = "";
			frm.directView.value = "1";
			frm.submit();
		}
		
		function moveTo(url) {
			document.location.href = url;
		}
	</script>
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery-bug.js" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery-ui.min.js" type="text/javascript" charset="utf-8"></script>
	<script>
	 <c:choose>	
	    
		<c:when test="${data.type=='popup'}">
		var okmLogin = function() {
			document.location.href = "${pageContext.request.contextPath}/user/login.do";
		}
		</c:when><c:otherwise>
		var okmLogin = function() {
			
			$("#dialog").append('<iframe src="${pageContext.request.contextPath}/user/login.do" frameborder="0" allowtransparency="true" width="340"  height="230" scrolling="no"></iframe>');
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
			  $("#dialog").dialog("option", "width", "350px" );
			  $("#dialog").dialog( "option", "title", "<spring:message code='message.login' />" );
			  $("#dialog").dialog("open");
		}
		</c:otherwise></c:choose>
	

</script>


	<style>
input.btn {background:url('${pageContext.request.contextPath}/images/error/btn.gif') no-repeat left top;	color:#6B78A9;	letter-spacing:-1px;  height:21px;	width:112px;	display:inline-block;	margin:0; 	padding:2px 4px 2px 4px;   border:none; font-family:"나눔고딕, Dotum"}
input.btn:hover {background-position:right top; color:#5a77c2; font-family:"나눔고딕, Dotum"; cursor:pointer}

input.btn2 {background:url('${pageContext.request.contextPath}/images/error/btn2.gif') no-repeat left top;	color:#6B78A9;	letter-spacing:-1px;  height:21px;	width:132px;	display:inline-block;	margin:0; 	padding:2px 4px 2px 4px;   border:none; font-family:"나눔고딕, Dotum" }
input.btn2:hover {background-position:right top; color:#5a77c2; font-family:"나눔고딕, Dotum"; cursor:pointer}


/*font*/
p.title{
	font-family:"나눔고딕","맑은 고딕", "Dotum";
	font-weight:600;
	font-size:12pt;
	color:#0076ad;
}

p.pw{
	font-family:"나눔고딕","맑은 고딕", "Dotum";
	color:#666666;
	font-size:10pt;
}

a.view{
	font-family:"나눔고딕","맑은 고딕", "Dotum";
	font-size:10pt;
	color:#0076ad;

}
	
	</style>
	
</head>
<body align=center>

<form id="frm_share_password" name="frm_share_password" action="${pageContext.request.contextPath}<c:out value="${data.action}"/>" method="post" target="_parent" onsubmit ="return check();">
<div id="dialog"></div>
<c:if test="${data.mapId != null}">
<input type="hidden" name="id" value="<c:out value="${data.mapId}"/>"/>
</c:if>

<table width="420" border="0" cellspacing="0" cellpadding="0" align="center" style="margin-top:30px">
  <tr>
    <td width="420" style="border-right-color:#CCC; border-right-style:dotted; border-right-width:1px; padding:10px"><p class="title" align="center">
    
    <c:choose>	
    
	<c:when test="${data.hasPasswordEditGrant=='true'}">
		<spring:message code='share.password.pleasinputpasswordtoedit'/>
	</c:when><c:otherwise>
		<spring:message code='share.password.pleasinputpasswordtosee'/>
	</c:otherwise></c:choose>
	
			
    
    </p>
    <p class="pw" align="center"><spring:message code='message.password'/> <input type="password" name="password" value="" /></p>
    <hr size="1" noshade width="300" align="center" color="#cccccc">
<!-- button --> <p align="center">
 <a href="#" onClick="check();"><input type="button" class="create_btn" value="<spring:message code='button.confirm'/>" /></a>&nbsp;
  <c:if test="${user.username eq 'guest'}">
	<input  type="button" class="btn" value="<spring:message code='message.login'/>" onclick="okmLogin()">
</c:if>&nbsp;
<c:if test="${data.message == 'strongpassword'}">
	<input type="button" class="btn" value="<spring:message code='share.password.viewmindmap'/>" onclick="javascript:close2()">
</c:if>&nbsp;
<c:if test="${data.message != 'strongpassword'}">
  <input type="button" class="btn" onclick="moveTo('${pageContext.request.contextPath}/')" value="<spring:message code='error.gomain'/>"/>
  </c:if>
    </td>
    
     

   	 <input type="hidden" name="directView" value="0"/>


  </tr>
</table>
<input type="hidden" name="shareConfirm" value="passwordCheck"/>

</form>


</body>
</html>