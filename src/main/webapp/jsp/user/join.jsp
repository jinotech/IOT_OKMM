<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.okmindmap.configuration.Configuration"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="env" uri="http://www.servletsuite.com/servlets/enventry" %>

<%
	String facebook_appid = Configuration.getString("facebook.appid");
%>

<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <meta http-equiv="Cache-Control" content="no-cache">
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Expires" content="0">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

        <title>OKMindmap :: Design Your Mind!</title>

        <!--CSS-->
       	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/main_style.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
       	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/reset.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
       	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/style_vertical.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
      
        <!--폰트-->
        <link href='http://fonts.googleapis.com/css?family=Noto+Sans:700' rel='stylesheet' type='text/css'>
        <link href='${pageContext.request.contextPath}/webfont.css' rel='stylesheet' type='text/css' />
		<link href='http://fonts.googleapis.com/css?family=Yanone+Kaffeesatz' rel='stylesheet' type='text/css'>

        <!-- 로그인/회원가입 css -->
    	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/login.css" />
        
        
        <!--Google API-->
        <script src="http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
		
        <!-- The JavaScript -->
        <script src="${pageContext.request.contextPath}/lib/jquery.min.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
        <script src="${pageContext.request.contextPath}/lib/jquery.easing.1.3.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
		<script src="http://developers.kakao.com/sdk/js/kakao.min.js"></script>

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
					async   : false,
					success: function (data) {
						if(data.status == "ok") {
							//alert(username + "<spring:message code='user.new.is_available'/>");
							checkedUsername = true;
							return true;
						} else {
							alert(username + "<spring:message code='user.new.is_not_available'/>");
							checkedUsername = false;
							return false;
						}
					}
				}
			);
			
			if(checkedUsername){
				return true;	
			}else{
				return false;
			}
				
		}else{
			return false;	
		}
		
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
					async   : false,
					success: function (data) {
						if(data.status == "ok") {
							//alert(mail + "<spring:message code='user.new.is_available'/>");
							checkedEmail = true;
							return true;
						} else {
							alert(mail + "<spring:message code='user.new.is_not_available'/>");
							return false;
						}
					}
				}
			);
			
			if(checkedEmail){
				return true;	
			}else{
				return false;
			}
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
		checkAvailableUsername();
		if(checkedUsername){
			checkAvailableEmail();
		}
		
			if(checkedUsername && checkedEmail){
	
				/* var lname = trimAll(frm.lastname.value);
				if(!validateNotEmpty(lname)) {
					alert("<spring:message code='user.new.enter_lastname'/>");
					return false;
				} */
		
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
				
				
				/* var txt = '<table borde="0"><tr><td class="nobody" rowspan="2" style="vertical-align: top; padding-top: 2px;padding-right: 10px;"><img src="${pageContext.request.contextPath}/images/wait16trans.gif"></td><td class="nobody">Import Bookmark</td><tr><td class="nobody">Please wait...</td></tr></table>';
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
				parent.$("#dialog").dialog( "option", "title", "<spring:message code='message.login' />" ); */
				return true;
			
			}else{
				return false;
			}
		
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

        <div class="login-bg">
            <h2 class="join-title">
                <strong>OKMindmap</strong><br/>
                생각의 날개를 펼쳐줄 <strong>OKMindmap!</strong> 사용할 준비가 되셨나요?
            </h2>
            <div class="join-box">
            	<form id="frm-user-new" action="${pageContext.request.contextPath}/user/new.do" method="post" onSubmit="return checkSubmit(this);">
				<input type="hidden" id="click_check" name="click_check" value="1"/>
				<input type="hidden" name="confirmed" value="1" />
				<input type="hidden" name="facebook" value="" />
				<input type="hidden" name="lastname" value="lastname" />
                <div class="right-area login-box">
                    <h3>이메일로 회원가입</h3>
                    <div class="input-wrap">
                        <label for="name">이름</label>
                        <input type="text" placeholder="이름을 입력해주세요." name="firstname" id="firstname" value=""/>
                    </div>
                    <div class="input-wrap">
                        <label for="name">아이디</label>
                        <input type="text" placeholder="아이디를 입력해주세요." name="username" id="username" value=""/>
                    </div>
                    <div class="input-wrap">
                        <label for="name">이메일</label>
                        <input type="text" placeholder="이메일주소를 입력해주세요." name="email" id="email" value=""/>
                    </div>
                    <div class="input-wrap">
                        <label for="name">비밀번호</label>
                        <input type="password" name="password" value="" placeholder="비밀번호를 입력해주세요." />
                    </div>
                    <div class="input-wrap">
                        <label for="name">비번재입력</label>
                        <input type="password" name="password1" value="" placeholder="비밀번호를 재입력 입력해주세요" />
                    </div>
                    <input type="submit" style="cursor: pointer;" value="회원가입" />
                </div>
                </form>
                <div class="left-area login-box">
                    <h3>간편회원가입</h3>
                    <input type="button" style="cursor: pointer;" onclick="javascript:loginWithKakao();" class="kakao" value="카카오톡 간편회원가입" />
                    <input type="button" style="cursor: pointer;" onclick="javascript:signIn();" class="google" value="구글로 간편회원가입" />
                    <input type="button" style="cursor: pointer;" class="bt" value="마인드맵 활용 예제" />
                </div>
                <a href="/" class="under" >이미 계정이 있습니다</a>
            </div>
        </div>

<form name="kakaoJoinForm" id="kakaoJoinForm" action="${pageContext.request.contextPath}/user/new.do" method="post">
<input type="hidden" name="confirmed" id="confirmed" value="1">
<input type="hidden" name="username" id="username" value="">
<input type="hidden" name="email" id="email" value="kakao">
<input type="hidden" name="firstname" id="firstname" value="">
<input type="hidden" name="lastname" id="lastname" value="">
<input type="hidden" name="password" id="password" value="wlshxpzm">
<input type="hidden" name="password1" id="password1" value="wlshxpzm">
<input type="hidden" name="kakaojoin" id="kakaojoin" value="N">
<input type="hidden" name="googlejoin" id="googlejoin" value="N">
</form>

<script type='text/javascript'>
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
                    
                    $("#kakaoJoinForm #username").val(res.id);
                    //$("#kakaoJoinForm #email").val(res.kaccount_email);
                    $("#kakaoJoinForm #firstname").val(res.properties.nickname);
                    
                    $("#kakaojoin").val("Y");
                    $("#googlejoin").val("N");
                    //회원가입
                    $("#kakaoJoinForm").submit();
                    
                    
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

 	function signIn() {
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
 	 
 	       $("#kakaoJoinForm #username").val(user.uid);
           $("#kakaoJoinForm #email").val(user.email);
           $("#kakaoJoinForm #firstname").val(user.email);
           
           $("#kakaojoin").val("N");
           $("#googlejoin").val("Y");
           //회원가입
           $("#kakaoJoinForm").submit();
           
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
    </body>
</html>