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
	String addUser = (String)request.getParameter("addUser");
%>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.2, maximum-scale=1.2, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">

	<!-- 로그인/회원가입 css -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/jquery-ui/jquery-ui.custom.css" />
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/login.css" />

<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/jquery-ui.min.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/http.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/koottam/jquery.koottam.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/plugin/jino_facebook.js" type="text/javascript" charset="utf-8"></script>
<script src="http://developers.kakao.com/sdk/js/kakao.min.js"></script>
<script src="${pageContext.request.contextPath}/lib/jquery.simplemodal.js" type="text/javascript" charset="utf-8"></script>

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
					//frm.target = "_parent";
					frm.return_url.value = document.location.href+"index.do";
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
					//frm.target = "_parent";
					frm.return_url.value = document.location.href+"index.do";
					frm.submit();
				} else {
					alert("카카오톡으로 간편 회원가입을 한 이력이 없습니다.\r카카오톡으로 회원가입후 다시 이용해 주세요.");
					parent.joinmember();
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
					//frm.target = "_parent";
					frm.return_url.value = document.location.href+"index.do";
					frm.submit();
				} else {
					alert("구글 계정으로 간편 회원가입을 한 이력이 없습니다.\r구글 계정으로 회원가입후 다시 이용해 주세요.");
					parent.joinmember();
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
	
	$(document).ready(function(){
	    $(".findid").click(function(){
	    	
	    	$("#findemail").val("");
	        //아이디 찾기 팝업
	        $( "#findId" ).dialog({
	            dialogClass: "findpop",
	            title: "아이디 찾기",
	            width: 400,
	            height: 200,
	            modal: true,
	            buttons: [
	                {
	                    text: "확인",
	                    click: function() { 
	                    	
	                    	var email = $("#findemail").val();
	                		if(!validateEmail(email)) {
	                			alert("<spring:message code='user.new.email_not_valid'/>");
	                			return false;
	                		}
	                		
	                    	$.ajax({
	    						type: 'post',
	    						dataType: 'json',
	    						async: false,
	    						url: '${pageContext.request.contextPath}/user/findusernameJson.do',
	    						data: {'email' : email },		
	    						success: function(data){
	    							
	    							if(data.result == "1"){
	    								alert("메일을 발송 했습니다.");
	    							}else{
	    								alert("메일 발송을 실패 했습니다.");
	    							}
	    							
	    						},
	    						error: function(data, status, err) {
	    							alert("send error : " + status);
	    						}
	    				    });
	                    	
	                    },
	                    class : 'blue-btn'
	                },
	                {
	                    text: "취소",
	                    click: function() {
	                    $( this ).dialog( "close" );
	                    }
	                }
	            ]
	          });
	    });
	    $(".findpw").click(function(){
	    	
	    	$("#findpwusername").val("");
	    	$("#findpwemail").val("");
	    	
	        //비밀번호 찾기 팝업
	        $( "#findpw" ).dialog({
	              dialogClass: "findpop",
	              title: "비밀번호 찾기",
	              width: 400,
	              height: 260,
	              modal: true,
	              buttons: [
	                  {
	                      text: "확인",
	                      click: function() {
	                    	  
	                    	  var username = $("#findpwusername").val();
	                    	  var email = $("#findpwemail").val();
		                		if(!validateEmail(email)) {
		                			alert("<spring:message code='user.new.email_not_valid'/>");
		                			return false;
		                		}
		                		
		                    	$.ajax({
		    						type: 'post',
		    						dataType: 'json',
		    						async: false,
		    						url: '${pageContext.request.contextPath}/user/recoverJson.do',
		    						data: {'email' : email , 'username' : username},		
		    						success: function(data){
		    							
		    							if(data.result == "99"){
		    								alert("아이디가 없습니다.");
		    							}else if(data.result == "88"){
		    								alert("이메일이 없습니다.");
		    							}else if(data.result == "1"){
		    								alert("메일을 발송 했습니다.");
		    							}else{
		    								alert("메일 발송을 실패 했습니다.");
		    							}
		    							
		    						},
		    						error: function(data, status, err) {
		    							alert("send error : " + status);
		    						}
		    				    });
	                    	  
	                      },
	                      class : 'blue-btn'
	                  },
	                  {
	                      text: "취소",
	                      click: function() {
	                      $( this ).dialog( "close" );
	                      }
	                  }
	              ]
	            });
	          });
	});
	
	function validateEmail(mail) {
		//var reg = new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]­{1}[a-z0-9]+)*[\.]{1}(com|ca|net|org|fr|us|qc.ca|gouv.qc.ca)$', 'i');
		//var reg = new RegExp(/^[A-Za-z0-9]([A-Za-z0-9_-]|(\.[A-Za-z0-9]))+@[A-Za-z0-9](([A-Za-z0-9]|(-[A-Za-z0-9]))+)\.([A-Za-z]{2,6})(\.([A-Za-z]{2}))?$/);
		var reg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
		
		if(mail.match(reg) == null || mail == "") {
			return false;
		} else {
			return true;
		}
	}
</script>
        	
</head>
<body>

    <!---- 아이디 찾기 ----->
    <form id="frm_recover" action="${pageContext.request.contextPath}/user/findusername.do" method="post">
    <input type="hidden" name="confirmed" value="1" />
    <div id="findId">
        <h5>회원가입시 입력하신 이메일을 입력해주세요</h5>
        <input type="text" name="findemail" id="findemail" placeholder="email 주소" />
    </div>
    </form>
    <!---- 아이디 찾기 ----->
    <!---- 비밀번호찾기 찾기 ----->
    <form id="frm_recover_pw" action="${pageContext.request.contextPath}/user/recover.do" method="post">
	<input type="hidden" name="confirmed" value="1" />
    <div id="findpw">
        <h5>회원가입시 입력하신 <br /> 아이디와 이메일을 입력해주세요</h5>
        <input type="text" name="findpwusername" id="findpwusername" placeholder="ID" />
        <input type="text" name="findpwemail" id="findpwemail" placeholder="email 주소" />
    </div>
    </form>
    <!---- 비밀번호찾기 찾기 ----->
    

	<div class="login-bg">
        <h2 class="join-title">
            <strong>OKMindmap</strong><br/>
            생각의 날개를 펼쳐줄 <strong>OKMindmap!</strong> 사용할 준비가 되셨나요?
        </h2>
        <div class="join-box lg">
        
        	<form name="frm_login" id="frm_login" action="${pageContext.request.contextPath}/user/login.do" method="post">
				<input type="hidden" name="confirmed" value="1" /> 
				<input type="hidden" name="return_url" value="" />
				<input type="hidden" name="facebook" value="" />
        
            <div class="right-area login-box">
                <h3>로그인</h3>
                <div class="input-wrap id">
                    <label for="id">아이디</label>
                    <input type="text" class="id" id="id" placeholder="아이디를 입력해주세요" name="username" id="username">
                </div>
                <div class="input-wrap pw">
                    <label for="pw">비밀번호</label>
                    <input type="password" name="password" id="password" class="pw" value="" onkeypress="jsEnter(event)"  placeholder="비밀번호를 입력해주세요">
                </div>
                <label>
                    <input type="checkbox" name="persistent" id="persistent" value="1"/>
                    로그인 상태 유지
                </label>
                <input type="button" style="cursor: pointer;" onclick="check()" value="로그인" />
                <ul class="bar">
                    <li>
                        <a href="#" class="findid">아이디 찾기</a>
                    </li>
                    <li>
                        <a href="#" class="findpw">비밀번호 찾기</a>
                    </li>
                </ul>
            </div>
            <div class="left-area login-box">
                <h3>간편 로그인</h3>
                <input type="button" style="cursor: pointer;" class="kakao" id="custom-login-btn" onclick="javascript:loginWithKakao();" value="카카오톡 간편로그인" />
                <input type="button" style="cursor: pointer;" class="google" onclick="javascript:signInGoogle();" value="구글로 간편로그인" />
                <input type="button" style="cursor: pointer;" class="bt" value="마인드맵 활용 예제" />
            </div>
            <p>
                <a href="/user/join.do" class="under" >회원가입</a>
            </p>
            
            </form>
            
        </div>
    </div>
    
<form name="kakaoLoginForm" id="kakaoLoginForm" action="${pageContext.request.contextPath}/user/login.do" method="post">
<input type="hidden" name="username" id="username" value="">
<input type="hidden" name="password" id="password" value="wlshxpzm">
<input type="hidden" name="return_url" value="" /> 
</form>    

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
	
	<%
		if("Y".equals(addUser)){
	%>
		alert("회원가입을 축하합니다. 로그인 해주세요.");
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
    
</body>
</html>