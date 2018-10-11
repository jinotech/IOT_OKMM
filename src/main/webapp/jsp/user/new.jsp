<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.okmindmap.configuration.Configuration"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="env" uri="http://www.servletsuite.com/servlets/enventry" %>

<%
	String facebook_appid = Configuration.getString("facebook.appid");
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
<meta name="apple-mobile-web-app-capable" content="yes">

<title><spring:message code='message.member.new'/></title>

<link rel="stylesheet" href="${pageContext.request.contextPath}/css/jquery-ui/jquery-ui.custom.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/mobile.css?v=<env:getEntry name="versioning"/>" type="text/css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/lib/koottam/koottam.css?v=<env:getEntry name="versioning"/>" type="text/css">

<script src="${pageContext.request.contextPath}/lib/jquery.min.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/jquery-ui.min.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/koottam/jquery.koottam.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/plugin/jino_facebook.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript">
	var FACEBOOK_APP_ID = '<%=facebook_appid%>';
	
	var checkedUsername = false;
	var checkedEmail = false;

	function validateUsername(username) {
		var illegalChars = /\W/; // allow letters, numbers, and underscores

		if (username == "") {
			alert("<spring:message code='user.new.username_not_enter'/>");

			return false;
		} else if ((username.length < 5) || (username.length > 15)) { 
			alert("<spring:message code='user.new.username_wrong_length'/>");

			return false;
		} else if (illegalChars.test(username)) {
			alert("<spring:message code='user.new.username_illegal'/>");

			return false;
		}

		return true;
	}

	function validateEmail(mail) {
		//var reg = new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]­{1}[a-z0-9]+)*[\.]{1}(com|ca|net|org|fr|us|qc.ca|gouv.qc.ca)$', 'i');
		var reg = new RegExp(/^[A-Za-z0-9]([A-Za-z0-9_-]|(\.[A-Za-z0-9]))+@[A-Za-z0-9](([A-Za-z0-9]|(-[A-Za-z0-9]))+)\.([A-Za-z]{2,6})(\.([A-Za-z]{2}))?$/);

		if(!reg.test(mail) || mail == "") {
			return false;
		} else {
			return true;
		}
	}

	function validateNotEmpty( strValue ) {
		var strTemp = strValue;

		strTemp = trimAll(strTemp);
		if(strTemp.length > 0){
			return true;
		}

		return false;
	}

	function trimAll( strValue ) {
		var objRegExp = /^(\s*)$/;

		//check for all spaces
		if(objRegExp.test(strValue)) {
			strValue = strValue.replace(objRegExp, '');

			if( strValue.length == 0)
				return strValue;
		}

		//check for leading & trailing spaces
		objRegExp = /^(\s*)([\W\w]*)(\b\s*$)/;
		if(objRegExp.test(strValue)) {
			//remove leading and trailing whitespace characters
			strValue = strValue.replace(objRegExp, '$2');
		}

		return strValue;
	}

	function checkAvailableUsername() {
		var frm = document.getElementById("frm-user-new");

		var username = frm.username.value;

		if(validateUsername(username)) {

			var params = {
				"what": "username",
				"value": username
			};

			$.ajax({
					url: "${pageContext.request.contextPath}/user/available.do",
					dataType: 'json',
					data: params,
					success: function (data) {
						if(data.status == "ok") {
							alert(username + "<spring:message code='user.new.is_available'/>");
							checkedUsername = true;
							return true;
						} else {
							alert(username + "<spring:message code='user.new.is_not_available'/>");
							return false;
						}
					}
				}
			);
		}

		return false;
	}

	function checkAvailableEmail() {
		var frm = document.getElementById("frm-user-new");
		
		var mail = frm.email.value;

		if(validateEmail(mail)) {
			var params = {
				"what": "email",
				"value": mail
			};

			$.ajax({
					url: "${pageContext.request.contextPath}/user/available.do",
					dataType: 'json',
					data: params,
					success: function (data) {
						if(data.status == "ok") {
							alert(mail + "<spring:message code='user.new.is_available'/>");
							checkedEmail = true;
							return true;
						} else {
							alert(mail + "<spring:message code='user.new.is_not_available'/>");
							return false;
						}
					}
				}
			);
		} else {
			alert("<spring:message code='user.new.email_not_valid'/>");

			checkedEmail = false;

			return false;
		}
	}
	
	function resetStatus(what) {
		if(what == "username") {
			checkedUsername = false;
		} else if(what == "email") {
			checkedEmail = false;
		}
	}

	function checkSubmit(frm) {
				
			if(!checkedUsername) {
				alert("<spring:message code='user.new.username_check'/>");
				return false;
			}
	
			if(!checkedEmail) {
				alert("<spring:message code='user.new.email_check'/>");
				return false;
			}
	
	
			var lname = trimAll(frm.lastname.value);
			if(!validateNotEmpty(lname)) {
				alert("<spring:message code='user.new.enter_lastname'/>");
				return false;
			}
	
			var fname = trimAll(frm.firstname.value);
			if(!validateNotEmpty(fname)) {
				alert("<spring:message code='user.new.enter_firstname'/>");
				return false;
			}
	
			var pwd1 = trimAll(frm.password.value);
			var pwd2 = trimAll(frm.password1.value);
	
			if(!validateNotEmpty(pwd1)) {
				alert("<spring:message code='user.new.enter_password'/>");
				return false;
			} else if(!validateNotEmpty(pwd2)) {
				alert("<spring:message code='user.new.enter_password1'/>");
				return false;
			} else if(pwd1 != pwd2) {
				alert("<spring:message code='user.new.password_not_match'/>");
				return false;
			}
			
			if($("#click_check").attr("value") == 0){
				return false;
			};
	
			_gaq.push(['_trackEvent', 'User', 'Register', 'From Site']);
			
			
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
			
			$("#click_check").attr("value",0);	
			parent.$("#dialog").dialog( "option", "title", "<spring:message code='message.login' />" );
			return true;
		
	}
	
	function cancel(){
		parent.$("#dialog").dialog("close");
	}
	
	function withFacebook() {
		FacebookService.getUser(function(response) {
			joinData = {};
			joinData.facebook = response.id;
			joinData.email = response.email;
			joinData.url = '${pageContext.request.contextPath}/user/new.do';
			joinData.username = response.id;
			joinData.firstname = response.first_name;
			joinData.lastname = response.last_name;
			joinData.password = response.email;
			joinData.password1 = response.email;
			FacebookService.joinFacebook(joinData, function(data) {
				// data
				// 0 : 페북 연동 실패
				// 1 : 페북 연동 성공
				var ret = parseInt(data) || 0;
				if(ret == 1) {
					//window.location.href = "${pageContext.request.contextPath}/index.do";
					if(window.parent !== undefined)
						window.parent.location.reload();
					else
						window.location.reload();
				} else {
					alert("error");
				}
			});
		});
		/*FacebookService.onLoginCompleted(function(r, FB) {
			FB.api('/me', function(response) {
				var frm = document.getElementById("frm-user-new");
				frm.email.value = response.email;
				frm.firstname.value = response.first_name;
				frm.lastname.value = response.last_name;
				if(response.username) frm.username.value = response.username;
				frm.facebook.value = response.id;
				frm.target = "_parent";
			});
		});
		FacebookService.facebook	Login();*/
	}
	
	$(document).ready(function(){
		$('.fb').koottam({
			'theme'				: 'facebook-blue',
            'icon_url'			: '../lib/koottam/img/facebook.png',
            'method'			: 'user',
            'style'				: 'image_id_count',
            'id'					: '<spring:message code='facebook.button.using'/>',
            'service'			: 'user',
            'count_visible'	: false
        });
    });
</script>

<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-30732410-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>

</head>
<body>
<div id="waitingDialog"></div>
<div style="padding-left:13px; margin-top:8px;">
<!-- <div class="facebook_join" >
	<a href="#" onclick="javascript:withFacebook();">페이스북으로 가입</a>
</div>-->
<form id="frm-user-new" action="${pageContext.request.contextPath}/user/new.do" method="post" onSubmit="return checkSubmit(this);">
<input type="hidden" id="click_check" name="click_check" value="1"/>
<input type="hidden" name="confirmed" value="1" />
<input type="hidden" name="facebook" value="" />

<!-- <div style="margin-bottom:20px; margin-right:45px; text-align:right;"> -->
<%-- 	<a href="#" class="fb" onclick="javascript:withFacebook();"><spring:message code='facebook.button.using'/></a> --%>
<!-- </div> -->

<table class="user-new" cellspacing="0" cellpadding="0">
	<tr>
		<td class="user-new-label nobody"><spring:message code='message.id'/></td>
		<td class="user-new-input nobody"><input type="text" class="new-input" name="username" value="" onChange="resetStatus('username');"/> 
		<a href="#" onclick="javascript:checkAvailableUsername();"><input type="button" class="check_btn" style="color:#3399cc;" value="<spring:message code='user.new.check_availability' />" /></a>
		</td>
	</tr>
	<tr>
		<td class="user-new-label nobody"><spring:message code='common.name.last'/></td>
		<td class="user-new-input nobody"><input type="text" class="new-input" name="lastname" value="" ></td>
	</tr>
	<tr>
		<td class="user-new-label nobody"><spring:message code='common.name.first'/></td>
		<td class="user-new-input nobody"><input type="text" class="new-input" name="firstname" value="" /></td>
	</tr>
	<tr>
		<td class="user-new-label nobody"><spring:message code='common.email'/></td>
		<td class="user-new-input nobody"><input type="text" class="new-input" name="email" value="" onChange="resetStatus('email');"/>
		<a href="#" onclick="javascript:checkAvailableEmail();"><input type="button" class="check_btn" style="color:#3399cc;" value="<spring:message code='user.new.check_availability'/>" /></a>
		</td>
	</tr>
	<tr>
		<td class="user-new-label nobody"><spring:message code='common.password'/></td>
		<td class="user-new-input nobody"><input type="password" class="new-input" name="password" value="" /></td>
	</tr>
	<tr>
		<td class="user-new-label nobody"><spring:message code='common.password.confirm'/></td>
		<td class="user-new-input nobody"><input type="password" class="new-input" name="password1" value="" /></td>
	</tr>
</table>
<div style="margin-top:20px; text-align:center;">
	<input type="submit" class="create_btn" value="<spring:message code='common.confirm'/>" />
</div>
</div>
</form>

</body>
</html>