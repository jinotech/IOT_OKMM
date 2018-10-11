<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.okmindmap.configuration.Configuration"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<%
	String useragent = (String) request.getAttribute("agent");
	String facebook_appid = Configuration.getString("facebook.appid");
	String kakaojoin = (String)request.getParameter("kakaojoin");
	String googlejoin = (String)request.getParameter("googlejoin");
	String isUser = (String)request.getParameter("isUser");
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>Login</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.2, maximum-scale=1.2, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">

<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/mobile.css" type="text/css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/lib/koottam/koottam.css" type="text/css">

<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/http.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/koottam/jquery.koottam.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/plugin/jino_facebook.js" type="text/javascript" charset="utf-8"></script>
<script src="http://developers.kakao.com/sdk/js/kakao.min.js"></script>

<script type="text/javascript">
	var FACEBOOK_APP_ID = '<%=facebook_appid%>';
	
	var auth_redirect = '${data.auth_redirect}';
	if(auth_redirect != '') parent.document.location.href = auth_redirect;
	
	function check() {
		var frm = document.getElementById("frm_login");

		var params = {
			"username" : frm.username.value,
			"password" : frm.password.value
		};

		postToURL("${pageContext.request.contextPath}/confirm.do", params,
				onCheck, true);
	}

	function onCheck(http) {
		if (http.readyState == 4) {
			if (http.status == 200) {
				var jsonData = JSON.parse(http.responseText);
				if (jsonData.status == "ok") {
					var frm = document.getElementById("frm_login");
					frm.target = "_parent";
					frm.return_url.value = parent.document.location.href;
					frm.submit();
				} else {
					alert("error3 : " + jsonData.message);
				}
			} else {
			}
		}
	}
	
	function onCheckKakao(http) {
		if (http.readyState == 4) {
			if (http.status == 200) {
				var jsonData = JSON.parse(http.responseText);
				
				if (jsonData.status == "ok") {
					var frm = document.getElementById("kakaoLoginForm");
					frm.target = "_parent";
					frm.return_url.value = parent.document.location.href;
					frm.submit();
				} else {
					alert("카카오톡으로 간편 회원가입을 한 이력이 없습니다.\r카카오톡으로 회원가입후 다시 이용해 주세요.");
					//parent.joinmember();
				}
			} else {
			}
		}
	}
	
	function onCheckGoogle(http) {
		if (http.readyState == 4) {
			if (http.status == 200) {
				var jsonData = JSON.parse(http.responseText);
				
				if (jsonData.status == "ok") {
					var frm = document.getElementById("kakaoLoginForm");
					frm.target = "_parent";
					frm.return_url.value = parent.document.location.href;
					frm.submit();
				} else {
					alert("구글 계정으로 간편 회원가입을 한 이력이 없습니다.\r구글 계정으로 회원가입후 다시 이용해 주세요.");
					//parent.joinmember();
				}
			} else {
			}
		}
	}

	function jsEnter(e) {
		e = e || window.event;
		if (e.keyCode == 13) {
			check();
		}
	}

	function facebooklogin() {
		FacebookService
				.getUser(function(response) {
					loginData = {};
					loginData.facebook = response.id;
					loginData.url = '${pageContext.request.contextPath}/user/login.do';
					FacebookService
							.loginFacebook(
									loginData,
									function(data) {
										// data
										// 0 : 페북 로그인 실패
										// url : 페북 로그인 성공. 마지막으로 열었던 맵 주소.

										var redirectUrl = "";
										// 정상적인 주소인지 체크
										if (data.indexOf("/") == 0) {
											redirectUrl = "${pageContext.request.contextPath}"+ data;
											if (window.parent !== undefined)
												window.parent.location.href = redirectUrl;
											else
												window.location.href = redirectUrl;
										} else {
											redirectUrl = "${pageContext.request.contextPath}/jsp/user/joinmethod.jsp";
											window.location.href = redirectUrl;
										}										
									});
				});
		/*
		FacebookService.onLoginCompleted(function(response, FB) {
			var frm = document.getElementById("frm_login");
			frm.target = "_parent";
			frm.facebook.value = response.authResponse.userID;
			frm.return_url.value = parent.document.location.href;
			frm.submit();
		});
		FacebookService.facebookLogin();
		 */
	}

	$(document).ready(function() {
		$('.fb').koottam({
			'theme' : 'facebook-blue',
			'icon_url' : '../lib/koottam/img/facebook.png',
			'method' : 'user',
			'style' : 'image_id_count',
			'id' : '<spring:message code='facebook.button.withlogin'/>',
			'service' : 'user',
			'count_visible' : false
		});
	});
</script>
</head>
<!-- 오토포커스를 위하여 -->
<body onload="document.frm_login.username.focus()">

	<!--  <div class="dialog_title">
		<spring:message code='message.login' />
	</div> -->

	<%
		if (useragent == "iPhone") {
	%>
	<div class="loginwrap" style="margin-top:45px;">
		<table border="0" cellpadding="0" cellspacing="0" class="login_table">
			<form name="frm_login" id="frm_login"
				action="${pageContext.request.contextPath}/user/login.do"
				method="post">
				<input type="hidden" name="confirmed" value="1" /> <input
					type="hidden" name="return_url" value="" /> <input type="hidden"
					name="facebook" value="" />

				<tr>
					<!-- <td class="user-login-label nobody" style="padding-left:3px;"><spring:message
								code='message.id' /></td> -->
					<td class="nobody"><input tabindex="1" type="text"
						class="login-input" id="username" name="username"
						placeholder="아이디" style="width: 100px;" /></td>
					<td rowspan="2" class="nobody">
						<!-- <input tabindex="3" type="image" src="../images/login_btn.png" alt="로그인" onclick="check();" /> -->
						<a href="#" onclick="check()" style="text-decoration: none;"><img
							tabindex="3" src="../images/login_btn.png" /></a>
					</td>
				</tr>
				<tr>
					<!-- <td class="user-login-label nobody" style="padding-left:3px;"><spring:message
								code='message.password' /></td> -->
					<td class="nobody"><input type="password" tabindex="2"
						class="login-input" style="width: 100px;" name="password"
						placeholder="비밀번호" value="" onkeypress="jsEnter(event)" /></td>
				</tr>
				<tr>
					<td class="nobody" colspan="3">

						<div class="keeplogin_div"  style="margin-bottom:30px;">
							<input type="checkbox" name="persistent" id="persistent"
								value="1" /> <label for="persistent"><span
								class="keeplogin"><spring:message code='index.keeplogin' /></span></label>
						</div> <a href="#"
						onClick="document.location.href='${pageContext.request.contextPath}/user/findusername.do'"
						style="text-decoration: none;"> <input type="button"
							class="find_username"
							value="<spring:message code='user.find_username'/>" />
					</a> <a href="#"
						onClick="document.location.href='${pageContext.request.contextPath}/user/recover.do'"
						style="text-decoration: none;"> <input type="button"
							class="recover_pw"
							value="<spring:message code='user.recover_password'/>" />
					</a>
						<div class="facebook_login" style="width: 131px; padding: 2px;">
							<a href="#" onclick="javascript:facebooklogin();"><img
								src="../images/facebook_login.png"></a>
						</div>
						
					</td>
				</tr>
			</form>
		</table>
	</div>
	<%
		} else {
	%>
	<div class="loginwrap" style="margin: 0px auto; margin-top:40px; max-width: 430px;">
		<table border="0" cellpadding="0" cellspacing="0" class="login_table">
			<form name="frm_login" id="frm_login"
				action="${pageContext.request.contextPath}/user/login.do"
				method="post">
				<input type="hidden" name="confirmed" value="1" /> <input
					type="hidden" name="return_url" value="" /> <input type="hidden"
					name="facebook" value="" />

				<tr>
					<td class="user-login-label nobody" style="padding-left: 8px;"><spring:message
							code='message.id' /></td>
					<td class="nobody"><input tabindex="1" type="text"
						class="login-input" id="username" name="username"
						style="width: 132px;" value="" /></td>
					<td rowspan="2" style="padding-left: 0px; padding-right: 32px;"
						class="nobody">
						<!-- <input tabindex="3" type="image" src="../images/login_btn.png" alt="로그인" onclick="check();" /> -->
						<a href="#" onclick="check()" style="text-decoration: none;"><img
							tabindex="3" src="../images/login_btn.png" /></a>
					</td>
				</tr>
				<tr>
					<td class="user-login-label nobody" style="padding-left: 8px;"><spring:message
							code='message.password' /></td>
					<td class="nobody"><input type="password" tabindex="2"
						class="login-input" name="password" value=""
						onkeypress="jsEnter(event)" style="width: 132px;" /></td>
				</tr>
				<tr>
					<td class="nobody" colspan="3" align="center">

						<div class="keeplogin_div" style="padding-bottom:35px;">
							<input type="checkbox" name="persistent" id="persistent"
								value="1" /> <label for="persistent"><span
								class="keeplogin"><spring:message code='index.keeplogin' /></span></label>
						</div> <a href="#"
						onClick="document.location.href='${pageContext.request.contextPath}/user/findusername.do'"
						style="float: left; text-decoration: none;"> <input
							type="button" class="find_username"
							value="<spring:message code='user.find_username'/>" />
					</a> <a href="#"
						onClick="document.location.href='${pageContext.request.contextPath}/user/recover.do'"
						style="float: left; text-decoration: none;"> <input
							type="button" class="recover_pw"
							value="<spring:message code='user.recover_password'/>" />
					</a>
						<%-- <div class="facebook_login">
							<a href="#" onclick="javascript:facebooklogin();"
								style="color: #fff; margin-left: 14px;"><spring:message
									code='facebook.button.withlogin' /></a>
						</div> --%>
						
					<c:if test="${data.moodle_loginpage_idp ne ''}">
						<a href="#" onClick="parent.document.location.href='${data.moodle_loginpage_idp}'" style="float: left; text-decoration: none;"> 
							<input type="button" value="Login with Moodle ID" />
						</a>
					</c:if>
						
						<a id="custom-login-btn" href="javascript:loginWithKakao();">
							<img src="http://mud-kage.kakao.com/14/dn/btqbjxsO6vP/KPiGpdnsubSq3a0PHEGUK1/o.jpg" width="170"/>
						</a>
						
						<a href="javascript:signInGoogle();">
							구글 계정으로 로그인
						</a>
						
					</td>
				</tr>
			</form>
		</table>
	</div>
	<%
		}
	%>

<form name="kakaoLoginForm" id="kakaoLoginForm" action="${pageContext.request.contextPath}/user/login.do" method="post">
<input type="hidden" name="username" id="username" value="">
<input type="hidden" name="password" id="password" value="wlshxpzm">
<input type="hidden" name="return_url" value="" /> 
</form>

</body>

<script type='text/javascript'>
	<%
		if("Y".equals(kakaojoin) && "N".equals(isUser)){
	%>
		alert("카카오톡으로 회원가입이 완료 되었습니다.");
	<%
		}else if("Y".equals(kakaojoin) && "Y".equals(isUser)){
	%>
		alert("카카오톡으로 가입된 이력이 있습니다.\n 카카오 계정으로 로그인 버튼을 클릭하여 로그인 하실 수 있습니다.");
	<%
		}else if("Y".equals(googlejoin) && "N".equals(isUser)){
	%>
		alert("구글 계정으로 회원가입이 완료 되었습니다.");
	<%
		}else if("Y".equals(googlejoin) && "Y".equals(isUser)){
	%>
		alert("구글 계정으로 가입된 이력이 있습니다.\n 구글 계정으로 로그인 버튼을 클릭하여 로그인 하실 수 있습니다.");
	<%
		}
	%>
  //<![CDATA[
    // 사용할 앱의 JavaScript 키를 설정해 주세요.
    Kakao.init('d3ea4ee7923f2fa5ae7c58c6048a28b4');
    
    function loginWithKakao() {
        // 로그인 창을 띄웁니다.
        Kakao.Auth.login({
          success: function(authObj) {
            //alert(JSON.stringify(authObj));
            
            Kakao.API.request({
                url: '/v1/user/me',
                success: function(res) {
                	console.log(JSON.stringify(res)); //<---- kakao.api.request 에서 불러온 결과값 json형태로 출력
                    console.log(JSON.stringify(authObj)); //<----Kakao.Auth.createLoginButton에서 불러온 결과값 json형태로 출력
                    console.log(res.id);//<---- 콘솔 로그에 id 정보 출력(id는 res안에 있기 때문에  res.id 로 불러온다)
                    console.log(res.kaccount_email);//<---- 콘솔 로그에 email 정보 출력 (어딨는지 알겠죠?)
                    console.log(res.properties['nickname']);//<---- 콘솔 로그에 닉네임 출력(properties에 있는 nickname 접근 
                  // res.properties.nickname으로도 접근 가능 )
                    console.log(authObj.access_token);//<---- 콘솔 로그에 토큰값 출력
                    
                    $("#kakaoLoginForm #username").val(res.id);
                    
                    var params = {
                			"username" : res.id,
                			"password" : "wlshxpzm"
                		};

                		postToURL("${pageContext.request.contextPath}/confirm.do", params,
                				onCheckKakao, true);
                		
                    }
                  });
            
          },
          fail: function(err) {
            alert(JSON.stringify(err));
          }
        });
    }
    
  //]]>
</script>

<script src="https://www.gstatic.com/firebasejs/5.0.4/firebase.js"></script>
<script>
	/*[S]  구글 로그인 */
	// Initialize Firebase
	var config = {
	  apiKey: "AIzaSyBZaXdi90lJZk7GLf64NIl9u6TQJ5SKO7Q",
	  authDomain: "okmmindmap-403e3.firebaseapp.com",
	  databaseURL: "https://okmmindmap-403e3.firebaseio.com",
	  projectId: "okmmindmap-403e3",
	  storageBucket: "okmmindmap-403e3.appspot.com",
	  messagingSenderId: "643822125756"
	};
	firebase.initializeApp(config); 

 	function signInGoogle() {
 	    var provider = new firebase.auth.GoogleAuthProvider();
 	     
 	    firebase.auth().signInWithPopup(provider)
 	            .then(signInSucceed)
 	            .catch(signInError);
 	}
 	 
 	function signInSucceed(result) {
 	    if (result.credential) {
 	        googleAccountToken = result.credential.accessToken;
 	        user = result.user;
 	 
 	       /*  $("#photo").attr("src", user.photoURL);
 	        $("#displayName").html(user.displayName);
 	        $("#email").html(user.email);
 	        $("#refreshToken").html(user.refreshToken);
 	        $("#uid").html(user.uid); */
 	 
           $("#kakaoLoginForm #username").val(user.uid);
           
           var params = {
       			"username" : user.uid,
       			"password" : "wlshxpzm"
       		};

       		postToURL("${pageContext.request.contextPath}/confirm.do", params,
       				onCheckGoogle, true);
 	    }
 	}
 	 
 	function signInError(error) {
 	    var errorCode = error.code;
 	    var errorMessage = error.message;
 	    var email = error.email;
 	    var credential = error.credential;
 	 
 	    var errmsg = errorCode + " " + errorMessage;
 	 
 	    if(typeof(email) != 'undefined') {
 	        errmsg += "<br />";
 	        errmsg += "Cannot sign in with your google account: " + email;
 	    }
 	 
 	    if(typeof(credential) != 'undefined') {
 	        errmsg += "<br />";
 	        errmsg += credential;
 	    }
 	 
 	    lastWork = "signIn";
 	    $("#error #errmsg").html(errmsg);
 	    $("#error").show();
 	    $("#signIn").hide();
 	    return;
 	}
 	 
 	function back() {
 	    $("#" + lastWork).show();
 	    $("#error").hide();
 	}
 	/*[E]  구글 로그인 */
</script>
</html>

