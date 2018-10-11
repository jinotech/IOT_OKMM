<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.okmindmap.configuration.Configuration"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<%
	String facebook_appid = Configuration.getString("facebook.appid");
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title>Login</title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width; initial-scale=1.2; maximum-scale=1.2; user-scalable=no;">
	<meta name="apple-mobile-web-app-capable" content="yes">
	
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/reset.css" type="text/css" media="screen">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/facebook_login.css" type="text/css" media="screen">
	
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/http.js" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/plugin/jino_facebook.js" type="text/javascript" charset="utf-8"></script>
	
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
	
			_gaq.push(['_trackEvent', 'User', 'Register', 'From Facebook']);
			
			return true;
		}
		
		function cancel(){
			parent.$.modal.close();
		}
		
	</script>

	<script type="text/javascript">
		function check() {
			var frm = document.getElementById("frm_login");
	
			var params = {
				"username": frm.username.value,
				"password": frm.password.value
			};
	
			postToURL("${pageContext.request.contextPath}/confirm.do", params, onCheck, true);
		}
	
		function onCheck(http) {
			if(http.readyState == 4) {
				if(http.status == 200) {
					var jsonData = JSON.parse(http.responseText);
					if(jsonData.status == "ok") {
						_gaq.push(['_trackEvent', 'User', 'Connect', 'Facebook']);
						
						FacebookService.onLoginCompleted(function(response, FB) {
							var frm = document.getElementById("frm_login");			
							frm.facebook_connect.value = response.authResponse.userID;						 
							frm.submit();
						});
						FacebookService.initFacebook();
					} else {
						alert("error2 : " + jsonData.message);
					}
				} else {
				}
			}
		}
	
		function jsEnter(e) {
			e = e || window.event;
			if(e.keyCode == 13) {
				check();
			}
		}
		
		
		function init(){
			FacebookService.onLoginCompleted(function(r, FB) {
				$('#login-request').hide();
				FB.api('/me', function(response) {
					var frm = document.getElementById("frm-user-new");
					frm.email.value = response.email;
					frm.firstname.value = response.first_name;
					frm.lastname.value = response.last_name;
					if(response.username) frm.username.value = response.username;
					frm.facebook.value = response.id;
					
					var frm_login = document.getElementById("frm_login");
					frm_login.facebook_connect.value = response.id;
				});
			});
			FacebookService.onLoginRequest(function(r, FB) {
				$('#login-request').show();
			});
			FacebookService.initFacebook();
			
		}
		
		window.fbAsyncInit = init;
		
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

	<div id="login-request">
		<div class="startfade"></div>
		<div href="#" class="startbtn" onclick="FacebookService.facebookLogin();"></div>
	</div>

	<div class="wrap">
		<!--top-->
		<div class="top">
			<div class="logo"></div>
		</div>

  <div class="container">
			

			<section class="tabs">
	            <input id="tab-1" type="radio" name="radio-set" class="tab-selector-1" checked="checked" />
		        <label for="tab-1" class="tab-label-1"><spring:message code='facebooklogin.new' /></label>
		
	            <input id="tab-2" type="radio" name="radio-set" class="tab-selector-2" />
		        <label for="tab-2" class="tab-label-2"><spring:message code='facebooklogin.facebooklogin' /></label>
		
	                       
			    <div class="clear-shadow"></div>
				
		        <div class="content">
			        <div class="signup">
                    			<div class="noid">
					<div class="mark1"></div>
					<div class="singup_info">
						<spring:message code='facebooklogin.infomation' />
					</div>
				</div>

				
				
				<div class="form">
					<form id="frm-user-new" action="${pageContext.request.contextPath}/user/new.do" method="post" onSubmit="return checkSubmit(this);">
						<input type="hidden" name="confirmed" value="1" />
						<input type="hidden" name="facebook" value="" />

						<table class="user-new" cellspacing="0" cellpadding="0">
							<tr>
								<td class="user-new-label nobody"><spring:message code='message.id' /></td>
								<td class="user-new-input nobody">
									<input type="text" class="new-input" name="username" value="" onChange="resetStatus('username');" />
									<a href="#" onclick="javascript:checkAvailableUsername();">
										<input type="button" class="check_btn" value="중복확인" />
									</a>
								</td>
							</tr>
							<tr>
								<td class="user-new-label nobody"><spring:message code='common.name.last' /></td>
								<td class="user-new-input nobody">
									<input type="text" class="new-input" name="lastname" value="">
								</td>
							</tr>
							<tr>
								<td class="user-new-label nobody"><spring:message code='common.name.first' /></td>
								<td class="user-new-input nobody">
									<input type="text" class="new-input" name="firstname" value="" />
								</td>
							</tr>
							<tr>
								<td class="user-new-label nobody"><spring:message code='common.email' /></td>
								<td class="user-new-input nobody">
									<input type="text" class="new-input" name="email" value="" onChange="resetStatus('email');" />
									<a href="#" onclick="javascript:checkAvailableEmail();">
										<input type="button" class="check_btn" value="중복확인" />
									</a>
								</td>
							</tr>
							<tr>
								<td class="user-new-label nobody"><spring:message code='common.password' /></td>
								<td class="user-new-input nobody">
									<input type="password" class="new-input" name="password" value="" />
								</td>
							</tr>
							<tr>
								<td class="user-new-label nobody"><spring:message code='common.password.confirm' /></td>
								<td class="user-new-input nobody"><input type="password" class="new-input" name="password1" value="" /></td>
							</tr>
						</table>
						<div class="signup_btn">
							<input type="submit" class="create_btn" value="확인" />
							<input type="button" class="create_btn" value="취소" onclick="cancel();" />
						</div>
					</form>
				</div>
				    </div>
                    
                    
                    
                    
                    
                    
                    
			        <div class="signin">
						<div class="login">
					<div class="mark1"></div>
					<div class="singin_info">
						<spring:message	code='facebooklogin.already' />
					</div>
				</div>
				
				

				<div class="form_signin" id="form2">
					<form name="frm_login" id="frm_login" action="${pageContext.request.contextPath}/user/login.do" method="post">
						<input type="hidden" name="return_url" value="" />
						<input type="hidden" name="facebook_connect" value="" />
						
						<table border="0" cellpadding="0" cellspacing="0" class="login_table">
							<tr>
								<td class="user-login-label nobody" colspan="2"><spring:message code='message.id' /></td>
								<td class="nobody"><input tabindex="1" type="text" class="login-input" id="username" name="username" title="아이디" autocomplete="on"></td>
							</tr>
							<tr>
								<td class="user-login-label nobody" colspan="2"><spring:message code='message.password' /></td>
								<td class="nobody"><input type="password" tabindex="2" class="login-input" name="password" value="" onkeypress="jsEnter(event)"></td>
							</tr>
							<tr>
								<td colspan="3" class="nobody">
									<div style="border-bottom: 1px solid #dddddd; margin-bottom: 15px; margin-top: 18px; position:relative; opacity:1;"></div>
								</td>
							</tr>
							<tr>
								<td class="keep-login" colspan="2" style="font-size: 11px; margin: 18px 0 3px; padding: 15px 0 0; text-align: center">
									<input type="checkbox" name="persistent" id="persistent" value="1">
									<span class="keeplogin"><spring:message code='index.keeplogin' /></span> 
									
								</td>
								<td rowspan="2" class="login_btn_td">
									<!-- <input tabindex="3" type="image" src="../images/login_btn.png" alt="로그인" onclick="check();" /> -->
									<a href="#" onclick="check()" style="text-decoration: none;">
										<div class="login_btn">Login</div>
									</a>
								</td>
							</tr>
							<tr>
								<td class="nobody" colspan="2">
									<a href="#" onclick="document.location.href='/user/recover.do'" style="text-decoration: none;">
										<div class="login_forget_password"><spring:message code='user.recover_password' /></div> 
									</a>
								</td>
							</tr>
						</table>
					</form>
				</div>
				    </div>
			      
		        </div>
		  </section>
        </div>
			
		</div>
	</div>

</body>
</html>