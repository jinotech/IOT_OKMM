<%@ page contentType="text/html; charset=utf-8" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
		"http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
		<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
		<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
		<META HTTP-EQUIV="Expires" CONTENT="0">

		<title>OKMindmap :: Design Your Mind!</title>
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js" type="text/javascript" charset="utf-8"></script>
		<script type="text/javascript">
			function initFacebook() {
				//var FACEBOOK_APP_ID = '277586902305869';
				var FACEBOOK_APP_ID = '222424227868957';
				FB.init({
					appId  : FACEBOOK_APP_ID,
					status : true, // check login status
					cookie : true, // enable cookies to allow the server to access the session
					xfbml  : true  // parse XFBML
				});
	
				FB.getLoginStatus(function (response) {
					var token = null;
					// 페이스북 토큰 확인
					if (response.status=="connected" && response.authResponse) {						
						token = response.authResponse.userID;
					}					
					// 페이스북 캔버스(앱)인지 체크.
					var isCanvas = FB._inCanvas;					
					goindex(token, isCanvas);
				});
			}
	
			function goindex(fb_token, isCanvas) {
				var sendform = document.getElementById("sendform");
				if(fb_token && fb_token !='') sendform.fb_token.value = fb_token;
				if(isCanvas) sendform.fb_canvas.value = 1;
				sendform.action = './main.do';
				sendform.submit();
			}
	
			function init(){
				goindex();
				
				var d = document, js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
				if (d.getElementById(id)) {return;}
				js = d.createElement('script'); js.id = id; js.async = true;
				js.src = "https://connect.facebook.net/en_US/all.js";
				ref.parentNode.insertBefore(js, ref);
				
				window.fbAsyncInit = initFacebook;								
			}
			$(document).ready( init );
		</script>
	</head>
	<body>
		<form method="post" name="sendForm" id="sendform">
			<input type='hidden' name='fb_token'/>
			<input type='hidden' name='fb_canvas'/>
		</form>
	</body>
</html>

